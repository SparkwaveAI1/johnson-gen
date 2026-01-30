import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://oxpkqnmuwqcnmzvavsuz.supabase.co',
  'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
)

async function main() {
  console.log('=== BATCH 5 FINAL FIXES ===\n')

  // ---------------------------------------------------------------------------
  // 1. CREATE MISSING COUNTY LOCATIONS (without 'state' column)
  // ---------------------------------------------------------------------------
  console.log('--- Creating Missing County Locations ---')

  const counties = [
    { name: 'Dickson County', slug: 'dickson-county-tn', location_type: 'county', description: 'County in Tennessee' },
    { name: 'Bedford County', slug: 'bedford-county-va', location_type: 'county', description: 'County in Virginia' },
    { name: 'Goochland County', slug: 'goochland-county-va', location_type: 'county', description: 'County in Virginia' },
    { name: 'St. Martin Parish', slug: 'st-martin-parish-la', location_type: 'county', description: 'Parish in Louisiana' },
    { name: 'Humphreys County', slug: 'humphreys-county-tn', location_type: 'county', description: 'County in Tennessee' }
  ]

  for (const loc of counties) {
    const { data: existing } = await supabase.from('locations').select('id').eq('slug', loc.slug).single()
    if (!existing) {
      const { error } = await supabase.from('locations').insert(loc)
      if (error) {
        console.log(`  Error creating ${loc.name}:`, error.message)
      } else {
        console.log(`  Created: ${loc.name}`)
      }
    } else {
      console.log(`  Exists: ${loc.name}`)
    }
  }

  // Set parent for Tumbling Creek
  const { data: humpLoc } = await supabase.from('locations').select('id').eq('slug', 'humphreys-county-tn').single()
  if (humpLoc) {
    await supabase.from('locations').update({ parent_location_id: humpLoc.id }).eq('slug', 'tumbling-creek-humphreys-tn')
    console.log('  Updated Tumbling Creek parent')
  }

  // ---------------------------------------------------------------------------
  // 2. CREATE HIRAM JOHNSON WITHOUT INVALID DNA STATUS
  // ---------------------------------------------------------------------------
  console.log('\n--- Creating Hiram Johnson ---')

  const { data: hiramExists } = await supabase.from('people').select('id').eq('id', 'JNSN-TN-e1800-01').single()
  if (!hiramExists) {
    const { error } = await supabase.from('people').insert({
      id: 'JNSN-TN-e1800-01',
      surname: 'Johnson',
      given_name: 'Hiram',
      birth_year: 1800,
      birth_year_type: 'e',
      death_year: 1844,
      death_year_type: 'b',
      death_place_code: 'Humphreys County, TN',
      confidence: 'CONFIRMED',
      bio: 'Married Margaret (b.1793 NC). Margaret did all land buying/selling - possibly couldn\'t write. Died 20 Nov 1844. Buried Cannon Cemetery, Tumbling Creek, Humphreys County, TN. Sons include James David Johnson, Jackson Johnson (born Kentucky). DNA matches Timothy Rich line of Henrico County VA.'
    })
    if (error) {
      console.log(`  Error creating Hiram Johnson:`, error.message)
    } else {
      console.log('  Created: Hiram Johnson (JNSN-TN-e1800-01)')
    }
  } else {
    console.log('  Exists: Hiram Johnson')
  }

  // ---------------------------------------------------------------------------
  // 3. CREATE REMAINING LOCATION RESIDENTS
  // ---------------------------------------------------------------------------
  console.log('\n--- Creating Remaining Location Residents ---')

  const { data: allLocs } = await supabase.from('locations').select('id, slug')
  const locMap = {}
  allLocs?.forEach(l => { locMap[l.slug] = l.id })

  const residents = [
    { person_id: 'JNSN-TN-e1800-01', location_slug: 'tumbling-creek-humphreys-tn', date_first: '1826', date_last: '1844', residence_type: 'resident', evidence: 'Wife\'s land deeds; buried Cannon Cemetery' },
    { person_id: 'JNSN-TN-e1790-02', location_slug: 'dickson-county-tn', date_first: '1809', residence_type: 'resident', evidence: 'Father Hudson Johnson witness 1809 deed' },
    { person_id: 'JNSN-TN-e1780-02', location_slug: 'dickson-county-tn', date_first: '1800', date_last: '1820', residence_type: 'resident', evidence: 'Researcher notes' },
    { person_id: 'JNSN-VA-e1750-02', location_slug: 'bedford-county-va', date_first: '1769', date_last: '1790', residence_type: 'resident', evidence: 'Son stated family was of Bedford County, Virginia' },
    { person_id: 'HOGN-VA-e1770-01', location_slug: 'bedford-county-va', date_first: '1770', date_last: '1800', residence_type: 'resident', evidence: 'Stated he was of Bedford County, Virginia' },
    { person_id: 'JNSN-VA-e1700-01', location_slug: 'goochland-county-va', date_first: '1744', date_last: '1746', residence_type: 'resident', evidence: 'Security for Benjamin Johnson estate 1744' },
    { person_id: 'JNSN-VA-e1715-02', location_slug: 'goochland-county-va', date_first: '1744', residence_type: 'resident', evidence: 'Estate administration 1744' }
  ]

  for (const lr of residents) {
    const locId = locMap[lr.location_slug]
    if (!locId) {
      console.log(`  Location not found: ${lr.location_slug}`)
      continue
    }

    const { data: existing } = await supabase.from('location_residents')
      .select('id').eq('person_id', lr.person_id).eq('location_id', locId).single()

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
  // 4. CREATE HIRAM + MARGARET RELATIONSHIP
  // ---------------------------------------------------------------------------
  console.log('\n--- Creating Hiram + Margaret Relationships ---')

  // Spouse relationship
  const { data: spouseExists } = await supabase.from('family_relationships')
    .select('id').eq('person_id', 'JNSN-TN-e1800-01').eq('related_person_id', 'JNSN-TN-b1793-01').single()

  if (!spouseExists) {
    await supabase.from('family_relationships').insert({
      person_id: 'JNSN-TN-e1800-01',
      related_person_id: 'JNSN-TN-b1793-01',
      relationship_type: 'spouse',
      evidence: 'Humphreys Co TN deeds; 1854 petition',
      relationship_status: 'confirmed'
    })
    await supabase.from('family_relationships').insert({
      person_id: 'JNSN-TN-b1793-01',
      related_person_id: 'JNSN-TN-e1800-01',
      relationship_type: 'spouse',
      evidence: 'Humphreys Co TN deeds; 1854 petition',
      relationship_status: 'confirmed'
    })
    console.log('  Created: Hiram <-> Margaret (spouse)')
  } else {
    console.log('  Exists: Hiram <-> Margaret (spouse)')
  }

  // Father relationship to James David
  const { data: fatherExists } = await supabase.from('family_relationships')
    .select('id').eq('person_id', 'JNSN-TN-e1820-01').eq('related_person_id', 'JNSN-TN-e1800-01').single()

  if (!fatherExists) {
    await supabase.from('family_relationships').insert({
      person_id: 'JNSN-TN-e1820-01',
      related_person_id: 'JNSN-TN-e1800-01',
      relationship_type: 'father',
      evidence: '1854 petition',
      relationship_status: 'confirmed'
    })
    await supabase.from('family_relationships').insert({
      person_id: 'JNSN-TN-e1800-01',
      related_person_id: 'JNSN-TN-e1820-01',
      relationship_type: 'child',
      evidence: '1854 petition',
      relationship_status: 'confirmed'
    })
    console.log('  Created: James David -> Hiram (father/child)')
  }

  // ---------------------------------------------------------------------------
  // 5. CREATE HIRAM RESEARCH QUESTION
  // ---------------------------------------------------------------------------
  console.log('\n--- Creating Hiram Research Question ---')

  const { data: rqExists } = await supabase.from('research_questions')
    .select('id').eq('question', 'What is Hiram Johnson\'s parentage and connection to Timothy Rich line?').single()

  if (!rqExists) {
    const { error } = await supabase.from('research_questions').insert({
      person_id: 'JNSN-TN-e1800-01',
      question: 'What is Hiram Johnson\'s parentage and connection to Timothy Rich line?',
      question_type: 'relationship',
      status: 'open',
      evidence_for: 'DNA match to descendants of Timothy Rich of Henrico Co VA',
      research_action: 'Research Timothy Rich descendants; check for migration to Tennessee',
      source_file: '1692-Johnson-renfro-Looney.docx'
    })
    if (error) {
      console.log('  Error:', error.message)
    } else {
      console.log('  Created: Hiram Johnson Timothy Rich research question')
    }
  } else {
    console.log('  Exists: Hiram Johnson research question')
  }

  // ---------------------------------------------------------------------------
  // 6. FINAL SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n=== FINAL VERIFICATION ===')

  const keyPeople = [
    { id: 'JNSN-TN-e1775-02', name: 'Agnes Johnson' },
    { id: 'JNSN-TN-e1790-02', name: 'Mary Johnson (Polly)' },
    { id: 'SHRP-TN-e1785-01', name: 'Joel Shropshire' },
    { id: 'JNSN-VA-e1750-02', name: 'Rebecca Johnson' },
    { id: 'HOGN-VA-e1745-01', name: 'Humphrey Hogan' },
    { id: 'HOGN-VA-e1770-01', name: 'Charles Jonson Hogan' },
    { id: 'HTCH-VA-e1775-01', name: 'Sara Hatcher' },
    { id: 'JNSN-TN-e1780-01', name: 'Larkin Johnson' },
    { id: 'RNFR-TN-b1809-01', name: 'Olivia Renfro' },
    { id: 'JNSN-TN-e1800-01', name: 'Hiram Johnson' },
    { id: 'JNSN-TN-b1793-01', name: 'Margaret Johnson' },
    { id: 'JNSN-TN-e1820-01', name: 'James David Johnson' },
    { id: 'JNSN-VA-e1700-01', name: 'Isaac Johnson (VA 1721)' },
    { id: 'JNSN-TN-e1780-02', name: 'Isaac Johnson (Dickson Co)' },
    { id: 'JNSN-VA-e1715-02', name: 'Benjamin Johnson (Goochland)' }
  ]

  let successCount = 0
  for (const p of keyPeople) {
    const { data } = await supabase.from('people').select('id').eq('id', p.id).single()
    if (data) {
      console.log(`  OK: ${p.name}`)
      successCount++
    } else {
      console.log(`  MISSING: ${p.name} (${p.id})`)
    }
  }

  console.log(`\n${successCount}/${keyPeople.length} people verified.`)

  // Count totals
  const { count: peopleCount } = await supabase.from('people').select('*', { count: 'exact', head: true })
  const { count: relCount } = await supabase.from('family_relationships').select('*', { count: 'exact', head: true })
  const { count: locCount } = await supabase.from('locations').select('*', { count: 'exact', head: true })
  const { count: rqCount } = await supabase.from('research_questions').select('*', { count: 'exact', head: true })

  console.log(`\nDatabase Totals:`)
  console.log(`  People: ${peopleCount}`)
  console.log(`  Relationships: ${relCount}`)
  console.log(`  Locations: ${locCount}`)
  console.log(`  Research Questions: ${rqCount}`)
}

main().catch(console.error)
