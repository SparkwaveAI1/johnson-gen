-- Event System Migration Fix
-- Fix: people.id is TEXT, not UUID

-- 2. Event participants table (with correct TEXT reference to people)
CREATE TABLE IF NOT EXISTS event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  person_id TEXT REFERENCES people(id) ON DELETE SET NULL,
  name_as_written TEXT NOT NULL,
  surname_extracted TEXT,
  given_name_extracted TEXT,
  role TEXT NOT NULL CHECK (role IN (
    -- Land/Legal roles
    'grantor', 'grantee', 'witness', 'chain_carrier', 'surveyor',
    'security', 'appraiser', 'administrator', 'executor', 'testator',
    'heir', 'petitioner', 'plaintiff', 'defendant', 'juror', 'bondsman', 'guardian',
    -- Tax/Census roles
    'head_of_household', 'household_member', 'taxpayer', 'list_member',
    -- Military roles
    'soldier', 'officer', 'pensioner', 'militia_member',
    -- Church roles
    'member', 'minister', 'baptized', 'spouse_1', 'spouse_2', 'deceased', 'sponsor', 'parent',
    -- Narrative roles
    'subject', 'mentioned', 'author', 'informant',
    -- Generic
    'participant', 'other'
  )),
  confidence TEXT CHECK (confidence IN ('confirmed', 'probable', 'possible')),
  possible_matches JSONB DEFAULT '[]'::jsonb,
  identification_evidence TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  identification_status TEXT NOT NULL DEFAULT 'unidentified' CHECK (identification_status IN (
    'confirmed', 'probable', 'possible', 'unidentified', 'rejected'
  )),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for event_participants
CREATE INDEX IF NOT EXISTS idx_event_participants_event_id ON event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_person_id ON event_participants(person_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_name ON event_participants(surname_extracted, given_name_extracted);
CREATE INDEX IF NOT EXISTS idx_event_participants_status ON event_participants(identification_status);
CREATE INDEX IF NOT EXISTS idx_event_participants_role ON event_participants(role);

-- 3. Document name registry (with correct TEXT reference to people)
CREATE TABLE IF NOT EXISTS document_name_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  name_as_written TEXT NOT NULL,
  surname_extracted TEXT,
  given_name_extracted TEXT,
  first_appearance_line INTEGER,
  occurrence_count INTEGER DEFAULT 1,
  resolved_person_id TEXT REFERENCES people(id) ON DELETE SET NULL,
  resolution_confidence TEXT CHECK (resolution_confidence IN ('confirmed', 'probable', 'possible')),
  resolution_evidence TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(document_id, name_as_written)
);

-- Indexes for document_name_registry
CREATE INDEX IF NOT EXISTS idx_document_name_registry_document_id ON document_name_registry(document_id);
CREATE INDEX IF NOT EXISTS idx_document_name_registry_person_id ON document_name_registry(resolved_person_id);

-- Add counter columns to people table for tracking event counts (if they don't exist)
DO $$
BEGIN
  -- Check if confirmed_count column exists on people
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'people' AND column_name = 'confirmed_count') THEN
    ALTER TABLE people ADD COLUMN confirmed_count INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'people' AND column_name = 'probable_count') THEN
    ALTER TABLE people ADD COLUMN probable_count INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'people' AND column_name = 'possible_count') THEN
    ALTER TABLE people ADD COLUMN possible_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_name_registry ENABLE ROW LEVEL SECURITY;

-- RLS Policies for development (allow all)
DROP POLICY IF EXISTS "Allow all operations on event_participants" ON event_participants;
DROP POLICY IF EXISTS "Allow all operations on document_name_registry" ON document_name_registry;

CREATE POLICY "Allow all operations on event_participants" ON event_participants FOR ALL USING (true);
CREATE POLICY "Allow all operations on document_name_registry" ON document_name_registry FOR ALL USING (true);

-- Verification
SELECT 'Event system fix migration complete!' as result;
