-- SQL to create the family groups tables
-- Run this in Supabase SQL Editor or via psql

-- ============================================
-- FAMILY GROUPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS family_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identity
    name TEXT NOT NULL,
    slug TEXT UNIQUE,

    -- Classification
    group_type TEXT CHECK (group_type IN (
        'nuclear',
        'extended',
        'cluster',
        'unproven'
    )),

    -- Anchor person (the central figure)
    anchor_person_id TEXT REFERENCES people(id),

    -- Geographic association
    primary_location_id UUID REFERENCES locations(id),

    -- Time span
    date_start TEXT,
    date_end TEXT,

    -- Research status
    confidence TEXT CHECK (confidence IN ('confirmed', 'likely', 'possible')),
    status TEXT CHECK (status IN ('active', 'draft', 'published')) DEFAULT 'draft',

    -- Content
    summary TEXT,
    narrative TEXT,

    -- DNA
    dna_group TEXT,

    -- Hierarchy (nested family groups)
    parent_group_id UUID REFERENCES family_groups(id),
    connection_confidence TEXT CHECK (connection_confidence IN (
        'confirmed',
        'likely',
        'possible',
        'speculative'
    )),
    connection_evidence TEXT,

    -- Metadata
    source_files TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_family_groups_slug ON family_groups(slug);
CREATE INDEX idx_family_groups_anchor ON family_groups(anchor_person_id);
CREATE INDEX idx_family_groups_location ON family_groups(primary_location_id);
CREATE INDEX idx_family_groups_parent ON family_groups(parent_group_id);

-- ============================================
-- FAMILY GROUP MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS family_group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_group_id UUID REFERENCES family_groups(id) ON DELETE CASCADE,
    person_id TEXT REFERENCES people(id) ON DELETE CASCADE,

    role TEXT CHECK (role IN (
        'anchor',
        'spouse',
        'child',
        'parent',
        'sibling',
        'grandchild',
        'in_law',
        'associated'
    )),

    generation INTEGER,  -- 0 = anchor, 1 = children, -1 = parents, etc.

    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(family_group_id, person_id)
);

CREATE INDEX idx_family_group_members_group ON family_group_members(family_group_id);
CREATE INDEX idx_family_group_members_person ON family_group_members(person_id);

-- ============================================
-- BOOK CHAPTERS TABLE (for narrative generation)
-- ============================================
CREATE TABLE IF NOT EXISTS book_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identity
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    chapter_number INTEGER,

    -- Classification
    chapter_type TEXT CHECK (chapter_type IN (
        'introduction',
        'methodology',
        'family_narrative',
        'geographic_survey',
        'migration_analysis',
        'appendix'
    )),

    -- Content
    introduction TEXT,
    body TEXT,
    conclusion TEXT,

    -- Status
    status TEXT CHECK (status IN ('outline', 'draft', 'review', 'final')) DEFAULT 'outline',
    word_count INTEGER,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_book_chapters_slug ON book_chapters(slug);

-- ============================================
-- CHAPTER CONTENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chapter_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID REFERENCES book_chapters(id) ON DELETE CASCADE,

    -- What this chapter covers (polymorphic)
    content_type TEXT CHECK (content_type IN ('family_group', 'location', 'person')),
    family_group_id UUID REFERENCES family_groups(id),
    location_id UUID REFERENCES locations(id),
    person_id TEXT REFERENCES people(id),

    -- Order within chapter
    sequence INTEGER,

    -- Section-specific content
    section_title TEXT,
    section_content TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chapter_contents_chapter ON chapter_contents(chapter_id);

-- ============================================
-- ADD FK TO ATTACHMENTS TABLE
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'attachments_family_group_id_fkey'
    ) THEN
        ALTER TABLE attachments
        ADD CONSTRAINT attachments_family_group_id_fkey
        FOREIGN KEY (family_group_id) REFERENCES family_groups(id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_attachments_family ON attachments(family_group_id) WHERE family_group_id IS NOT NULL;

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE TRIGGER update_family_groups_updated_at
    BEFORE UPDATE ON family_groups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_chapters_updated_at
    BEFORE UPDATE ON book_chapters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
