/**
 * Import Script: Family Groups
 *
 * This script imports family groups from a JSON file into the database.
 *
 * Usage:
 *   node scripts/import-family-groups.js <path-to-json-file>
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabaseUrl = 'https://oxpkqnmuwqcnmzvavsuz.supabase.co'
const supabaseKey = 'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
const supabase = createClient(supabaseUrl, supabaseKey)

// Get the file path from command line args
const filePath = process.argv[2]

if (!filePath) {
  console.error('Usage: node scripts/import-family-groups.js <path-to-json-file>')
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

const groups = data.family_groups || []

if (groups.length === 0) {
  console.log('No family groups found in file.')
  process.exit(0)
}

async function importGroups() {
  console.log('========================================')
  console.log('IMPORTING FAMILY GROUPS')
  console.log('========================================')
  console.log(`File: ${filePath}`)
  console.log(`Groups to import: ${groups.length}`)

  let addedCount = 0
  let skippedCount = 0
  let errorCount = 0
  let membersAdded = 0

  for (const group of groups) {
    // Check if group already exists
    const { data: existing } = await supabase
      .from('family_groups')
      .select('id')
      .eq('slug', group.slug)
      .single()

    if (existing) {
      console.log(`  - Skipping (already exists): ${group.name}`)
      skippedCount++
      continue
    }

    // Look up location ID from slug
    let locationId = null
    if (group.primary_location_slug) {
      const { data: location } = await supabase
        .from('locations')
        .select('id')
        .eq('slug', group.primary_location_slug)
        .single()

      if (location) {
        locationId = location.id
      } else {
        console.log(`  - Warning: Location ${group.primary_location_slug} not found`)
      }
    }

    // Verify anchor person exists
    if (group.anchor_person_id) {
      const { data: person } = await supabase
        .from('people')
        .select('id')
        .eq('id', group.anchor_person_id)
        .single()

      if (!person) {
        console.log(`  - Warning: Anchor person ${group.anchor_person_id} not found`)
      }
    }

    // Insert the group
    const groupData = {
      name: group.name,
      slug: group.slug,
      group_type: group.group_type,
      anchor_person_id: group.anchor_person_id,
      primary_location_id: locationId,
      date_start: group.date_start || null,
      date_end: group.date_end || null,
      confidence: group.confidence || 'possible',
      status: group.status || 'draft',
      summary: group.summary || null,
      narrative: group.narrative || null,
      dna_group: group.dna_group || null,
      source_files: group.source_files || null
    }

    const { data: insertedGroup, error: groupError } = await supabase
      .from('family_groups')
      .insert(groupData)
      .select('id')
      .single()

    if (groupError) {
      console.error(`  ERROR inserting group ${group.name}: ${groupError.message}`)
      errorCount++
      continue
    }

    console.log(`  + Added group: ${group.name}`)
    addedCount++

    // Add members
    if (group.members && group.members.length > 0) {
      for (const member of group.members) {
        // Verify person exists
        const { data: person } = await supabase
          .from('people')
          .select('id')
          .eq('id', member.person_id)
          .single()

        if (!person) {
          console.log(`    - Skipping member ${member.person_id}: person not found`)
          continue
        }

        const memberData = {
          family_group_id: insertedGroup.id,
          person_id: member.person_id,
          role: member.role,
          generation: member.generation,
          notes: member.notes || null
        }

        const { error: memberError } = await supabase
          .from('family_group_members')
          .insert(memberData)

        if (memberError) {
          console.error(`    ERROR adding member ${member.person_id}: ${memberError.message}`)
        } else {
          console.log(`    + Added member: ${member.person_id} (${member.role})`)
          membersAdded++
        }
      }
    }
  }

  console.log('\n========================================')
  console.log('IMPORT COMPLETE')
  console.log('========================================')
  console.log(`  Groups added: ${addedCount}`)
  console.log(`  Groups skipped: ${skippedCount}`)
  console.log(`  Errors: ${errorCount}`)
  console.log(`  Members added: ${membersAdded}`)
}

importGroups()
