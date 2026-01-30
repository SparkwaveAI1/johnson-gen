/**
 * FINAL AUDIT FIX
 *
 * Fixes the remaining 14 missing items from comprehensive audit:
 * - 6 relationships (father relationships)
 * - 2 associations (marked as "associated" in source files)
 * - 1 research question
 * - 5 location_residents
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://oxpkqnmuwqcnmzvavsuz.supabase.co',
  'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
)

const timestamp = () => new Date().toISOString().replace('T', ' ').substring(0, 19)

// ============================================================================
// PHASE 1: FIX MISSING RELATIONSHIPS
// ============================================================================

const MISSING_RELATIONSHIPS = [
  {
    person_id: 'WTSN-UNK-e1650-01',        // John Watson
    related_person_id: 'WTSN-UNK-e1675-01', // Sarah Watson
    relationship_type: 'father',
    inverse_type: 'child',
    evidence: 'John Watson is father of Sarah Watson'
  },
  {
    person_id: 'JNSN-UNK-e1673-01',        // Michael Johnson
    related_person_id: 'JNSN-HEN-e1695-01', // James Johnson
    relationship_type: 'father',
    inverse_type: 'child',
    evidence: 'Michael Johnson is father of James Johnson'
  },
  {
    person_id: 'JNSN-UNK-e1673-01',        // Michael Johnson
    related_person_id: 'JNSN-HEN-e1695-02', // John Johnson
    relationship_type: 'father',
    inverse_type: 'child',
    evidence: 'Michael Johnson is father of John Johnson'
  },
  {
    person_id: 'RNFR-ENG-e1614-01',        // Symon Renfro
    related_person_id: 'RNFR-VA-e1640-01', // Robert Renfro
    relationship_type: 'father',
    inverse_type: 'child',
    evidence: 'Symon Renfro is father of Robert Renfro'
  },
  {
    person_id: 'JNSN-TN-e1770-01',         // Hudson Johnson
    related_person_id: 'JNSN-TN-e1790-01', // John Johnston
    relationship_type: 'father',
    inverse_type: 'child',
    evidence: 'Hudson Johnson is father of John Johnston'
  },
  {
    person_id: 'LNEY-VA-b1758-01',         // Michael Looney
    related_person_id: 'LNEY-TN-b1790-01', // Absalom David Looney
    relationship_type: 'father',
    inverse_type: 'child',
    evidence: 'Michael Looney is father of Absalom David Looney'
  }
]

async function phase1_FixRelationships() {
  console.log(`[${timestamp()}] === PHASE 1: FIX MISSING RELATIONSHIPS ===`)

  let created = 0

  for (const rel of MISSING_RELATIONSHIPS) {
    // Check if relationship already exists
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

    // Create forward relationship
    const { error: fwdErr } = await supabase.from('family_relationships').insert({
      person_id: rel.person_id,
      related_person_id: rel.related_person_id,
      relationship_type: rel.relationship_type,
      relationship_status: 'confirmed',
      evidence: rel.evidence
    })

    if (fwdErr) {
      console.log(`[${timestamp()}] ERROR: ${rel.person_id} [${rel.relationship_type}] ${rel.related_person_id} - ${fwdErr.message}`)
      continue
    }

    console.log(`[${timestamp()}] CREATED: ${rel.person_id} [${rel.relationship_type}] ${rel.related_person_id}`)
    created++

    // Check if inverse exists
    const { data: invExisting } = await supabase
      .from('family_relationships')
      .select('id')
      .eq('person_id', rel.related_person_id)
      .eq('related_person_id', rel.person_id)
      .eq('relationship_type', rel.inverse_type)
      .limit(1)

    if (invExisting && invExisting.length > 0) {
      console.log(`[${timestamp()}] SKIP: Inverse already exists`)
      continue
    }

    // Create inverse relationship
    const { error: invErr } = await supabase.from('family_relationships').insert({
      person_id: rel.related_person_id,
      related_person_id: rel.person_id,
      relationship_type: rel.inverse_type,
      relationship_status: 'confirmed',
      evidence: rel.evidence + ' (inverse)'
    })

    if (invErr) {
      console.log(`[${timestamp()}] ERROR creating inverse: ${invErr.message}`)
    } else {
      console.log(`[${timestamp()}] CREATED inverse: ${rel.related_person_id} [${rel.inverse_type}] ${rel.person_id}`)
      created++
    }
  }

  console.log(`[${timestamp()}] Phase 1 complete: ${created} relationships created`)
  return created
}

// ============================================================================
// PHASE 2: FIX MISSING ASSOCIATIONS
// ============================================================================

const MISSING_ASSOCIATIONS = [
  {
    person_id: 'JNSN-VA-e1740-01',         // Walter Johnson
    associated_person_id: 'JNSN-VA-e1745-01', // Mary Johnson
    association_type: 'neighbor',
    evidence: 'Walter Johnson associated with Mary Johnson in Big Creek area'
  },
  {
    person_id: 'JNSN-TN-e1770-01',         // Hudson Johnson
    associated_person_id: 'JNSN-TN-e1775-01', // Nathaniel Johnson
    association_type: 'neighbor',
    evidence: 'Hudson Johnson associated with Nathaniel Johnson in Sullivan County area'
  }
]

async function phase2_FixAssociations() {
  console.log(`\n[${timestamp()}] === PHASE 2: FIX MISSING ASSOCIATIONS ===`)

  let created = 0

  for (const assoc of MISSING_ASSOCIATIONS) {
    // Check if association already exists
    const { data: existing } = await supabase
      .from('associations')
      .select('id')
      .eq('person_id', assoc.person_id)
      .eq('associated_person_id', assoc.associated_person_id)
      .limit(1)

    if (existing && existing.length > 0) {
      console.log(`[${timestamp()}] SKIP: ${assoc.person_id} <-> ${assoc.associated_person_id} (exists)`)
      continue
    }

    // Create forward association
    const { error: fwdErr } = await supabase.from('associations').insert({
      person_id: assoc.person_id,
      associated_person_id: assoc.associated_person_id,
      association_type: assoc.association_type,
      evidence: assoc.evidence
    })

    if (fwdErr) {
      console.log(`[${timestamp()}] ERROR: ${fwdErr.message}`)
      continue
    }

    console.log(`[${timestamp()}] CREATED: ${assoc.person_id} <-> ${assoc.associated_person_id}`)
    created++

    // Create inverse association
    const { data: invExisting } = await supabase
      .from('associations')
      .select('id')
      .eq('person_id', assoc.associated_person_id)
      .eq('associated_person_id', assoc.person_id)
      .limit(1)

    if (invExisting && invExisting.length > 0) {
      continue
    }

    const { error: invErr } = await supabase.from('associations').insert({
      person_id: assoc.associated_person_id,
      associated_person_id: assoc.person_id,
      association_type: assoc.association_type,
      evidence: assoc.evidence + ' (inverse)'
    })

    if (!invErr) {
      console.log(`[${timestamp()}] CREATED inverse`)
      created++
    }
  }

  console.log(`[${timestamp()}] Phase 2 complete: ${created} associations created`)
  return created
}

// ============================================================================
// PHASE 3: FIX MISSING RESEARCH QUESTION
// ============================================================================

async function phase3_FixResearchQuestion() {
  console.log(`\n[${timestamp()}] === PHASE 3: FIX MISSING RESEARCH QUESTION ===`)

  const question = {
    person_id: 'JNSN-VA-e1740-01', // Walter Johnson
    question: 'Is Walter Johnson related to the Sullivan County, Tennessee Johnson family?',
    context: 'Walter Johnson appears in Big Creek area records alongside other Johnson families. His potential connection to the Sullivan County Johnsons needs investigation.',
    priority: 'medium',
    status: 'open'
  }

  // Check if similar question exists
  const { data: existing } = await supabase
    .from('research_questions')
    .select('id, question')
    .eq('person_id', question.person_id)
    .ilike('question', '%Sullivan County%')
    .limit(1)

  if (existing && existing.length > 0) {
    console.log(`[${timestamp()}] SKIP: Similar question already exists`)
    return 0
  }

  const { error } = await supabase.from('research_questions').insert(question)

  if (error) {
    console.log(`[${timestamp()}] ERROR: ${error.message}`)
    return 0
  }

  console.log(`[${timestamp()}] CREATED: Research question for Walter Johnson`)
  return 1
}

// ============================================================================
// PHASE 4: FIX MISSING LOCATION_RESIDENTS
// ============================================================================

const LOONEY_MILL_CREEK_ID = '0d1462f3-b73a-4ef9-aab1-0d473d3123b8'

const MISSING_LOCATION_RESIDENTS = [
  {
    person_id: 'LNEY-VA-b1721-01',  // Robert Looney
    location_id: LOONEY_MILL_CREEK_ID,
    date_first: '1740',
    date_last: '1770',
    residence_type: 'resident',
    evidence: 'Robert Looney resided at Looney\'s Mill Creek 1740-1770'
  },
  {
    person_id: 'RHEA-VA-e1722-01',  // Margaret Rhea
    location_id: LOONEY_MILL_CREEK_ID,
    date_first: '1742',
    date_last: '1765',
    residence_type: 'resident',
    evidence: 'Margaret Rhea (wife of Robert Looney) at Looney\'s Mill Creek'
  },
  {
    person_id: 'LNEY-VA-e1748-01',  // Peter Looney
    location_id: LOONEY_MILL_CREEK_ID,
    date_first: null,
    date_last: '1760',
    residence_type: 'resident',
    evidence: 'Peter Looney at Looney\'s Mill Creek until 1760'
  },
  {
    person_id: 'LAUD-VA-e1709-01',  // James Lauderdale
    location_id: LOONEY_MILL_CREEK_ID,
    date_first: '1749',
    date_last: '1794',
    residence_type: 'resident',
    evidence: 'James Lauderdale associated with Looney\'s Mill Creek 1749-1794'
  },
  {
    person_id: 'LNEY-VA-b1756-01',  // Benjamin Looney
    location_id: LOONEY_MILL_CREEK_ID,
    date_first: '1756',
    date_last: '1777',
    residence_type: 'resident',
    evidence: 'Benjamin Looney born 1756, resided at Looney\'s Mill Creek until moving to Big Creek 1777'
  }
]

async function phase4_FixLocationResidents() {
  console.log(`\n[${timestamp()}] === PHASE 4: FIX MISSING LOCATION_RESIDENTS ===`)

  let created = 0

  for (const lr of MISSING_LOCATION_RESIDENTS) {
    // Check if already exists
    const { data: existing } = await supabase
      .from('location_residents')
      .select('id')
      .eq('person_id', lr.person_id)
      .eq('location_id', lr.location_id)
      .limit(1)

    if (existing && existing.length > 0) {
      console.log(`[${timestamp()}] SKIP: ${lr.person_id} @ Looney's Mill Creek (exists)`)
      continue
    }

    const { error } = await supabase.from('location_residents').insert(lr)

    if (error) {
      console.log(`[${timestamp()}] ERROR: ${lr.person_id} - ${error.message}`)
    } else {
      console.log(`[${timestamp()}] CREATED: ${lr.person_id} @ Looney's Mill Creek (${lr.date_first || '?'}-${lr.date_last || 'present'})`)
      created++
    }
  }

  console.log(`[${timestamp()}] Phase 4 complete: ${created} location_residents created`)
  return created
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log(`[${timestamp()}] START: Final Audit Fix`)
  console.log('='.repeat(60))

  const relsCreated = await phase1_FixRelationships()
  const assocsCreated = await phase2_FixAssociations()
  const questionsCreated = await phase3_FixResearchQuestion()
  const residentsCreated = await phase4_FixLocationResidents()

  console.log('\n' + '='.repeat(60))
  console.log(`[${timestamp()}] SUMMARY`)
  console.log('='.repeat(60))
  console.log(`Relationships created: ${relsCreated}`)
  console.log(`Associations created: ${assocsCreated}`)
  console.log(`Research questions created: ${questionsCreated}`)
  console.log(`Location_residents created: ${residentsCreated}`)
  console.log(`TOTAL: ${relsCreated + assocsCreated + questionsCreated + residentsCreated}`)
}

main().catch(console.error)
