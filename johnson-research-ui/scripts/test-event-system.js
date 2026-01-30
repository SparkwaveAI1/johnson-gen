/**
 * Integration test for Event System
 * Tests database operations, relationships, and data integrity
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oxpkqnmuwqcnmzvavsuz.supabase.co'
const supabaseKey = 'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
const supabase = createClient(supabaseUrl, supabaseKey)

let testDocumentId = null
let testEventId = null
let testParticipantId = null
let testPersonId = null

async function runTests() {
  console.log('=== EVENT SYSTEM INTEGRATION TESTS ===\n')

  let passed = 0
  let failed = 0

  // Test 1: Get existing person for testing
  console.log('1. Fetching test person...')
  try {
    const { data: people, error } = await supabase
      .from('people')
      .select('id, given_name, surname')
      .limit(1)
      .single()

    if (error) throw error
    testPersonId = people.id
    console.log(`   PASS: Found person ${people.given_name} ${people.surname} (${testPersonId})`)
    passed++
  } catch (err) {
    console.log(`   FAIL: ${err.message}`)
    failed++
    console.log('\nTests require at least one person in database. Exiting.')
    process.exit(1)
  }

  // Test 2: Create test document
  console.log('\n2. Creating test document...')
  try {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        title: 'Test Tax List 1750 - Integration Test',
        document_type: 'tax_list',
        date: '1750',
        county: 'Augusta',
        state: 'Virginia',
        raw_text: 'Line 1: John Johnson - 100 acres\nLine 2: William Johnston - 50 acres',
        line_count: 2,
        processing_status: 'uploaded'
      })
      .select()
      .single()

    if (error) throw error
    testDocumentId = data.id
    console.log(`   PASS: Created document ${testDocumentId}`)
    passed++
  } catch (err) {
    console.log(`   FAIL: ${err.message}`)
    failed++
  }

  // Test 3: Update document processing status
  console.log('\n3. Testing processing status updates...')
  try {
    const statuses = ['analyzing', 'extracting', 'matching', 'review']
    for (const status of statuses) {
      const { error } = await supabase
        .from('documents')
        .update({ processing_status: status })
        .eq('id', testDocumentId)

      if (error) throw error
    }
    console.log(`   PASS: All status transitions successful`)
    passed++
  } catch (err) {
    console.log(`   FAIL: ${err.message}`)
    failed++
  }

  // Test 4: Create event linked to document
  console.log('\n4. Creating test event...')
  try {
    const { data, error } = await supabase
      .from('events')
      .insert({
        document_id: testDocumentId,
        event_type: 'tax_list',
        event_date_text: '1750',
        event_year: 1750,
        title: 'Augusta County Tax List 1750',
        description: 'Annual tax assessment',
        location_text: 'Augusta County, Virginia',
        confidence: 'confirmed',
        line_start: 1,
        line_end: 2
      })
      .select()
      .single()

    if (error) throw error
    testEventId = data.id
    console.log(`   PASS: Created event ${testEventId}`)
    passed++
  } catch (err) {
    console.log(`   FAIL: ${err.message}`)
    failed++
  }

  // Test 5: Create participant linked to event
  console.log('\n5. Creating test participant (unidentified)...')
  try {
    const { data, error } = await supabase
      .from('event_participants')
      .insert({
        event_id: testEventId,
        name_as_written: 'John Johnson',
        surname_extracted: 'Johnson',
        given_name_extracted: 'John',
        role: 'taxpayer',
        identification_status: 'unidentified'
      })
      .select()
      .single()

    if (error) throw error
    testParticipantId = data.id
    console.log(`   PASS: Created participant ${testParticipantId}`)
    passed++
  } catch (err) {
    console.log(`   FAIL: ${err.message}`)
    failed++
  }

  // Test 6: Link participant to person (probable match)
  console.log('\n6. Linking participant to person (probable)...')
  try {
    const { error } = await supabase
      .from('event_participants')
      .update({
        person_id: testPersonId,
        identification_status: 'probable',
        confidence: 'probable',
        identification_evidence: 'Name and time period match'
      })
      .eq('id', testParticipantId)

    if (error) throw error
    console.log(`   PASS: Linked participant to person`)
    passed++
  } catch (err) {
    console.log(`   FAIL: ${err.message}`)
    failed++
  }

  // Test 7: Confirm participant identification
  console.log('\n7. Confirming participant identification...')
  try {
    const { error } = await supabase
      .from('event_participants')
      .update({
        identification_status: 'confirmed'
      })
      .eq('id', testParticipantId)

    if (error) throw error
    console.log(`   PASS: Confirmed participant`)
    passed++
  } catch (err) {
    console.log(`   FAIL: ${err.message}`)
    failed++
  }

  // Test 8: Create name registry entry
  console.log('\n8. Creating document name registry entry...')
  try {
    const { data, error } = await supabase
      .from('document_name_registry')
      .insert({
        document_id: testDocumentId,
        name_as_written: 'John Johnson',
        surname_extracted: 'Johnson',
        given_name_extracted: 'John',
        first_appearance_line: 1,
        occurrence_count: 1,
        resolved_person_id: testPersonId,
        resolution_confidence: 'confirmed'
      })
      .select()
      .single()

    if (error) throw error
    console.log(`   PASS: Created name registry entry ${data.id}`)
    passed++
  } catch (err) {
    console.log(`   FAIL: ${err.message}`)
    failed++
  }

  // Test 9: Create extraction file reference
  console.log('\n9. Creating extraction file reference...')
  try {
    const { data, error } = await supabase
      .from('extraction_files')
      .insert({
        document_id: testDocumentId,
        file_type: 'events_json',
        file_path: '/extractions/test-doc/events.json',
        file_size: 1024
      })
      .select()
      .single()

    if (error) throw error
    console.log(`   PASS: Created extraction file ${data.id}`)
    passed++
  } catch (err) {
    console.log(`   FAIL: ${err.message}`)
    failed++
  }

  // Test 10: Query events with participants
  console.log('\n10. Querying events with participants...')
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_participants (
          *,
          person:people (id, given_name, surname)
        )
      `)
      .eq('id', testEventId)
      .single()

    if (error) throw error
    if (!data.event_participants || data.event_participants.length === 0) {
      throw new Error('No participants returned in join')
    }
    if (!data.event_participants[0].person) {
      throw new Error('Person not joined')
    }
    console.log(`   PASS: Event query with nested participants works`)
    console.log(`         Event: ${data.title}`)
    console.log(`         Participant: ${data.event_participants[0].name_as_written}`)
    console.log(`         Linked to: ${data.event_participants[0].person.given_name} ${data.event_participants[0].person.surname}`)
    passed++
  } catch (err) {
    console.log(`   FAIL: ${err.message}`)
    failed++
  }

  // Test 11: Mark document complete
  console.log('\n11. Marking document as complete...')
  try {
    const { error } = await supabase
      .from('documents')
      .update({
        processing_status: 'complete',
        processing_completed_at: new Date().toISOString(),
        event_count: 1,
        participant_count: 1
      })
      .eq('id', testDocumentId)

    if (error) throw error
    console.log(`   PASS: Document marked complete`)
    passed++
  } catch (err) {
    console.log(`   FAIL: ${err.message}`)
    failed++
  }

  // Test 12: Query person's events
  console.log('\n12. Querying person events...')
  try {
    const { data, error } = await supabase
      .from('event_participants')
      .select(`
        *,
        event:events (
          *,
          document:documents (id, title)
        )
      `)
      .eq('person_id', testPersonId)
      .limit(5)

    if (error) throw error
    console.log(`   PASS: Found ${data.length} event(s) for person`)
    passed++
  } catch (err) {
    console.log(`   FAIL: ${err.message}`)
    failed++
  }

  // Cleanup
  console.log('\n--- CLEANUP ---')

  // Delete in correct order (respecting foreign keys)
  if (testDocumentId) {
    try {
      // Extraction files delete with CASCADE
      // Name registry deletes with CASCADE
      // Event participants delete with CASCADE
      // Events delete via document CASCADE
      await supabase
        .from('documents')
        .delete()
        .eq('id', testDocumentId)
      console.log('Cleaned up test document and related records')
    } catch (err) {
      console.log(`Cleanup error: ${err.message}`)
    }
  }

  // Summary
  console.log('\n=== TEST SUMMARY ===')
  console.log(`Passed: ${passed}`)
  console.log(`Failed: ${failed}`)
  console.log(`Total:  ${passed + failed}`)

  if (failed === 0) {
    console.log('\n✓ ALL TESTS PASSED - Event system is working correctly!')
  } else {
    console.log('\n✗ SOME TESTS FAILED - Review errors above')
    process.exit(1)
  }
}

runTests().catch(err => {
  console.error('Test runner error:', err)
  process.exit(1)
})
