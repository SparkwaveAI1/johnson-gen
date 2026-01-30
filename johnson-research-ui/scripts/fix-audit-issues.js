/**
 * FIX AUDIT ISSUES
 *
 * Repairs missing data found by audit:
 * 1. Creates missing locations
 * 2. Creates missing location_residents
 * 3. Creates missing inverse relationships
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://oxpkqnmuwqcnmzvavsuz.supabase.co',
  'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
)

const timestamp = () => new Date().toISOString().replace('T', ' ').substring(0, 19)

// ============================================================================
// PHASE 1: CREATE MISSING LOCATIONS
// ============================================================================

const MISSING_LOCATIONS = [
  {
    name: "Ballagilley Farm, Maughold",
    slug: "ballagilley-farm-maughold",
    location_type: "plantation", // farm
    description: "Farm in Maughold parish, Isle of Man. Birthplace of Robert Looney Sr. (1692).",
    verification_status: "confirmed"
  },
  {
    name: "Holston River area",
    slug: "holston-river-area",
    location_type: "region",
    description: "Region along the Holston River, southwestern Virginia/northeastern Tennessee frontier.",
    verification_status: "probable",
    latitude: 36.5,
    longitude: -82.5
  },
  {
    name: "Sinking Creek",
    slug: "sinking-creek-hawkins",
    location_type: "creek",
    description: "Creek in Hawkins County, Tennessee. Stanley Valley area where Looney family settled.",
    verification_status: "probable",
    latitude: 36.4,
    longitude: -83.0
  }
]

async function phase1_CreateLocations() {
  console.log(`[${timestamp()}] === PHASE 1: CREATE MISSING LOCATIONS ===`)

  let created = 0
  for (const loc of MISSING_LOCATIONS) {
    // Check if exists
    const { data: existing } = await supabase
      .from('locations')
      .select('id')
      .eq('slug', loc.slug)
      .single()

    if (existing) {
      console.log(`[${timestamp()}] SKIP: ${loc.name} (already exists)`)
      continue
    }

    const { error } = await supabase.from('locations').insert(loc)

    if (error) {
      console.log(`[${timestamp()}] ERROR: ${loc.name} - ${error.message}`)
    } else {
      console.log(`[${timestamp()}] CREATED: location "${loc.name}"`)
      created++
    }
  }

  console.log(`[${timestamp()}] Phase 1 complete: ${created} locations created`)
  return created
}

// ============================================================================
// PHASE 2: CREATE MISSING LOCATION_RESIDENTS
// ============================================================================

async function findLocationId(name) {
  // Try exact match first
  let { data } = await supabase
    .from('locations')
    .select('id')
    .ilike('name', name)
    .limit(1)

  if (data && data.length > 0) return data[0].id

  // Try partial match
  const { data: partial } = await supabase
    .from('locations')
    .select('id, name')
    .ilike('name', `%${name.split(',')[0]}%`)
    .limit(1)

  if (partial && partial.length > 0) return partial[0].id

  return null
}

const MISSING_LOCATION_RESIDENTS = [
  {
    person_id: "LNEY-IOM-b1692-01",
    location_name: "Ballagilley Farm, Maughold",
    date_first: "1692",
    date_last: "1715",
    residence_type: "resident",
    evidence: "Born 1692 at Ballagilley Farm, Maughold, Isle of Man. Married Elizabeth Stover 1715."
  },
  {
    person_id: "RNFR-VA-e1707-01",
    location_name: "Holston River area",
    date_first: "1777",
    date_last: "1782",
    residence_type: "resident",
    evidence: "Moved to Holston River area frontier by 1777."
  },
  {
    person_id: "RNFR-VA-b1736-01",
    location_name: "Holston River area",
    date_first: "1777",
    date_last: null,
    residence_type: "resident",
    evidence: "Settled in Holston River area with father Stephen Renfro Sr."
  },
  {
    person_id: "LNEY-VA-b1756-01",
    location_name: "Big Creek (Hawkins)",
    date_first: "1777",
    date_last: "1779",
    residence_type: "resident",
    evidence: "Signed 1777 petition for Hawkins County courthouse. Killed by Cherokees c.1779."
  },
  {
    person_id: "JNSN-VA-e1745-01",
    location_name: "Big Creek (Hawkins)",
    date_first: "1768",
    date_last: "1830",
    residence_type: "resident",
    evidence: "Married Benjamin Looney c.1768. Remained on Big Creek after his death. Died c.1830."
  },
  {
    person_id: "JNSN-VA-e1740-01",
    location_name: "Big Creek (Hawkins)",
    date_first: "1779",
    date_last: "1793",
    residence_type: "resident",
    evidence: "Guardian of Benjamin Looney's orphans. Documented on Big Creek 1779-1793."
  },
  {
    person_id: "LNEY-TN-b1775-01",
    location_name: "Sinking Creek",
    date_first: "1775",
    date_last: null,
    residence_type: "resident",
    evidence: "Boyhood spent in Stanley Valley on Sinking Creek, Possum Creek, and Big Creek."
  },
  {
    person_id: "LNEY-TN-b1775-01",
    location_name: "Big Creek (Hawkins)",
    date_first: "1775",
    date_last: null,
    residence_type: "resident",
    evidence: "Boyhood spent in Stanley Valley on Big Creek area."
  },
  {
    person_id: "LNEY-VA-b1729-01",
    location_name: "Augusta County",
    date_first: "1750",
    date_last: "1770",
    residence_type: "resident",
    evidence: "Married Eleanor Margaret Moore 1750 in Augusta County. Resided there until 1770."
  },
  {
    person_id: "LNEY-VA-b1729-01",
    location_name: "Botetourt County",
    date_first: "1770",
    date_last: "1796",
    residence_type: "resident",
    evidence: "Moved to Botetourt County when formed 1770. Died 1796. Will proved there."
  }
]

async function phase2_CreateLocationResidents() {
  console.log(`\n[${timestamp()}] === PHASE 2: CREATE MISSING LOCATION_RESIDENTS ===`)

  let created = 0
  let errors = 0

  for (const lr of MISSING_LOCATION_RESIDENTS) {
    const locationId = await findLocationId(lr.location_name)

    if (!locationId) {
      console.log(`[${timestamp()}] ERROR: Location not found: ${lr.location_name}`)
      errors++
      continue
    }

    // Check if already exists
    const { data: existing } = await supabase
      .from('location_residents')
      .select('id')
      .eq('person_id', lr.person_id)
      .eq('location_id', locationId)
      .limit(1)

    if (existing && existing.length > 0) {
      console.log(`[${timestamp()}] SKIP: ${lr.person_id} @ ${lr.location_name} (exists)`)
      continue
    }

    const { error } = await supabase.from('location_residents').insert({
      person_id: lr.person_id,
      location_id: locationId,
      date_first: lr.date_first,
      date_last: lr.date_last,
      residence_type: lr.residence_type,
      evidence: lr.evidence
    })

    if (error) {
      console.log(`[${timestamp()}] ERROR: ${lr.person_id} @ ${lr.location_name} - ${error.message}`)
      errors++
    } else {
      console.log(`[${timestamp()}] CREATED: ${lr.person_id} @ ${lr.location_name}, ${lr.date_first}-${lr.date_last || 'present'}`)
      created++
    }
  }

  console.log(`[${timestamp()}] Phase 2 complete: ${created} location_residents created, ${errors} errors`)
  return created
}

// ============================================================================
// PHASE 3: FIX ORPHANED RELATIONSHIPS
// ============================================================================

const MISSING_INVERSE_RELATIONSHIPS = [
  {
    person_id: "LNEY-VA-e1730-01",  // Samuel
    related_person_id: "LNEY-VA-e1725-02",  // Robert Jr.
    relationship_type: "sibling",
    evidence: "Brothers - both sons of Robert Looney Sr."
  },
  {
    person_id: "LNEY-VA-e1735-01",  // David
    related_person_id: "LNEY-VA-e1725-02",  // Robert Jr.
    relationship_type: "sibling",
    evidence: "Brothers - both sons of Robert Looney Sr."
  },
  {
    person_id: "LNEY-VA-e1735-01",  // David
    related_person_id: "LNEY-VA-e1730-01",  // Samuel
    relationship_type: "sibling",
    evidence: "Brothers - both sons of Robert Looney Sr."
  }
]

async function phase3_FixRelationships() {
  console.log(`\n[${timestamp()}] === PHASE 3: FIX ORPHANED RELATIONSHIPS ===`)

  let created = 0

  for (const rel of MISSING_INVERSE_RELATIONSHIPS) {
    // Check if exists
    const { data: existing } = await supabase
      .from('family_relationships')
      .select('id')
      .eq('person_id', rel.person_id)
      .eq('related_person_id', rel.related_person_id)
      .eq('relationship_type', rel.relationship_type)
      .limit(1)

    if (existing && existing.length > 0) {
      console.log(`[${timestamp()}] SKIP: ${rel.person_id} [${rel.relationship_type}] ${rel.related_person_id} (exists)`)
      continue
    }

    const { error } = await supabase.from('family_relationships').insert({
      person_id: rel.person_id,
      related_person_id: rel.related_person_id,
      relationship_type: rel.relationship_type,
      relationship_status: 'confirmed',
      evidence: rel.evidence
    })

    if (error) {
      console.log(`[${timestamp()}] ERROR: ${rel.person_id} [${rel.relationship_type}] ${rel.related_person_id} - ${error.message}`)
    } else {
      console.log(`[${timestamp()}] CREATED: ${rel.person_id} [${rel.relationship_type}] ${rel.related_person_id}`)
      created++
    }
  }

  console.log(`[${timestamp()}] Phase 3 complete: ${created} relationships created`)
  return created
}

// ============================================================================
// VERIFICATION
// ============================================================================

async function verify() {
  console.log(`\n[${timestamp()}] === VERIFICATION ===`)

  // Check location_residents count
  const { data: lrData } = await supabase
    .from('location_residents')
    .select('id', { count: 'exact', head: true })

  // Check for orphaned relationships
  const { data: rels } = await supabase
    .from('family_relationships')
    .select('person_id, related_person_id, relationship_type')

  const relSet = new Set(rels.map(r => `${r.person_id}|${r.related_person_id}|${r.relationship_type}`))

  let orphaned = 0
  for (const r of rels) {
    if (r.relationship_type === 'sibling') {
      if (!relSet.has(`${r.related_person_id}|${r.person_id}|sibling`)) {
        orphaned++
      }
    }
  }

  console.log(`[${timestamp()}] Location residents in DB: ${lrData?.length || 'unknown'}`)
  console.log(`[${timestamp()}] Orphaned sibling relationships: ${orphaned}`)

  return orphaned === 0
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log(`[${timestamp()}] START: Fix Audit Issues`)
  console.log('=' .repeat(60))

  const locationsCreated = await phase1_CreateLocations()
  const residentsCreated = await phase2_CreateLocationResidents()
  const relsCreated = await phase3_FixRelationships()

  const verified = await verify()

  console.log('\n' + '='.repeat(60))
  console.log(`[${timestamp()}] SUMMARY`)
  console.log('='.repeat(60))
  console.log(`Locations created: ${locationsCreated}`)
  console.log(`Location_residents created: ${residentsCreated}`)
  console.log(`Relationships created: ${relsCreated}`)
  console.log(`Verification: ${verified ? '✓ PASS' : '✗ ISSUES REMAIN'}`)
}

main().catch(console.error)
