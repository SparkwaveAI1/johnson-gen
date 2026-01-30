-- =============================================================================
-- EVENT SYSTEM TABLES MIGRATION
-- Based on EVENT_SYSTEM_SPEC_v2_iron_clad.md
-- Run this in Supabase SQL Editor
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

-- Drop policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "Allow all operations on events" ON events;
DROP POLICY IF EXISTS "Allow all operations on event_participants" ON event_participants;
DROP POLICY IF EXISTS "Allow all operations on document_name_registry" ON document_name_registry;
DROP POLICY IF EXISTS "Allow all operations on extraction_files" ON extraction_files;

-- Create policies
CREATE POLICY "Allow all operations on events" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on event_participants" ON event_participants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on document_name_registry" ON document_name_registry FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on extraction_files" ON extraction_files FOR ALL USING (true) WITH CHECK (true);

-- Done!
SELECT 'Event system tables created successfully!' as result;
