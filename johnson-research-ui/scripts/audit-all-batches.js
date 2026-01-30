/**
 * AUDIT ALL BATCH FILES
 *
 * Checks all imported batch files against the database to find:
 * 1. Missing location_residents
 * 2. Missing bidirectional relationships
 * 3. Missing associations
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const supabase = createClient(
  'https://oxpkqnmuwqcnmzvavsuz.supabase.co',
  'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
)

const SOURCES_DIR = '/Users/scottjohnson/Development/johnson-johnston-project/sources'

// ============================================================================
// DATA COLLECTION FROM JSON FILES
// ============================================================================

function loadBatchFiles() {
  const files = readdirSync(SOURCES_DIR)
    .filter(f => f.endsWith('.json') && (f.includes('batch') || f.includes('extraction')))
    .sort()

  const batches = []
  for (const file of files) {
    try {
      const content = JSON.parse(readFileSync(join(SOURCES_DIR, file), 'utf-8'))
      batches.push({ file, content })
    } catch (e) {
      console.log(`Error reading ${file}: ${e.message}`)
    }
  }
  return batches
}

// ============================================================================
// EXTRACT ALL PEOPLE WITH LOCATIONS FROM BATCH FILES
// ============================================================================

function extractPeopleWithLocations(batches) {
  const peopleLocations = []

  for (const { file, content } of batches) {
    // Check new_people_to_create
    if (content.new_people_to_create) {
      for (const person of content.new_people_to_create) {
        if (person.locations && person.locations.length > 0) {
          peopleLocations.push({
            file,
            person_id: person.suggested_id || person.id,
            person_name: `${person.given_name} ${person.surname}`,
            locations: person.locations
          })
        }
      }
    }

    // Check people_to_update
    if (content.people_to_update) {
      for (const person of content.people_to_update) {
        if (person.locations && person.locations.length > 0) {
          peopleLocations.push({
            file,
            person_id: person.suggested_id || person.id,
            person_name: `${person.given_name} ${person.surname}`,
            locations: person.locations
          })
        }
      }
    }
  }

  return peopleLocations
}

// ============================================================================
// EXTRACT ALL RELATIONSHIPS FROM BATCH FILES
// ============================================================================

function extractRelationships(batches) {
  const relationships = []

  for (const { file, content } of batches) {
    if (content.relationships_to_add) {
      for (const rel of content.relationships_to_add) {
        relationships.push({
          file,
          person1: rel.person_1_name || rel.person_1_temp,
          person2: rel.person_2_name || rel.person_2_temp,
          type: rel.relationship_type,
          confidence: rel.confidence || 'probable'
        })
      }
    }
  }

  return relationships
}

// ============================================================================
// DATABASE QUERIES
// ============================================================================

async function getDbPeople() {
  const { data } = await supabase
    .from('people')
    .select('id, given_name, surname')
  return data || []
}

async function getDbLocationResidents() {
  const { data } = await supabase
    .from('location_residents')
    .select('id, person_id, location_id, date_first, date_last, residence_type')
  return data || []
}

async function getDbRelationships() {
  const { data } = await supabase
    .from('family_relationships')
    .select('person_id, related_person_id, relationship_type')
  return data || []
}

async function getDbLocations() {
  const { data } = await supabase
    .from('locations')
    .select('id, name')
  return data || []
}

// ============================================================================
// AUDIT FUNCTIONS
// ============================================================================

async function auditLocationResidents(peopleLocations, dbPeople, dbLocationResidents, dbLocations) {
  console.log('\n' + '='.repeat(70))
  console.log('AUDIT: LOCATION RESIDENTS')
  console.log('='.repeat(70))

  const missing = []
  const locationMap = new Map(dbLocations.map(l => [l.name.toLowerCase(), l.id]))
  const personMap = new Map(dbPeople.map(p => [p.id, p]))

  // Group existing location_residents by person
  const existingByPerson = new Map()
  for (const lr of dbLocationResidents) {
    if (!existingByPerson.has(lr.person_id)) {
      existingByPerson.set(lr.person_id, [])
    }
    existingByPerson.get(lr.person_id).push(lr)
  }

  for (const { file, person_id, person_name, locations } of peopleLocations) {
    if (!personMap.has(person_id)) {
      console.log(`\nWARNING: Person ${person_id} (${person_name}) not found in database`)
      continue
    }

    const existingLocs = existingByPerson.get(person_id) || []
    const existingLocIds = new Set(existingLocs.map(l => l.location_id))

    for (const loc of locations) {
      const locName = loc.location_name || loc.name
      const locId = locationMap.get(locName?.toLowerCase())

      if (!locId) {
        missing.push({
          file,
          person_id,
          person_name,
          location_name: locName,
          issue: 'LOCATION NOT IN DB',
          data: loc
        })
      } else if (!existingLocIds.has(locId)) {
        missing.push({
          file,
          person_id,
          person_name,
          location_name: locName,
          location_id: locId,
          issue: 'MISSING LOCATION_RESIDENT',
          data: loc
        })
      }
    }
  }

  // Summary by person
  const byPerson = new Map()
  for (const m of missing) {
    const key = m.person_id
    if (!byPerson.has(key)) {
      byPerson.set(key, { name: m.person_name, missing: [] })
    }
    byPerson.get(key).missing.push(m)
  }

  console.log(`\nTotal people with missing location_residents: ${byPerson.size}`)
  console.log(`Total missing location_resident records: ${missing.length}`)

  for (const [personId, data] of byPerson) {
    console.log(`\n  ${personId} (${data.name}): ${data.missing.length} missing`)
    for (const m of data.missing) {
      console.log(`    - ${m.location_name} (${m.issue})`)
      if (m.data.date_first) console.log(`      dates: ${m.data.date_first}-${m.data.date_last || 'present'}`)
      if (m.data.residence_type) console.log(`      type: ${m.data.residence_type}`)
    }
  }

  return missing
}

async function auditRelationships(relationships, dbPeople, dbRelationships) {
  console.log('\n' + '='.repeat(70))
  console.log('AUDIT: RELATIONSHIPS (BIDIRECTIONAL)')
  console.log('='.repeat(70))

  // Create lookup maps
  const personByName = new Map()
  for (const p of dbPeople) {
    const fullName = `${p.given_name} ${p.surname}`.toLowerCase()
    personByName.set(fullName, p.id)
    // Also map by surname only for partial matches
    if (!personByName.has(p.surname.toLowerCase())) {
      personByName.set(p.surname.toLowerCase(), p.id)
    }
  }

  // Check for orphaned relationships (one direction only)
  const relSet = new Set()
  for (const r of dbRelationships) {
    relSet.add(`${r.person_id}|${r.related_person_id}|${r.relationship_type}`)
  }

  const orphaned = []
  const inverseMap = {
    'father': 'child',
    'mother': 'child',
    'child': 'parent', // Could be father or mother
    'parent': 'child',
    'spouse': 'spouse',
    'sibling': 'sibling'
  }

  for (const r of dbRelationships) {
    const inverse = inverseMap[r.relationship_type]
    if (inverse) {
      // Check if inverse exists
      const hasInverse = relSet.has(`${r.related_person_id}|${r.person_id}|${inverse}`) ||
                        (r.relationship_type === 'child' &&
                         (relSet.has(`${r.related_person_id}|${r.person_id}|father`) ||
                          relSet.has(`${r.related_person_id}|${r.person_id}|mother`)))

      if (!hasInverse) {
        orphaned.push({
          person_id: r.person_id,
          related_person_id: r.related_person_id,
          type: r.relationship_type,
          missing_inverse: inverse
        })
      }
    }
  }

  console.log(`\nTotal relationships in database: ${dbRelationships.length}`)
  console.log(`Orphaned (missing inverse): ${orphaned.length}`)

  if (orphaned.length > 0) {
    console.log('\nOrphaned relationships (need inverse):')
    for (const o of orphaned.slice(0, 20)) { // Show first 20
      const p1 = dbPeople.find(p => p.id === o.person_id)
      const p2 = dbPeople.find(p => p.id === o.related_person_id)
      console.log(`  ${o.person_id} [${o.type}] ${o.related_person_id}`)
      console.log(`    Need: ${o.related_person_id} [${o.missing_inverse}] ${o.person_id}`)
    }
    if (orphaned.length > 20) {
      console.log(`  ... and ${orphaned.length - 20} more`)
    }
  }

  return orphaned
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('COMPREHENSIVE BATCH AUDIT')
  console.log('='.repeat(70))
  console.log('Loading batch files...')

  const batches = loadBatchFiles()
  console.log(`Found ${batches.length} batch files:`)
  for (const b of batches) {
    console.log(`  - ${b.file}`)
  }

  console.log('\nLoading database data...')
  const [dbPeople, dbLocationResidents, dbRelationships, dbLocations] = await Promise.all([
    getDbPeople(),
    getDbLocationResidents(),
    getDbRelationships(),
    getDbLocations()
  ])

  console.log(`Database contains:`)
  console.log(`  - ${dbPeople.length} people`)
  console.log(`  - ${dbLocationResidents.length} location_residents`)
  console.log(`  - ${dbRelationships.length} relationships`)
  console.log(`  - ${dbLocations.length} locations`)

  // Extract data from batch files
  const peopleLocations = extractPeopleWithLocations(batches)
  const relationships = extractRelationships(batches)

  console.log(`\nBatch files contain:`)
  console.log(`  - ${peopleLocations.length} people with location data`)
  console.log(`  - ${relationships.length} relationships`)

  // Run audits
  const missingLocations = await auditLocationResidents(peopleLocations, dbPeople, dbLocationResidents, dbLocations)
  const orphanedRels = await auditRelationships(relationships, dbPeople, dbRelationships)

  // Final summary
  console.log('\n' + '='.repeat(70))
  console.log('AUDIT SUMMARY')
  console.log('='.repeat(70))
  console.log(`Missing location_residents: ${missingLocations.length}`)
  console.log(`Orphaned relationships: ${orphanedRels.length}`)

  // Output data for fixing
  if (missingLocations.length > 0 || orphanedRels.length > 0) {
    console.log('\n' + '='.repeat(70))
    console.log('ACTION REQUIRED: Run fix script to repair missing data')
    console.log('='.repeat(70))
  }

  return { missingLocations, orphanedRels }
}

main().catch(console.error)
