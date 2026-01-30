-- Johnson Family Research Database Schema
-- For Supabase (PostgreSQL)

-- ============================================
-- SOURCES (create first, referenced by others)
-- ============================================

CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type TEXT, -- book, document_collection, website, personal_research, dna_project
    title TEXT NOT NULL,
    author TEXT,
    publication_info TEXT,
    url TEXT,
    abbreviation TEXT, -- CPv1, CPv2, etc.
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookup by abbreviation
CREATE INDEX idx_sources_abbreviation ON sources(abbreviation);

-- ============================================
-- PEOPLE (core table)
-- ============================================

CREATE TABLE people (
    -- Identity
    id TEXT PRIMARY KEY, -- Our code: JNSN-ENG-e1590-01
    surname TEXT NOT NULL,
    given_name TEXT,
    name_variants TEXT[], -- Array of alternate spellings
    suffix TEXT, -- Jr., Sr., III
    title TEXT, -- Col., Capt., Mr.
    designation TEXT, -- "Ancient Planter", "of Tuckahoe Creek"
    occupation TEXT,
    
    -- Birth
    birth_year INTEGER,
    birth_year_type CHAR(1) CHECK (birth_year_type IN ('b', 'e')), -- b=known, e=estimated
    birthplace_code TEXT, -- ENG, HEN, UNK, etc.
    birthplace_detail TEXT,
    
    -- Death
    death_year INTEGER,
    death_year_type CHAR(1) CHECK (death_year_type IN ('b', 'e')),
    death_place_code TEXT,
    death_place_detail TEXT,
    
    -- Burial
    burial_place TEXT,
    burial_notes TEXT, -- cemetery name, GPS, tombstone inscription
    
    -- Religion
    religion TEXT, -- Quaker, Anglican, etc.
    religion_notes TEXT,
    
    -- Research Status
    confidence TEXT CHECK (confidence IN ('CONFIRMED', 'PROBABLE', 'POSSIBLE', 'UNCERTAIN')),
    dna_group TEXT, -- White Oak, Longleaf Pine, etc.
    dna_status TEXT CHECK (dna_status IN ('ANCHOR', 'CONFIRMED', 'PROBABLE', 'POSSIBLE')),
    first_documented_date TEXT, -- For unknown birth years
    
    -- Bio (for the book)
    bio TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_people_surname ON people(surname);
CREATE INDEX idx_people_birthplace ON people(birthplace_code);
CREATE INDEX idx_people_birth_year ON people(birth_year);
CREATE INDEX idx_people_dna_group ON people(dna_group);

-- ============================================
-- FAMILY RELATIONSHIPS
-- ============================================

CREATE TABLE family_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id TEXT NOT NULL REFERENCES people(id),
    related_person_id TEXT NOT NULL REFERENCES people(id),
    relationship_type TEXT NOT NULL CHECK (relationship_type IN (
        'father', 'mother', 'spouse', 'child', 'sibling',
        'stepfather', 'stepmother', 'stepchild', 'half_sibling',
        'guardian', 'ward'
    )),
    relationship_status TEXT CHECK (relationship_status IN (
        'confirmed', 'probable', 'possible', 'speculative'
    )),
    competing_theory BOOLEAN DEFAULT FALSE, -- True if multiple candidates
    evidence TEXT,
    
    -- For spouse relationships
    marriage_date TEXT,
    marriage_place TEXT,
    marriage_end_date TEXT,
    marriage_end_type TEXT CHECK (marriage_end_type IN ('death', 'divorce', 'annulment', 'unknown')),
    
    notes TEXT,
    source_id UUID REFERENCES sources(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate relationships
    UNIQUE(person_id, related_person_id, relationship_type)
);

-- Indexes
CREATE INDEX idx_family_rel_person ON family_relationships(person_id);
CREATE INDEX idx_family_rel_related ON family_relationships(related_person_id);
CREATE INDEX idx_family_rel_type ON family_relationships(relationship_type);

-- ============================================
-- ASSOCIATIONS (non-family connections)
-- ============================================

CREATE TABLE associations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id TEXT NOT NULL REFERENCES people(id),
    associated_person_id TEXT NOT NULL REFERENCES people(id),
    association_type TEXT NOT NULL, -- neighbor, witness, adjacent_landowner, business_partner, transported_by, guardian, executor, etc.
    date TEXT,
    location TEXT,
    context TEXT, -- "witnessed deed for 400 acres"
    notes TEXT,
    source_id UUID REFERENCES sources(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_assoc_person ON associations(person_id);
CREATE INDEX idx_assoc_associated ON associations(associated_person_id);
CREATE INDEX idx_assoc_type ON associations(association_type);

-- ============================================
-- DOCUMENTS
-- ============================================

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type TEXT NOT NULL, -- land_patent, deed, will, tax_list, court_record, marriage_record, church_record, inventory, etc.
    date TEXT,
    date_normalized DATE, -- For sorting/querying
    county TEXT,
    state TEXT DEFAULT 'Virginia',
    title TEXT,
    description TEXT,
    transcription TEXT, -- Full text if available
    url TEXT,
    file_path TEXT, -- If we have actual doc stored
    source_citation TEXT, -- "CPv1", "Henrico Deed Book 3, p. 45"
    acres INTEGER, -- For land records
    location_description TEXT, -- "S side main br of Tuckahoe Cr adj Wm Burton"
    notes TEXT,
    source_id UUID REFERENCES sources(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_date ON documents(date_normalized);
CREATE INDEX idx_documents_county ON documents(county);

-- ============================================
-- DOCUMENT_PEOPLE (junction table)
-- ============================================

CREATE TABLE document_people (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id),
    person_id TEXT NOT NULL REFERENCES people(id),
    role TEXT NOT NULL, -- patentee, grantor, grantee, witness, adjacent_landowner, transported, mentioned, executor, heir, boundary_neighbor, etc.
    acres INTEGER, -- If this person received specific acreage
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate entries
    UNIQUE(document_id, person_id, role)
);

-- Indexes
CREATE INDEX idx_doc_people_document ON document_people(document_id);
CREATE INDEX idx_doc_people_person ON document_people(person_id);
CREATE INDEX idx_doc_people_role ON document_people(role);

-- ============================================
-- MILITARY SERVICE
-- ============================================

CREATE TABLE military_service (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id TEXT NOT NULL REFERENCES people(id),
    war_conflict TEXT, -- French & Indian War, Revolutionary War, War of 1812, etc.
    branch TEXT, -- Militia, Continental Army, etc.
    rank TEXT,
    unit TEXT,
    service_start TEXT,
    service_end TEXT,
    battles TEXT, -- Comma-separated or free text
    pension_info TEXT,
    notes TEXT,
    source_id UUID REFERENCES sources(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_military_person ON military_service(person_id);
CREATE INDEX idx_military_war ON military_service(war_conflict);

-- ============================================
-- MIGRATIONS (location timeline)
-- ============================================

CREATE TABLE migrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id TEXT NOT NULL REFERENCES people(id),
    location_code TEXT NOT NULL, -- HEN, GOO, AUG, etc.
    location_detail TEXT, -- "Tuckahoe Creek", "Archer's Hope"
    date_arrived TEXT,
    date_departed TEXT,
    date_type CHAR(1) CHECK (date_type IN ('b', 'e')), -- b=known, e=estimated
    reason TEXT, -- land grant, marriage, family migration, etc.
    sequence INTEGER, -- 1, 2, 3... to order the moves
    notes TEXT,
    source_id UUID REFERENCES sources(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_migrations_person ON migrations(person_id);
CREATE INDEX idx_migrations_location ON migrations(location_code);
CREATE INDEX idx_migrations_sequence ON migrations(person_id, sequence);

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON people
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_relationships_updated_at BEFORE UPDATE ON family_relationships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_associations_updated_at BEFORE UPDATE ON associations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_military_service_updated_at BEFORE UPDATE ON military_service
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_migrations_updated_at BEFORE UPDATE ON migrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- USEFUL VIEWS
-- ============================================

-- View: People with basic info formatted nicely
CREATE VIEW people_summary AS
SELECT 
    id,
    COALESCE(title || ' ', '') || COALESCE(given_name, '') || ' ' || surname || COALESCE(' ' || suffix, '') AS full_name,
    designation,
    birth_year_type || CAST(birth_year AS TEXT) AS birth,
    birthplace_code,
    death_year,
    death_place_code,
    dna_group,
    confidence
FROM people;

-- View: Family tree connections
CREATE VIEW family_tree AS
SELECT 
    p1.id AS person_id,
    p1.given_name || ' ' || p1.surname AS person_name,
    fr.relationship_type,
    fr.relationship_status,
    p2.id AS related_id,
    p2.given_name || ' ' || p2.surname AS related_name,
    fr.competing_theory,
    fr.evidence
FROM family_relationships fr
JOIN people p1 ON fr.person_id = p1.id
JOIN people p2 ON fr.related_person_id = p2.id;

-- View: Document participants
CREATE VIEW document_participants AS
SELECT 
    d.id AS document_id,
    d.document_type,
    d.date,
    d.county,
    d.title,
    dp.role,
    p.id AS person_id,
    p.given_name || ' ' || p.surname AS person_name,
    dp.acres
FROM documents d
JOIN document_people dp ON d.id = dp.document_id
JOIN people p ON dp.person_id = p.id;
