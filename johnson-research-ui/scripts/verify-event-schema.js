import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://oxpkqnmuwqcnmzvavsuz.supabase.co',
  'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
)

// =============================================================================
// VERIFY EVENT SYSTEM DATABASE SCHEMA
// Run this after executing the migration SQL
// =============================================================================

async function verifySchema() {
  console.log('=== VERIFYING EVENT SYSTEM SCHEMA ===\n')

  let allPassed = true

  // ---------------------------------------------------------------------------
  // Check 1: Events table exists and has correct structure
  // ---------------------------------------------------------------------------
  console.log('1. Checking events table...')
  const { data: eventsData, error: eventsError } = await supabase
    .from('events')
    .select('id')
    .limit(1)

  if (eventsError && eventsError.code === '42P01') {
    console.log('   FAIL: events table does not exist')
    allPassed = false
  } else if (eventsError) {
    console.log('   FAIL:', eventsError.message)
    allPassed = false
  } else {
    console.log('   PASS: events table exists')
  }

  // ---------------------------------------------------------------------------
  // Check 2: Event_participants table exists
  // ---------------------------------------------------------------------------
  console.log('2. Checking event_participants table...')
  const { data: epData, error: epError } = await supabase
    .from('event_participants')
    .select('id')
    .limit(1)

  if (epError && epError.code === '42P01') {
    console.log('   FAIL: event_participants table does not exist')
    allPassed = false
  } else if (epError) {
    console.log('   FAIL:', epError.message)
    allPassed = false
  } else {
    console.log('   PASS: event_participants table exists')
  }

  // ---------------------------------------------------------------------------
  // Check 3: Document_name_registry table exists
  // ---------------------------------------------------------------------------
  console.log('3. Checking document_name_registry table...')
  const { data: dnrData, error: dnrError } = await supabase
    .from('document_name_registry')
    .select('id')
    .limit(1)

  if (dnrError && dnrError.code === '42P01') {
    console.log('   FAIL: document_name_registry table does not exist')
    allPassed = false
  } else if (dnrError) {
    console.log('   FAIL:', dnrError.message)
    allPassed = false
  } else {
    console.log('   PASS: document_name_registry table exists')
  }

  // ---------------------------------------------------------------------------
  // Check 4: Extraction_files table exists
  // ---------------------------------------------------------------------------
  console.log('4. Checking extraction_files table...')
  const { data: efData, error: efError } = await supabase
    .from('extraction_files')
    .select('id')
    .limit(1)

  if (efError && efError.code === '42P01') {
    console.log('   FAIL: extraction_files table does not exist')
    allPassed = false
  } else if (efError) {
    console.log('   FAIL:', efError.message)
    allPassed = false
  } else {
    console.log('   PASS: extraction_files table exists')
  }

  // ---------------------------------------------------------------------------
  // Check 5: Documents table has new columns
  // ---------------------------------------------------------------------------
  console.log('5. Checking documents table columns...')
  const { data: docSample } = await supabase.from('documents').select('*').limit(1)
  const docCols = docSample && docSample[0] ? Object.keys(docSample[0]) : []

  const requiredDocCols = [
    'processing_status', 'processing_started_at', 'processing_completed_at',
    'event_count', 'participant_count', 'line_count', 'raw_text'
  ]

  const missingDocCols = requiredDocCols.filter(col => !docCols.includes(col))
  if (missingDocCols.length > 0) {
    console.log('   FAIL: documents missing columns:', missingDocCols.join(', '))
    allPassed = false
  } else {
    console.log('   PASS: documents table has all new columns')
  }

  // ---------------------------------------------------------------------------
  // Check 6: People table has new columns
  // ---------------------------------------------------------------------------
  console.log('6. Checking people table columns...')
  const { data: peopleSample } = await supabase.from('people').select('*').limit(1)
  const peopleCols = peopleSample && peopleSample[0] ? Object.keys(peopleSample[0]) : []

  const requiredPeopleCols = [
    'confirmed_event_count', 'probable_event_count', 'possible_event_count'
  ]

  const missingPeopleCols = requiredPeopleCols.filter(col => !peopleCols.includes(col))
  if (missingPeopleCols.length > 0) {
    console.log('   FAIL: people missing columns:', missingPeopleCols.join(', '))
    allPassed = false
  } else {
    console.log('   PASS: people table has all new columns')
  }

  // ---------------------------------------------------------------------------
  // Check 7: Test insert and delete to events table
  // ---------------------------------------------------------------------------
  console.log('7. Testing event insert/delete...')

  // First, get a valid document_id
  const { data: docs } = await supabase.from('documents').select('id').limit(1)

  if (docs && docs.length > 0) {
    const testEvent = {
      document_id: docs[0].id,
      event_date_text: 'TEST - 1756',
      event_year: 1756,
      event_type: 'other',
      title: 'TEST EVENT - DELETE ME',
      confidence: 'possible'
    }

    const { data: insertedEvent, error: insertError } = await supabase
      .from('events')
      .insert(testEvent)
      .select()
      .single()

    if (insertError) {
      console.log('   FAIL: Could not insert test event:', insertError.message)
      allPassed = false
    } else {
      console.log('   PASS: Test event inserted successfully')

      // Delete the test event
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', insertedEvent.id)

      if (deleteError) {
        console.log('   WARNING: Could not delete test event:', deleteError.message)
      } else {
        console.log('   PASS: Test event deleted successfully')
      }
    }
  } else {
    console.log('   SKIP: No documents available for test')
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n' + '='.repeat(50))
  if (allPassed) {
    console.log('ALL CHECKS PASSED - Schema is ready!')
    console.log('='.repeat(50))
  } else {
    console.log('SOME CHECKS FAILED - Please run the migration SQL')
    console.log('='.repeat(50))
    console.log('\nFile: supabase/migrations/001_event_system.sql')
  }
}

verifySchema().catch(console.error)
