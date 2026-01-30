// Supabase Edge Function to match event participants to people profiles
// Enhanced with: exact match detection, relationship boost, auto-profile creation, deduplication
// Deploy with: supabase functions deploy match-participants

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Person {
  id: string
  given_name: string | null
  surname: string | null
  name_variants: string[] | null
  birth_year: number | null
  death_year: number | null
  first_documented: string | null
  bio: string | null
  occupation: string | null
}

interface Participant {
  id: string
  name_as_written: string
  surname_extracted: string | null
  given_name_extracted: string | null
  event: {
    id: string
    event_year: number | null
    event_date_text: string | null
    location_id: string | null
    document_id: string
    transcription: string | null
  }
}

interface ExtractedRelationship {
  id: string
  person1_name: string
  person2_name: string | null
  relationship_type: string
  person1_profile_id: string | null
  person2_profile_id: string | null
}

interface MatchResult {
  person_id: string
  person_name: string
  score: number
  reasons: string[]
  confidence: 'confirmed' | 'probable' | 'possible'
}

// Document-scoped cache to prevent duplicates within same processing run
const documentProfileCache: Record<string, Record<string, string>> = {}

// Surname variant mappings for genealogical research
const SURNAME_VARIANTS: Record<string, string[]> = {
  'JOHNSON': ['JOHNSON', 'JOHNSTON', 'JONSON', 'JOHNSEN'],
  'JOHNSTON': ['JOHNSTON', 'JOHNSON', 'JONSON', 'JOHNSEN'],
  'GOCHE': ['GOCHE', 'GOUCHE', 'GOUCH', 'GOOCH', 'GOCH'],
  'GOUCHE': ['GOUCHE', 'GOCHE', 'GOUCH', 'GOOCH', 'GOCH'],
  'GOUCH': ['GOUCH', 'GOCHE', 'GOUCHE', 'GOOCH', 'GOCH'],
  'GOOCH': ['GOOCH', 'GOCHE', 'GOUCHE', 'GOUCH', 'GOCH'],
  'GOCH': ['GOCH', 'GOCHE', 'GOUCHE', 'GOUCH', 'GOOCH'],
  'RENFRO': ['RENFRO', 'RENFROE', 'RENTFRO', 'RENTFROW'],
  'LOONEY': ['LOONEY', 'LOONY', 'LUNEY', 'LONEY'],
  'TRAVIS': ['TRAVIS', 'TRAVISS', 'TREVIS'],
}

// Given name variant mappings
const GIVEN_NAME_VARIANTS: Record<string, string[]> = {
  'JEFFREY': ['JEFFREY', 'JEFFERY', 'JEOFFREY', 'GEOFFREY', 'GEOFFRY'],
  'JEFFERY': ['JEFFERY', 'JEFFREY', 'JEOFFREY', 'GEOFFREY', 'GEOFFRY'],
  'JEOFFREY': ['JEOFFREY', 'JEFFREY', 'JEFFERY', 'GEOFFREY', 'GEOFFRY'],
  'ANN': ['ANN', 'ANNE', 'ANNA'],
  'ANNE': ['ANNE', 'ANN', 'ANNA'],
  'WILLIAM': ['WILLIAM', 'WM', 'WILL'],
  'JOHN': ['JOHN', 'JNO', 'JN'],
  'JNO': ['JNO', 'JOHN', 'JN'],
}

// Unique identifiers that indicate exact match
const UNIQUE_IDENTIFIERS = [
  'ancient planter',
  'ancient inhabitant',
  'first settler',
  'original patentee'
]

// Invalid name patterns (garbage from regex extraction)
const INVALID_NAME_PATTERNS = [
  /^(TO|OF|THE|AND|IN|FOR|BY|AT|FROM)$/i,
  /^(MR|MRS|MS|DR|JR|SR|JUNIOR|SENIOR)$/i,
  /^(DECEASED|COUNTY|PARISH|VIRGINIA|ENGLAND)$/i,
  /^[^A-Za-z]+$/,  // No letters
  /\d/,  // Contains numbers
  /^.{1,2}$/,  // Too short (1-2 chars)
  /(HEREIN|NAMELY|ROAMING|SHOULD|SEEMED|WERE|SAID)/i,
]

function isValidName(name: string | null): boolean {
  if (!name || name.trim().length < 2) return false

  for (const pattern of INVALID_NAME_PATTERNS) {
    if (pattern.test(name.trim())) return false
  }

  return true
}

function getSurnameVariants(surname: string): string[] {
  const normalized = surname.toUpperCase()
  return SURNAME_VARIANTS[normalized] || [normalized]
}

function getGivenNameVariants(givenName: string): string[] {
  const normalized = givenName.toUpperCase()
  return GIVEN_NAME_VARIANTS[normalized] || [normalized]
}

function parseName(fullName: string): { surname: string | null, givenName: string | null } {
  if (!fullName) return { surname: null, givenName: null }

  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 0) return { surname: null, givenName: null }

  // Check if last part is all caps (surname)
  const lastPart = parts[parts.length - 1]
  if (lastPart === lastPart.toUpperCase() && lastPart.length > 1) {
    return {
      surname: lastPart,
      givenName: parts.slice(0, -1).join(' ') || null
    }
  }

  // Otherwise assume "Given Surname" format
  if (parts.length >= 2) {
    return {
      givenName: parts[0],
      surname: parts[parts.length - 1].toUpperCase()
    }
  }

  return { surname: parts[0].toUpperCase(), givenName: null }
}

function namesMatch(
  participantSurname: string | null,
  participantGiven: string | null,
  profile: Person
): boolean {
  if (!participantSurname) return false

  const pSurname = participantSurname.toUpperCase()
  const profileSurname = profile.surname?.toUpperCase()
  const variants = (profile.name_variants || []).map(v => v.toUpperCase())

  // Get all surname variants for comparison
  const pSurnameVariants = getSurnameVariants(pSurname)
  const profileSurnameVariants = profileSurname ? getSurnameVariants(profileSurname) : []

  // Check if any variant matches
  const surnameMatches = pSurnameVariants.some(v =>
    v === profileSurname ||
    variants.includes(v) ||
    profileSurnameVariants.includes(v)
  )

  return surnameMatches
}

function checkExactMatch(
  participant: Participant,
  profile: Person,
  eventDateStr: string | null,
  transcription: string | null
): { isExact: boolean, reason: string | null } {

  // Check for exact date match
  if (eventDateStr && profile.first_documented) {
    const eventDate = new Date(eventDateStr)
    const profileDate = new Date(profile.first_documented)

    if (!isNaN(eventDate.getTime()) && !isNaN(profileDate.getTime())) {
      if (eventDate.toISOString().split('T')[0] === profileDate.toISOString().split('T')[0]) {
        return { isExact: true, reason: 'exact_date_match' }
      }
    }
  }

  // Check for unique identifier match
  const transLower = (transcription || '').toLowerCase()
  const bioLower = (profile.bio || '').toLowerCase()
  const occLower = (profile.occupation || '').toLowerCase()

  for (const identifier of UNIQUE_IDENTIFIERS) {
    if (transLower.includes(identifier)) {
      if (bioLower.includes(identifier) || occLower.includes(identifier)) {
        return { isExact: true, reason: `unique_identifier:${identifier}` }
      }
    }
  }

  return { isExact: false, reason: null }
}

function calculateMatchScore(
  participant: Participant,
  profile: Person,
  relationships: ExtractedRelationship[],
  confirmedMatches: Map<string, string>
): { score: number, reasons: string[] } {

  let score = 0
  const reasons: string[] = []

  const pSurname = participant.surname_extracted?.toUpperCase()
  const pGiven = participant.given_name_extracted?.toUpperCase()
  const profileSurname = profile.surname?.toUpperCase()
  const profileGiven = profile.given_name?.toUpperCase()

  // Surname match (base score)
  if (pSurname && profileSurname) {
    const pVariants = getSurnameVariants(pSurname)
    const profileVariants = getSurnameVariants(profileSurname)
    const variants = (profile.name_variants || []).map(v => v.toUpperCase())

    if (profileSurname === pSurname || variants.includes(pSurname)) {
      score += 30
      reasons.push('surname_exact')
    } else if (pVariants.some(v => profileVariants.includes(v))) {
      score += 25
      reasons.push('surname_variant')
    }
  }

  // Given name match
  if (pGiven && profileGiven) {
    const pGivenVariants = getGivenNameVariants(pGiven)
    const profileGivenVariants = getGivenNameVariants(profileGiven)

    if (profileGiven === pGiven) {
      score += 25
      reasons.push('given_name_exact')
    } else if (pGivenVariants.some(v => profileGivenVariants.includes(v))) {
      score += 20
      reasons.push('given_name_variant')
    } else if (
      profileGiven.startsWith(pGiven.substring(0, 3)) ||
      pGiven.startsWith(profileGiven.substring(0, 3))
    ) {
      score += 15
      reasons.push('given_name_partial')
    }
  }

  // Age plausibility
  const eventYear = participant.event?.event_year
  if (eventYear && profile.birth_year) {
    const age = eventYear - profile.birth_year
    if (age < 0 || age > 100) {
      return { score: 0, reasons: ['impossible_age'] }
    }
    if (age >= 18 && age <= 70) {
      score += 10
      reasons.push(`plausible_age_${age}`)
    } else if (age >= 10 && age <= 85) {
      score += 5
      reasons.push(`marginal_age_${age}`)
    }
  }

  // Check if person was dead before event
  if (eventYear && profile.death_year && profile.death_year < eventYear) {
    return { score: 0, reasons: ['deceased_before_event'] }
  }

  // RELATIONSHIP BOOST: Check if participant is related to a confirmed match
  const participantName = participant.name_as_written.toUpperCase()
  for (const rel of relationships) {
    const person1Upper = rel.person1_name?.toUpperCase() || ''
    const person2Upper = rel.person2_name?.toUpperCase() || ''

    let relatedProfileId: string | null = null

    if (participantName.includes(person1Upper) || person1Upper.includes(participantName)) {
      if (rel.person2_profile_id) {
        relatedProfileId = rel.person2_profile_id
      } else if (rel.person2_name) {
        for (const [name, profileId] of confirmedMatches) {
          if (name.toUpperCase().includes(person2Upper) || person2Upper.includes(name.toUpperCase())) {
            relatedProfileId = profileId
            break
          }
        }
      }
    } else if (participantName.includes(person2Upper) || person2Upper.includes(participantName)) {
      if (rel.person1_profile_id) {
        relatedProfileId = rel.person1_profile_id
      } else if (rel.person1_name) {
        for (const [name, profileId] of confirmedMatches) {
          if (name.toUpperCase().includes(person1Upper) || person1Upper.includes(name.toUpperCase())) {
            relatedProfileId = profileId
            break
          }
        }
      }
    }

    if (relatedProfileId && relatedProfileId === profile.id) {
      score += 30
      reasons.push(`related_to_confirmed:${rel.relationship_type}`)
      break
    }
  }

  return { score, reasons }
}

function assignConfidence(
  score: number,
  reasons: string[],
  candidateCount: number
): 'confirmed' | 'probable' | 'possible' | 'unidentified' {

  if (reasons.some(r => r.startsWith('related_to_confirmed'))) {
    return 'probable'
  }

  if (score >= 70 && candidateCount === 1) {
    return 'probable'
  }

  if (score >= 80) {
    return 'probable'
  }

  if (score >= 40) {
    return 'possible'
  }

  return 'unidentified'
}

async function findOrCreateProfile(
  name: string,
  documentId: string,
  supabase: SupabaseClient,
  existingPeople: Person[]
): Promise<string | null> {

  const { surname, givenName } = parseName(name)

  // Validate the name
  if (!isValidName(surname)) {
    console.log(`Invalid surname rejected: ${surname}`)
    return null
  }
  if (givenName && !isValidName(givenName)) {
    console.log(`Invalid given name rejected: ${givenName}`)
    return null
  }

  const normalizedSurname = surname?.toUpperCase() || ''
  const normalizedGiven = givenName?.toUpperCase() || ''

  // 1. Check document-scoped cache first
  const cacheKey = `${normalizedSurname}:${normalizedGiven}`
  if (documentProfileCache[documentId]?.[cacheKey]) {
    console.log(`Found in document cache: ${name}`)
    return documentProfileCache[documentId][cacheKey]
  }

  // 2. Check existing profiles (including variants)
  const surnameVariants = getSurnameVariants(normalizedSurname)
  const givenVariants = normalizedGiven ? getGivenNameVariants(normalizedGiven) : ['']

  for (const person of existingPeople) {
    const personSurname = person.surname?.toUpperCase() || ''
    const personGiven = person.given_name?.toUpperCase() || ''

    // Check surname match (including variants)
    const surnameMatch = surnameVariants.includes(personSurname) ||
      getSurnameVariants(personSurname).some(v => surnameVariants.includes(v))

    if (!surnameMatch) continue

    // Check given name match (including variants)
    if (normalizedGiven) {
      const givenMatch = givenVariants.includes(personGiven) ||
        getGivenNameVariants(personGiven).some(v => givenVariants.includes(v))

      if (givenMatch) {
        console.log(`Found existing profile for ${name}: ${person.id}`)
        // Add to cache
        if (!documentProfileCache[documentId]) documentProfileCache[documentId] = {}
        documentProfileCache[documentId][cacheKey] = person.id
        return person.id
      }
    } else if (!personGiven) {
      // Both have no given name, surname matches
      console.log(`Found existing profile (no given) for ${name}: ${person.id}`)
      if (!documentProfileCache[documentId]) documentProfileCache[documentId] = {}
      documentProfileCache[documentId][cacheKey] = person.id
      return person.id
    }
  }

  // 3. Create new profile
  const { data: newPerson, error } = await supabase
    .from('people')
    .insert({
      id: crypto.randomUUID(),
      given_name: givenName,
      surname: surname,
      auto_created: true,
      needs_review: true,
      creation_source: `document:${documentId}`,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating profile:', error)
    return null
  }

  console.log(`Created new profile for ${name}: ${newPerson.id}`)

  // Add to cache
  if (!documentProfileCache[documentId]) documentProfileCache[documentId] = {}
  documentProfileCache[documentId][cacheKey] = newPerson.id

  // Add to existingPeople for subsequent lookups
  existingPeople.push({
    id: newPerson.id,
    given_name: givenName,
    surname: surname,
    name_variants: null,
    birth_year: null,
    death_year: null,
    first_documented: null,
    bio: null,
    occupation: null
  })

  return newPerson.id
}

// Propagate confidence through relationship chains
async function propagateConfidenceCascade(
  documentId: string,
  supabase: SupabaseClient,
  maxDepth: number = 3
): Promise<number> {

  let totalUpgraded = 0

  for (let depth = 0; depth < maxDepth; depth++) {
    // Get all confirmed/probable profiles for this document's participants
    const { data: knownParticipants } = await supabase
      .from('event_participants')
      .select('person_id, events!inner(document_id)')
      .eq('events.document_id', documentId)
      .in('confidence', ['confirmed', 'probable'])

    if (!knownParticipants || knownParticipants.length === 0) break

    const knownIds = [...new Set(knownParticipants.map(p => p.person_id).filter(Boolean))]
    if (knownIds.length === 0) break

    // Find relationships where one party is known
    const { data: relationships } = await supabase
      .from('extracted_relationships')
      .select('*')
      .eq('document_id', documentId)

    if (!relationships || relationships.length === 0) break

    let upgradedCount = 0

    for (const rel of relationships) {
      let unknownProfileId: string | null = null
      let knownName: string = ''

      // If person1 is known, target person2
      if (rel.person1_profile_id && knownIds.includes(rel.person1_profile_id) &&
          rel.person2_profile_id && !knownIds.includes(rel.person2_profile_id)) {
        unknownProfileId = rel.person2_profile_id
        knownName = rel.person1_name
      }
      // If person2 is known, target person1
      else if (rel.person2_profile_id && knownIds.includes(rel.person2_profile_id) &&
               rel.person1_profile_id && !knownIds.includes(rel.person1_profile_id)) {
        unknownProfileId = rel.person1_profile_id
        knownName = rel.person2_name || ''
      }

      if (unknownProfileId) {
        // Upgrade all event_participants for this profile to PROBABLE
        const { data: updated } = await supabase
          .from('event_participants')
          .update({
            confidence: 'probable',
            identification_status: 'probable'
          })
          .eq('person_id', unknownProfileId)
          .in('confidence', ['possible', null])
          .select('id')

        if (updated && updated.length > 0) {
          upgradedCount += updated.length
          console.log(`Upgraded ${updated.length} participants for profile ${unknownProfileId} (related to ${knownName})`)
        }
      }
    }

    totalUpgraded += upgradedCount
    console.log(`Cascade depth ${depth + 1}: upgraded ${upgradedCount} participants`)

    if (upgradedCount === 0) break
  }

  return totalUpgraded
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { documentId } = await req.json()

    if (!documentId) {
      return new Response(
        JSON.stringify({ error: 'Missing documentId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Clear document cache at start
    documentProfileCache[documentId] = {}

    // Get extracted relationships for this document
    const { data: relationships } = await supabase
      .from('extracted_relationships')
      .select('*')
      .eq('document_id', documentId) as { data: ExtractedRelationship[] | null }

    // Get all unidentified participants for this document
    const { data: participants, error: fetchError } = await supabase
      .from('event_participants')
      .select(`
        id,
        name_as_written,
        surname_extracted,
        given_name_extracted,
        event:events!inner(id, event_year, event_date_text, location_id, document_id, transcription)
      `)
      .eq('event.document_id', documentId)
      .eq('identification_status', 'unidentified') as { data: Participant[] | null, error: any }

    if (fetchError) {
      console.error('Error fetching participants:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch participants' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get all people for matching
    const { data: people, error: peopleError } = await supabase
      .from('people')
      .select('id, given_name, surname, name_variants, birth_year, death_year, first_documented, bio, occupation') as { data: Person[] | null, error: any }

    if (peopleError) {
      console.error('Error fetching people:', peopleError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch people' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const existingPeople = people || []
    const confirmedMatches = new Map<string, string>()

    let confirmedCount = 0
    let probableCount = 0
    let possibleCount = 0
    let profilesCreated = 0

    // First pass: Find exact matches (CONFIRMED)
    for (const participant of (participants || [])) {
      const surname = participant.surname_extracted?.toUpperCase()
      const givenName = participant.given_name_extracted?.toUpperCase()

      if (!surname) continue

      for (const person of existingPeople) {
        if (!namesMatch(surname, givenName, person)) continue

        const { isExact, reason } = checkExactMatch(
          participant,
          person,
          participant.event?.event_date_text || null,
          participant.event?.transcription || null
        )

        if (isExact) {
          await supabase
            .from('event_participants')
            .update({
              person_id: person.id,
              identification_status: 'confirmed',
              confidence: 'confirmed',
              possible_matches: [{ person_id: person.id, score: 100, reasons: [reason] }],
              updated_at: new Date().toISOString()
            })
            .eq('id', participant.id)

          confirmedMatches.set(participant.name_as_written, person.id)
          confirmedCount++
          break
        }
      }
    }

    // Second pass: Score remaining participants with relationship boost
    for (const participant of (participants || [])) {
      if (confirmedMatches.has(participant.name_as_written)) continue

      const surname = participant.surname_extracted?.toUpperCase()
      const givenName = participant.given_name_extracted?.toUpperCase()

      if (!surname) continue

      const matches: MatchResult[] = []

      for (const person of existingPeople) {
        if (!namesMatch(surname, givenName, person)) continue

        const eventYear = participant.event?.event_year
        if (eventYear && person.birth_year) {
          const age = eventYear - person.birth_year
          if (age < 0 || age > 100) continue
        }
        if (eventYear && person.death_year && person.death_year < eventYear) continue

        const { score, reasons } = calculateMatchScore(
          participant,
          person,
          relationships || [],
          confirmedMatches
        )

        if (score >= 30) {
          matches.push({
            person_id: person.id,
            person_name: `${person.given_name || ''} ${person.surname}`.trim(),
            score,
            reasons,
            confidence: 'possible'
          })
        }
      }

      matches.sort((a, b) => b.score - a.score)

      let status: 'confirmed' | 'probable' | 'possible' | 'unidentified' = 'unidentified'
      let personId: string | null = null
      let confidence: string | null = null

      if (matches.length > 0) {
        const topMatch = matches[0]
        const finalConfidence = assignConfidence(topMatch.score, topMatch.reasons, matches.length)

        if (finalConfidence === 'probable') {
          status = 'probable'
          personId = topMatch.person_id
          confidence = 'probable'
          probableCount++
          confirmedMatches.set(participant.name_as_written, topMatch.person_id)
        } else if (finalConfidence === 'possible') {
          status = 'possible'
          personId = topMatch.person_id
          confidence = 'possible'
          possibleCount++
        }
      }

      await supabase
        .from('event_participants')
        .update({
          person_id: personId,
          identification_status: status,
          confidence: confidence,
          possible_matches: matches.slice(0, 5),
          updated_at: new Date().toISOString()
        })
        .eq('id', participant.id)
    }

    // Third pass: Create profiles from relationships where needed (with deduplication)
    for (const rel of (relationships || [])) {
      // Try to link person1
      if (!rel.person1_profile_id && rel.person1_name) {
        const profileId = await findOrCreateProfile(rel.person1_name, documentId, supabase, existingPeople)

        if (profileId) {
          await supabase
            .from('extracted_relationships')
            .update({ person1_profile_id: profileId })
            .eq('id', rel.id)

          // Check if this was a new profile
          const isNew = !people?.some(p => p.id === profileId)
          if (isNew) profilesCreated++
        }
      }

      // Try to link person2
      if (!rel.person2_profile_id && rel.person2_name) {
        const profileId = await findOrCreateProfile(rel.person2_name, documentId, supabase, existingPeople)

        if (profileId) {
          await supabase
            .from('extracted_relationships')
            .update({ person2_profile_id: profileId })
            .eq('id', rel.id)

          const isNew = !people?.some(p => p.id === profileId)
          if (isNew) profilesCreated++
        }
      }

      // Create family_relationship record if both profiles exist
      const { data: updatedRel } = await supabase
        .from('extracted_relationships')
        .select('person1_profile_id, person2_profile_id, relationship_type')
        .eq('id', rel.id)
        .single()

      if (updatedRel?.person1_profile_id && updatedRel?.person2_profile_id) {
        // Check if relationship already exists
        const { data: existingRel } = await supabase
          .from('family_relationships')
          .select('id')
          .eq('person_id', updatedRel.person1_profile_id)
          .eq('related_person_id', updatedRel.person2_profile_id)
          .single()

        if (!existingRel) {
          await supabase
            .from('family_relationships')
            .insert({
              person_id: updatedRel.person1_profile_id,
              related_person_id: updatedRel.person2_profile_id,
              relationship_type: updatedRel.relationship_type,
              confidence: 'probable'
            })
        }
      }
    }

    // Fourth pass: Propagate confidence through relationships
    const cascadeUpgrades = await propagateConfidenceCascade(documentId, supabase, 3)
    probableCount += cascadeUpgrades

    // Update document status and counts
    await supabase
      .from('documents')
      .update({
        processing_status: 'review',
        profiles_created: profilesCreated
      })
      .eq('id', documentId)

    // Clear document cache
    delete documentProfileCache[documentId]

    return new Response(
      JSON.stringify({
        success: true,
        processed: participants?.length || 0,
        confirmed: confirmedCount,
        probable: probableCount,
        possible: possibleCount,
        profiles_created: profilesCreated,
        cascade_upgrades: cascadeUpgrades
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
