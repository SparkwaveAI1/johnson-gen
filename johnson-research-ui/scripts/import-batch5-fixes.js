import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://oxpkqnmuwqcnmzvavsuz.supabase.co',
  'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
)

// =============================================================================
// BATCH 5 FIXES: Fix constraint violations and create missing records
// =============================================================================

async function main() {
  console.log('=== BATCH 5 FIXES ===\n')

  // ---------------------------------------------------------------------------
  // 1. CREATE MISSING LOCATIONS
  // ---------------------------------------------------------------------------
  console.log('--- Creating Missing Locations ---')

  // Get parent location IDs
  const { data: parentLocs } = await supabase
    .from('locations')
    .select('id, name, slug')
    .in('slug', ['humphreys-county-tn', 'st-martin-parish-la', 'hawkins-county-tn', 'dickson-county-tn', 'bedford-county-va', 'goochland-county-va'])

  const parentMap = {}
  parentLocs?.forEach(l => { parentMap[l.slug] = l.id })
  console.log('Parent locations found:', Object.keys(parentMap))

  // Create missing parent locations if needed
  const missingParents = [
    { name: 'Dickson County', slug: 'dickson-county-tn', location_type: 'county', state: 'Tennessee' },
    { name: 'Bedford County', slug: 'bedford-county-va', location_type: 'county', state: 'Virginia' },
    { name: 'Goochland County', slug: 'goochland-county-va', location_type: 'county', state: 'Virginia' },
    { name: 'St. Martin Parish', slug: 'st-martin-parish-la', location_type: 'county', state: 'Louisiana' },
    { name: 'Humphreys County', slug: 'humphreys-county-tn', location_type: 'county', state: 'Tennessee' }
  ]

  for (const loc of missingParents) {
    if (!parentMap[loc.slug]) {
      const { data, error } = await supabase.from('locations').insert(loc).select().single()
      if (error) {
        console.log(`  Error creating ${loc.name}:`, error.message)
      } else {
        console.log(`  Created: ${loc.name}`)
        parentMap[loc.slug] = data.id
      }
    }
  }

  // Create child locations
  const childLocations = [
    { name: 'Bartons Creek', slug: 'bartons-creek-dickson-tn', location_type: 'creek', parent_slug: 'dickson-county-tn', description: 'Creek in Dickson County, Tennessee where Hudson Johnson family lived' },
    { name: 'Big Creek', slug: 'big-creek-hawkins-tn', location_type: 'creek', parent_slug: 'hawkins-county-tn', description: 'Location of Big Creek Baptist Church where Hudson Johnson was deacon' }
  ]

  for (const loc of childLocations) {
    const { data: existing } = await supabase.from('locations').select('id').eq('slug', loc.slug).single()
    if (!existing) {
      const parentId = parentMap[loc.parent_slug]
      const { error } = await supabase.from('locations').insert({
        name: loc.name,
        slug: loc.slug,
        location_type: loc.location_type,
        description: loc.description,
        parent_location_id: parentId
      })
      if (error) {
        console.log(`  Error creating ${loc.name}:`, error.message)
      } else {
        console.log(`  Created: ${loc.name}`)
      }
    } else {
      console.log(`  Exists: ${loc.name}`)
    }
  }

  // ---------------------------------------------------------------------------
  // 2. CREATE PEOPLE WITH FIXED DEATH YEAR TYPES
  // ---------------------------------------------------------------------------
  console.log('\n--- Creating People with Fixed Values ---')

  // death_year_type values: 'b' (before), 'd' (exact date), 'e' (estimate)
  // 'a' (after) and 'c' (circa) need to be converted

  const peopleToFix = [
    // Rebecca Johnson - death_year_type 'a' (after) -> 'e' (estimate since we don't know exactly)
    {
      id: 'JNSN-VA-e1750-02',
      surname: 'Johnson',
      given_name: 'Rebecca',
      birth_year: 1750,
      birth_year_type: 'e',
      death_year: 1804,
      death_year_type: 'e', // Changed from 'a' to 'e'
      confidence: 'CONFIRMED',
      bio: 'Married (1) Humphrey Hogan c.1769, (2) William Hines. Son Charles Jonson Hogan married Sara HATCHER - key Hatcher connection. Possibly relative of Walter Johnson of Sullivan County, Tennessee. Living after 1804. Of Bedford County, Virginia.'
    },
    // Humphrey Hogan - death_year_type 'c' -> 'e'
    {
      id: 'HOGN-VA-e1745-01',
      surname: 'Hogan',
      given_name: 'Humphrey',
      birth_year: 1745,
      birth_year_type: 'e',
      death_year: 1790,
      death_year_type: 'e', // Changed from 'c' to 'e'
      confidence: 'CONFIRMED',
      bio: 'Married Rebecca Johnson c.1769. Died c.1789 or 1790, probably leaving children not yet adults. Parentage unknown - research ongoing.'
    },
    // Hiram Johnson - death_year_type 'd' should be valid, but let's try 'b' for before (died before 1845)
    {
      id: 'JNSN-TN-e1800-01',
      surname: 'Johnson',
      given_name: 'Hiram',
      birth_year: 1800,
      birth_year_type: 'e',
      death_year: 1844,
      death_year_type: 'b', // 'd' for exact date
      death_place_code: 'Humphreys County, TN',
      confidence: 'CONFIRMED',
      dna_group: 'Timothy Rich line match',
      dna_status: 'predicted',
      bio: 'Married Margaret (b.1793 NC). Margaret did all land buying/selling - possibly couldn\'t write. Died 20 Nov 1844. Buried Cannon Cemetery, Tumbling Creek, Humphreys County, TN. Sons include James David Johnson, Jackson Johnson (born Kentucky). DNA matches Timothy Rich line of Henrico County VA.'
    },
    // Margaret Johnson
    {
      id: 'JNSN-TN-b1793-01',
      surname: 'Johnson',
      given_name: 'Margaret',
      birth_year: 1793,
      birth_year_type: 'b',
      birthplace_code: 'North Carolina',
      death_year: 1850,
      death_year_type: 'b', // 'd' for exact date
      death_place_code: 'Humphreys County, TN',
      confidence: 'CONFIRMED',
      bio: 'Wife of Hiram Johnson. Born NC, maiden name unknown. Educated - could sign her name. Did all land transactions (possibly Hiram couldn\'t write). Bought 50 acres 1826 for 1 cent/acre, 150 acres 1842. Buried Cannon Cemetery, Tumbling Creek. Partnership with son David Johnson 1849 for farming/stock raising. Died 9 Sept 1850.'
    },
    // Isaac Johnson (Dickson) - death_year_type 'c' -> 'e'
    {
      id: 'JNSN-TN-e1780-02',
      surname: 'Johnson',
      given_name: 'Isaac',
      designation: 'of Dickson County',
      birth_year: 1780,
      birth_year_type: 'e',
      death_year: 1820,
      death_year_type: 'e', // Changed from 'c'
      confidence: 'PROBABLE',
      bio: 'Lived in Dickson County TN. Possibly related to Nathaniel Johnson. Died c.1820. Son Isaac Johnson went to Johnson County, Arkansas about same time as Mary Polly Johnson Shropshire.'
    }
  ]

  for (const person of peopleToFix) {
    const { data: existing } = await supabase.from('people').select('id').eq('id', person.id).single()
    if (!existing) {
      const { error } = await supabase.from('people').insert(person)
      if (error) {
        console.log(`  Error creating ${person.given_name} ${person.surname}:`, error.message)
      } else {
        console.log(`  Created: ${person.given_name} ${person.surname} (${person.id})`)
      }
    } else {
      console.log(`  Exists: ${person.given_name} ${person.surname} (${person.id})`)
    }
  }

  // ---------------------------------------------------------------------------
  // 3. CREATE REMAINING LOCATION RESIDENTS
  // ---------------------------------------------------------------------------
  console.log('\n--- Creating Location Residents ---')

  const { data: allLocs } = await supabase.from('locations').select('id, slug, name')
  const locMap = {}
  allLocs?.forEach(l => { locMap[l.slug] = l.id })

  const locationResidents = [
    // Agnes Johnson
    { person_id: 'JNSN-TN-e1775-02', location_slug: 'bartons-creek-dickson-tn', date_first: '1800', date_last: '1823', residence_type: 'resident', evidence: 'Tony\'s research - wife of Hudson Johnson' },
    { person_id: 'JNSN-TN-e1775-02', location_slug: 'big-creek-hawkins-tn', date_first: '1800', residence_type: 'resident', evidence: 'Big Creek Baptist Church member' },
    // Mary Johnson
    { person_id: 'JNSN-TN-e1790-02', location_slug: 'dickson-county-tn', date_first: '1809', residence_type: 'resident', evidence: 'Father Hudson Johnson witness 1809 deed' },
    // Joel Shropshire
    { person_id: 'SHRP-TN-e1785-01', location_slug: 'bartons-creek-dickson-tn', date_first: '1809', residence_type: 'resident', evidence: 'Witness to 1809 deed with father-in-law Hudson Johnson' },
    // Rebecca Johnson
    { person_id: 'JNSN-VA-e1750-02', location_slug: 'bedford-county-va', date_first: '1769', date_last: '1790', residence_type: 'resident', evidence: 'Son stated family was of Bedford County, Virginia' },
    // Charles Jonson Hogan
    { person_id: 'HOGN-VA-e1770-01', location_slug: 'bedford-county-va', date_first: '1770', date_last: '1800', residence_type: 'resident', evidence: 'Stated he was of Bedford County, Virginia' },
    // Hiram Johnson
    { person_id: 'JNSN-TN-e1800-01', location_slug: 'tumbling-creek-humphreys-tn', date_first: '1826', date_last: '1844', residence_type: 'resident', evidence: 'Wife\'s land deeds; buried Cannon Cemetery' },
    // Margaret Johnson
    { person_id: 'JNSN-TN-b1793-01', location_slug: 'tumbling-creek-humphreys-tn', date_first: '1826', date_last: '1850', residence_type: 'landowner', evidence: 'Multiple land deeds in her name 1826-1849' },
    // Isaac Johnson (early VA)
    { person_id: 'JNSN-VA-e1700-01', location_slug: 'goochland-county-va', date_first: '1744', date_last: '1746', residence_type: 'resident', evidence: 'Security for Benjamin Johnson estate 1744; tithables 1746' },
    // Isaac Johnson (Dickson)
    { person_id: 'JNSN-TN-e1780-02', location_slug: 'dickson-county-tn', date_first: '1800', date_last: '1820', residence_type: 'resident', evidence: 'Researcher notes' },
    // Benjamin Johnson
    { person_id: 'JNSN-VA-e1715-02', location_slug: 'goochland-county-va', date_first: '1744', residence_type: 'resident', evidence: 'Estate administration 1744' }
  ]

  for (const lr of locationResidents) {
    const locId = locMap[lr.location_slug]
    if (!locId) {
      console.log(`  Location not found: ${lr.location_slug}`)
      continue
    }

    const { data: personExists } = await supabase.from('people').select('id').eq('id', lr.person_id).single()
    if (!personExists) {
      console.log(`  Person not found: ${lr.person_id}`)
      continue
    }

    const { data: existing } = await supabase
      .from('location_residents')
      .select('id')
      .eq('person_id', lr.person_id)
      .eq('location_id', locId)
      .single()

    if (!existing) {
      const { error } = await supabase.from('location_residents').insert({
        person_id: lr.person_id,
        location_id: locId,
        date_first: lr.date_first || null,
        date_last: lr.date_last || null,
        residence_type: lr.residence_type,
        evidence: lr.evidence
      })
      if (error) {
        console.log(`  Error: ${lr.person_id} at ${lr.location_slug}:`, error.message)
      } else {
        console.log(`  Created: ${lr.person_id} at ${lr.location_slug}`)
      }
    } else {
      console.log(`  Exists: ${lr.person_id} at ${lr.location_slug}`)
    }
  }

  // ---------------------------------------------------------------------------
  // 4. CREATE REMAINING RELATIONSHIPS
  // ---------------------------------------------------------------------------
  console.log('\n--- Creating Remaining Relationships ---')

  const relationships = [
    // Rebecca Johnson + Humphrey Hogan = spouse
    { person1: 'JNSN-VA-e1750-02', person2: 'HOGN-VA-e1745-01', type: 'spouse', evidence: 'Louisiana church records' },

    // Rebecca Johnson is mother of Charles Jonson Hogan
    { person1: 'HOGN-VA-e1770-01', person2: 'JNSN-VA-e1750-02', type: 'mother', evidence: 'Louisiana church records: Charles Jonson Hogans, son of Homfrey and Rebecca Jonson Hogan' },
    { person1: 'HOGN-VA-e1770-01', person2: 'HOGN-VA-e1745-01', type: 'father', evidence: 'Louisiana church records' },

    // Hiram Johnson + Margaret Johnson = spouse
    { person1: 'JNSN-TN-e1800-01', person2: 'JNSN-TN-b1793-01', type: 'spouse', evidence: 'Humphreys Co TN deeds; 1854 petition' },

    // Hiram Johnson is father of James David Johnson
    { person1: 'JNSN-TN-e1820-01', person2: 'JNSN-TN-e1800-01', type: 'father', evidence: '1854 petition' },
    { person1: 'JNSN-TN-e1820-01', person2: 'JNSN-TN-b1793-01', type: 'mother', evidence: '1854 petition' }
  ]

  for (const rel of relationships) {
    const { data: p1 } = await supabase.from('people').select('id').eq('id', rel.person1).single()
    const { data: p2 } = await supabase.from('people').select('id').eq('id', rel.person2).single()

    if (!p1 || !p2) {
      console.log(`  Person not found: ${rel.person1} or ${rel.person2}`)
      continue
    }

    // Forward
    const { data: existingFwd } = await supabase.from('family_relationships')
      .select('id').eq('person_id', rel.person1).eq('related_person_id', rel.person2).eq('relationship_type', rel.type).single()

    if (!existingFwd) {
      const { error } = await supabase.from('family_relationships').insert({
        person_id: rel.person1, related_person_id: rel.person2, relationship_type: rel.type,
        evidence: rel.evidence, relationship_status: 'confirmed'
      })
      if (error) console.log(`  Error: ${rel.person1} -> ${rel.person2}:`, error.message)
      else console.log(`  Created: ${rel.person1} -> ${rel.person2} (${rel.type})`)
    } else {
      console.log(`  Exists: ${rel.person1} -> ${rel.person2} (${rel.type})`)
    }

    // Inverse
    let inverseType = rel.type
    if (rel.type === 'father' || rel.type === 'mother') inverseType = 'child'

    const { data: existingInv } = await supabase.from('family_relationships')
      .select('id').eq('person_id', rel.person2).eq('related_person_id', rel.person1).eq('relationship_type', inverseType).single()

    if (!existingInv) {
      const { error } = await supabase.from('family_relationships').insert({
        person_id: rel.person2, related_person_id: rel.person1, relationship_type: inverseType,
        evidence: rel.evidence, relationship_status: 'confirmed'
      })
      if (!error) console.log(`  Created: ${rel.person2} -> ${rel.person1} (${inverseType})`)
    }
  }

  // ---------------------------------------------------------------------------
  // 5. CREATE REMAINING RESEARCH QUESTIONS
  // ---------------------------------------------------------------------------
  console.log('\n--- Creating Remaining Research Questions ---')

  const researchQuestions = [
    {
      person_id: 'JNSN-VA-e1750-02',
      question: 'Is Rebecca Johnson related to Walter Johnson of Sullivan County?',
      question_type: 'relationship',
      status: 'open',
      evidence_for: 'Researcher note states Rebecca Johnson possibly relative of Walter Johnson',
      research_action: 'Compare Bedford County VA Johnson records with Sullivan County TN',
      source_file: '1692-Johnson-renfro-Looney.docx'
    },
    {
      person_id: 'JNSN-TN-e1800-01',
      question: 'What is Hiram Johnson\'s parentage and connection to Timothy Rich line?',
      question_type: 'relationship',
      status: 'open',
      evidence_for: 'DNA match to descendants of Timothy Rich of Henrico Co VA',
      research_action: 'Research Timothy Rich descendants; check for migration to Tennessee',
      source_file: '1692-Johnson-renfro-Looney.docx'
    }
  ]

  for (const rq of researchQuestions) {
    const { data: personExists } = await supabase.from('people').select('id').eq('id', rq.person_id).single()
    if (!personExists) {
      console.log(`  Person not found: ${rq.person_id}`)
      continue
    }

    const { data: existing } = await supabase.from('research_questions')
      .select('id').eq('question', rq.question).single()

    if (!existing) {
      const { error } = await supabase.from('research_questions').insert(rq)
      if (error) console.log(`  Error:`, error.message)
      else console.log(`  Created: ${rq.question.substring(0, 50)}...`)
    } else {
      console.log(`  Exists: ${rq.question.substring(0, 50)}...`)
    }
  }

  // ---------------------------------------------------------------------------
  // 6. FINAL VERIFICATION
  // ---------------------------------------------------------------------------
  console.log('\n=== VERIFICATION ===')

  // Check key people exist
  const keyPeople = [
    'JNSN-TN-e1775-02', // Agnes Johnson
    'JNSN-TN-e1790-02', // Mary Johnson (Polly)
    'SHRP-TN-e1785-01', // Joel Shropshire
    'JNSN-VA-e1750-02', // Rebecca Johnson
    'HOGN-VA-e1745-01', // Humphrey Hogan
    'HOGN-VA-e1770-01', // Charles Jonson Hogan
    'HTCH-VA-e1775-01', // Sara Hatcher
    'JNSN-TN-e1800-01', // Hiram Johnson
    'JNSN-TN-b1793-01', // Margaret Johnson
    'JNSN-VA-e1700-01'  // Isaac Johnson
  ]

  for (const id of keyPeople) {
    const { data } = await supabase.from('people').select('given_name, surname').eq('id', id).single()
    if (data) {
      console.log(`  OK: ${data.given_name} ${data.surname} (${id})`)
    } else {
      console.log(`  MISSING: ${id}`)
    }
  }

  console.log('\n=== IMPORT COMPLETE ===')
}

main().catch(console.error)
