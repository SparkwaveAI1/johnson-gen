import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://oxpkqnmuwqcnmzvavsuz.supabase.co',
  'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
)

// =============================================================================
// BATCH 5: looney-johnson-renfro-extraction-batch5.json
// Focus: Hudson Johnson family completion, Hatcher connection, additional Johnsons
// =============================================================================

async function main() {
  console.log('=== BATCH 5 IMPORT: Hudson Johnson Family, Hatcher Connection ===\n')

  // ---------------------------------------------------------------------------
  // 1. CREATE LOCATIONS
  // ---------------------------------------------------------------------------
  console.log('--- Creating Locations ---')

  const locations = [
    {
      name: 'Tumbling Creek',
      slug: 'tumbling-creek-humphreys-tn',
      location_type: 'creek',
      description: 'Creek of the Duck River. Location of Hiram and Margaret Johnson lands. Cannon Cemetery on Ben Pewett farm. Rices Branch is a tributary.'
    },
    {
      name: 'Rices Branch',
      slug: 'rices-branch-humphreys-tn',
      location_type: 'creek',
      description: 'Branch of Tumbling Creek where Margaret Johnson received 150 acre state grant 1842.'
    },
    {
      name: 'Cannon Cemetery',
      slug: 'cannon-cemetery-humphreys-tn',
      location_type: 'cemetery',
      description: 'Cemetery on Ben Pewett farm on Tumbling Creek. Burial place of Hiram Johnson (d.1844), Margaret Johnson (d.1850), Milbury Johnson (d.1869), George Washington Johnson.'
    },
    {
      name: 'St. Martinville',
      slug: 'st-martinville-la',
      location_type: 'town',
      description: 'Location of St. Martin of Tours Church where Charles Jonson Hogan and Sara Hatcher had children baptized 1806-1808.'
    },
    {
      name: 'Taylors Creek',
      slug: 'taylors-creek-hanover-va',
      location_type: 'creek',
      description: 'Creek where Isaac Johnson, Thomas Johnson, and John Bunch lived per 1721 road order. Part of Owens Creek area. Meriwether families here married to Col. Richard Johnson son of William Johnson.'
    },
    {
      name: 'Buffalo Creek',
      slug: 'buffalo-creek-henry-va',
      location_type: 'creek',
      description: 'Location associated with Hudson Johnson and Agnes Johnson family per Tony\'s header notes.'
    }
  ]

  // Get parent location IDs
  const { data: parentLocs } = await supabase
    .from('locations')
    .select('id, name, slug')
    .in('slug', ['humphreys-county-tn', 'st-martin-parish-la', 'hanover-county-va', 'henry-county-va', 'goochland-county-va'])

  const parentMap = {}
  parentLocs?.forEach(l => { parentMap[l.slug] = l.id })

  for (const loc of locations) {
    // Determine parent
    let parentId = null
    if (loc.slug.includes('humphreys')) {
      parentId = parentMap['humphreys-county-tn']
    } else if (loc.slug.includes('-la')) {
      parentId = parentMap['st-martin-parish-la']
    } else if (loc.slug.includes('hanover') || loc.slug.includes('taylors')) {
      parentId = parentMap['hanover-county-va'] || parentMap['goochland-county-va']
    } else if (loc.slug.includes('henry')) {
      parentId = parentMap['henry-county-va']
    }

    const { data: existing } = await supabase
      .from('locations')
      .select('id')
      .eq('slug', loc.slug)
      .single()

    if (!existing) {
      const { error } = await supabase.from('locations').insert({
        ...loc,
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
  // 2. CREATE NEW PEOPLE (16 people)
  // ---------------------------------------------------------------------------
  console.log('\n--- Creating People ---')

  const people = [
    // Agnes Johnson - wife of Hudson Johnson
    {
      id: 'JNSN-TN-e1775-02',
      surname: 'Johnson',
      given_name: 'Agnes',
      birth_year: 1775,
      birth_year_type: 'e',
      confidence: 'CONFIRMED',
      bio: 'Wife of Hudson Johnson. Member of Big Creek Baptist Church with Rev. Thomas Murrell. Tony L. Johnson\'s direct ancestor. Associated with Bartons Creek (Dickson Co TN), Big Creek (Hawkins Co TN), and Buffalo Creek (Henry Co VA).'
    },
    // Mary Johnson (Polly) - daughter of Hudson
    {
      id: 'JNSN-TN-e1790-02',
      surname: 'Johnson',
      given_name: 'Mary',
      designation: 'Polly',
      birth_year: 1790,
      birth_year_type: 'e',
      confidence: 'CONFIRMED',
      bio: 'Daughter of Hudson Johnson and Agnes Johnson. Married (1) Joel Shropshire, (2) Sterling May. Also known as Polly Johnson. Went to Johnson Co, Arkansas.'
    },
    // Joel Shropshire
    {
      id: 'SHRP-TN-e1785-01',
      surname: 'Shropshire',
      given_name: 'Joel',
      birth_year: 1785,
      birth_year_type: 'e',
      confidence: 'CONFIRMED',
      bio: 'First husband of Mary Johnson (daughter of Hudson Johnson). Witnessed 1809 deed alongside Hudson Johnson at Bartons Creek, Dickson County, Tennessee.'
    },
    // Rebecca Johnson
    {
      id: 'JNSN-VA-e1750-02',
      surname: 'Johnson',
      given_name: 'Rebecca',
      birth_year: 1750,
      birth_year_type: 'e',
      death_year: 1804,
      death_year_type: 'a',
      confidence: 'CONFIRMED',
      bio: 'Married (1) Humphrey Hogan c.1769, (2) William Hines. Son Charles Jonson Hogan married Sara HATCHER - key Hatcher connection. Possibly relative of Walter Johnson of Sullivan County, Tennessee. Living 1804. Of Bedford County, Virginia.'
    },
    // Humphrey Hogan
    {
      id: 'HOGN-VA-e1745-01',
      surname: 'Hogan',
      given_name: 'Humphrey',
      birth_year: 1745,
      birth_year_type: 'e',
      death_year: 1790,
      death_year_type: 'c',
      confidence: 'CONFIRMED',
      bio: 'Married Rebecca Johnson c.1769. Died 1789 or 1790, probably leaving children not yet adults. Parentage unknown - research ongoing.'
    },
    // Charles Jonson Hogan
    {
      id: 'HOGN-VA-e1770-01',
      surname: 'Hogan',
      given_name: 'Charles Jonson',
      birth_year: 1770,
      birth_year_type: 'e',
      birthplace_code: 'Bedford County, VA',
      confidence: 'CONFIRMED',
      bio: 'Son of Humphrey Hogan and Rebecca Johnson. Married Sara HATCHER. Daughters Prudence (b.1806) and Anne (b.1808) baptized at St. Martin of Tours Church, Louisiana. KEY HATCHER CONNECTION.'
    },
    // Sara Hatcher
    {
      id: 'HTCH-VA-e1775-01',
      surname: 'Hatcher',
      given_name: 'Sara',
      birth_year: 1775,
      birth_year_type: 'e',
      confidence: 'CONFIRMED',
      bio: 'HATCHER - wife of Charles Jonson Hogan, son of Rebecca Johnson. Connects Johnson and Hatcher families. Daughters Prudence and Anne baptized St. Martin of Tours Church, Louisiana.'
    },
    // Larkin Johnson
    {
      id: 'JNSN-TN-e1780-01',
      surname: 'Johnson',
      given_name: 'Larkin',
      birth_year: 1780,
      birth_year_type: 'e',
      confidence: 'PROBABLE',
      bio: 'Married Olivia Renfro (daughter of James Renfro, born 1809). Another Johnson-Renfro marriage connection.'
    },
    // Olivia Renfro
    {
      id: 'RNFR-TN-b1809-01',
      surname: 'Renfro',
      given_name: 'Olivia',
      birth_year: 1809,
      birth_year_type: 'b',
      confidence: 'PROBABLE',
      bio: 'Daughter of James Renfro. Married Larkin Johnson.'
    },
    // Hiram Johnson
    {
      id: 'JNSN-TN-e1800-01',
      surname: 'Johnson',
      given_name: 'Hiram',
      birth_year: 1800,
      birth_year_type: 'e',
      death_year: 1844,
      death_year_type: 'd',
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
      death_year_type: 'd',
      death_place_code: 'Humphreys County, TN',
      confidence: 'CONFIRMED',
      bio: 'Wife of Hiram Johnson. Born NC, maiden name unknown. Educated - could sign her name. Did all land transactions (possibly Hiram couldn\'t write). Bought 50 acres 1826 for 1 cent/acre, 150 acres 1842. Buried Cannon Cemetery, Tumbling Creek. Partnership with son David Johnson 1849 for farming/stock raising.'
    },
    // James David Johnson
    {
      id: 'JNSN-TN-e1820-01',
      surname: 'Johnson',
      given_name: 'James David',
      birth_year: 1820,
      birth_year_type: 'e',
      confidence: 'CONFIRMED',
      bio: 'Son of Hiram Johnson and Margaret Johnson. Entered farming/stock partnership with mother Margaret 1849. Petitioned to sell mother\'s estate land 1854.'
    },
    // Isaac Johnson (early Virginia)
    {
      id: 'JNSN-VA-e1700-01',
      surname: 'Johnson',
      given_name: 'Isaac',
      birth_year: 1700,
      birth_year_type: 'e',
      confidence: 'CONFIRMED',
      bio: 'Early Virginia Johnson. On 1721 road order with Thomas Johnson, John Bunch, David Meriwether on Taylors Creek. Posted security for Benjamin Johnson estate 1744. Listed on John Payne\'s tithables list 1746.'
    },
    // Isaac Johnson (Dickson Co TN)
    {
      id: 'JNSN-TN-e1780-02',
      surname: 'Johnson',
      given_name: 'Isaac',
      designation: 'of Dickson County',
      birth_year: 1780,
      birth_year_type: 'e',
      death_year: 1820,
      death_year_type: 'c',
      confidence: 'PROBABLE',
      bio: 'Lived in Dickson County TN. Possibly related to Nathaniel Johnson. Died c.1820. Son Isaac Johnson went to Johnson County, Arkansas about same time as Mary Polly Johnson Shropshire.'
    },
    // Benjamin Johnson (of Goochland)
    {
      id: 'JNSN-VA-e1715-02',
      surname: 'Johnson',
      given_name: 'Benjamin',
      designation: 'of Goochland',
      birth_year: 1715,
      birth_year_type: 'e',
      death_year: 1744,
      death_year_type: 'b',
      death_place_code: 'Goochland County, VA',
      confidence: 'CONFIRMED',
      bio: 'Died intestate before 1744. Widow Elizabeth Johnson administered estate. Isaac Johnson posted security. Appraisers included George Payne and Robert Burton Jr. (Burton family connection). Estate valued at 34 pounds, 9 shillings, 6 pence.'
    },
    // Elizabeth Johnson (widow of Benjamin)
    {
      id: 'JNSN-VA-e1720-01',
      surname: 'Johnson',
      given_name: 'Elizabeth',
      birth_year: 1720,
      birth_year_type: 'e',
      confidence: 'CONFIRMED',
      bio: 'Widow of Benjamin Johnson of Goochland County. Administered his estate 1744.'
    }
  ]

  for (const person of people) {
    const { data: existing } = await supabase
      .from('people')
      .select('id')
      .eq('id', person.id)
      .single()

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
  // 3. CREATE LOCATION_RESIDENTS
  // ---------------------------------------------------------------------------
  console.log('\n--- Creating Location Residents ---')

  // Get location IDs
  const { data: allLocs } = await supabase
    .from('locations')
    .select('id, slug, name')

  const locMap = {}
  allLocs?.forEach(l => { locMap[l.slug] = l.id })

  const locationResidents = [
    // Agnes Johnson
    { person_id: 'JNSN-TN-e1775-02', location_slug: 'bartons-creek-dickson-tn', date_first: '1800', date_last: '1823', residence_type: 'resident', evidence: 'Tony\'s research - wife of Hudson Johnson' },
    { person_id: 'JNSN-TN-e1775-02', location_slug: 'big-creek-hawkins-tn', date_first: '1800', residence_type: 'resident', evidence: 'Big Creek Baptist Church member' },
    { person_id: 'JNSN-TN-e1775-02', location_slug: 'buffalo-creek-henry-va', residence_type: 'resident', evidence: 'Tony\'s header notes' },
    // Mary Johnson (Polly)
    { person_id: 'JNSN-TN-e1790-02', location_slug: 'dickson-county-tn', date_first: '1809', residence_type: 'resident', evidence: 'Father Hudson Johnson witness 1809 deed' },
    // Joel Shropshire
    { person_id: 'SHRP-TN-e1785-01', location_slug: 'bartons-creek-dickson-tn', date_first: '1809', residence_type: 'resident', evidence: 'Witness to 1809 deed with father-in-law Hudson Johnson' },
    // Rebecca Johnson
    { person_id: 'JNSN-VA-e1750-02', location_slug: 'bedford-county-va', date_first: '1769', date_last: '1790', residence_type: 'resident', evidence: 'Son stated family was of Bedford County, Virginia' },
    // Charles Jonson Hogan
    { person_id: 'HOGN-VA-e1770-01', location_slug: 'bedford-county-va', date_first: '1770', date_last: '1800', residence_type: 'resident', evidence: 'Stated he was of Bedford County, Virginia' },
    { person_id: 'HOGN-VA-e1770-01', location_slug: 'st-martinville-la', date_first: '1806', date_last: '1808', residence_type: 'resident', evidence: 'Children baptized there 1806, 1808' },
    // Sara Hatcher
    { person_id: 'HTCH-VA-e1775-01', location_slug: 'st-martinville-la', date_first: '1806', residence_type: 'resident', evidence: 'Children baptized there' },
    // Hiram Johnson
    { person_id: 'JNSN-TN-e1800-01', location_slug: 'tumbling-creek-humphreys-tn', date_first: '1826', date_last: '1844', residence_type: 'resident', evidence: 'Wife\'s land deeds; buried Cannon Cemetery on Tumbling Creek' },
    // Margaret Johnson
    { person_id: 'JNSN-TN-b1793-01', location_slug: 'tumbling-creek-humphreys-tn', date_first: '1826', date_last: '1850', residence_type: 'landowner', evidence: 'Multiple land deeds in her name 1826-1849' },
    { person_id: 'JNSN-TN-b1793-01', location_slug: 'rices-branch-humphreys-tn', date_first: '1842', residence_type: 'landowner', evidence: 'State grant 150 acres 14 June 1842' },
    // James David Johnson
    { person_id: 'JNSN-TN-e1820-01', location_slug: 'tumbling-creek-humphreys-tn', date_first: '1849', date_last: '1854', residence_type: 'resident', evidence: '1849 partnership with mother; 1854 petition' },
    // Isaac Johnson (early VA)
    { person_id: 'JNSN-VA-e1700-01', location_slug: 'taylors-creek-hanover-va', date_first: '1721', residence_type: 'resident', evidence: '1721 road order' },
    { person_id: 'JNSN-VA-e1700-01', location_slug: 'goochland-county-va', date_first: '1744', date_last: '1746', residence_type: 'resident', evidence: 'Security for Benjamin Johnson estate 1744; tithables list 1746' },
    // Isaac Johnson (Dickson)
    { person_id: 'JNSN-TN-e1780-02', location_slug: 'dickson-county-tn', date_first: '1800', date_last: '1820', residence_type: 'resident', evidence: 'Researcher notes' },
    // Benjamin Johnson (Goochland)
    { person_id: 'JNSN-VA-e1715-02', location_slug: 'goochland-county-va', date_first: '1744', residence_type: 'resident', evidence: 'Estate administration 1744' }
  ]

  for (const lr of locationResidents) {
    const locId = locMap[lr.location_slug]
    if (!locId) {
      console.log(`  Location not found: ${lr.location_slug}`)
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
        console.log(`  Error creating location resident ${lr.person_id} at ${lr.location_slug}:`, error.message)
      } else {
        console.log(`  Created: ${lr.person_id} at ${lr.location_slug}`)
      }
    } else {
      console.log(`  Exists: ${lr.person_id} at ${lr.location_slug}`)
    }
  }

  // ---------------------------------------------------------------------------
  // 4. CREATE FAMILY RELATIONSHIPS (bidirectional)
  // ---------------------------------------------------------------------------
  console.log('\n--- Creating Family Relationships ---')

  const relationships = [
    // Hudson Johnson + Agnes Johnson = spouse
    { person1: 'JNSN-TN-e1770-01', person2: 'JNSN-TN-e1775-02', type: 'spouse', evidence: 'Tony L. Johnson direct ancestor statement; Big Creek Baptist Church records' },

    // Hudson Johnson is father of Mary Johnson
    { person1: 'JNSN-TN-e1790-02', person2: 'JNSN-TN-e1770-01', type: 'father', evidence: 'Tony\'s research; Joel Shropshire witnessed deed with Hudson' },
    { person1: 'JNSN-TN-e1790-02', person2: 'JNSN-TN-e1775-02', type: 'mother', evidence: 'Tony\'s research' },

    // Mary Johnson + Joel Shropshire = spouse
    { person1: 'JNSN-TN-e1790-02', person2: 'SHRP-TN-e1785-01', type: 'spouse', evidence: 'Tony\'s research notes' },

    // Rebecca Johnson + Humphrey Hogan = spouse
    { person1: 'JNSN-VA-e1750-02', person2: 'HOGN-VA-e1745-01', type: 'spouse', evidence: 'Louisiana church records' },

    // Rebecca Johnson is mother of Charles Jonson Hogan
    { person1: 'HOGN-VA-e1770-01', person2: 'JNSN-VA-e1750-02', type: 'mother', evidence: 'Louisiana church records: Charles Jonson Hogans, son of Homfrey and Rebecca Jonson Hogan' },
    { person1: 'HOGN-VA-e1770-01', person2: 'HOGN-VA-e1745-01', type: 'father', evidence: 'Louisiana church records' },

    // Charles Jonson Hogan + Sara Hatcher = spouse
    { person1: 'HOGN-VA-e1770-01', person2: 'HTCH-VA-e1775-01', type: 'spouse', evidence: 'Louisiana church records - children baptized 1806, 1808' },

    // Larkin Johnson + Olivia Renfro = spouse
    { person1: 'JNSN-TN-e1780-01', person2: 'RNFR-TN-b1809-01', type: 'spouse', evidence: 'Tony\'s research notes' },

    // Hiram Johnson + Margaret Johnson = spouse
    { person1: 'JNSN-TN-e1800-01', person2: 'JNSN-TN-b1793-01', type: 'spouse', evidence: 'Humphreys Co TN deeds; 1854 petition identifies Hiram as father' },

    // Hiram Johnson is father of James David Johnson
    { person1: 'JNSN-TN-e1820-01', person2: 'JNSN-TN-e1800-01', type: 'father', evidence: '1854 petition: James David Johnson is Petitioning to sell land of Margaret Johnson decd. in right of their father Hiram Johnson' },
    { person1: 'JNSN-TN-e1820-01', person2: 'JNSN-TN-b1793-01', type: 'mother', evidence: '1854 petition' },

    // Benjamin Johnson + Elizabeth Johnson = spouse
    { person1: 'JNSN-VA-e1715-02', person2: 'JNSN-VA-e1720-01', type: 'spouse', evidence: 'Goochland Co estate records 1744 - Elizabeth as widow' }
  ]

  for (const rel of relationships) {
    // Check if person1 exists
    const { data: p1 } = await supabase.from('people').select('id').eq('id', rel.person1).single()
    const { data: p2 } = await supabase.from('people').select('id').eq('id', rel.person2).single()

    if (!p1) {
      console.log(`  Person not found: ${rel.person1}`)
      continue
    }
    if (!p2) {
      console.log(`  Person not found: ${rel.person2}`)
      continue
    }

    // Forward relationship
    const { data: existingFwd } = await supabase
      .from('family_relationships')
      .select('id')
      .eq('person_id', rel.person1)
      .eq('related_person_id', rel.person2)
      .eq('relationship_type', rel.type)
      .single()

    if (!existingFwd) {
      const { error } = await supabase.from('family_relationships').insert({
        person_id: rel.person1,
        related_person_id: rel.person2,
        relationship_type: rel.type,
        evidence: rel.evidence,
        relationship_status: 'confirmed'
      })
      if (error) {
        console.log(`  Error creating ${rel.person1} -> ${rel.person2} (${rel.type}):`, error.message)
      } else {
        console.log(`  Created: ${rel.person1} -> ${rel.person2} (${rel.type})`)
      }
    } else {
      console.log(`  Exists: ${rel.person1} -> ${rel.person2} (${rel.type})`)
    }

    // Inverse relationship
    let inverseType = rel.type
    if (rel.type === 'father') inverseType = 'child'
    else if (rel.type === 'mother') inverseType = 'child'
    else if (rel.type === 'child') inverseType = 'parent'

    const { data: existingInv } = await supabase
      .from('family_relationships')
      .select('id')
      .eq('person_id', rel.person2)
      .eq('related_person_id', rel.person1)
      .eq('relationship_type', inverseType)
      .single()

    if (!existingInv) {
      const { error } = await supabase.from('family_relationships').insert({
        person_id: rel.person2,
        related_person_id: rel.person1,
        relationship_type: inverseType,
        evidence: rel.evidence,
        relationship_status: 'confirmed'
      })
      if (error && !error.message.includes('duplicate')) {
        console.log(`  Error creating inverse ${rel.person2} -> ${rel.person1} (${inverseType}):`, error.message)
      } else if (!error) {
        console.log(`  Created: ${rel.person2} -> ${rel.person1} (${inverseType})`)
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 5. CREATE ASSOCIATIONS
  // ---------------------------------------------------------------------------
  console.log('\n--- Creating Associations ---')

  const associations = [
    // Rebecca Johnson possibly related to Walter Johnson
    {
      person_id: 'JNSN-VA-e1750-02',
      associated_person_id: 'JNSN-VA-e1740-01',
      association_type: 'possibly_related',
      context: 'Researcher note: Rebecca Johnson possibly relative of Walter Johnson of Sullivan County, Tennessee',
      confidence: 'possible'
    },
    // Isaac Johnson (VA) posted security for Benjamin Johnson
    {
      person_id: 'JNSN-VA-e1700-01',
      associated_person_id: 'JNSN-VA-e1715-02',
      association_type: 'estate_security',
      context: 'Isaac posted security for Benjamin Johnson\'s estate 1744 - often indicates kinship',
      date: '1744',
      confidence: 'confirmed'
    }
  ]

  for (const assoc of associations) {
    const { data: p1 } = await supabase.from('people').select('id').eq('id', assoc.person_id).single()
    const { data: p2 } = await supabase.from('people').select('id').eq('id', assoc.associated_person_id).single()

    if (!p1 || !p2) {
      console.log(`  Person not found for association: ${assoc.person_id} or ${assoc.associated_person_id}`)
      continue
    }

    const { data: existing } = await supabase
      .from('associations')
      .select('id')
      .eq('person_id', assoc.person_id)
      .eq('associated_person_id', assoc.associated_person_id)
      .single()

    if (!existing) {
      const { error } = await supabase.from('associations').insert(assoc)
      if (error) {
        console.log(`  Error creating association:`, error.message)
      } else {
        console.log(`  Created: ${assoc.person_id} <-> ${assoc.associated_person_id} (${assoc.association_type})`)
      }
    } else {
      console.log(`  Exists: ${assoc.person_id} <-> ${assoc.associated_person_id}`)
    }
  }

  // ---------------------------------------------------------------------------
  // 6. CREATE RESEARCH QUESTIONS
  // ---------------------------------------------------------------------------
  console.log('\n--- Creating Research Questions ---')

  const researchQuestions = [
    {
      person_id: 'JNSN-VA-e1750-02',
      question: 'Is Rebecca Johnson related to Walter Johnson of Sullivan County?',
      question_type: 'relationship',
      status: 'open',
      evidence_for: 'Researcher note states Rebecca Johnson possibly relative of Walter Johnson of Sullivan County, Tennessee',
      evidence_against: 'No documented connection',
      research_action: 'Compare Bedford County VA Johnson records with Sullivan County TN Johnson records',
      source_file: '1692-Johnson-renfro-Looney.docx'
    },
    {
      person_id: 'HTCH-VA-e1775-01',
      question: 'What is Sara Hatcher\'s connection to the Henrico County Hatcher family?',
      question_type: 'relationship',
      status: 'open',
      evidence_for: 'Hatcher surname; husband\'s family from Bedford County VA (near Henrico migration path)',
      evidence_against: 'No documented connection; Louisiana location',
      research_action: 'Research Hatcher families who migrated from Virginia to Louisiana; check for connections to Ben Hatcher of Henrico/Goochland',
      source_file: '1692-Johnson-renfro-Looney.docx'
    },
    {
      person_id: 'JNSN-TN-e1800-01',
      question: 'What is Hiram Johnson\'s parentage and connection to Timothy Rich line?',
      question_type: 'relationship',
      status: 'open',
      evidence_for: 'DNA match to descendants of Timothy Rich of Henrico Co VA',
      evidence_against: 'No paper trail documented',
      research_action: 'Research Timothy Rich descendants; check for migration to Tennessee',
      source_file: '1692-Johnson-renfro-Looney.docx'
    },
    {
      person_id: 'JNSN-VA-e1700-01',
      question: 'Is Isaac Johnson of Goochland (1721-1746) related to Benjamin Johnson whose estate he secured?',
      question_type: 'relationship',
      status: 'open',
      evidence_for: 'Isaac posted security for Benjamin\'s estate - often indicates kinship',
      evidence_against: 'Could be neighbor/friend obligation',
      research_action: 'Search Goochland County records for Isaac Johnson and Benjamin Johnson connections',
      source_file: '1692-Johnson-renfro-Looney.docx'
    },
    {
      person_id: 'RNFR-VA-b1775-01',
      question: 'What is the connection between Eleanor Renfro who married John Johnson and Eleanor Renfro who married John R. Choate?',
      question_type: 'identity',
      status: 'open',
      evidence_for: 'Both born c.1775; both married men named John; overlapping geography (Montgomery Co VA and Dickson Co TN on same migration path)',
      evidence_against: 'Different death dates (1833 vs 1845); different husbands\' surnames; second Eleanor\'s parents identified as Isaac Alexander Renfro and Mary McKinney',
      research_action: 'Determine if same person with two husbands (John Johnson died first), or two different women, or misattribution',
      source_file: '1692-Johnson-renfro-Looney.docx'
    }
  ]

  for (const rq of researchQuestions) {
    const { data: existing } = await supabase
      .from('research_questions')
      .select('id')
      .eq('question', rq.question)
      .single()

    if (!existing) {
      const { error } = await supabase.from('research_questions').insert(rq)
      if (error) {
        console.log(`  Error creating research question:`, error.message)
      } else {
        console.log(`  Created: ${rq.question.substring(0, 60)}...`)
      }
    } else {
      console.log(`  Exists: ${rq.question.substring(0, 60)}...`)
    }
  }

  // ---------------------------------------------------------------------------
  // 7. SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n=== IMPORT SUMMARY ===')

  const { count: peopleCount } = await supabase.from('people').select('*', { count: 'exact', head: true })
  const { count: relCount } = await supabase.from('family_relationships').select('*', { count: 'exact', head: true })
  const { count: locCount } = await supabase.from('locations').select('*', { count: 'exact', head: true })
  const { count: rqCount } = await supabase.from('research_questions').select('*', { count: 'exact', head: true })

  console.log(`Total People: ${peopleCount}`)
  console.log(`Total Family Relationships: ${relCount}`)
  console.log(`Total Locations: ${locCount}`)
  console.log(`Total Research Questions: ${rqCount}`)

  console.log('\nKEY FINDINGS IMPORTED:')
  console.log('  - AGNES JOHNSON - wife of Hudson Johnson, completes Tony\'s direct ancestral family')
  console.log('  - SARA HATCHER married Charles Jonson Hogan - KEY HATCHER CONNECTION')
  console.log('  - HIRAM JOHNSON DNA match to Timothy Rich line')
  console.log('  - Isaac Johnson (1721) on road order with Thomas Johnson, John Bunch, David Meriwether')
  console.log('  - Larkin Johnson married Olivia Renfro - another Johnson-Renfro connection')
}

main().catch(console.error)
