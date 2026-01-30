/**
 * Import Script: Arrowhattocks Extraction Batch 4
 *
 * Focus: Robert Burton 1699 patent, Michael Johnson's arrival (1698-1702),
 * Hutchins Burton, Burton-Johnson land adjacency
 *
 * Run with: node scripts/import-arrowhattocks-batch4.js
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabaseUrl = 'https://oxpkqnmuwqcnmzvavsuz.supabase.co'
const supabaseKey = 'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
const supabase = createClient(supabaseUrl, supabaseKey)

// Load the extraction data
const extractionPath = '../../sources/arrowhattocks-extraction-batch4.json'
const extraction = JSON.parse(readFileSync(new URL(extractionPath, import.meta.url), 'utf8'))

// Track temp_id to real UUID mappings
const sourceIdMap = {}
const documentIdMap = {}
const newPeopleIdMap = {}

async function importSources() {
  console.log('\n=== IMPORTING SOURCES ===')

  for (const source of extraction.sources_to_add) {
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
      console.log(`  ✓ Added source: ${source.abbreviation} (${source.temp_id})`)
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
      document_type: doc.document_type === 'parish_record' ? 'church_record' : doc.document_type,
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
      console.log(`  ✓ Added document: ${doc.title?.substring(0, 50)}... (${doc.temp_id})`)
    }
  }

  console.log(`  Total documents added: ${Object.keys(documentIdMap).length}`)
}

async function createNewPeople() {
  console.log('\n=== CREATING NEW PEOPLE ===')

  for (const person of extraction.new_people_to_create) {
    let birthYear = person.birth_year || person.birth_year_estimate || null
    let birthYearType = 'e'

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
      death_year: person.death_year || null,
      death_year_type: person.death_type === 'known' ? 'k' : 'e',
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

  for (const doc of extraction.documents) {
    const documentId = documentIdMap[doc.temp_id]
    if (!documentId) {
      console.log(`  - Skipping ${doc.temp_id}: document not found`)
      continue
    }

    for (const person of doc.people) {
      let personId = person.likely_match

      if (!personId) {
        console.log(`  - Skipping: ${person.name_as_written} (no person ID)`)
        continue
      }

      // Verify person exists
      const { data: existingPerson } = await supabase
        .from('people')
        .select('id')
        .eq('id', personId)
        .single()

      if (!existingPerson) {
        console.log(`  - Skipping link: person ${personId} not in database`)
        continue
      }

      const roleMap = {
        'patentee': 'patentee',
        'previous_patentee': 'mentioned',
        'adjacent_landowner': 'adjacent_landowner',
        'grantor': 'grantor',
        'grantee': 'grantee',
        'wife_of_grantor': 'spouse',
        'reporter': 'witness',
        'tithable': 'mentioned',
        'plantation_owner': 'mentioned'
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
        if (error.code === '23505') {
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

async function addRelationships() {
  console.log('\n=== ADDING RELATIONSHIPS ===')

  for (const rel of extraction.relationships_to_add) {
    // Check if both people exist
    const { data: person1 } = await supabase
      .from('people')
      .select('id')
      .eq('id', rel.person_1)
      .single()

    const { data: person2 } = await supabase
      .from('people')
      .select('id')
      .eq('id', rel.person_2)
      .single()

    if (!person1) {
      console.log(`  - Skipping: ${rel.person_1} not found`)
      continue
    }
    if (!person2) {
      console.log(`  - Skipping: ${rel.person_2} not found`)
      continue
    }

    // Map confidence to relationship_status
    const statusMap = {
      'confirmed': 'confirmed',
      'likely': 'probable',
      'possible': 'possible'
    }

    const relData = {
      person_id: rel.person_1,
      related_person_id: rel.person_2,
      relationship_type: rel.relationship_type,
      relationship_status: statusMap[rel.confidence] || 'probable',
      confidence: rel.confidence,
      evidence: rel.evidence_summary || null,
      evidence_summary: rel.evidence_summary || null,
      source_id: sourceIdMap[rel.source_temp_id] || null,
      notes: rel.notes || null
    }

    const { error } = await supabase
      .from('family_relationships')
      .insert(relData)

    if (error) {
      if (error.code === '23505') {
        console.log(`  - Relationship already exists: ${rel.person_1_name} -> ${rel.person_2_name}`)
      } else {
        console.error(`  ERROR adding relationship:`, error.message)
      }
    } else {
      console.log(`  ✓ Added: ${rel.person_1_name} -> ${rel.person_2_name} (${rel.relationship_type}, ${rel.confidence})`)

      // Add reciprocal relationship
      const reciprocalType = {
        'spouse': 'spouse',
        'father': 'child',
        'mother': 'child',
        'child': 'father',
        'sibling': 'sibling'
      }[rel.relationship_type]

      if (reciprocalType) {
        const reciprocalData = {
          person_id: rel.person_2,
          related_person_id: rel.person_1,
          relationship_type: reciprocalType,
          relationship_status: statusMap[rel.confidence] || 'probable',
          confidence: rel.confidence,
          evidence: rel.evidence_summary || null,
          evidence_summary: `Reciprocal: ${rel.evidence_summary || ''}`,
          source_id: sourceIdMap[rel.source_temp_id] || null
        }

        const { error: recError } = await supabase
          .from('family_relationships')
          .insert(reciprocalData)

        if (!recError) {
          console.log(`    ✓ Added reciprocal: ${rel.person_2_name} -> ${rel.person_1_name}`)
        }
      }
    }
  }
}

async function addAssociations() {
  console.log('\n=== ADDING ASSOCIATIONS ===')

  for (const assoc of extraction.associations_to_add) {
    // Check if both people exist
    const { data: person1 } = await supabase
      .from('people')
      .select('id')
      .eq('id', assoc.person_1)
      .single()

    const { data: person2 } = await supabase
      .from('people')
      .select('id')
      .eq('id', assoc.person_2)
      .single()

    if (!person1 || !person2) {
      console.log(`  - Skipping: one or both people not found (${assoc.person_1}, ${assoc.person_2})`)
      continue
    }

    const { error } = await supabase
      .from('associations')
      .insert({
        person_id: assoc.person_1,
        associated_person_id: assoc.person_2,
        association_type: assoc.association_type,
        date: assoc.date || null,
        confidence: assoc.confidence,
        evidence_summary: assoc.evidence_summary,
        source_id: sourceIdMap[assoc.source_temp_id] || null
      })

    if (error) {
      if (error.code === '23505') {
        console.log(`  - Association already exists: ${assoc.person_1_name} <-> ${assoc.person_2_name}`)
      } else {
        console.error(`  ERROR adding association:`, error.message)
      }
    } else {
      console.log(`  ✓ Added: ${assoc.person_1_name} <-> ${assoc.person_2_name} (${assoc.association_type})`)
    }
  }
}

async function addResearchNotes() {
  console.log('\n=== ADDING RESEARCH NOTES ===')

  // Map names to IDs
  const nameToId = {
    'Michael Johnson': 'JNSN-UNK-e1673-01',
    'John Jones': 'JNES-UNK-e1670-01',
    'Robert Burton Sr.': 'BRTN-VA-e1660-01',
    'William Burton': 'BRTN-HEN-e1685-01',
    'John Burton (1665)': 'BRTN-VA-e1640-01'
  }

  const noteTypeMap = {
    'unverified': 'theory',
    'likely_but_unconfirmed': 'theory',
    'possible': 'speculation',
    'gap_in_record': 'observation'
  }

  for (const note of extraction.research_notes_not_evidence) {
    const personIds = (note.related_people || [])
      .map(name => nameToId[name])
      .filter(id => id !== null && id !== undefined)

    if (personIds.length === 0) {
      console.log(`  - Skipping note: no valid person IDs for ${note.related_people?.join(', ')}`)
      continue
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
  console.log('ARROWHATTOCKS EXTRACTION BATCH 4 IMPORT')
  console.log('========================================')
  console.log(`Source file: ${extraction.extraction_metadata.source_file}`)
  console.log(`Extraction date: ${extraction.extraction_metadata.extraction_date}`)
  console.log(`Focus: ${extraction.extraction_metadata.focus}`)

  try {
    await importSources()
    await importDocuments()
    await createNewPeople()
    await linkPeopleToDocuments()
    await addRelationships()
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
