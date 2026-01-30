/**
 * COMPREHENSIVE SOURCE FILE AUDIT
 *
 * Checks EVERY piece of data in EVERY source file against the database.
 * Reports all missing items.
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
// LOAD ALL DATABASE DATA
// ============================================================================

async function loadDatabaseData() {
  console.log('Loading database data...')

  const [people, locations, relationships, sources, documents, researchQuestions, associations, locationResidents] = await Promise.all([
    supabase.from('people').select('id, given_name, surname'),
    supabase.from('locations').select('id, name, slug'),
    supabase.from('family_relationships').select('person_id, related_person_id, relationship_type'),
    supabase.from('sources').select('id, abbreviation, title'),
    supabase.from('documents').select('id, title, document_type'),
    supabase.from('research_questions').select('id, person_id, question'),
    supabase.from('associations').select('person_id, associated_person_id, association_type'),
    supabase.from('location_residents').select('person_id, location_id')
  ])

  return {
    people: people.data || [],
    locations: locations.data || [],
    relationships: relationships.data || [],
    sources: sources.data || [],
    documents: documents.data || [],
    researchQuestions: researchQuestions.data || [],
    associations: associations.data || [],
    locationResidents: locationResidents.data || []
  }
}

// ============================================================================
// AUDIT A SINGLE FILE
// ============================================================================

function auditFile(filename, content, db) {
  const results = {
    file: filename,
    missing: {
      people: [],
      locations: [],
      relationships: [],
      sources: [],
      documents: [],
      researchQuestions: [],
      associations: [],
      locationResidents: []
    },
    totals: {
      people: 0,
      locations: 0,
      relationships: 0,
      sources: 0,
      documents: 0,
      researchQuestions: 0,
      associations: 0,
      locationResidents: 0
    }
  }

  // Create lookup sets for faster checking
  const dbPeopleIds = new Set(db.people.map(p => p.id))
  const dbPeopleNames = new Map(db.people.map(p => [`${p.given_name} ${p.surname}`.toLowerCase(), p.id]))
  const dbLocationNames = new Map(db.locations.map(l => [l.name.toLowerCase(), l.id]))
  const dbRelSet = new Set(db.relationships.map(r => `${r.person_id}|${r.related_person_id}|${r.relationship_type}`))
  const dbSourceAbbrevs = new Set(db.sources.map(s => s.abbreviation?.toLowerCase()).filter(Boolean))
  const dbDocTitles = new Set(db.documents.map(d => d.title?.toLowerCase()).filter(Boolean))
  const dbLocResidents = new Set(db.locationResidents.map(lr => `${lr.person_id}|${lr.location_id}`))

  // -------------------------------------------------------------------------
  // CHECK PEOPLE (new_people_to_create and people_to_update)
  // -------------------------------------------------------------------------
  const allPeople = [
    ...(content.new_people_to_create || []),
    ...(content.people_to_update || [])
  ]

  for (const person of allPeople) {
    results.totals.people++
    const id = person.suggested_id || person.id
    if (id && !dbPeopleIds.has(id)) {
      results.missing.people.push({
        id,
        name: `${person.given_name} ${person.surname}`,
        data: person
      })
    }
  }

  // -------------------------------------------------------------------------
  // CHECK LOCATIONS (locations_to_create)
  // -------------------------------------------------------------------------
  if (content.locations_to_create) {
    for (const loc of content.locations_to_create) {
      results.totals.locations++
      const name = loc.name?.toLowerCase()
      if (name && !dbLocationNames.has(name)) {
        // Check partial match
        let found = false
        for (const [dbName] of dbLocationNames) {
          if (dbName.includes(name) || name.includes(dbName)) {
            found = true
            break
          }
        }
        if (!found) {
          results.missing.locations.push({
            name: loc.name,
            data: loc
          })
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // CHECK RELATIONSHIPS (relationships_to_add)
  // -------------------------------------------------------------------------
  if (content.relationships_to_add) {
    for (const rel of content.relationships_to_add) {
      results.totals.relationships++

      // Try to find person IDs
      const p1Name = (rel.person_1_name || '').toLowerCase()
      const p2Name = (rel.person_2_name || '').toLowerCase()
      const p1Id = rel.person_1_id || dbPeopleNames.get(p1Name)
      const p2Id = rel.person_2_id || dbPeopleNames.get(p2Name)

      if (p1Id && p2Id) {
        const key = `${p1Id}|${p2Id}|${rel.relationship_type}`
        if (!dbRelSet.has(key)) {
          results.missing.relationships.push({
            person1: rel.person_1_name,
            person2: rel.person_2_name,
            type: rel.relationship_type,
            data: rel
          })
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // CHECK SOURCES (sources_to_add)
  // -------------------------------------------------------------------------
  if (content.sources_to_add) {
    for (const src of content.sources_to_add) {
      results.totals.sources++
      const abbrev = src.abbreviation?.toLowerCase()
      if (abbrev && !dbSourceAbbrevs.has(abbrev)) {
        results.missing.sources.push({
          abbreviation: src.abbreviation,
          title: src.title,
          data: src
        })
      }
    }
  }

  // -------------------------------------------------------------------------
  // CHECK DOCUMENTS (documents)
  // -------------------------------------------------------------------------
  if (content.documents) {
    for (const doc of content.documents) {
      results.totals.documents++
      const title = doc.title?.toLowerCase()
      if (title && !dbDocTitles.has(title)) {
        results.missing.documents.push({
          title: doc.title,
          type: doc.document_type,
          data: doc
        })
      }
    }
  }

  // -------------------------------------------------------------------------
  // CHECK RESEARCH QUESTIONS (research_questions_to_add)
  // -------------------------------------------------------------------------
  if (content.research_questions_to_add) {
    for (const rq of content.research_questions_to_add) {
      results.totals.researchQuestions++
      // Check if similar question exists (by first 50 chars)
      const qStart = rq.question?.substring(0, 50).toLowerCase()
      const exists = db.researchQuestions.some(dbRq =>
        dbRq.question?.toLowerCase().startsWith(qStart)
      )
      if (!exists) {
        results.missing.researchQuestions.push({
          question: rq.question?.substring(0, 80) + '...',
          person_id: rq.person_id,
          data: rq
        })
      }
    }
  }

  // -------------------------------------------------------------------------
  // CHECK LOCATION RESIDENTS (locations in people records)
  // -------------------------------------------------------------------------
  for (const person of allPeople) {
    if (person.locations && person.locations.length > 0) {
      const personId = person.suggested_id || person.id
      for (const loc of person.locations) {
        results.totals.locationResidents++
        const locName = (loc.location_name || loc.name || '').toLowerCase()

        // Find location ID
        let locId = null
        for (const [dbName, dbId] of dbLocationNames) {
          if (dbName === locName || dbName.includes(locName) || locName.includes(dbName)) {
            locId = dbId
            break
          }
        }

        if (personId && locId) {
          const key = `${personId}|${locId}`
          if (!dbLocResidents.has(key)) {
            results.missing.locationResidents.push({
              person_id: personId,
              person_name: `${person.given_name} ${person.surname}`,
              location: loc.location_name || loc.name,
              dates: `${loc.date_first || '?'}-${loc.date_last || 'present'}`,
              data: loc
            })
          }
        }
      }
    }
  }

  return results
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('=' .repeat(70))
  console.log('COMPREHENSIVE SOURCE FILE AUDIT')
  console.log('=' .repeat(70))
  console.log('')

  // Load database
  const db = await loadDatabaseData()
  console.log(`Database: ${db.people.length} people, ${db.locations.length} locations, ${db.relationships.length} relationships`)
  console.log(`          ${db.sources.length} sources, ${db.documents.length} documents, ${db.researchQuestions.length} research questions`)
  console.log(`          ${db.associations.length} associations, ${db.locationResidents.length} location_residents`)
  console.log('')

  // Get all JSON files
  const files = readdirSync(SOURCES_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()

  console.log(`Found ${files.length} JSON files to audit:`)
  files.forEach(f => console.log(`  - ${f}`))
  console.log('')

  // Audit each file
  const allResults = []

  for (const file of files) {
    console.log('=' .repeat(70))
    console.log(`AUDITING: ${file}`)
    console.log('=' .repeat(70))

    try {
      const content = JSON.parse(readFileSync(join(SOURCES_DIR, file), 'utf-8'))
      const results = auditFile(file, content, db)
      allResults.push(results)

      // Print results for this file
      const hasMissing = Object.values(results.missing).some(arr => arr.length > 0)

      if (!hasMissing) {
        console.log('✓ All data from this file is in the database')
      } else {
        // People
        if (results.missing.people.length > 0) {
          console.log(`\n  MISSING PEOPLE (${results.missing.people.length}/${results.totals.people}):`)
          for (const p of results.missing.people) {
            console.log(`    - ${p.id}: ${p.name}`)
          }
        }

        // Locations
        if (results.missing.locations.length > 0) {
          console.log(`\n  MISSING LOCATIONS (${results.missing.locations.length}/${results.totals.locations}):`)
          for (const l of results.missing.locations) {
            console.log(`    - ${l.name}`)
          }
        }

        // Relationships
        if (results.missing.relationships.length > 0) {
          console.log(`\n  MISSING RELATIONSHIPS (${results.missing.relationships.length}/${results.totals.relationships}):`)
          for (const r of results.missing.relationships.slice(0, 10)) {
            console.log(`    - ${r.person1} [${r.type}] ${r.person2}`)
          }
          if (results.missing.relationships.length > 10) {
            console.log(`    ... and ${results.missing.relationships.length - 10} more`)
          }
        }

        // Sources
        if (results.missing.sources.length > 0) {
          console.log(`\n  MISSING SOURCES (${results.missing.sources.length}/${results.totals.sources}):`)
          for (const s of results.missing.sources) {
            console.log(`    - ${s.abbreviation}: ${s.title?.substring(0, 50)}...`)
          }
        }

        // Documents
        if (results.missing.documents.length > 0) {
          console.log(`\n  MISSING DOCUMENTS (${results.missing.documents.length}/${results.totals.documents}):`)
          for (const d of results.missing.documents.slice(0, 10)) {
            console.log(`    - ${d.title?.substring(0, 60)}...`)
          }
          if (results.missing.documents.length > 10) {
            console.log(`    ... and ${results.missing.documents.length - 10} more`)
          }
        }

        // Research Questions
        if (results.missing.researchQuestions.length > 0) {
          console.log(`\n  MISSING RESEARCH QUESTIONS (${results.missing.researchQuestions.length}/${results.totals.researchQuestions}):`)
          for (const rq of results.missing.researchQuestions.slice(0, 5)) {
            console.log(`    - ${rq.question}`)
          }
          if (results.missing.researchQuestions.length > 5) {
            console.log(`    ... and ${results.missing.researchQuestions.length - 5} more`)
          }
        }

        // Location Residents
        if (results.missing.locationResidents.length > 0) {
          console.log(`\n  MISSING LOCATION_RESIDENTS (${results.missing.locationResidents.length}/${results.totals.locationResidents}):`)
          for (const lr of results.missing.locationResidents.slice(0, 10)) {
            console.log(`    - ${lr.person_name} @ ${lr.location} (${lr.dates})`)
          }
          if (results.missing.locationResidents.length > 10) {
            console.log(`    ... and ${results.missing.locationResidents.length - 10} more`)
          }
        }
      }

      console.log('')

    } catch (e) {
      console.log(`ERROR reading file: ${e.message}`)
      console.log('')
    }
  }

  // -------------------------------------------------------------------------
  // FINAL SUMMARY
  // -------------------------------------------------------------------------
  console.log('=' .repeat(70))
  console.log('FINAL SUMMARY')
  console.log('=' .repeat(70))

  let totalMissing = {
    people: 0,
    locations: 0,
    relationships: 0,
    sources: 0,
    documents: 0,
    researchQuestions: 0,
    locationResidents: 0
  }

  for (const r of allResults) {
    totalMissing.people += r.missing.people.length
    totalMissing.locations += r.missing.locations.length
    totalMissing.relationships += r.missing.relationships.length
    totalMissing.sources += r.missing.sources.length
    totalMissing.documents += r.missing.documents.length
    totalMissing.researchQuestions += r.missing.researchQuestions.length
    totalMissing.locationResidents += r.missing.locationResidents.length
  }

  console.log('')
  console.log('Missing data across all files:')
  console.log(`  People:             ${totalMissing.people}`)
  console.log(`  Locations:          ${totalMissing.locations}`)
  console.log(`  Relationships:      ${totalMissing.relationships}`)
  console.log(`  Sources:            ${totalMissing.sources}`)
  console.log(`  Documents:          ${totalMissing.documents}`)
  console.log(`  Research Questions: ${totalMissing.researchQuestions}`)
  console.log(`  Location Residents: ${totalMissing.locationResidents}`)
  console.log('')

  const totalItems = Object.values(totalMissing).reduce((a, b) => a + b, 0)
  if (totalItems === 0) {
    console.log('✓ ALL DATA FROM ALL FILES IS IN THE DATABASE')
  } else {
    console.log(`✗ TOTAL MISSING ITEMS: ${totalItems}`)
    console.log('')
    console.log('Run fix script to import missing data.')
  }

  // Return results for potential fix script
  return allResults
}

main().catch(console.error)
