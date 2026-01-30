/**
 * Document Processing Service v3.2
 * Orchestrates the event extraction pipeline using Supabase Edge Functions
 *
 * Pipeline order:
 * For TEXT documents:
 * 1. Extract relationships (scan for "son of", "married", etc.)
 * 2. Extract events (use Claude to identify events and participants)
 * 3. Match participants (exact match, relationship boost, auto-create profiles)
 *
 * For JSON documents:
 * 1. Route to import-structured-json Edge Function
 * 2. Handles people, relationships, events, locations with fuzzy matching
 */

import { supabase } from '../lib/supabase'

const CHUNK_SIZE = 500 // lines per chunk for large documents

/**
 * Process a document through the extraction pipeline
 * @param {string} documentId - Document ID to process
 * @param {function} onProgress - Callback for progress updates
 * @returns {Promise<{success: boolean, eventCount: number, participantCount: number}>}
 */
export async function processDocument(documentId, onProgress = () => {}) {
  try {
    // Get document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      throw new Error('Document not found')
    }

    if (!document.raw_text) {
      throw new Error('Document has no text content to process')
    }

    // Check if this is a structured JSON import
    if (document.file_type === 'json') {
      return await processStructuredJson(document, onProgress)
    }

    // =========================================================================
    // STEP 1: EXTRACT RELATIONSHIPS (NEW in v3.1)
    // =========================================================================
    onProgress({ phase: 'relationships', message: 'Extracting stated relationships...', progress: 5 })

    // Update status to analyzing
    await supabase
      .from('documents')
      .update({
        processing_status: 'analyzing',
        processing_started_at: new Date().toISOString(),
        error_message: null
      })
      .eq('id', documentId)

    // Call extract-relationships Edge Function
    const { data: relData, error: relError } = await supabase.functions.invoke('extract-relationships', {
      body: {
        documentId,
        rawText: document.raw_text
      }
    })

    if (relError) {
      console.error('Relationship extraction error:', relError)
      // Continue anyway - relationships are enhancement, not required
    } else {
      onProgress({
        phase: 'relationships',
        message: `Found ${relData?.inserted || 0} stated relationships`,
        progress: 10
      })
    }

    // =========================================================================
    // STEP 2: EXTRACT EVENTS
    // =========================================================================
    onProgress({ phase: 'extracting', message: 'Analyzing document structure...', progress: 15 })

    const lines = document.raw_text.split('\n')
    const lineCount = lines.length

    // Determine chunking strategy
    let chunks = []
    if (lineCount <= CHUNK_SIZE) {
      // Process as single chunk
      chunks = [{ start: 0, end: lineCount, text: document.raw_text }]
    } else {
      // Split into chunks
      for (let i = 0; i < lineCount; i += CHUNK_SIZE) {
        const chunkLines = lines.slice(i, Math.min(i + CHUNK_SIZE, lineCount))
        chunks.push({
          start: i,
          end: Math.min(i + CHUNK_SIZE, lineCount),
          text: chunkLines.join('\n')
        })
      }
    }

    onProgress({
      phase: 'extracting',
      message: `Extracting events from ${chunks.length} chunk(s)...`,
      progress: 20,
      chunks: chunks.length
    })

    let totalEvents = 0
    let totalParticipants = 0

    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      const chunkProgress = 20 + Math.round((i / chunks.length) * 40) // 20-60%

      onProgress({
        phase: 'extracting',
        message: `Processing chunk ${i + 1} of ${chunks.length}...`,
        progress: chunkProgress
      })

      // Call extract-events Edge Function
      const { data, error } = await supabase.functions.invoke('extract-events', {
        body: {
          documentId,
          rawText: chunk.text,
          chunkStart: chunk.start,
          chunkEnd: chunk.end
        }
      })

      if (error) {
        console.error('Extraction error:', error)
        // Continue with other chunks
      } else if (data) {
        totalEvents += data.eventCount || 0
        totalParticipants += data.participantCount || 0
      }
    }

    // =========================================================================
    // STEP 3: MATCH PARTICIPANTS (Enhanced in v3.1)
    // =========================================================================
    onProgress({
      phase: 'matching',
      message: 'Matching participants to people profiles...',
      progress: 65
    })

    // Call match-participants Edge Function (now includes relationship boost + auto-create)
    const { data: matchData, error: matchError } = await supabase.functions.invoke('match-participants', {
      body: { documentId }
    })

    if (matchError) {
      console.error('Matching error:', matchError)
    } else {
      onProgress({
        phase: 'matching',
        message: `Matched: ${matchData?.confirmed || 0} confirmed, ${matchData?.probable || 0} probable, ${matchData?.possible || 0} possible. Created ${matchData?.profiles_created || 0} new profiles.`,
        progress: 90
      })
    }

    // =========================================================================
    // STEP 4: FINALIZE
    // =========================================================================
    onProgress({
      phase: 'complete',
      message: 'Processing complete!',
      progress: 100
    })

    // Get final counts (recalculate to ensure accuracy)
    const { count: eventCount } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('document_id', documentId)

    const { count: participantCount } = await supabase
      .from('event_participants')
      .select('*, events!inner(*)', { count: 'exact', head: true })
      .eq('events.document_id', documentId)

    // Update document with accurate counts
    await supabase
      .from('documents')
      .update({
        event_count: eventCount || totalEvents,
        participant_count: participantCount || totalParticipants,
        processing_completed_at: new Date().toISOString()
      })
      .eq('id', documentId)

    return {
      success: true,
      eventCount: eventCount || totalEvents,
      participantCount: participantCount || totalParticipants,
      relationshipsFound: relData?.inserted || 0,
      confirmed: matchData?.confirmed || 0,
      probable: matchData?.probable || 0,
      possible: matchData?.possible || 0,
      profilesCreated: matchData?.profiles_created || 0
    }

  } catch (error) {
    console.error('Processing error:', error)

    // Update document with error
    await supabase
      .from('documents')
      .update({
        processing_status: 'error',
        error_message: error.message
      })
      .eq('id', documentId)

    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Process a structured JSON import file
 * Routes to the import-structured-json Edge Function
 */
async function processStructuredJson(document, onProgress) {
  onProgress({ phase: 'parsing', message: 'Parsing JSON structure...', progress: 5 })

  // Parse the JSON
  let importData
  try {
    importData = JSON.parse(document.raw_text)
  } catch (e) {
    throw new Error(`Invalid JSON: ${e.message}`)
  }

  // Validate structure
  if (!importData.individuals || !Array.isArray(importData.individuals)) {
    throw new Error('JSON must contain an "individuals" array')
  }

  onProgress({
    phase: 'importing',
    message: `Importing ${importData.individuals.length} individuals...`,
    progress: 10
  })

  // Update document status
  await supabase
    .from('documents')
    .update({
      processing_status: 'analyzing',
      processing_started_at: new Date().toISOString(),
      error_message: null
    })
    .eq('id', document.id)

  // Call the structured import Edge Function
  // Note: The function expects `jsonData` with the parsed JSON content
  const { data, error } = await supabase.functions.invoke('import-structured-json', {
    body: {
      jsonData: importData
    }
  })

  if (error) {
    throw new Error(error.message || 'Import failed')
  }

  if (data?.errors?.length > 0) {
    throw new Error(data.errors.join(', '))
  }

  // Extract counts from response
  const counts = data?.counts || {}
  const peopleCreated = counts.individuals_created || 0
  const peopleMatched = counts.individuals_matched || 0
  const relationshipsCreated = counts.relationships_created || 0
  const eventsCreated = counts.events_created || 0
  const locationsCreated = counts.locations_created || 0
  const locationResidentsCreated = counts.location_residents_created || 0
  const eventParticipantsCreated = counts.event_participants_created || 0

  // Progress updates for results
  onProgress({
    phase: 'importing',
    message: `Created ${peopleCreated} people (${peopleMatched} matched), ${relationshipsCreated} relationships, ${eventsCreated} events, ${locationsCreated} locations`,
    progress: 90
  })

  onProgress({
    phase: 'complete',
    message: 'Import complete!',
    progress: 100
  })

  // Update document
  await supabase
    .from('documents')
    .update({
      processing_status: 'complete',
      processing_completed_at: new Date().toISOString(),
      event_count: eventsCreated,
      participant_count: eventParticipantsCreated
    })
    .eq('id', document.id)

  // Log import details for debugging
  console.log('Import results:', {
    logs: data?.logs?.slice(-10),
    errors: data?.errors
  })

  return {
    success: true,
    eventCount: eventsCreated,
    participantCount: eventParticipantsCreated,
    peopleCreated,
    peopleMatched,
    relationshipsCreated,
    locationsCreated,
    locationResidentsCreated,
    fuzzyMatches: [],
    potentialRelatives: [],
    confirmed: peopleMatched,
    probable: 0,
    possible: 0
  }
}

/**
 * Retry processing for a failed document
 */
export async function retryProcessing(documentId) {
  // Clear events and participants from previous attempt
  const { data: events } = await supabase
    .from('events')
    .select('id')
    .eq('document_id', documentId)

  if (events && events.length > 0) {
    const eventIds = events.map(e => e.id)
    await supabase
      .from('event_participants')
      .delete()
      .in('event_id', eventIds)

    await supabase
      .from('events')
      .delete()
      .eq('document_id', documentId)
  }

  // Clear extracted relationships
  await supabase
    .from('extracted_relationships')
    .delete()
    .eq('document_id', documentId)

  // Reset document status
  await supabase
    .from('documents')
    .update({
      processing_status: 'uploaded',
      error_message: null,
      event_count: 0,
      participant_count: 0,
      relationship_count: 0,
      profiles_created: 0
    })
    .eq('id', documentId)

  return { success: true }
}

export default { processDocument, retryProcessing }
