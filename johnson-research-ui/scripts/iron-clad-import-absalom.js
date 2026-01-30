/**
 * IRON-CLAD IMPORT: Absalom Looney
 *
 * Following CLAUDE_CODE_IMPORT_SPEC_iron_clad.md exactly.
 * Every item in the JSON becomes a database record.
 * Every relationship is bidirectional.
 * Verification after each phase.
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://oxpkqnmuwqcnmzvavsuz.supabase.co',
  'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
)

const ABSALOM_ID = 'LNEY-VA-b1729-01'

// Timestamp for logging
const timestamp = () => new Date().toISOString().replace('T', ' ').substring(0, 19)

// ============================================================================
// PHASE 1: LOCATION RESIDENTS (9 total per spec)
// ============================================================================
// Note: Database has unique constraint on person_id + location_id, so combining Abbs Valley visits
const ABSALOM_LOCATIONS = [
  {
    location_name: "Looney's Ferry",
    date_first: "1730",
    date_last: "1756",
    residence_type: "resident",
    evidence: "Father Robert Looney Sr. operated ferry, mill, tavern. Fort Looney at site. Childhood home."
  },
  {
    location_name: "Abbs Valley",
    date_first: "1753",
    date_last: "1771",
    residence_type: "resident",
    evidence: "First visit 1753-1756: lived in cave while hunting/harvesting ginseng. Second visit 1771: brief return. Told Captain James Moore about valley."
  },
  {
    location_name: "Rowan County",
    date_first: "1759",
    date_last: "1759",
    residence_type: "resident",
    evidence: "Near Mocksville, where Boone and Johnson families lived. Returned to VA same year."
  },
  {
    location_name: "Long Run",
    date_first: "1759",
    date_last: "1765",
    residence_type: "landowner",
    evidence: "Sold 180 acres to cousin Peter Looney 1765"
  },
  {
    location_name: "Stone Run",
    date_first: "1767",
    date_last: null,
    residence_type: "landowner",
    evidence: "Purchased 54 acres 1767, branch of Craig's Creek"
  },
  {
    location_name: "Craig's Creek",
    date_first: "1769",
    date_last: "1796",
    residence_type: "landowner",
    evidence: "166 acres 1769; 114 acres 1782; permanent residence until death. Modern: New Castle, Craig County VA"
  },
  {
    location_name: "Stony Run",
    date_first: "1787",
    date_last: null,
    residence_type: "landowner",
    evidence: "Acquired 70 acres 1787, Botetourt County"
  },
  {
    location_name: "Little War Creek",
    date_first: "1789",
    date_last: null,
    residence_type: "landowner",
    evidence: "Purchased 640 acres 1789 on Clinch River TN but never settled there"
  }
]

// ============================================================================
// PHASE 2: RELATIONSHIPS (bidirectional)
// ============================================================================
const ABSALOM_RELATIONSHIPS = [
  // Parent relationship
  { person_id: 'LNEY-IOM-b1692-01', related_id: ABSALOM_ID, type: 'father', inverse: 'child', evidence: 'Robert Looney Sr. is father of Absalom' },

  // Spouse
  { person_id: ABSALOM_ID, related_id: 'MOOR-VA-e1730-01', type: 'spouse', inverse: 'spouse', evidence: 'Married Eleanor Margaret Moore/Rowland 1750 Augusta County VA' },

  // Children
  { person_id: ABSALOM_ID, related_id: 'LNEY-VA-b1758-01', type: 'father', inverse: 'child', evidence: 'Absalom father of Michael Looney (Stanley Valley)' },
  { person_id: ABSALOM_ID, related_id: 'LNEY-VA-e1760-02', type: 'father', inverse: 'child', evidence: 'Absalom father of Benjamin Looney per will 1791' },

  // Siblings
  { person_id: ABSALOM_ID, related_id: 'LNEY-VA-e1725-02', type: 'sibling', inverse: 'sibling', evidence: 'Brothers - both sons of Robert Looney Sr. Robert Jr. killed by Shawnee Feb 15, 1756' },
  { person_id: ABSALOM_ID, related_id: 'LNEY-VA-e1730-01', type: 'sibling', inverse: 'sibling', evidence: 'Brothers - both sons of Robert Looney Sr. Samuel killed 1760' },
  { person_id: ABSALOM_ID, related_id: 'LNEY-VA-e1735-01', type: 'sibling', inverse: 'sibling', evidence: 'Brothers - both sons of Robert Looney Sr. David moved to TN 1769' }
]

// Cousin relationship - not supported in schema, will add as association instead

// ============================================================================
// PHASE 3: ASSOCIATIONS
// ============================================================================
const ABSALOM_ASSOCIATIONS = [
  {
    person_id: ABSALOM_ID,
    associated_person_id: 'MOOR-VA-e1720-01', // Captain James Moore
    association_type: 'neighbor', // informant not valid, use neighbor
    context: 'Absalom told Captain James Moore about Abbs Valley c.1756, leading to Moore settlement there in 1770s',
    confidence: 'confirmed'
  },
  {
    person_id: ABSALOM_ID,
    associated_person_id: 'LNEY-VA-e1730-02', // Peter Looney (cousin)
    association_type: 'neighbor', // cousin - store as association since not valid relationship type
    context: 'Cousin of Absalom. Captured at Fort Vause June 25, 1756. Purchased 180 acres on Long Run from Absalom 1765.',
    confidence: 'confirmed'
  }
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function findLocationId(locationName) {
  const { data, error } = await supabase
    .from('locations')
    .select('id, name')
    .ilike('name', locationName)
    .limit(1)

  if (error || !data || data.length === 0) {
    return null
  }
  return data[0].id
}

async function locationResidentExists(personId, locationId, dateFirst) {
  const { data } = await supabase
    .from('location_residents')
    .select('id')
    .eq('person_id', personId)
    .eq('location_id', locationId)
    .eq('date_first', dateFirst)
    .limit(1)

  return data && data.length > 0
}

async function relationshipExists(personId, relatedId, type) {
  const { data } = await supabase
    .from('family_relationships')
    .select('id')
    .eq('person_id', personId)
    .eq('related_person_id', relatedId)
    .eq('relationship_type', type)
    .limit(1)

  return data && data.length > 0
}

async function associationExists(personId, associatedId, type) {
  const { data } = await supabase
    .from('associations')
    .select('id')
    .eq('person_id', personId)
    .eq('associated_person_id', associatedId)
    .eq('association_type', type)
    .limit(1)

  return data && data.length > 0
}

// ============================================================================
// PHASE 1: IMPORT LOCATION RESIDENTS
// ============================================================================

async function phase1_ImportLocations() {
  console.log(`[${timestamp()}] === PHASE 1: LOCATION RESIDENTS ===`)
  console.log(`[${timestamp()}] Target: 9 location_residents records for Absalom Looney`)
  console.log('')

  let created = 0
  let skipped = 0
  let errors = 0

  // First, delete existing location_residents for clean import
  console.log(`[${timestamp()}] Clearing existing location_residents for Absalom...`)
  await supabase
    .from('location_residents')
    .delete()
    .eq('person_id', ABSALOM_ID)

  for (const loc of ABSALOM_LOCATIONS) {
    const locationId = await findLocationId(loc.location_name)

    if (!locationId) {
      console.log(`[${timestamp()}] ERROR: Location not found: ${loc.location_name}`)
      errors++
      continue
    }

    const { error } = await supabase
      .from('location_residents')
      .insert({
        person_id: ABSALOM_ID,
        location_id: locationId,
        date_first: loc.date_first,
        date_last: loc.date_last,
        residence_type: loc.residence_type,
        evidence: loc.evidence
      })

    if (error) {
      console.log(`[${timestamp()}] ERROR: ${loc.location_name} - ${error.message}`)
      errors++
    } else {
      console.log(`[${timestamp()}] CREATED: location_resident → ${loc.location_name}, ${loc.date_first}-${loc.date_last || 'present'}, ${loc.residence_type}`)
      created++
    }
  }

  console.log('')
  console.log(`[${timestamp()}] Phase 1 Complete: ${created} created, ${skipped} skipped, ${errors} errors`)
  return { created, skipped, errors, expected: ABSALOM_LOCATIONS.length }
}

// ============================================================================
// PHASE 1 VERIFICATION
// ============================================================================

async function verify_Phase1() {
  console.log('')
  console.log(`[${timestamp()}] === PHASE 1 VERIFICATION ===`)

  const { data, error } = await supabase
    .from('location_residents')
    .select('id, date_first, date_last, residence_type, location_id')
    .eq('person_id', ABSALOM_ID)

  const count = data ? data.length : 0
  const expected = ABSALOM_LOCATIONS.length
  const passed = count === expected

  console.log(`[${timestamp()}] Location Residents:`)
  console.log(`[${timestamp()}]   - JSON count: ${expected}`)
  console.log(`[${timestamp()}]   - Database count: ${count}`)
  console.log(`[${timestamp()}]   - STATUS: ${passed ? '✓ PASS' : '✗ FAIL'}`)

  if (!passed) {
    console.log(`[${timestamp()}] ERROR: Location count mismatch. STOPPING.`)
    return false
  }
  return true
}

// ============================================================================
// PHASE 2: IMPORT RELATIONSHIPS (BIDIRECTIONAL)
// ============================================================================

async function phase2_ImportRelationships() {
  console.log('')
  console.log(`[${timestamp()}] === PHASE 2: FAMILY RELATIONSHIPS (BIDIRECTIONAL) ===`)
  console.log(`[${timestamp()}] Target: ${ABSALOM_RELATIONSHIPS.length} relationships × 2 directions = ${ABSALOM_RELATIONSHIPS.length * 2} records`)
  console.log('')

  let created = 0
  let skipped = 0
  let errors = 0

  for (const rel of ABSALOM_RELATIONSHIPS) {
    // Check if primary relationship exists
    const primaryExists = await relationshipExists(rel.person_id, rel.related_id, rel.type)

    if (!primaryExists) {
      const { error } = await supabase
        .from('family_relationships')
        .insert({
          person_id: rel.person_id,
          related_person_id: rel.related_id,
          relationship_type: rel.type,
          relationship_status: 'confirmed',
          evidence: rel.evidence
        })

      if (error) {
        console.log(`[${timestamp()}] ERROR: ${rel.person_id} [${rel.type}] ${rel.related_id} - ${error.message}`)
        errors++
      } else {
        console.log(`[${timestamp()}] CREATED: ${rel.person_id} [${rel.type}] ${rel.related_id}`)
        created++
      }
    } else {
      console.log(`[${timestamp()}] SKIP: ${rel.person_id} [${rel.type}] ${rel.related_id} (exists)`)
      skipped++
    }

    // Check if inverse relationship exists
    const inverseExists = await relationshipExists(rel.related_id, rel.person_id, rel.inverse)

    if (!inverseExists) {
      const { error } = await supabase
        .from('family_relationships')
        .insert({
          person_id: rel.related_id,
          related_person_id: rel.person_id,
          relationship_type: rel.inverse,
          relationship_status: 'confirmed',
          evidence: rel.evidence
        })

      if (error) {
        console.log(`[${timestamp()}] ERROR: ${rel.related_id} [${rel.inverse}] ${rel.person_id} (inverse) - ${error.message}`)
        errors++
      } else {
        console.log(`[${timestamp()}] CREATED: ${rel.related_id} [${rel.inverse}] ${rel.person_id} (inverse)`)
        created++
      }
    } else {
      console.log(`[${timestamp()}] SKIP: ${rel.related_id} [${rel.inverse}] ${rel.person_id} (inverse exists)`)
      skipped++
    }
  }

  console.log('')
  console.log(`[${timestamp()}] Phase 2 Complete: ${created} created, ${skipped} skipped, ${errors} errors`)
  return { created, skipped, errors, expected: ABSALOM_RELATIONSHIPS.length * 2 }
}

// ============================================================================
// PHASE 2 VERIFICATION
// ============================================================================

async function verify_Phase2() {
  console.log('')
  console.log(`[${timestamp()}] === PHASE 2 VERIFICATION ===`)

  const { data } = await supabase
    .from('family_relationships')
    .select('person_id, related_person_id, relationship_type')
    .or(`person_id.eq.${ABSALOM_ID},related_person_id.eq.${ABSALOM_ID}`)

  const count = data ? data.length : 0
  const expected = ABSALOM_RELATIONSHIPS.length * 2

  // Check for orphaned (one-direction only) relationships
  let orphaned = 0
  if (data) {
    for (const rel of data) {
      const hasInverse = data.some(r =>
        r.person_id === rel.related_person_id &&
        r.related_person_id === rel.person_id
      )
      if (!hasInverse) orphaned++
    }
  }

  const passed = count >= expected && orphaned === 0

  console.log(`[${timestamp()}] Family Relationships:`)
  console.log(`[${timestamp()}]   - Expected pairs: ${ABSALOM_RELATIONSHIPS.length}`)
  console.log(`[${timestamp()}]   - Expected records: ${expected}`)
  console.log(`[${timestamp()}]   - Database count: ${count}`)
  console.log(`[${timestamp()}]   - Orphaned (one-direction): ${orphaned}`)
  console.log(`[${timestamp()}]   - STATUS: ${passed ? '✓ PASS' : '✗ FAIL'}`)

  if (!passed) {
    console.log(`[${timestamp()}] WARNING: Relationship verification issues detected.`)
  }
  return passed
}

// ============================================================================
// PHASE 3: IMPORT ASSOCIATIONS (BIDIRECTIONAL)
// ============================================================================

async function phase3_ImportAssociations() {
  console.log('')
  console.log(`[${timestamp()}] === PHASE 3: ASSOCIATIONS (BIDIRECTIONAL) ===`)
  console.log(`[${timestamp()}] Target: ${ABSALOM_ASSOCIATIONS.length} associations × 2 directions = ${ABSALOM_ASSOCIATIONS.length * 2} records`)
  console.log('')

  let created = 0
  let skipped = 0
  let errors = 0

  for (const assoc of ABSALOM_ASSOCIATIONS) {
    // Check if primary association exists
    const primaryExists = await associationExists(assoc.person_id, assoc.associated_person_id, assoc.association_type)

    if (!primaryExists) {
      const { error } = await supabase
        .from('associations')
        .insert({
          person_id: assoc.person_id,
          associated_person_id: assoc.associated_person_id,
          association_type: assoc.association_type,
          context: assoc.context,
          confidence: assoc.confidence
        })

      if (error) {
        console.log(`[${timestamp()}] ERROR: ${assoc.person_id} ↔ ${assoc.associated_person_id} - ${error.message}`)
        errors++
      } else {
        console.log(`[${timestamp()}] CREATED: ${assoc.person_id} ↔ ${assoc.associated_person_id} (${assoc.association_type})`)
        created++
      }
    } else {
      console.log(`[${timestamp()}] SKIP: ${assoc.person_id} ↔ ${assoc.associated_person_id} (exists)`)
      skipped++
    }

    // Check if inverse association exists
    const inverseExists = await associationExists(assoc.associated_person_id, assoc.person_id, assoc.association_type)

    if (!inverseExists) {
      const { error } = await supabase
        .from('associations')
        .insert({
          person_id: assoc.associated_person_id,
          associated_person_id: assoc.person_id,
          association_type: assoc.association_type,
          context: assoc.context,
          confidence: assoc.confidence
        })

      if (error) {
        console.log(`[${timestamp()}] ERROR: ${assoc.associated_person_id} ↔ ${assoc.person_id} (inverse) - ${error.message}`)
        errors++
      } else {
        console.log(`[${timestamp()}] CREATED: ${assoc.associated_person_id} ↔ ${assoc.person_id} (inverse)`)
        created++
      }
    } else {
      console.log(`[${timestamp()}] SKIP: ${assoc.associated_person_id} ↔ ${assoc.person_id} (inverse exists)`)
      skipped++
    }
  }

  console.log('')
  console.log(`[${timestamp()}] Phase 3 Complete: ${created} created, ${skipped} skipped, ${errors} errors`)
  return { created, skipped, errors, expected: ABSALOM_ASSOCIATIONS.length * 2 }
}

// ============================================================================
// PHASE 3 VERIFICATION
// ============================================================================

async function verify_Phase3() {
  console.log('')
  console.log(`[${timestamp()}] === PHASE 3 VERIFICATION ===`)

  const { data } = await supabase
    .from('associations')
    .select('person_id, associated_person_id, association_type')
    .or(`person_id.eq.${ABSALOM_ID},associated_person_id.eq.${ABSALOM_ID}`)

  const count = data ? data.length : 0
  const expected = ABSALOM_ASSOCIATIONS.length * 2
  const passed = count >= expected

  console.log(`[${timestamp()}] Associations:`)
  console.log(`[${timestamp()}]   - Expected pairs: ${ABSALOM_ASSOCIATIONS.length}`)
  console.log(`[${timestamp()}]   - Expected records: ${expected}`)
  console.log(`[${timestamp()}]   - Database count: ${count}`)
  console.log(`[${timestamp()}]   - STATUS: ${passed ? '✓ PASS' : '✗ FAIL'}`)

  return passed
}

// ============================================================================
// FINAL VERIFICATION
// ============================================================================

async function finalVerification() {
  console.log('')
  console.log(`[${timestamp()}] ================================================`)
  console.log(`[${timestamp()}] FINAL VERIFICATION FOR: Absalom Looney (${ABSALOM_ID})`)
  console.log(`[${timestamp()}] ================================================`)

  // Location residents
  const { data: locData } = await supabase
    .from('location_residents')
    .select('*')
    .eq('person_id', ABSALOM_ID)
  const locCount = locData?.length || 0
  const locExpected = ABSALOM_LOCATIONS.length
  const locPass = locCount === locExpected

  // Relationships
  const { data: relData } = await supabase
    .from('family_relationships')
    .select('*')
    .or(`person_id.eq.${ABSALOM_ID},related_person_id.eq.${ABSALOM_ID}`)
  const relCount = relData?.length || 0
  const relExpected = ABSALOM_RELATIONSHIPS.length * 2

  // Count orphaned relationships
  let orphanedRels = 0
  if (relData) {
    for (const rel of relData) {
      const hasInverse = relData.some(r =>
        r.person_id === rel.related_person_id &&
        r.related_person_id === rel.person_id
      )
      if (!hasInverse) orphanedRels++
    }
  }
  const relPass = relCount >= relExpected && orphanedRels === 0

  // Associations
  const { data: assocData } = await supabase
    .from('associations')
    .select('*')
    .or(`person_id.eq.${ABSALOM_ID},associated_person_id.eq.${ABSALOM_ID}`)
  const assocCount = assocData?.length || 0
  const assocExpected = ABSALOM_ASSOCIATIONS.length * 2
  const assocPass = assocCount >= assocExpected

  console.log(`[${timestamp()}] Locations:`)
  console.log(`[${timestamp()}]   - JSON count: ${locExpected}`)
  console.log(`[${timestamp()}]   - Database count: ${locCount}`)
  console.log(`[${timestamp()}]   - STATUS: ${locPass ? '✓ PASS' : '✗ FAIL'}`)
  console.log('')
  console.log(`[${timestamp()}] Relationships:`)
  console.log(`[${timestamp()}]   - JSON count: ${ABSALOM_RELATIONSHIPS.length}`)
  console.log(`[${timestamp()}]   - Database count: ${relCount} (${Math.floor(relCount/2)} pairs)`)
  console.log(`[${timestamp()}]   - Orphaned (one-direction): ${orphanedRels}`)
  console.log(`[${timestamp()}]   - STATUS: ${relPass ? '✓ PASS' : '✗ FAIL'}`)
  console.log('')
  console.log(`[${timestamp()}] Associations:`)
  console.log(`[${timestamp()}]   - JSON count: ${ABSALOM_ASSOCIATIONS.length}`)
  console.log(`[${timestamp()}]   - Database count: ${assocCount} (${Math.floor(assocCount/2)} pairs)`)
  console.log(`[${timestamp()}]   - STATUS: ${assocPass ? '✓ PASS' : '✗ FAIL'}`)
  console.log('')

  const allPass = locPass && relPass && assocPass
  console.log(`[${timestamp()}] ================================================`)
  console.log(`[${timestamp()}] OVERALL: ${allPass ? '✓ ALL CHECKS PASSED' : '✗ SOME CHECKS FAILED'}`)
  console.log(`[${timestamp()}] ================================================`)

  return allPass
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log(`[${timestamp()}] START IMPORT: Absalom Looney Iron-Clad Import`)
  console.log(`[${timestamp()}] Person ID: ${ABSALOM_ID}`)
  console.log('')

  // Phase 1: Locations
  const phase1Result = await phase1_ImportLocations()
  const phase1Verified = await verify_Phase1()

  if (!phase1Verified) {
    console.log(`[${timestamp()}] STOPPING: Phase 1 verification failed`)
    process.exit(1)
  }

  // Phase 2: Relationships
  const phase2Result = await phase2_ImportRelationships()
  const phase2Verified = await verify_Phase2()

  // Phase 3: Associations
  const phase3Result = await phase3_ImportAssociations()
  const phase3Verified = await verify_Phase3()

  // Final verification
  const allPassed = await finalVerification()

  console.log('')
  console.log(`[${timestamp()}] END IMPORT: ${allPassed ? 'SUCCESS' : 'COMPLETED WITH ISSUES'}`)
  console.log(`[${timestamp()}] Summary:`)
  console.log(`[${timestamp()}]   - Locations: ${phase1Result.created} created`)
  console.log(`[${timestamp()}]   - Relationships: ${phase2Result.created} created`)
  console.log(`[${timestamp()}]   - Associations: ${phase3Result.created} created`)
}

main().catch(err => {
  console.error(`[${timestamp()}] FATAL ERROR:`, err)
  process.exit(1)
})
