// Supabase Edge Function to extract events from genealogical documents using Claude API
// Enhanced with: better error handling, retry logic, robust JSON parsing
// Deploy with: supabase functions deploy extract-events

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const EVENT_TYPES = [
  'land_patent', 'land_deed', 'land_survey', 'will', 'estate_admin',
  'court_case', 'court_order', 'petition', 'bond', 'tax_list',
  'militia_list', 'census', 'church_membership', 'baptism',
  'church_marriage', 'church_burial', 'vital_birth', 'vital_death',
  'vital_marriage', 'pension', 'military_service', 'narrative',
  'list_other', 'other'
]

const PARTICIPANT_ROLES = [
  'grantor', 'grantee', 'witness', 'chain_carrier', 'surveyor',
  'security', 'appraiser', 'administrator', 'executor', 'testator',
  'heir', 'petitioner', 'plaintiff', 'defendant', 'juror', 'bondsman',
  'guardian', 'head_of_household', 'household_member', 'taxpayer',
  'list_member', 'soldier', 'officer', 'pensioner', 'militia_member',
  'member', 'minister', 'baptized', 'spouse_1', 'spouse_2', 'deceased',
  'sponsor', 'parent', 'subject', 'mentioned', 'author', 'informant',
  'participant', 'other'
]

const SYSTEM_PROMPT = `You are a genealogical research assistant specializing in colonial Virginia and early American history. Your task is to extract EVENTS from historical documents.

An EVENT is a documented occurrence: a land transaction, tax listing, will probate, militia muster, etc.

For each event in the document, extract:

1. **event_type**: One of: ${EVENT_TYPES.join(', ')}
2. **event_date_text**: The date exactly as written in the document
3. **event_year**: The year as an integer (for sorting/filtering)
4. **title**: Brief descriptive title (e.g., "John Johnson land patent 1745")
5. **location_text**: Location as written in the document
6. **description**: Fuller description if needed
7. **transcription**: The relevant excerpt from the source (keep brief, under 500 chars)
8. **confidence**: 'confirmed', 'probable', or 'possible'
9. **participants**: Array of people involved, each with:
   - name_as_written: Name exactly as it appears
   - surname_extracted: Parsed surname (UPPERCASE)
   - given_name_extracted: Parsed given name
   - role: One of: ${PARTICIPANT_ROLES.join(', ')}
   - details: Any additional info (e.g., {"acres": 200})

CRITICAL RULES:
- Extract EVERY event you can identify in the document
- For tax lists, militia lists, etc.: each entry is typically ONE event with ONE participant
- For deeds/wills: the document IS the event with MULTIPLE participants
- Always capture names EXACTLY as written, then also extract surname/given_name
- Include ALL participants: main parties, witnesses, chain carriers, etc.
- Keep transcriptions brief to avoid response truncation

Return ONLY a JSON object with this structure:
{
  "events": [...],
  "document_summary": "Brief summary",
  "estimated_date_range": "1745-1790"
}

Return ONLY valid JSON. No markdown, no code blocks, no extra text.`

// Robust JSON parsing with multiple fallback strategies
function parseJsonResponse(text: string): any {
  // Strategy 1: Direct parse
  try {
    return JSON.parse(text)
  } catch (e) {
    // Continue to next strategy
  }

  // Strategy 2: Extract JSON object with regex
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    // Continue to next strategy
  }

  // Strategy 3: Try to fix common issues
  try {
    // Remove markdown code blocks
    let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '')

    // Find the outermost JSON object
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')

    if (start !== -1 && end !== -1 && end > start) {
      cleaned = cleaned.substring(start, end + 1)
      return JSON.parse(cleaned)
    }
  } catch (e) {
    // Continue to next strategy
  }

  // Strategy 4: Try to fix truncated JSON
  try {
    let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '')
    const start = cleaned.indexOf('{')

    if (start !== -1) {
      cleaned = cleaned.substring(start)

      // Count braces to find where to close
      let braceCount = 0
      let lastValidIndex = -1

      for (let i = 0; i < cleaned.length; i++) {
        if (cleaned[i] === '{') braceCount++
        else if (cleaned[i] === '}') {
          braceCount--
          if (braceCount === 0) {
            lastValidIndex = i
            break
          }
        }
      }

      if (lastValidIndex > 0) {
        return JSON.parse(cleaned.substring(0, lastValidIndex + 1))
      }

      // If still unbalanced, try to close it
      if (braceCount > 0) {
        // Try to find the events array and close it properly
        const eventsMatch = cleaned.match(/"events"\s*:\s*\[/)
        if (eventsMatch) {
          // Find the last complete event object
          const lastCompleteEvent = cleaned.lastIndexOf('}')
          if (lastCompleteEvent > 0) {
            let partial = cleaned.substring(0, lastCompleteEvent + 1)

            // Count array brackets
            const openBrackets = (partial.match(/\[/g) || []).length
            const closeBrackets = (partial.match(/\]/g) || []).length

            // Close any open arrays
            partial += ']'.repeat(openBrackets - closeBrackets)

            // Close any open objects
            const openBraces = (partial.match(/\{/g) || []).length
            const closeBraces = (partial.match(/\}/g) || []).length
            partial += '}'.repeat(openBraces - closeBraces)

            return JSON.parse(partial)
          }
        }
      }
    }
  } catch (e) {
    // All strategies failed
  }

  throw new Error('Failed to parse JSON response after all strategies')
}

// Call Claude API with retry logic
async function callClaudeWithRetry(
  anthropicKey: string,
  rawText: string,
  maxRetries: number = 2
): Promise<any> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 8192,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: 'user',
              content: `Extract all events from this genealogical document:\n\n${rawText}`
            }
          ]
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Claude API error (${response.status}): ${errorText.substring(0, 200)}`)
      }

      const claudeResponse = await response.json()
      const extractedText = claudeResponse.content[0]?.text || ''

      if (!extractedText) {
        throw new Error('Empty response from Claude')
      }

      // Try to parse the response
      const parsed = parseJsonResponse(extractedText)
      return parsed

    } catch (error) {
      lastError = error
      console.error(`Attempt ${attempt + 1} failed:`, error.message)

      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
      }
    }
  }

  throw lastError || new Error('All retry attempts failed')
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { documentId, rawText, chunkStart, chunkEnd } = await req.json()

    if (!documentId || !rawText) {
      return new Response(
        JSON.stringify({ error: 'Missing documentId or rawText' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Update document status to extracting (only if this is the first chunk)
    if (chunkStart === 0) {
      await supabase
        .from('documents')
        .update({
          processing_status: 'extracting',
          processing_started_at: new Date().toISOString()
        })
        .eq('id', documentId)
    }

    // Call Claude API with retry
    let extracted
    try {
      extracted = await callClaudeWithRetry(anthropicKey, rawText, 2)
    } catch (parseError) {
      console.error(`Chunk ${chunkStart}-${chunkEnd} failed:`, parseError.message)

      // DON'T set document to error status for individual chunk failures
      // Just return partial failure - processing can continue with other chunks
      return new Response(
        JSON.stringify({
          success: false,
          eventCount: 0,
          participantCount: 0,
          error: parseError.message,
          chunk: { start: chunkStart, end: chunkEnd }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Store events and participants in database
    const events = extracted.events || []
    let eventCount = 0
    let participantCount = 0
    const errors: string[] = []

    for (const eventData of events) {
      try {
        // Validate event data
        if (!eventData.title && !eventData.event_type) {
          console.warn('Skipping event with no title or type')
          continue
        }

        // Insert event
        const { data: event, error: eventError } = await supabase
          .from('events')
          .insert({
            document_id: documentId,
            event_type: eventData.event_type || 'other',
            event_date_text: eventData.event_date_text || 'Unknown',
            event_year: eventData.event_year,
            title: eventData.title || 'Untitled Event',
            location_text: eventData.location_text,
            description: eventData.description,
            transcription: eventData.transcription?.substring(0, 2000), // Limit transcription length
            confidence: eventData.confidence || 'probable',
            line_start: chunkStart,
            line_end: chunkEnd
          })
          .select()
          .single()

        if (eventError) {
          console.error('Error inserting event:', eventError)
          errors.push(`Event "${eventData.title}": ${eventError.message}`)
          continue
        }

        eventCount++

        // Insert participants
        for (const participant of (eventData.participants || [])) {
          try {
            // Skip invalid participants
            if (!participant.name_as_written || participant.name_as_written.length < 2) {
              continue
            }

            const { error: partError } = await supabase
              .from('event_participants')
              .insert({
                event_id: event.id,
                name_as_written: participant.name_as_written,
                surname_extracted: participant.surname_extracted,
                given_name_extracted: participant.given_name_extracted,
                role: participant.role || 'participant',
                details: participant.details || {},
                identification_status: 'unidentified'
              })

            if (partError) {
              console.error('Error inserting participant:', partError)
              errors.push(`Participant "${participant.name_as_written}": ${partError.message}`)
            } else {
              participantCount++
            }
          } catch (partError) {
            console.error('Unexpected participant error:', partError)
          }
        }
      } catch (eventProcessError) {
        console.error('Unexpected event processing error:', eventProcessError)
        errors.push(`Unexpected error: ${eventProcessError.message}`)
      }
    }

    // Update document with INCREMENTED counts (not replaced)
    // Get current counts first
    const { data: currentDoc } = await supabase
      .from('documents')
      .select('event_count, participant_count')
      .eq('id', documentId)
      .single()

    const newEventCount = (currentDoc?.event_count || 0) + eventCount
    const newParticipantCount = (currentDoc?.participant_count || 0) + participantCount

    await supabase
      .from('documents')
      .update({
        processing_status: 'matching',
        event_count: newEventCount,
        participant_count: newParticipantCount
      })
      .eq('id', documentId)

    return new Response(
      JSON.stringify({
        success: true,
        eventCount,
        participantCount,
        totalEventCount: newEventCount,
        totalParticipantCount: newParticipantCount,
        summary: extracted.document_summary,
        chunk: { start: chunkStart, end: chunkEnd },
        errors: errors.length > 0 ? errors : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
