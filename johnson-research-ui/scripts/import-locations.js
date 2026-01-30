/**
 * Import Script: Locations
 *
 * This script imports locations from a JSON file into the locations table.
 * It handles the parent-child hierarchy by importing in two passes.
 *
 * Usage:
 *   node scripts/import-locations.js <path-to-json-file>
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabaseUrl = 'https://oxpkqnmuwqcnmzvavsuz.supabase.co'
const supabaseKey = 'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
const supabase = createClient(supabaseUrl, supabaseKey)

// Get the file path from command line args
const filePath = process.argv[2]

if (!filePath) {
  console.error('Usage: node scripts/import-locations.js <path-to-json-file>')
  process.exit(1)
}

// Load the JSON file
let data
try {
  const fileContent = readFileSync(filePath, 'utf8')
  data = JSON.parse(fileContent)
} catch (err) {
  console.error('Error reading file:', err.message)
  process.exit(1)
}

const locations = data.locations || []

if (locations.length === 0) {
  console.log('No locations found in file.')
  process.exit(0)
}

async function importLocations() {
  console.log('========================================')
  console.log('IMPORTING LOCATIONS')
  console.log('========================================')
  console.log(`File: ${filePath}`)
  console.log(`Locations to import: ${locations.length}`)

  // Map to store slug -> id for parent lookups
  const slugToId = {}

  let addedCount = 0
  let skippedCount = 0
  let errorCount = 0

  // First pass: Insert all locations without parent references
  console.log('\n--- Pass 1: Creating locations ---')
  for (const loc of locations) {
    // Check if location already exists
    const { data: existing } = await supabase
      .from('locations')
      .select('id')
      .eq('slug', loc.slug)
      .single()

    if (existing) {
      console.log(`  - Exists: ${loc.name} (${loc.slug})`)
      slugToId[loc.slug] = existing.id
      skippedCount++
      continue
    }

    // Insert without parent_location_id first
    const locationData = {
      name: loc.name,
      slug: loc.slug,
      location_type: loc.location_type,
      name_variants: loc.name_variants || null,
      description: loc.description || null,
      date_formed: loc.date_formed || null,
      date_dissolved: loc.date_dissolved || null,
      formed_from: loc.formed_from || null,
      dissolved_into: loc.dissolved_into || null,
      border_notes: loc.border_notes || null,
      latitude: loc.latitude || null,
      longitude: loc.longitude || null,
      coordinates_known: loc.coordinates_known || false,
      coordinate_precision: loc.coordinate_precision || null
    }

    const { data: inserted, error } = await supabase
      .from('locations')
      .insert(locationData)
      .select('id')
      .single()

    if (error) {
      console.error(`  ERROR inserting ${loc.name}: ${error.message}`)
      errorCount++
    } else {
      console.log(`  + Added: ${loc.name} (${loc.location_type})`)
      slugToId[loc.slug] = inserted.id
      addedCount++
    }
  }

  // Second pass: Update parent references
  console.log('\n--- Pass 2: Setting parent relationships ---')
  for (const loc of locations) {
    if (!loc.parent_slug) continue

    const locationId = slugToId[loc.slug]
    const parentId = slugToId[loc.parent_slug]

    if (!locationId) {
      console.log(`  - Skipping ${loc.slug}: not found in database`)
      continue
    }

    if (!parentId) {
      console.log(`  - Warning: Parent ${loc.parent_slug} not found for ${loc.name}`)
      continue
    }

    const { error } = await supabase
      .from('locations')
      .update({ parent_location_id: parentId })
      .eq('id', locationId)

    if (error) {
      console.error(`  ERROR updating parent for ${loc.name}: ${error.message}`)
    } else {
      console.log(`  ~ ${loc.name} -> parent: ${loc.parent_slug}`)
    }
  }

  console.log('\n========================================')
  console.log('IMPORT COMPLETE')
  console.log('========================================')
  console.log(`  Added: ${addedCount}`)
  console.log(`  Skipped (existing): ${skippedCount}`)
  console.log(`  Errors: ${errorCount}`)
}

importLocations()
