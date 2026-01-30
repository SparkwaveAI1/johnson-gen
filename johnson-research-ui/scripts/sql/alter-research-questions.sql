-- SQL to update research_questions table schema
-- Run this in Supabase SQL Editor if the table exists but is missing columns

-- If the table needs to be recreated entirely, run this:
DROP TABLE IF EXISTS research_questions;

CREATE TABLE research_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id TEXT REFERENCES people(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    question_type TEXT CHECK (question_type IN (
        'relationship',    -- "Is X the father of Y?"
        'identity',        -- "Are these the same person?"
        'source_needed',   -- "Find the original document"
        'gap',            -- "What happened 1702-1714?"
        'verification'     -- "Verify Tony's claim"
    )),
    status TEXT DEFAULT 'open' CHECK (status IN (
        'open',
        'resolved',
        'cannot_resolve'
    )),
    evidence_for TEXT,         -- Why this might be true
    evidence_against TEXT,     -- Why this might not be true
    research_action TEXT,      -- Specific next steps to resolve
    resolution TEXT,           -- What we found (when resolved)
    resolution_date DATE,
    source_file TEXT,          -- Which Tony file raised this question
    related_people TEXT[],     -- Array of other person IDs involved
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for looking up questions by person
CREATE INDEX idx_research_questions_person ON research_questions(person_id);
CREATE INDEX idx_research_questions_status ON research_questions(status);

-- Trigger for updated_at (only if the function doesn't exist)
-- First check if the function exists:
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_research_questions_updated_at
    BEFORE UPDATE ON research_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
