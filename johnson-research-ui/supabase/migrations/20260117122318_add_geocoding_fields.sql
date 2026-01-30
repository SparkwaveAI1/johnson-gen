-- Add geocoding fields to locations table
-- Run this in Supabase SQL Editor

-- Add modern_name field for when the current name differs from historical name
ALTER TABLE locations ADD COLUMN IF NOT EXISTS modern_name TEXT;

-- Add verification_status to track geocoding confidence
ALTER TABLE locations ADD COLUMN IF NOT EXISTS verification_status TEXT
    CHECK (verification_status IN ('confirmed', 'probable', 'possible'))
    DEFAULT 'possible';

-- Add verification_notes for recording how the location was verified
ALTER TABLE locations ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- Add GNIS ID for linking to USGS Geographic Names Information System
ALTER TABLE locations ADD COLUMN IF NOT EXISTS gnis_id TEXT;

-- Add index on verification_status for filtering
CREATE INDEX IF NOT EXISTS idx_locations_verification_status ON locations(verification_status);

-- Add index on gnis_id for lookups
CREATE INDEX IF NOT EXISTS idx_locations_gnis_id ON locations(gnis_id);
