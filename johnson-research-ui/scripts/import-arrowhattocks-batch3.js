/**
 * Import Script: Arrowhattocks Extraction Batch 3
 *
 * Focus: Richard Johnson (earliest, 1621-1639), Woodson family, bridging records
 *
 * Run with: node scripts/import-arrowhattocks-batch3.js
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabaseUrl = 'https://oxpkqnmuwqcnmzvavsuz.supabase.co'
const supabaseKey = 'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
const supabase = createClient(supabaseUrl, supabaseKey)

// Load the extraction data
const extractionPath = '../../sources/arrowhattocks-extraction-batch3.json'
const extraction = JSON.parse(readFileSync(new URL(extractionPath, import.meta.url), 'utf8'))

// Track temp_id to real UUID mappings
const sourceIdMap = {}
const documentIdMap = {}
const newPeopleIdMap = {}

async function importSources() {
  console.log('\n=== IMPORTING SOURCES ===')

  for (const source of extraction.sources_to_add) {
    // Handle record_date - must be valid date format or null
    let recordDate = null
    if (source.record_date) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(source.record_date)) {
        recordDate = source.record_date
      } else if (/^\d{4}$/.test(source.record_date)) {
        recordDate = `${source.record_date}-01-01`
      }
    }

    const sourceData = {
      source_type: source.source_type,
      repository: source.repository || null,
      collection: source.collection || null,
      volume: source.volume || null,
      page: source.page || null,
      record_date: recordDate,
      author: source.author || null,
      title: source.title || null,
      publication_place: source.publication_place || null,
      publisher: source.publisher || null,
      publication_year: source.publication_year || null,
      abbreviation: source.abbreviation,
      full_citation: source.full_citation,
      original_examined: source.original_examined || false,
      cited_in: source.cited_in || null,
      notes: source.notes || null
    }

    const { data, error } = await supabase
      .from('sources')
      .insert(sourceData)
      .select()
      .single()

    if (error) {
      console.error(`  ERROR adding source ${source.temp_id}:`, error.message)
    } else {
      sourceIdMap[source.temp_id] = data.id
      console.log(`  ✓ Added source: ${source.abbreviation} (${source.temp_id} -> ${data.id})`)
    }
  }

  console.log(`  Total sources added: ${Object.keys(sourceIdMap).length}`)
}

async function importDocuments() {
  console.log('\n=== IMPORTING DOCUMENTS ===')

  for (const doc of extraction.documents) {
    let dateNormalized = null
    if (doc.date) {
      const dateMatch = doc.date.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/)
      if (dateMatch) {
        const year = dateMatch[1]
        const month = dateMatch[2] || '01'
        const day = dateMatch[3] || '01'
        dateNormalized = `${year}-${month}-${day}`
      }
    }

    const docData = {
      document_type: doc.document_type,
      date: doc.date || null,
      date_normalized: dateNormalized,
      county: doc.county || null,
      state: doc.state || 'Virginia',
      title: doc.title || null,
      description: doc.transcription_excerpt || null,
      transcription: doc.transcription_excerpt || null,
      acres: doc.acres || null,
      location_description: doc.location_description || null,
      source_id: sourceIdMap[doc.source_temp_id] || null,
      notes: doc.notes || null
    }

    const { data, error } = await supabase
      .from('documents')
      .insert(docData)
      .select()
      .single()

    if (error) {
      console.error(`  ERROR adding document ${doc.temp_id}:`, error.message)
    } else {
      documentIdMap[doc.temp_id] = data.id
      console.log(`  ✓ Added document: ${doc.title} (${doc.temp_id})`)
    }
  }

  console.log(`  Total documents added: ${Object.keys(documentIdMap).length}`)
}

async function createNewPeople() {
  console.log('\n=== CREATING NEW PEOPLE ===')

  for (const person of extraction.new_people_to_create) {
    // Parse birth year from suggested_id
    let birthYear = person.birth_year || person.birth_year_estimate || null
    let birthYearType = 'e' // Default to estimated

    // Check for existing person
    const { data: existing } = await supabase
      .from('people')
      .select('id')
      .eq('id', person.suggested_id)
      .single()

    if (existing) {
      console.log(`  - Person already exists: ${person.suggested_id}`)
      newPeopleIdMap[person.suggested_id] = person.suggested_id
      continue
    }

    const personData = {
      id: person.suggested_id,
      surname: person.surname,
      given_name: person.given_name,
      designation: person.designation || null,
      birth_year: birthYear,
      birth_year_type: birthYearType,
      birthplace_code: person.location?.split(',')[0]?.trim().substring(0, 3).toUpperCase() || 'UNK',
      confidence: person.confidence?.toUpperCase() || 'CONFIRMED',
      bio: person.evidence || null
    }

    const { data, error } = await supabase
      .from('people')
      .insert(personData)
      .select()
      .single()

    if (error) {
      console.error(`  ERROR creating person ${person.suggested_id}:`, error.message)
    } else {
      newPeopleIdMap[person.suggested_id] = data.id
      console.log(`  ✓ Created person: ${person.given_name} ${person.surname} (${person.suggested_id})`)
    }
  }

  console.log(`  Total new people created: ${Object.keys(newPeopleIdMap).length}`)
}

async function linkPeopleToDocuments() {
  console.log('\n=== LINKING PEOPLE TO DOCUMENTS ===')

  let linkCount = 0

  // Map of person IDs we know
  const knownPersonIds = {
    'HTCR-ENG-b1613-01': 'HTCR-ENG-b1613-01', // William Hatcher
    'HTCR-VA-e1640-01': 'HTCR-VA-e1640-01',   // Edward Hatcher
    'BRTN-VA-e1660-01': 'BRTN-VA-e1660-01',   // Robert Burton
    'PLSN-ENG-e1640-01': 'PLSN-ENG-e1640-01', // John Pleasants
    'JNES-UNK-e1670-01': 'JNES-UNK-e1670-01', // John Jones
    ...newPeopleIdMap
  }

  for (const doc of extraction.documents) {
    const documentId = documentIdMap[doc.temp_id]
    if (!documentId) {
      console.log(`  - Skipping ${doc.temp_id}: document not found`)
      continue
    }

    for (const person of doc.people) {
      let personId = person.likely_match

      // If no likely_match, check if this person was created
      if (!personId && person.new_person_flag) {
        // Try to find by name pattern in our created people
        const createdPerson = extraction.new_people_to_create.find(p =>
          person.name_as_written.toLowerCase().includes(p.given_name.toLowerCase()) &&
          person.name_as_written.toLowerCase().includes(p.surname.toLowerCase().substring(0, 4))
        )
        if (createdPerson) {
          personId = createdPerson.suggested_id
        }
      }

      if (!personId) {
        console.log(`  - Skipping: ${person.name_as_written} (no person ID)`)
        continue
      }

      // Verify person exists
      if (!knownPersonIds[personId]) {
        const { data: existingPerson } = await supabase
          .from('people')
          .select('id')
          .eq('id', personId)
          .single()

        if (!existingPerson) {
          console.log(`  - Skipping link: person ${personId} not in database`)
          continue
        }
        knownPersonIds[personId] = personId
      }

      const roleMap = {
        'patentee': 'patentee',
        'adjacent_landowner': 'adjacent_landowner',
        'grantor': 'grantor',
        'grantee': 'grantee',
        'witness': 'witness',
        'tobacco_viewer': 'mentioned',
        'listed_resident': 'mentioned',
        'plantation_owner': 'mentioned',
        'party_to_agreement': 'mentioned',
        'original_patentee': 'mentioned',
        'intermediate_owner': 'mentioned',
        'heir': 'heir',
        'wife_releasing_dower': 'spouse'
      }

      const linkData = {
        document_id: documentId,
        person_id: personId,
        role: roleMap[person.role] || person.role,
        notes: person.reasoning || person.notes || null,
        confidence: person.match_confidence || 'confirmed'
      }

      const { error } = await supabase
        .from('document_people')
        .insert(linkData)

      if (error) {
        if (error.code === '23503') {
          console.log(`  - Skipping link: person ${personId} not in database`)
        } else if (error.code === '23505') {
          console.log(`  - Link already exists: ${personId} -> ${doc.temp_id}`)
        } else {
          console.error(`  ERROR linking ${personId} to ${doc.temp_id}:`, error.message)
        }
      } else {
        linkCount++
        console.log(`  ✓ Linked: ${person.name_as_written} (${person.role}) -> ${doc.title?.substring(0, 30)}...`)
      }
    }
  }

  console.log(`  Total links created: ${linkCount}`)
}

async function addAssociations() {
  console.log('\n=== ADDING ASSOCIATIONS ===')

  // The "relationship" in this batch is actually an association (associate type)
  // Add it here along with other associations

  // Map temp names to IDs
  const personNameToId = {
    'Richard Johnson (1621/1624)': 'JNSN-ENG-e1595-01',
    'William Hatcher (b.1613)': 'HTCR-ENG-b1613-01',
    'Samuel Jordan': 'JRDN-ENG-e1580-01',
    'William Farrar': 'FRRR-ENG-e1590-01',
    'John Woodson (merchant)': 'WDSN-VA-e1660-01',
    'Edward Hatcher Sr.': 'HTCR-VA-e1640-01'
  }

  // First, add the "relationship" as an association (it's really an associate connection)
  for (const rel of extraction.relationships_to_add) {
    const person1Id = personNameToId[rel.person_1_temp]
    const person2Id = personNameToId[rel.person_2_temp]

    if (!person1Id || !person2Id) {
      console.log(`  - Skipping relationship: missing ID for ${rel.person_1_temp} or ${rel.person_2_temp}`)
      continue
    }

    const { error } = await supabase
      .from('associations')
      .insert({
        person_id: person1Id,
        associated_person_id: person2Id,
        association_type: 'colleague',
        date: '1639-01-01',
        confidence: rel.confidence,
        evidence_summary: rel.evidence_summary,
        source_id: sourceIdMap[rel.source_temp_id] || null,
        notes: rel.notes || null
      })

    if (error) {
      console.error(`  ERROR adding association:`, error.message)
    } else {
      console.log(`  ✓ Added: Richard Johnson <-> William Hatcher (colleague - Tobacco Viewers 1639)`)
    }
  }

  // Now add the other associations
  for (const assoc of extraction.associations_to_add) {
    const person1Id = personNameToId[assoc.person_1_temp]
    const person2Id = personNameToId[assoc.person_2_temp]

    if (!person1Id || !person2Id) {
      console.log(`  - Skipping: missing ID for ${assoc.person_1_temp} or ${assoc.person_2_temp}`)
      continue
    }

    const { error } = await supabase
      .from('associations')
      .insert({
        person_id: person1Id,
        associated_person_id: person2Id,
        association_type: assoc.association_type,
        date: assoc.date || null,
        confidence: assoc.confidence,
        evidence_summary: assoc.evidence_summary,
        source_id: sourceIdMap[assoc.source_temp_id] || null,
        notes: assoc.notes || null
      })

    if (error) {
      if (error.code === '23505') {
        console.log(`  - Association already exists`)
      } else {
        console.error(`  ERROR adding association:`, error.message)
      }
    } else {
      console.log(`  ✓ Added: ${assoc.person_1_temp} <-> ${assoc.person_2_temp} (${assoc.association_type})`)
    }
  }
}

async function addResearchNotes() {
  console.log('\n=== ADDING RESEARCH NOTES ===')

  // Map names to IDs for research notes
  const nameToId = {
    'Richard Johnson': 'JNSN-ENG-e1595-01',
    'William Johnson (1653)': 'JNSN-ENG-e1620-01',
    'William Farrar': 'FRRR-ENG-e1590-01',
    'John Woodson (merchant)': 'WDSN-VA-e1660-01',
    'John Woodson Sr.': 'WDSN-VA-e1635-01',
    'John Jones': 'JNES-UNK-e1670-01',
    'Michael Johnson': null // Not in database yet
  }

  for (const note of extraction.research_notes_not_evidence) {
    const personIds = (note.related_people || [])
      .map(name => nameToId[name])
      .filter(id => id !== null && id !== undefined)

    if (personIds.length === 0) {
      console.log(`  - Skipping note: no valid person IDs for ${note.related_people?.join(', ')}`)
      continue
    }

    // Add note for first person (primary subject)
    const noteTypeMap = {
      'unverified': 'theory',
      'likely_but_unconfirmed': 'theory',
      'observation': 'observation',
      'needs_research': 'speculation',
      'possible_but_speculative': 'speculation'
    }

    const noteData = {
      person_id: personIds[0],
      note_text: note.note + (note.research_needed ? `\n\nRESEARCH NEEDED: ${note.research_needed}` : ''),
      note_type: noteTypeMap[note.status] || 'speculation',
      source_file: note.source_file || 'Va-1607-Arrowhattocks',
      is_verified: false
    }

    const { error } = await supabase
      .from('research_notes')
      .insert(noteData)

    if (error) {
      console.error(`  ERROR adding note for ${personIds[0]}:`, error.message)
    } else {
      console.log(`  ✓ Added note for ${personIds[0]}: ${note.note.substring(0, 50)}...`)
    }
  }
}

async function runImport() {
  console.log('========================================')
  console.log('ARROWHATTOCKS EXTRACTION BATCH 3 IMPORT')
  console.log('========================================')
  console.log(`Source file: ${extraction.extraction_metadata.source_file}`)
  console.log(`Extraction date: ${extraction.extraction_metadata.extraction_date}`)
  console.log(`Focus: ${extraction.extraction_metadata.focus}`)

  try {
    await importSources()
    await importDocuments()
    await createNewPeople()
    await linkPeopleToDocuments()
    await addAssociations()
    await addResearchNotes()

    console.log('\n========================================')
    console.log('IMPORT COMPLETE')
    console.log('========================================')
    console.log('Key findings:')
    extraction.extraction_summary.key_findings.forEach((f, i) => {
      console.log(`  ${i + 1}. ${f}`)
    })
  } catch (error) {
    console.error('Import failed:', error)
  }
}

runImport()
