-- Migration: Relationship Extraction Enhancement (v3.1)
-- Implements: extracted_relationships table, people columns for auto-creation

-- ============================================================================
-- 1. Create extracted_relationships table
-- ============================================================================

CREATE TABLE IF NOT EXISTS extracted_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,

    -- The two people
    person1_name TEXT NOT NULL,
    person2_name TEXT,
    relationship_type TEXT NOT NULL,  -- 'parent_child', 'spouse', 'sibling', 'grandparent'

    -- Which is which (for parent_child: who is parent, who is child)
    person1_role TEXT,  -- 'parent', 'child', 'spouse', 'grandparent', 'grandchild', 'sibling'
    person2_role TEXT,

    -- Source
    source_text TEXT,
    line_number INTEGER,

    -- Links (populated during matching)
    person1_profile_id TEXT REFERENCES people(id),
    person2_profile_id TEXT REFERENCES people(id),

    -- Confidence: stated relationship = PROBABLE
    confidence TEXT DEFAULT 'probable',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_er_document ON extracted_relationships(document_id);
CREATE INDEX IF NOT EXISTS idx_er_person1 ON extracted_relationships(person1_profile_id);
CREATE INDEX IF NOT EXISTS idx_er_person2 ON extracted_relationships(person2_profile_id);
CREATE INDEX IF NOT EXISTS idx_er_type ON extracted_relationships(relationship_type);

-- ============================================================================
-- 2. Add columns to people table for auto-creation tracking
-- ============================================================================

ALTER TABLE people ADD COLUMN IF NOT EXISTS auto_created BOOLEAN DEFAULT FALSE;
ALTER TABLE people ADD COLUMN IF NOT EXISTS needs_review BOOLEAN DEFAULT FALSE;
ALTER TABLE people ADD COLUMN IF NOT EXISTS creation_source TEXT;
ALTER TABLE people ADD COLUMN IF NOT EXISTS creation_reason TEXT;

-- Index for finding auto-created profiles needing review
CREATE INDEX IF NOT EXISTS idx_people_needs_review ON people(needs_review) WHERE needs_review = TRUE;
CREATE INDEX IF NOT EXISTS idx_people_auto_created ON people(auto_created) WHERE auto_created = TRUE;

-- ============================================================================
-- 3. Add first_documented column to people if not exists (for exact matching)
-- ============================================================================

ALTER TABLE people ADD COLUMN IF NOT EXISTS first_documented DATE;
ALTER TABLE people ADD COLUMN IF NOT EXISTS first_documented_text TEXT;

-- ============================================================================
-- 4. Enable RLS on extracted_relationships
-- ============================================================================

ALTER TABLE extracted_relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on extracted_relationships" ON extracted_relationships
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- 5. Add relationship_count to documents for tracking
-- ============================================================================

ALTER TABLE documents ADD COLUMN IF NOT EXISTS relationship_count INTEGER DEFAULT 0;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS profiles_created INTEGER DEFAULT 0;

-- ============================================================================
-- Done
-- ============================================================================
