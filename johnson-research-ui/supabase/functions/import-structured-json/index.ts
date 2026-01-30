// Structured JSON Import Function v2
// Properly handles the JSON format with embedded family_members, events, and locations per individual
//
// JSON Structure Expected:
// {
//   "individuals": [
//     {
//       "temp_id": "JOHN-1590",
//       "given_name": "John",
//       "surname": "Johnson",
//       "birth_year": 1590,
//       "locations": [ { "place": "...", "type": "residence", "date_range": "..." } ],
//       "family_members": [ { "relationship": "child", "temp_id": "ANN-1621", "name": "..." } ],
//       "events": [ { "event_type": "land_patent", "title": "...", "date": "...", "role": "grantee" } ],
//       "notes": "..."
//     }
//   ]
// }

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ============================================
// PROFILE ID GENERATION
// ============================================
function generateProfileId(surname: string | null, birthYear: number | null): string {
  const surnameCode = (surname || 'UNK').substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '') || 'UNK'
  const yearCode = birthYear ? `e${birthYear}` : 'eUNK'
  // Use longer random suffix (6 chars) + timestamp component for uniqueness
  const timestamp = Date.now().toString(36).slice(-3).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${surnameCode}-IMP-${yearCode}-${timestamp}${random}`
}

// ============================================
// DUPLICATE DETECTION
// ============================================
interface MatchResult {
  id: string
  score: number
  matchType: string
}

async function findExistingProfile(
  supabase: any,
  givenName: string | null,
  surname: string | null,
  birthYear: number | null,
  minScore: number = 80 // Default requires name + birth year match; use 65 for name-only
): Promise<MatchResult | null> {
  if (!surname) return null

  // Search for candidates with matching surname
  const { data: candidates } = await supabase
    .from('people')
    .select('id, given_name, surname, birth_year')
    .ilike('surname', surname)
    .limit(50)

  if (!candidates || candidates.length === 0) return null

  let bestMatch: MatchResult | null = null

  for (const candidate of candidates) {
    let score = 0
    const reasons: string[] = []

    // Exact surname match (case-insensitive)
    if (candidate.surname?.toLowerCase() === surname?.toLowerCase()) {
      score += 30
      reasons.push('surname')
    }

    // Given name match
    if (givenName && candidate.given_name) {
      if (candidate.given_name.toLowerCase() === givenName.toLowerCase()) {
        score += 35
        reasons.push('given_name')
      } else if (candidate.given_name.toLowerCase().startsWith(givenName.toLowerCase().substring(0, 3))) {
        // Partial match (first 3 chars)
        score += 15
        reasons.push('given_name_partial')
      }
    }

    // Birth year match
    if (birthYear && candidate.birth_year) {
      if (candidate.birth_year === birthYear) {
        score += 30
        reasons.push('birth_year_exact')
      } else if (Math.abs(candidate.birth_year - birthYear) <= 2) {
        score += 20
        reasons.push('birth_year_close')
      } else if (Math.abs(candidate.birth_year - birthYear) <= 5) {
        score += 10
        reasons.push('birth_year_approx')
      }
    }

    // Match if score meets minimum threshold
    // Default 80: requires surname(30) + given_name(35) + birth_year(15+)
    // With 65: surname(30) + given_name(35) for name-only matches
    if (score >= minScore && (!bestMatch || score > bestMatch.score)) {
      bestMatch = {
        id: candidate.id,
        score,
        matchType: reasons.join('+')
      }
    }
  }

  return bestMatch
}

// ============================================
// EVENT TYPE MAPPING
// ============================================
const EVENT_TYPE_MAP: Record<string, string> = {
  'marriage': 'vital_marriage',
  'birth': 'vital_birth',
  'death': 'vital_death',
  'census': 'census',
  'land_patent': 'land_patent',
  'land_deed': 'land_deed',
  'will': 'will',
  'estate_admin': 'estate_admin',
  'court_order': 'court_order',
  'court_case': 'court_case',
  'legal_document': 'legal_document'
}

// ============================================
// RELATIONSHIP TYPE MAPPING
// ============================================
// Maps JSON relationship types to database types
// The relationship describes what the OTHER person is TO this person
const RELATIONSHIP_MAP: Record<string, { forward: string, inverse: string }> = {
  'spouse': { forward: 'spouse', inverse: 'spouse' },
  'child': { forward: 'child', inverse: 'father' }, // My child → they have me as father
  'parent': { forward: 'father', inverse: 'child' }, // My parent → they have me as child
  'sibling': { forward: 'sibling', inverse: 'sibling' },
  'father_in_law': { forward: 'father_in_law', inverse: 'son_in_law' },
  'son_in_law': { forward: 'son_in_law', inverse: 'father_in_law' },
  'uncle': { forward: 'uncle', inverse: 'nephew' },
  'nephew': { forward: 'nephew', inverse: 'uncle' },
  'nephew_by_marriage': { forward: 'nephew', inverse: 'uncle' },
  'sibling_or_uncle': { forward: 'relative', inverse: 'relative' },
  'nephew_or_cousin': { forward: 'relative', inverse: 'relative' },
  'brother_in_law': { forward: 'brother_in_law', inverse: 'brother_in_law' },
  'brother_in_law_or_uncle_in_law': { forward: 'relative', inverse: 'relative' }
}

// ============================================
// LOGGING
// ============================================
interface ImportLog {
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR'
  message: string
}

function log(logs: ImportLog[], level: 'INFO' | 'WARN' | 'ERROR', message: string) {
  const entry = { timestamp: new Date().toISOString(), level, message }
  logs.push(entry)
  console.log(`[${level}] ${message}`)
}

// ============================================
// MAIN IMPORT FUNCTION
// ============================================
interface ImportResults {
  success: boolean
  logs: ImportLog[]
  counts: {
    individuals_processed: number
    individuals_created: number
    individuals_matched: number
    relationships_created: number
    events_created: number
    event_participants_created: number
    locations_created: number
    location_residents_created: number
  }
  errors: string[]
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const results: ImportResults = {
    success: false,
    logs: [],
    counts: {
      individuals_processed: 0,
      individuals_created: 0,
      individuals_matched: 0,
      relationships_created: 0,
      events_created: 0,
      event_participants_created: 0,
      locations_created: 0,
      location_residents_created: 0
    },
    errors: []
  }

  try {
    const { jsonData } = await req.json()
    if (!jsonData) throw new Error('Missing jsonData in request body')

    const sourceDocument = jsonData.extraction_metadata?.source_document || 'unknown source'
    log(results.logs, 'INFO', `=== START IMPORT: ${sourceDocument} ===`)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const individuals = jsonData.individuals || []
    log(results.logs, 'INFO', `Found ${individuals.length} individuals to process`)

    // ========================================
    // PHASE 0: Find or Create Document
    // ========================================
    log(results.logs, 'INFO', 'PHASE 0: Finding/creating source document')

    let documentId: string
    const { data: existingDoc } = await supabase
      .from('documents')
      .select('id')
      .ilike('title', `%${sourceDocument}%`)
      .single()

    if (existingDoc) {
      documentId = existingDoc.id
      log(results.logs, 'INFO', `Using existing document: ${documentId}`)
    } else {
      const { data: newDoc, error: docError } = await supabase
        .from('documents')
        .insert({
          title: sourceDocument,
          document_type: 'genealogical_compilation',
          raw_text: `Structured import from ${sourceDocument}`,
          processing_status: 'complete'
        })
        .select('id')
        .single()

      if (docError) throw new Error(`Failed to create document: ${docError.message}`)
      documentId = newDoc.id
      log(results.logs, 'INFO', `Created document: ${documentId}`)
    }

    // ========================================
    // PHASE 1: Create All Individuals First
    // ========================================
    log(results.logs, 'INFO', 'PHASE 1: Creating individuals')

    const tempIdToDbId: Record<string, string> = {}
    const tempIdToName: Record<string, string> = {}

    for (const individual of individuals) {
      const tempId = individual.temp_id
      if (!tempId) {
        log(results.logs, 'WARN', `Skipping individual without temp_id`)
        continue
      }

      results.counts.individuals_processed++
      const fullName = `${individual.given_name || ''} ${individual.surname || ''}`.trim()
      tempIdToName[tempId] = fullName

      let dbId: string | null = null

      // Try custom_id match first
      if (individual.match_existing?.custom_id) {
        const customId = individual.match_existing.custom_id
        const { data: existing } = await supabase
          .from('people')
          .select('id')
          .eq('id', customId)
          .single()

        if (existing) {
          dbId = existing.id
          log(results.logs, 'INFO', `MATCHED: ${tempId} → ${dbId} (custom_id)`)
          results.counts.individuals_matched++
        }
      }

      // Try automatic duplicate detection by name + birth year
      if (!dbId) {
        const existingMatch = await findExistingProfile(
          supabase,
          individual.given_name,
          individual.surname,
          individual.birth_year
        )

        if (existingMatch) {
          dbId = existingMatch.id
          log(results.logs, 'INFO', `MATCHED: ${tempId} → ${dbId} (auto: ${existingMatch.matchType}, score: ${existingMatch.score})`)
          results.counts.individuals_matched++
        }
      }

      // Create new profile if no match found
      if (!dbId) {
        const newPerson: Record<string, any> = {
          given_name: individual.given_name || 'Unknown',
          surname: individual.surname || 'Unknown',
          suffix: individual.suffix || null,
          birth_year: individual.birth_year || null,
          birth_year_type: individual.birth_year_type === 'circa' ? 'e' :
                          individual.birth_year_type === 'before' ? 'b' : null,
          death_year: individual.death_year || null,
          death_year_type: individual.death_year_type === 'circa' ? 'e' :
                          individual.death_year_type === 'before' ? 'b' : null,
          bio: individual.notes || null,
          confidence: 'PROBABLE'
        }

        // Retry up to 3 times with different IDs in case of collision
        let created = null
        let createError = null
        for (let attempt = 0; attempt < 3; attempt++) {
          const profileId = generateProfileId(individual.surname, individual.birth_year)
          newPerson.id = profileId

          const result = await supabase
            .from('people')
            .insert(newPerson)
            .select('id')
            .single()

          if (!result.error) {
            created = result.data
            break
          } else if (result.error.code === '23505') {
            // Duplicate key - try again with new ID
            log(results.logs, 'WARN', `ID collision for ${tempId}, retrying (attempt ${attempt + 1})`)
            continue
          } else {
            createError = result.error
            break
          }
        }

        if (!created) {
          log(results.logs, 'ERROR', `Failed to create ${tempId}: ${createError?.message || 'Max retries exceeded'}`)
          results.errors.push(`Create ${tempId}: ${createError?.message || 'Max retries exceeded'}`)
          continue
        }

        dbId = created.id
        log(results.logs, 'INFO', `CREATED: ${tempId} → ${dbId} (${fullName})`)
        results.counts.individuals_created++
      }

      tempIdToDbId[tempId] = dbId
    }

    log(results.logs, 'INFO', `Phase 1 complete: ${results.counts.individuals_created} created, ${results.counts.individuals_matched} matched`)

    // ========================================
    // PHASE 2: Process Locations for Each Individual
    // ========================================
    log(results.logs, 'INFO', 'PHASE 2: Processing locations')

    // Cache for location lookups
    const locationCache: Record<string, string> = {}

    for (const individual of individuals) {
      const tempId = individual.temp_id
      const dbId = tempIdToDbId[tempId]
      if (!dbId) continue

      const locations = individual.locations || []

      for (const loc of locations) {
        const placeName = loc.place
        if (!placeName) continue

        // Find or create location
        let locationId = locationCache[placeName.toLowerCase()]

        if (!locationId) {
          // Try to find existing
          const { data: existingLoc } = await supabase
            .from('locations')
            .select('id')
            .ilike('name', placeName)
            .single()

          if (existingLoc) {
            locationId = existingLoc.id
          } else {
            // Create new location
            const locationType = placeName.includes('County') ? 'county' :
                               placeName.includes('Parish') ? 'parish' :
                               placeName.includes('Creek') ? 'landmark' :
                               placeName.includes('Island') ? 'landmark' : 'place'

            const { data: newLoc, error: locError } = await supabase
              .from('locations')
              .insert({
                name: placeName,
                location_type: locationType
              })
              .select('id')
              .single()

            if (!locError && newLoc) {
              locationId = newLoc.id
              results.counts.locations_created++
              log(results.logs, 'INFO', `LOCATION: Created "${placeName}"`)
            }
          }

          if (locationId) {
            locationCache[placeName.toLowerCase()] = locationId
          }
        }

        if (locationId) {
          // Determine residence type
          const resType = loc.type === 'birth' ? 'birth' :
                         loc.type === 'death' ? 'death' :
                         loc.type === 'land_ownership' ? 'landowner' : 'resident'

          // Parse dates
          let dateFirst: string | null = null
          let dateLast: string | null = null

          if (loc.date) {
            dateFirst = loc.date
            dateLast = loc.date
          } else if (loc.date_range) {
            const parts = loc.date_range.split('-')
            if (parts.length >= 1) dateFirst = parts[0].trim()
            if (parts.length >= 2) dateLast = parts[1].trim()
          }

          // Create location_residents record (no confidence column exists)
          const { error: lrError } = await supabase
            .from('location_residents')
            .insert({
              person_id: dbId,
              location_id: locationId,
              residence_type: resType,
              date_first: dateFirst,
              date_last: dateLast,
              evidence: loc.notes || `From ${individual.temp_id} locations`
            })

          if (!lrError) {
            results.counts.location_residents_created++
            log(results.logs, 'INFO', `  RESIDENCE: ${tempIdToName[tempId] || tempId} at ${placeName}`)
          } else {
            log(results.logs, 'ERROR', `  Failed location_resident: ${lrError.message}`)
          }
        }
      }
    }

    log(results.logs, 'INFO', `Phase 2 complete: ${results.counts.locations_created} locations, ${results.counts.location_residents_created} residents`)

    // ========================================
    // PHASE 3: Process Family Members (Relationships)
    // ========================================
    log(results.logs, 'INFO', 'PHASE 3: Processing family relationships')

    // Track created relationships to avoid duplicates
    const createdRelationships = new Set<string>()

    for (const individual of individuals) {
      const tempId = individual.temp_id
      const personDbId = tempIdToDbId[tempId]
      if (!personDbId) continue

      const familyMembers = individual.family_members || []

      for (const fm of familyMembers) {
        const relatedTempId = fm.temp_id
        const relatedDbId = relatedTempId ? tempIdToDbId[relatedTempId] : null

        if (!relatedDbId) {
          // Related person not in this import - skip for now
          continue
        }

        const relType = fm.relationship?.toLowerCase() || 'relative'
        const mapping = RELATIONSHIP_MAP[relType] || { forward: relType, inverse: 'relative' }

        const confidence = (fm.confidence || 'probable').toLowerCase()
        const evidence = fm.source || null

        // Create forward relationship (from this person's perspective)
        // e.g., if John lists Ann as "child", then John → Ann with type "child"
        const fwdKey = `${personDbId}|${relatedDbId}|${mapping.forward}`
        if (!createdRelationships.has(fwdKey)) {
          const { error: fwdError } = await supabase
            .from('family_relationships')
            .insert({
              person_id: personDbId,
              related_person_id: relatedDbId,
              relationship_type: mapping.forward,
              relationship_status: confidence,
              evidence
            })

          if (!fwdError) {
            createdRelationships.add(fwdKey)
            results.counts.relationships_created++
            log(results.logs, 'INFO', `RELATIONSHIP: ${tempId} [${mapping.forward}] ${relatedTempId}`)
          }
        }

        // Create inverse relationship
        // e.g., if John lists Ann as "child", then Ann → John with type "father"
        const invKey = `${relatedDbId}|${personDbId}|${mapping.inverse}`
        if (!createdRelationships.has(invKey)) {
          const { error: invError } = await supabase
            .from('family_relationships')
            .insert({
              person_id: relatedDbId,
              related_person_id: personDbId,
              relationship_type: mapping.inverse,
              relationship_status: confidence,
              evidence: evidence ? `${evidence} (inverse)` : null
            })

          if (!invError) {
            createdRelationships.add(invKey)
            results.counts.relationships_created++
          }
        }
      }
    }

    log(results.logs, 'INFO', `Phase 3 complete: ${results.counts.relationships_created} relationships`)

    // ========================================
    // PHASE 3.5: Process Associated Individuals (Associations)
    // ========================================
    log(results.logs, 'INFO', 'PHASE 3.5: Processing associated individuals')

    let associationsCreated = 0
    let stubProfilesCreated = 0

    // Helper to parse a name string into given/surname
    function parseName(fullName: string): { givenName: string, surname: string } {
      if (!fullName) return { givenName: 'Unknown', surname: 'Unknown' }

      // Remove parenthetical notes like "(b. 1600)" or "(wife)"
      const cleanName = fullName.replace(/\s*\([^)]*\)/g, '').trim()

      const parts = cleanName.split(/\s+/)
      if (parts.length === 1) {
        return { givenName: parts[0], surname: 'Unknown' }
      }
      // Last part is surname, rest is given name
      const surname = parts.pop() || 'Unknown'
      const givenName = parts.join(' ') || 'Unknown'
      return { givenName, surname }
    }

    // Cache for stub profiles we create (by name) to avoid duplicates
    const stubProfileCache: Record<string, string> = {}

    for (const individual of individuals) {
      const tempId = individual.temp_id
      const personDbId = tempIdToDbId[tempId]
      if (!personDbId) continue

      const associatedIndividuals = individual.associated_individuals || []

      for (const assoc of associatedIndividuals) {
        // Check if the associated person is in this import
        const assocTempId = assoc.temp_id
        let assocDbId = assocTempId ? tempIdToDbId[assocTempId] : null

        // If not in import, create a stub profile for the external person
        if (!assocDbId && assoc.name) {
          const cacheKey = assoc.name.toLowerCase().trim()

          // Check cache first
          if (stubProfileCache[cacheKey]) {
            assocDbId = stubProfileCache[cacheKey]
          } else {
            // Try to find existing person by name using the duplicate detection
            const { givenName, surname } = parseName(assoc.name)

            // Use the same matching logic but lower threshold since we don't have birth year
            const existingMatch = await findExistingProfile(supabase, givenName, surname, null, 65)

            if (existingMatch) {
              assocDbId = existingMatch.id
              stubProfileCache[cacheKey] = assocDbId
              log(results.logs, 'INFO', `Found existing profile for ${assoc.name}: ${assocDbId} (score: ${existingMatch.score})`)
            } else {
              // Create stub profile - use confidence from the association since they're documented
              const designation = assoc.title || null
              const profileConfidence = (assoc.confidence || 'probable').toUpperCase()

              // Retry up to 3 times with different IDs in case of collision
              let newStub = null
              for (let attempt = 0; attempt < 3; attempt++) {
                const stubId = generateProfileId(surname, null)

                const result = await supabase
                  .from('people')
                  .insert({
                    id: stubId,
                    given_name: givenName,
                    surname: surname,
                    designation: designation,
                    bio: `${assoc.notes || ''}`.trim() || null,
                    confidence: profileConfidence
                  })
                  .select('id')
                  .single()

                if (!result.error) {
                  newStub = result.data
                  break
                } else if (result.error.code === '23505') {
                  // Duplicate key - try again
                  continue
                } else {
                  log(results.logs, 'ERROR', `Failed to create stub for ${assoc.name}: ${result.error.message}`)
                  break
                }
              }

              if (newStub) {
                assocDbId = newStub.id
                stubProfileCache[cacheKey] = assocDbId
                stubProfilesCreated++
                log(results.logs, 'INFO', `STUB PROFILE: Created ${assocDbId} for ${assoc.name}`)
              } else {
                continue
              }
            }
          }
        }

        if (!assocDbId) {
          log(results.logs, 'WARN', `Skipping association: could not resolve ${assoc.name}`)
          continue
        }

        // Check if association already exists
        const { data: existingAssoc } = await supabase
          .from('associations')
          .select('id')
          .eq('person_id', personDbId)
          .eq('associated_person_id', assocDbId)
          .eq('association_type', assoc.relationship || 'associate')
          .single()

        if (existingAssoc) continue

        // Create association record
        const { error: assocError } = await supabase
          .from('associations')
          .insert({
            person_id: personDbId,
            associated_person_id: assocDbId,
            association_type: assoc.relationship || 'associate',
            date: assoc.date || null,
            notes: assoc.notes || null,
            evidence_summary: assoc.title ? `${assoc.title}: ${assoc.notes || ''}` : assoc.notes,
            confidence: (assoc.confidence || 'probable').toLowerCase()
          })

        if (!assocError) {
          associationsCreated++
          log(results.logs, 'INFO', `ASSOCIATION: ${tempIdToName[tempId] || tempId} ↔ ${assoc.name} (${assoc.relationship})`)
        } else {
          log(results.logs, 'ERROR', `Association failed: ${assocError.message}`)
        }
      }
    }

    log(results.logs, 'INFO', `Phase 3.5 complete: ${associationsCreated} associations, ${stubProfilesCreated} stub profiles created`)

    // ========================================
    // PHASE 4: Process Events
    // ========================================
    log(results.logs, 'INFO', 'PHASE 4: Processing events')

    // Track events to avoid duplicates (by title + date)
    const createdEvents: Record<string, string> = {} // key -> event_id

    for (const individual of individuals) {
      const tempId = individual.temp_id
      const personDbId = tempIdToDbId[tempId]
      if (!personDbId) continue

      const events = individual.events || []

      for (const evt of events) {
        const eventKey = `${evt.title || 'Untitled'}|${evt.date || 'no-date'}`

        let eventId = createdEvents[eventKey]

        // Create event if it doesn't exist
        if (!eventId) {
          let eventYear: number | null = null
          if (evt.date) {
            const yearMatch = evt.date.match(/\d{4}/)
            if (yearMatch) eventYear = parseInt(yearMatch[0])
          }

          const eventType = EVENT_TYPE_MAP[evt.event_type] || evt.event_type || 'other'

          const { data: createdEvent, error: eventError } = await supabase
            .from('events')
            .insert({
              document_id: documentId,
              event_type: eventType,
              title: evt.title || 'Untitled Event',
              event_date_text: evt.date || null,
              event_year: eventYear,
              location_text: evt.location || null,
              description: evt.description || null,
              confidence: (evt.confidence || 'probable').toLowerCase()
            })
            .select('id')
            .single()

          if (eventError) {
            log(results.logs, 'ERROR', `Failed to create event "${evt.title}": ${eventError.message}`)
            continue
          }

          eventId = createdEvent.id
          createdEvents[eventKey] = eventId
          results.counts.events_created++
          log(results.logs, 'INFO', `EVENT: "${evt.title}" (${evt.date || 'no date'})`)
        }

        // Add this person as participant
        const personName = tempIdToName[tempId] || 'Unknown'
        let role = evt.role || 'participant'
        if (role === 'spouse') role = 'spouse_1'

        const { error: partError } = await supabase
          .from('event_participants')
          .insert({
            event_id: eventId,
            person_id: personDbId,
            name_as_written: personName,
            role: role,
            identification_status: 'confirmed'
          })

        if (!partError) {
          results.counts.event_participants_created++
        }
      }
    }

    log(results.logs, 'INFO', `Phase 4 complete: ${results.counts.events_created} events, ${results.counts.event_participants_created} participants`)

    // ========================================
    // SUMMARY
    // ========================================
    results.success = results.errors.length === 0

    log(results.logs, 'INFO', '=== IMPORT COMPLETE ===')
    log(results.logs, 'INFO', `Individuals: ${results.counts.individuals_created} created, ${results.counts.individuals_matched} matched`)
    log(results.logs, 'INFO', `Locations: ${results.counts.locations_created} created, ${results.counts.location_residents_created} residents`)
    log(results.logs, 'INFO', `Relationships: ${results.counts.relationships_created}`)
    log(results.logs, 'INFO', `Events: ${results.counts.events_created}, Participants: ${results.counts.event_participants_created}`)
    if (results.errors.length > 0) {
      log(results.logs, 'ERROR', `Errors: ${results.errors.length}`)
    }

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    log(results.logs, 'ERROR', `FATAL: ${error.message}`)
    results.errors.push(error.message)
    return new Response(JSON.stringify(results), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
