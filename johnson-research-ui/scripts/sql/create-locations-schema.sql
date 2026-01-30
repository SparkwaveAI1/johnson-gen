-- SQL to create the geographic framework tables
-- Run this in Supabase SQL Editor or via psql

-- ============================================
-- LOCATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identity
    name TEXT NOT NULL,
    name_variants TEXT[],                  -- ["Tuckahoe", "Tuckahoe Cr."]
    slug TEXT UNIQUE,                      -- For URLs

    -- Classification
    location_type TEXT CHECK (location_type IN (
        'creek',
        'river',
        'swamp',
        'plantation',
        'hundred',
        'parish',
        'county',
        'colony',
        'region'
    )),

    -- Hierarchy
    parent_location_id UUID REFERENCES locations(id),

    -- Geography
    latitude DECIMAL,
    longitude DECIMAL,
    coordinates_known BOOLEAN DEFAULT FALSE,
    coordinate_precision TEXT CHECK (coordinate_precision IN (
        'exact',
        'approximate',
        'general'
    )),

    -- Time context (for counties that formed/dissolved)
    date_formed TEXT,
    date_dissolved TEXT,
    formed_from TEXT,
    dissolved_into TEXT,
    border_notes TEXT,

    -- Description
    description TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_locations_type ON locations(location_type);
CREATE INDEX idx_locations_parent ON locations(parent_location_id);
CREATE INDEX idx_locations_slug ON locations(slug);

-- ============================================
-- LOCATION RESIDENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS location_residents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    person_id TEXT REFERENCES people(id) ON DELETE CASCADE,

    date_first TEXT,
    date_last TEXT,

    residence_type TEXT CHECK (residence_type IN (
        'landowner',
        'tenant',
        'resident',
        'adjacent',
        'documented'
    )),

    -- Coordinates for this specific person at this location
    latitude DECIMAL,
    longitude DECIMAL,
    coordinate_source TEXT,

    evidence TEXT,
    source_id UUID REFERENCES sources(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(location_id, person_id)
);

CREATE INDEX idx_location_residents_location ON location_residents(location_id);
CREATE INDEX idx_location_residents_person ON location_residents(person_id);

-- ============================================
-- DOCUMENT LOCATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS document_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,

    location_role TEXT CHECK (location_role IN (
        'subject',
        'recorded',
        'mentioned'
    )),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(document_id, location_id, location_role)
);

CREATE INDEX idx_document_locations_document ON document_locations(document_id);
CREATE INDEX idx_document_locations_location ON document_locations(location_id);

-- ============================================
-- ATTACHMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- What this is attached to (polymorphic)
    entity_type TEXT CHECK (entity_type IN ('person', 'family_group', 'location', 'document')),
    person_id TEXT REFERENCES people(id) ON DELETE CASCADE,
    family_group_id UUID,  -- Will add FK after family_groups table exists
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,

    -- File info
    filename TEXT NOT NULL,
    file_type TEXT,
    mime_type TEXT,
    file_size INTEGER,
    storage_path TEXT NOT NULL,

    -- Metadata
    title TEXT,
    description TEXT,
    date_taken TEXT,
    source TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attachments_person ON attachments(person_id) WHERE person_id IS NOT NULL;
CREATE INDEX idx_attachments_location ON attachments(location_id) WHERE location_id IS NOT NULL;
CREATE INDEX idx_attachments_document ON attachments(document_id) WHERE document_id IS NOT NULL;

-- ============================================
-- ADD BIO_STATUS TO PEOPLE TABLE
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'people' AND column_name = 'bio_status'
    ) THEN
        ALTER TABLE people ADD COLUMN bio_status TEXT CHECK (bio_status IN (
            'no_bio',
            'notes_only',
            'draft',
            'review',
            'final'
        )) DEFAULT 'no_bio';
    END IF;
END $$;

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PROXIMITY QUERY FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION find_nearby_residents(
    center_lat DECIMAL,
    center_lon DECIMAL,
    radius_miles DECIMAL,
    target_year INTEGER
) RETURNS TABLE (
    person_id TEXT,
    distance_miles DECIMAL,
    location_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        lr.person_id,
        (3959 * acos(
            cos(radians(center_lat)) * cos(radians(lr.latitude)) *
            cos(radians(lr.longitude) - radians(center_lon)) +
            sin(radians(center_lat)) * sin(radians(lr.latitude))
        ))::DECIMAL as distance_miles,
        l.name as location_name
    FROM location_residents lr
    JOIN locations l ON lr.location_id = l.id
    WHERE lr.latitude IS NOT NULL
      AND lr.longitude IS NOT NULL
      AND (lr.date_first IS NULL OR lr.date_first::INTEGER <= target_year)
      AND (lr.date_last IS NULL OR lr.date_last::INTEGER >= target_year)
      AND (3959 * acos(
            cos(radians(center_lat)) * cos(radians(lr.latitude)) *
            cos(radians(lr.longitude) - radians(center_lon)) +
            sin(radians(center_lat)) * sin(radians(lr.latitude))
        )) <= radius_miles
    ORDER BY distance_miles;
END;
$$ LANGUAGE plpgsql;
