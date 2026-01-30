/**
 * COMPREHENSIVE FIX SCRIPT
 *
 * Imports all missing data found by the audit.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabase = createClient(
  'https://oxpkqnmuwqcnmzvavsuz.supabase.co',
  'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
)

const SOURCES_DIR = '/Users/scottjohnson/Development/johnson-johnston-project/sources'
const timestamp = () => new Date().toISOString().replace('T', ' ').substring(0, 19)

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function findPersonId(name) {
  const { data } = await supabase
    .from('people')
    .select('id')
    .or(`given_name.ilike.%${name.split(' ')[0]}%,surname.ilike.%${name.split(' ').pop()}%`)
    .limit(5)

  if (data && data.length > 0) {
    // Try to match full name
    const fullName = name.toLowerCase()
    for (const p of data) {
      // We'd need full data to match properly, so return first match
    }
    return data[0].id
  }
  return null
}

async function findLocationId(name) {
  const { data } = await supabase
    .from('locations')
    .select('id, name')
    .ilike('name', `%${name}%`)
    .limit(1)

  return data?.[0]?.id || null
}

// ============================================================================
// FIX MISSING SOURCES
// ============================================================================

async function fixSources() {
  console.log(`\n[${timestamp()}] === FIXING MISSING SOURCES ===`)

  const batch1 = JSON.parse(readFileSync(join(SOURCES_DIR, 'looney-johnson-renfro-extraction-batch1.json'), 'utf-8'))
  const batch2 = JSON.parse(readFileSync(join(SOURCES_DIR, 'looney-johnson-renfro-extraction-batch2.json'), 'utf-8'))
  const batch3 = JSON.parse(readFileSync(join(SOURCES_DIR, 'looney-johnson-renfro-extraction-batch3.json'), 'utf-8'))
  const batch4 = JSON.parse(readFileSync(join(SOURCES_DIR, 'looney-johnson-renfro-extraction-batch4.json'), 'utf-8'))
  const arrowBatch1 = JSON.parse(readFileSync(join(SOURCES_DIR, 'arrowhattocks-extraction-batch1.json'), 'utf-8'))

  const allSources = [
    ...(batch1.sources_to_add || []),
    ...(batch2.sources_to_add || []),
    ...(batch3.sources_to_add || []),
    ...(batch4.sources_to_add || []),
    ...(arrowBatch1.sources_to_add || [])
  ]

  let created = 0
  let skipped = 0

  for (const src of allSources) {
    // Check if exists
    const { data: existing } = await supabase
      .from('sources')
      .select('id')
      .eq('abbreviation', src.abbreviation)
      .single()

    if (existing) {
      skipped++
      continue
    }

    const { error } = await supabase.from('sources').insert({
      abbreviation: src.abbreviation,
      title: src.title || src.full_citation,
      full_citation: src.full_citation,
      source_type: src.source_type || 'primary',
      author: src.author,
      publication_year: src.publication_year,
      repository: src.repository,
      collection: src.collection,
      volume: src.volume,
      page: src.page,
      notes: src.notes
    })

    if (error) {
      console.log(`  ERROR: ${src.abbreviation} - ${error.message}`)
    } else {
      console.log(`  CREATED: ${src.abbreviation}`)
      created++
    }
  }

  console.log(`  Sources: ${created} created, ${skipped} skipped`)
  return created
}

// ============================================================================
// FIX MISSING DOCUMENTS
// ============================================================================

async function fixDocuments() {
  console.log(`\n[${timestamp()}] === FIXING MISSING DOCUMENTS ===`)

  const batch1 = JSON.parse(readFileSync(join(SOURCES_DIR, 'looney-johnson-renfro-extraction-batch1.json'), 'utf-8'))
  const batch2 = JSON.parse(readFileSync(join(SOURCES_DIR, 'looney-johnson-renfro-extraction-batch2.json'), 'utf-8'))
  const batch3 = JSON.parse(readFileSync(join(SOURCES_DIR, 'looney-johnson-renfro-extraction-batch3.json'), 'utf-8'))
  const batch4 = JSON.parse(readFileSync(join(SOURCES_DIR, 'looney-johnson-renfro-extraction-batch4.json'), 'utf-8'))

  const allDocs = [
    ...(batch1.documents || []),
    ...(batch2.documents || []),
    ...(batch3.documents || []),
    ...(batch4.documents || [])
  ]

  let created = 0
  let skipped = 0

  for (const doc of allDocs) {
    // Check if exists
    const { data: existing } = await supabase
      .from('documents')
      .select('id')
      .ilike('title', doc.title)
      .single()

    if (existing) {
      skipped++
      continue
    }

    const { error } = await supabase.from('documents').insert({
      title: doc.title,
      document_type: doc.document_type || 'other',
      date: doc.date,
      county: doc.county,
      state: doc.state,
      transcription: doc.transcription_excerpt,
      notes: doc.notes,
      acres: doc.acres
    })

    if (error) {
      console.log(`  ERROR: ${doc.title?.substring(0, 40)}... - ${error.message}`)
    } else {
      console.log(`  CREATED: ${doc.title?.substring(0, 50)}...`)
      created++
    }
  }

  console.log(`  Documents: ${created} created, ${skipped} skipped`)
  return created
}

// ============================================================================
// FIX MISSING LOCATIONS
// ============================================================================

async function fixLocations() {
  console.log(`\n[${timestamp()}] === FIXING MISSING LOCATIONS ===`)

  const missingLocations = [
    {
      name: "Welsh Tract",
      slug: "welsh-tract",
      location_type: "region",
      description: "Welsh Tract Baptist settlement area in Pencader Hundred, New Castle County, Delaware. Important Renfro family church community 1701-1728.",
      verification_status: "confirmed"
    },
    {
      name: "Stephen Rentfroe's Fort",
      slug: "stephen-rentfroes-fort",
      location_type: "region", // fort not valid
      description: "Fort built by Stephen Renfro Sr. in the Holston River area, Virginia/Tennessee frontier. Local tradition.",
      verification_status: "possible"
    }
  ]

  let created = 0

  for (const loc of missingLocations) {
    const { data: existing } = await supabase
      .from('locations')
      .select('id')
      .eq('slug', loc.slug)
      .single()

    if (existing) {
      console.log(`  SKIP: ${loc.name} (exists)`)
      continue
    }

    const { error } = await supabase.from('locations').insert(loc)

    if (error) {
      console.log(`  ERROR: ${loc.name} - ${error.message}`)
    } else {
      console.log(`  CREATED: ${loc.name}`)
      created++
    }
  }

  return created
}

// ============================================================================
// FIX MISSING RELATIONSHIPS
// ============================================================================

async function fixRelationships() {
  console.log(`\n[${timestamp()}] === FIXING MISSING RELATIONSHIPS ===`)

  // Get all people for lookup
  const { data: people } = await supabase.from('people').select('id, given_name, surname')
  const personByName = new Map()
  for (const p of people) {
    personByName.set(`${p.given_name} ${p.surname}`.toLowerCase(), p.id)
    personByName.set(p.surname.toLowerCase(), p.id)
  }

  const missingRels = [
    // From batch1
    { p1: 'John Watson', p2: 'Sarah Watson', type: 'father', inverse: 'child' },
    { p1: 'Michael Johnson', p2: 'James Johnson', type: 'father', inverse: 'child' },
    { p1: 'Michael Johnson', p2: 'John Johnson', type: 'father', inverse: 'child' },
    { p1: 'James Johnson', p2: 'John Johnson', type: 'sibling', inverse: 'sibling' },
    // From looney batch1
    { p1: 'Robert Renfro', p2: 'Symon Renfro', type: 'father', inverse: 'child' },
    // From looney batch3
    { p1: 'Benjamin Looney', p2: 'Mary Johnson', type: 'spouse', inverse: 'spouse', status: 'confirmed', evidence: 'Married c.1768' },
    { p1: 'Benjamin Looney', p2: 'Isham Looney', type: 'father', inverse: 'child', status: 'confirmed' },
    // From looney batch4
    { p1: 'John Johnston', p2: 'Hudson Johnson', type: 'father', inverse: 'child' },
    { p1: 'Absalom David Looney', p2: 'Michael Looney', type: 'father', inverse: 'child' }
  ]

  let created = 0

  for (const rel of missingRels) {
    const p1Id = personByName.get(rel.p1.toLowerCase())
    const p2Id = personByName.get(rel.p2.toLowerCase())

    if (!p1Id || !p2Id) {
      console.log(`  SKIP: ${rel.p1} -> ${rel.p2} (person not found)`)
      continue
    }

    // Check if exists
    const { data: existing } = await supabase
      .from('family_relationships')
      .select('id')
      .eq('person_id', p1Id)
      .eq('related_person_id', p2Id)
      .single()

    if (!existing) {
      const { error } = await supabase.from('family_relationships').insert({
        person_id: p1Id,
        related_person_id: p2Id,
        relationship_type: rel.type,
        relationship_status: rel.status || 'confirmed',
        evidence: rel.evidence || `${rel.p1} [${rel.type}] ${rel.p2}`
      })

      if (error) {
        console.log(`  ERROR: ${rel.p1} [${rel.type}] ${rel.p2} - ${error.message}`)
      } else {
        console.log(`  CREATED: ${rel.p1} [${rel.type}] ${rel.p2}`)
        created++
      }
    }

    // Create inverse
    const { data: inverseExisting } = await supabase
      .from('family_relationships')
      .select('id')
      .eq('person_id', p2Id)
      .eq('related_person_id', p1Id)
      .single()

    if (!inverseExisting) {
      const { error } = await supabase.from('family_relationships').insert({
        person_id: p2Id,
        related_person_id: p1Id,
        relationship_type: rel.inverse,
        relationship_status: rel.status || 'confirmed',
        evidence: rel.evidence || `${rel.p2} [${rel.inverse}] ${rel.p1}`
      })

      if (error && !error.message.includes('duplicate')) {
        console.log(`  ERROR: ${rel.p2} [${rel.inverse}] ${rel.p1} (inverse) - ${error.message}`)
      } else if (!error) {
        console.log(`  CREATED: ${rel.p2} [${rel.inverse}] ${rel.p1} (inverse)`)
        created++
      }
    }
  }

  return created
}

// ============================================================================
// FIX MISSING LOCATION RESIDENTS
// ============================================================================

async function fixLocationResidents() {
  console.log(`\n[${timestamp()}] === FIXING MISSING LOCATION RESIDENTS ===`)

  // Get locations
  const { data: locations } = await supabase.from('locations').select('id, name')
  const locByName = new Map()
  for (const l of locations) {
    locByName.set(l.name.toLowerCase(), l.id)
  }

  const missingLR = [
    { person_id: 'LNEY-VA-b1721-01', location: "Looney's Mill Creek", date_first: '1740', date_last: '1770', type: 'landowner', evidence: 'Patented lands 1741-1742' },
    { person_id: 'RHEA-VA-e1720-01', location: "Looney's Mill Creek", date_first: '1742', date_last: '1765', type: 'resident', evidence: 'Married Robert Looney Jr. c.1742' },
    { person_id: 'LNEY-VA-e1748-01', location: "Looney's Mill Creek", date_first: '1748', date_last: '1760', type: 'resident', evidence: 'Son of Robert Looney Jr., died 1760' },
    { person_id: 'LDRD-VA-e1720-01', location: "Looney's Mill Creek", date_first: '1749', date_last: '1794', type: 'neighbor', evidence: 'Adjacent landowner to Robert Looney' },
    { person_id: 'LNEY-VA-b1756-01', location: "Looney's Mill Creek", date_first: '1756', date_last: '1777', type: 'resident', evidence: 'Son of Robert Looney Jr., lived there before moving to Hawkins' }
  ]

  let created = 0

  for (const lr of missingLR) {
    // Find location ID
    let locId = locByName.get(lr.location.toLowerCase())
    if (!locId) {
      // Try partial match
      for (const [name, id] of locByName) {
        if (name.includes(lr.location.toLowerCase()) || lr.location.toLowerCase().includes(name)) {
          locId = id
          break
        }
      }
    }

    if (!locId) {
      console.log(`  SKIP: ${lr.person_id} @ ${lr.location} (location not found)`)
      continue
    }

    // Check if exists
    const { data: existing } = await supabase
      .from('location_residents')
      .select('id')
      .eq('person_id', lr.person_id)
      .eq('location_id', locId)
      .single()

    if (existing) {
      console.log(`  SKIP: ${lr.person_id} @ ${lr.location} (exists)`)
      continue
    }

    const { error } = await supabase.from('location_residents').insert({
      person_id: lr.person_id,
      location_id: locId,
      date_first: lr.date_first,
      date_last: lr.date_last,
      residence_type: lr.type,
      evidence: lr.evidence
    })

    if (error) {
      console.log(`  ERROR: ${lr.person_id} @ ${lr.location} - ${error.message}`)
    } else {
      console.log(`  CREATED: ${lr.person_id} @ ${lr.location}`)
      created++
    }
  }

  return created
}

// ============================================================================
// FIX MISSING RESEARCH QUESTIONS
// ============================================================================

async function fixResearchQuestions() {
  console.log(`\n[${timestamp()}] === FIXING MISSING RESEARCH QUESTIONS ===`)

  const missingRQ = [
    {
      person_id: 'JNSN-VA-e1740-01', // Walter Johnson
      question: "What is Walter Johnson's relationship to Mary Johnson? Was he her brother, cousin, or unrelated?",
      question_type: 'relationship',
      status: 'open'
    },
    {
      person_id: 'JNSN-VA-e1745-01', // Mary Johnson
      question: "Who were Mary Johnson's parents? She married Benjamin Looney c.1768.",
      question_type: 'relationship',
      status: 'open'
    },
    {
      person_id: 'JNSN-VA-e1740-01', // Walter Johnson
      question: "Is Walter Johnson related to the Sullivan County, Tennessee Johnson family?",
      question_type: 'relationship',
      status: 'open'
    }
  ]

  let created = 0

  for (const rq of missingRQ) {
    // Check if similar exists
    const { data: existing } = await supabase
      .from('research_questions')
      .select('id')
      .eq('person_id', rq.person_id)
      .ilike('question', `%${rq.question.substring(0, 30)}%`)
      .single()

    if (existing) {
      console.log(`  SKIP: ${rq.question.substring(0, 40)}... (exists)`)
      continue
    }

    const { error } = await supabase.from('research_questions').insert(rq)

    if (error) {
      console.log(`  ERROR: ${rq.question.substring(0, 40)}... - ${error.message}`)
    } else {
      console.log(`  CREATED: ${rq.question.substring(0, 50)}...`)
      created++
    }
  }

  return created
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log(`[${timestamp()}] START: Comprehensive Fix Script`)
  console.log('=' .repeat(60))

  const sourcesCreated = await fixSources()
  const documentsCreated = await fixDocuments()
  const locationsCreated = await fixLocations()
  const relationshipsCreated = await fixRelationships()
  const locationResidentsCreated = await fixLocationResidents()
  const researchQuestionsCreated = await fixResearchQuestions()

  console.log('\n' + '=' .repeat(60))
  console.log(`[${timestamp()}] SUMMARY`)
  console.log('=' .repeat(60))
  console.log(`Sources created: ${sourcesCreated}`)
  console.log(`Documents created: ${documentsCreated}`)
  console.log(`Locations created: ${locationsCreated}`)
  console.log(`Relationships created: ${relationshipsCreated}`)
  console.log(`Location residents created: ${locationResidentsCreated}`)
  console.log(`Research questions created: ${researchQuestionsCreated}`)

  const total = sourcesCreated + documentsCreated + locationsCreated + relationshipsCreated + locationResidentsCreated + researchQuestionsCreated
  console.log(`\nTOTAL ITEMS CREATED: ${total}`)
}

main().catch(console.error)
