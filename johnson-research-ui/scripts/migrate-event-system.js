import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://oxpkqnmuwqcnmzvavsuz.supabase.co',
  'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
)

// =============================================================================
// EVENT SYSTEM DATABASE MIGRATION
// Based on EVENT_SYSTEM_SPEC_v2_iron_clad.md
// =============================================================================

async function runMigration() {
  console.log('=== EVENT SYSTEM DATABASE MIGRATION ===\n')

  // ---------------------------------------------------------------------------
  // STEP 1: Create events table
  // ---------------------------------------------------------------------------
  console.log('Step 1: Creating events table...')

  const createEventsResult = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        -- Source document
        document_id UUID REFERENCES documents(id) NOT NULL,

        -- When
        event_date DATE,
        event_date_text TEXT NOT NULL,
        event_year INTEGER,

        -- Where
        location_id UUID REFERENCES locations(id),
        location_text TEXT,

        -- What
        event_type TEXT NOT NULL CHECK (event_type IN (
          'land_patent', 'land_deed', 'land_survey',
          'will', 'estate_admin',
          'court_case', 'court_order', 'petition', 'bond',
          'tax_list', 'militia_list', 'census',
          'church_membership', 'baptism', 'church_marriage', 'church_burial',
          'vital_birth', 'vital_death', 'vital_marriage',
          'pension', 'military_service',
          'narrative', 'list_other', 'other'
        )),
        title TEXT NOT NULL,
        description TEXT,
        transcription TEXT,

        -- Position in source
        line_start INTEGER,
        line_end INTEGER,
        section_marker TEXT,

        -- Confidence
        confidence TEXT NOT NULL DEFAULT 'probable' CHECK (confidence IN ('confirmed', 'probable', 'possible')),

        -- Metadata
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        notes TEXT
      );
    `
  })

  // If RPC doesn't exist, we need an alternative approach
  // Let's verify the table exists by trying to select from it
  const { error: eventsCheckError } = await supabase.from('events').select('id').limit(1)

  if (eventsCheckError && eventsCheckError.code === '42P01') {
    console.log('  Events table does not exist - needs to be created via Supabase Dashboard SQL Editor')
    console.log('  SQL to run:')
    console.log(`
      CREATE TABLE events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        document_id UUID REFERENCES documents(id) NOT NULL,
        event_date DATE,
        event_date_text TEXT NOT NULL,
        event_year INTEGER,
        location_id UUID REFERENCES locations(id),
        location_text TEXT,
        event_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        transcription TEXT,
        line_start INTEGER,
        line_end INTEGER,
        section_marker TEXT,
        confidence TEXT NOT NULL DEFAULT 'probable',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        notes TEXT
      );

      CREATE INDEX idx_events_document ON events(document_id);
      CREATE INDEX idx_events_year ON events(event_year);
      CREATE INDEX idx_events_location ON events(location_id);
      CREATE INDEX idx_events_type ON events(event_type);
    `)
  } else if (!eventsCheckError) {
    console.log('  Events table already exists')
  }

  // ---------------------------------------------------------------------------
  // STEP 2: Create event_participants table
  // ---------------------------------------------------------------------------
  console.log('\nStep 2: Checking event_participants table...')

  const { error: participantsCheckError } = await supabase.from('event_participants').select('id').limit(1)

  if (participantsCheckError && participantsCheckError.code === '42P01') {
    console.log('  Event_participants table does not exist - SQL to run:')
    console.log(`
      CREATE TABLE event_participants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
        person_id UUID REFERENCES people(id) ON DELETE SET NULL,
        name_as_written TEXT NOT NULL,
        surname_extracted TEXT,
        given_name_extracted TEXT,
        role TEXT NOT NULL,
        confidence TEXT CHECK (confidence IN ('confirmed', 'probable', 'possible')),
        possible_matches JSONB DEFAULT '[]'::jsonb,
        identification_evidence TEXT,
        details JSONB DEFAULT '{}'::jsonb,
        identification_status TEXT NOT NULL DEFAULT 'unidentified'
          CHECK (identification_status IN ('confirmed', 'probable', 'possible', 'unidentified', 'rejected')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        reviewed_at TIMESTAMP WITH TIME ZONE,
        reviewed_by TEXT,
        UNIQUE (event_id, name_as_written, role)
      );

      CREATE INDEX idx_ep_event ON event_participants(event_id);
      CREATE INDEX idx_ep_person ON event_participants(person_id);
      CREATE INDEX idx_ep_name ON event_participants(name_as_written);
      CREATE INDEX idx_ep_surname ON event_participants(surname_extracted);
      CREATE INDEX idx_ep_status ON event_participants(identification_status);
    `)
  } else if (!participantsCheckError) {
    console.log('  Event_participants table already exists')
  }

  // ---------------------------------------------------------------------------
  // STEP 3: Create document_name_registry table
  // ---------------------------------------------------------------------------
  console.log('\nStep 3: Checking document_name_registry table...')

  const { error: registryCheckError } = await supabase.from('document_name_registry').select('id').limit(1)

  if (registryCheckError && registryCheckError.code === '42P01') {
    console.log('  Document_name_registry table does not exist - SQL to run:')
    console.log(`
      CREATE TABLE document_name_registry (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
        name_as_written TEXT NOT NULL,
        surname TEXT,
        given_name TEXT,
        first_line_number INTEGER,
        first_section TEXT,
        mention_count INTEGER DEFAULT 1,
        resolved_person_id UUID REFERENCES people(id),
        resolution_confidence TEXT CHECK (resolution_confidence IN ('confirmed', 'probable', 'possible')),
        possible_matches JSONB DEFAULT '[]'::jsonb,
        UNIQUE (document_id, name_as_written)
      );

      CREATE INDEX idx_dnr_document ON document_name_registry(document_id);
      CREATE INDEX idx_dnr_surname ON document_name_registry(surname);
    `)
  } else if (!registryCheckError) {
    console.log('  Document_name_registry table already exists')
  }

  // ---------------------------------------------------------------------------
  // STEP 4: Create extraction_files table
  // ---------------------------------------------------------------------------
  console.log('\nStep 4: Checking extraction_files table...')

  const { error: filesCheckError } = await supabase.from('extraction_files').select('id').limit(1)

  if (filesCheckError && filesCheckError.code === '42P01') {
    console.log('  Extraction_files table does not exist - SQL to run:')
    console.log(`
      CREATE TABLE extraction_files (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
        file_type TEXT NOT NULL CHECK (file_type IN (
          'events_json', 'participants_json', 'name_registry_json',
          'processing_log', 'verification_report'
        )),
        file_path TEXT NOT NULL,
        file_size INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX idx_extraction_files_document ON extraction_files(document_id);
    `)
  } else if (!filesCheckError) {
    console.log('  Extraction_files table already exists')
  }

  // ---------------------------------------------------------------------------
  // STEP 5: Check documents table columns
  // ---------------------------------------------------------------------------
  console.log('\nStep 5: Checking documents table for new columns...')

  const { data: docSample } = await supabase.from('documents').select('*').limit(1)
  const existingDocCols = docSample ? Object.keys(docSample[0] || {}) : []

  const neededDocCols = [
    'file_type', 'raw_text', 'line_count', 'processing_status',
    'processing_started_at', 'processing_completed_at',
    'event_count', 'participant_count', 'error_message', 'processing_log'
  ]

  const missingDocCols = neededDocCols.filter(col => !existingDocCols.includes(col))

  if (missingDocCols.length > 0) {
    console.log('  Documents table missing columns:', missingDocCols.join(', '))
    console.log('  SQL to run:')

    let sql = ''
    if (missingDocCols.includes('file_type')) {
      sql += `ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_type TEXT;\n`
    }
    if (missingDocCols.includes('raw_text')) {
      sql += `ALTER TABLE documents ADD COLUMN IF NOT EXISTS raw_text TEXT;\n`
    }
    if (missingDocCols.includes('line_count')) {
      sql += `ALTER TABLE documents ADD COLUMN IF NOT EXISTS line_count INTEGER;\n`
    }
    if (missingDocCols.includes('processing_status')) {
      sql += `ALTER TABLE documents ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'uploaded'
        CHECK (processing_status IN ('uploaded', 'analyzing', 'extracting', 'matching', 'review', 'complete', 'error'));\n`
    }
    if (missingDocCols.includes('processing_started_at')) {
      sql += `ALTER TABLE documents ADD COLUMN IF NOT EXISTS processing_started_at TIMESTAMP WITH TIME ZONE;\n`
    }
    if (missingDocCols.includes('processing_completed_at')) {
      sql += `ALTER TABLE documents ADD COLUMN IF NOT EXISTS processing_completed_at TIMESTAMP WITH TIME ZONE;\n`
    }
    if (missingDocCols.includes('event_count')) {
      sql += `ALTER TABLE documents ADD COLUMN IF NOT EXISTS event_count INTEGER DEFAULT 0;\n`
    }
    if (missingDocCols.includes('participant_count')) {
      sql += `ALTER TABLE documents ADD COLUMN IF NOT EXISTS participant_count INTEGER DEFAULT 0;\n`
    }
    if (missingDocCols.includes('error_message')) {
      sql += `ALTER TABLE documents ADD COLUMN IF NOT EXISTS error_message TEXT;\n`
    }
    if (missingDocCols.includes('processing_log')) {
      sql += `ALTER TABLE documents ADD COLUMN IF NOT EXISTS processing_log JSONB DEFAULT '[]'::jsonb;\n`
    }
    console.log(sql)
  } else {
    console.log('  Documents table has all required columns')
  }

  // ---------------------------------------------------------------------------
  // STEP 6: Check people table columns
  // ---------------------------------------------------------------------------
  console.log('\nStep 6: Checking people table for new columns...')

  const { data: peopleSample } = await supabase.from('people').select('*').limit(1)
  const existingPeopleCols = peopleSample ? Object.keys(peopleSample[0] || {}) : []

  const neededPeopleCols = ['confirmed_event_count', 'probable_event_count', 'possible_event_count']
  const missingPeopleCols = neededPeopleCols.filter(col => !existingPeopleCols.includes(col))

  if (missingPeopleCols.length > 0) {
    console.log('  People table missing columns:', missingPeopleCols.join(', '))
    console.log('  SQL to run:')

    let sql = ''
    if (missingPeopleCols.includes('confirmed_event_count')) {
      sql += `ALTER TABLE people ADD COLUMN IF NOT EXISTS confirmed_event_count INTEGER DEFAULT 0;\n`
    }
    if (missingPeopleCols.includes('probable_event_count')) {
      sql += `ALTER TABLE people ADD COLUMN IF NOT EXISTS probable_event_count INTEGER DEFAULT 0;\n`
    }
    if (missingPeopleCols.includes('possible_event_count')) {
      sql += `ALTER TABLE people ADD COLUMN IF NOT EXISTS possible_event_count INTEGER DEFAULT 0;\n`
    }
    console.log(sql)
  } else {
    console.log('  People table has all required columns')
  }

  // ---------------------------------------------------------------------------
  // COMPLETE SQL FOR COPY/PASTE
  // ---------------------------------------------------------------------------
  console.log('\n' + '='.repeat(80))
  console.log('COMPLETE SQL TO RUN IN SUPABASE SQL EDITOR:')
  console.log('='.repeat(80))

  console.log(`
-- =============================================================================
-- EVENT SYSTEM TABLES - Run this in Supabase SQL Editor
-- =============================================================================

-- 1. Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) NOT NULL,
  event_date DATE,
  event_date_text TEXT NOT NULL,
  event_year INTEGER,
  location_id UUID REFERENCES locations(id),
  location_text TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'land_patent', 'land_deed', 'land_survey',
    'will', 'estate_admin',
    'court_case', 'court_order', 'petition', 'bond',
    'tax_list', 'militia_list', 'census',
    'church_membership', 'baptism', 'church_marriage', 'church_burial',
    'vital_birth', 'vital_death', 'vital_marriage',
    'pension', 'military_service',
    'narrative', 'list_other', 'other'
  )),
  title TEXT NOT NULL,
  description TEXT,
  transcription TEXT,
  line_start INTEGER,
  line_end INTEGER,
  section_marker TEXT,
  confidence TEXT NOT NULL DEFAULT 'probable' CHECK (confidence IN ('confirmed', 'probable', 'possible')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_document ON events(document_id);
CREATE INDEX IF NOT EXISTS idx_events_year ON events(event_year);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);

-- 2. Event participants table
CREATE TABLE IF NOT EXISTS event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  person_id UUID REFERENCES people(id) ON DELETE SET NULL,
  name_as_written TEXT NOT NULL,
  surname_extracted TEXT,
  given_name_extracted TEXT,
  role TEXT NOT NULL,
  confidence TEXT CHECK (confidence IN ('confirmed', 'probable', 'possible')),
  possible_matches JSONB DEFAULT '[]'::jsonb,
  identification_evidence TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  identification_status TEXT NOT NULL DEFAULT 'unidentified'
    CHECK (identification_status IN ('confirmed', 'probable', 'possible', 'unidentified', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT,
  UNIQUE (event_id, name_as_written, role)
);

CREATE INDEX IF NOT EXISTS idx_ep_event ON event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_ep_person ON event_participants(person_id);
CREATE INDEX IF NOT EXISTS idx_ep_name ON event_participants(name_as_written);
CREATE INDEX IF NOT EXISTS idx_ep_surname ON event_participants(surname_extracted);
CREATE INDEX IF NOT EXISTS idx_ep_status ON event_participants(identification_status);

-- 3. Document name registry table
CREATE TABLE IF NOT EXISTS document_name_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  name_as_written TEXT NOT NULL,
  surname TEXT,
  given_name TEXT,
  first_line_number INTEGER,
  first_section TEXT,
  mention_count INTEGER DEFAULT 1,
  resolved_person_id UUID REFERENCES people(id),
  resolution_confidence TEXT CHECK (resolution_confidence IN ('confirmed', 'probable', 'possible')),
  possible_matches JSONB DEFAULT '[]'::jsonb,
  UNIQUE (document_id, name_as_written)
);

CREATE INDEX IF NOT EXISTS idx_dnr_document ON document_name_registry(document_id);
CREATE INDEX IF NOT EXISTS idx_dnr_surname ON document_name_registry(surname);

-- 4. Extraction files table
CREATE TABLE IF NOT EXISTS extraction_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN (
    'events_json', 'participants_json', 'name_registry_json',
    'processing_log', 'verification_report'
  )),
  file_path TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_extraction_files_document ON extraction_files(document_id);

-- 5. Add columns to documents table
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_type TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS raw_text TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS line_count INTEGER;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'uploaded';
ALTER TABLE documents ADD COLUMN IF NOT EXISTS processing_started_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS processing_completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS event_count INTEGER DEFAULT 0;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS participant_count INTEGER DEFAULT 0;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS error_message TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS processing_log JSONB DEFAULT '[]'::jsonb;

-- 6. Add columns to people table
ALTER TABLE people ADD COLUMN IF NOT EXISTS confirmed_event_count INTEGER DEFAULT 0;
ALTER TABLE people ADD COLUMN IF NOT EXISTS probable_event_count INTEGER DEFAULT 0;
ALTER TABLE people ADD COLUMN IF NOT EXISTS possible_event_count INTEGER DEFAULT 0;

-- 7. Enable Row Level Security (allow all for now)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_name_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE extraction_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on events" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on event_participants" ON event_participants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on document_name_registry" ON document_name_registry FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on extraction_files" ON extraction_files FOR ALL USING (true) WITH CHECK (true);

-- Done!
SELECT 'Event system tables created successfully!' as result;
  `)
}

runMigration().catch(console.error)
