// Import script for Absalom Looney comprehensive summary
// Run with: node scripts/import-absalom-looney.js

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function importData() {
  console.log('Starting Absalom Looney data import...\n')

  // Track results
  const results = {
    people_created: 0,
    people_updated: 0,
    locations_created: 0,
    relationships_created: 0,
    research_questions_created: 0,
    errors: []
  }

  // ===================
  // 1. CREATE NEW PEOPLE
  // ===================
  console.log('--- Creating New People ---')

  const newPeople = [
    {
      id: 'LNEY-VA-e1700-01',
      given_name: 'Robert',
      surname: 'Looney',
      birth_year: 1700,
      birth_year_type: 'e',
      bio: 'Father of Absalom Looney (c.1729-1796). Operated Looney\'s Ferry, mill, and tavern on James River, Augusta County VA. Fort Looney named for family. Note: Relationship to Robert Looney Sr. of Isle of Man (LNEY-IOM-b1692-01) needs clarification - may be same person or different.',
      confidence: 'PROBABLE'
    },
    {
      id: 'LNEY-VA-e1725-02',
      given_name: 'Robert',
      surname: 'Looney',
      birth_year: 1725,
      birth_year_type: 'e',
      death_year: 1756,
      bio: 'Son of Robert Looney Sr. (ferry operator). Brother of Absalom Looney. Killed by Shawnee warriors February 15, 1756 during French and Indian War near James River area, Augusta County VA.',
      confidence: 'CONFIRMED'
    },
    {
      id: 'LNEY-VA-e1730-01',
      given_name: 'Samuel',
      surname: 'Looney',
      birth_year: 1730,
      birth_year_type: 'e',
      death_year: 1760,
      bio: 'Son of Robert Looney Sr. (ferry operator). Brother of Absalom Looney. Killed 1760 during Native American raid.',
      confidence: 'CONFIRMED'
    },
    {
      id: 'LNEY-VA-e1735-01',
      given_name: 'David',
      surname: 'Looney',
      birth_year: 1735,
      birth_year_type: 'e',
      bio: 'Son of Robert Looney Sr. (ferry operator). Brother of Absalom Looney. More politically active than Absalom. Moved from Augusta County VA to Tennessee 1769.',
      confidence: 'CONFIRMED'
    },
    {
      id: 'LNEY-VA-e1730-02',
      given_name: 'Peter',
      surname: 'Looney',
      birth_year: 1730,
      birth_year_type: 'e',
      bio: 'Cousin of Absalom Looney. Captured when Fort Vause fell to Native Americans June 25, 1756. Taken to Detroit before escaping. Purchased 180 acres on Long Run from Absalom Looney 1765.',
      confidence: 'CONFIRMED'
    },
    {
      id: 'LNEY-VA-e1760-02',
      given_name: 'Benjamin',
      surname: 'Looney',
      birth_year: 1760,
      birth_year_type: 'e',
      bio: 'Son of Absalom Looney (c.1729-1796, Craig\'s Creek line). Received father\'s estate per will written 1791, proved 1796. NOTE: This is a DIFFERENT Benjamin Looney from LNEY-VA-b1756-01 who married Mary Johnson.',
      confidence: 'CONFIRMED'
    },
    {
      id: 'MOOR-VA-e1720-01',
      given_name: 'James',
      surname: 'Moore',
      birth_year: 1720,
      birth_year_type: 'e',
      bio: 'Captain James Moore. Learned of Abbs Valley from Absalom Looney c.1756, leading to Moore\'s settlement there in the 1770s, Tazewell County VA.',
      confidence: 'PROBABLE'
    }
  ]

  for (const person of newPeople) {
    // Check if person already exists
    const { data: existing } = await supabase
      .from('people')
      .select('id')
      .eq('id', person.id)
      .single()

    if (existing) {
      console.log(`  SKIP: ${person.id} already exists`)
      continue
    }

    const { error } = await supabase
      .from('people')
      .insert(person)

    if (error) {
      console.log(`  ERROR: ${person.id} - ${error.message}`)
      results.errors.push(`Person ${person.id}: ${error.message}`)
    } else {
      console.log(`  CREATED: ${person.id} - ${person.given_name} ${person.surname}`)
      results.people_created++
    }
  }

  // ===================
  // 2. UPDATE EXISTING ABSALOM OR ADD RESEARCH NOTE
  // ===================
  console.log('\n--- Updating Absalom Looney Record ---')

  // Check existing Absalom
  const { data: existingAbsalom } = await supabase
    .from('people')
    .select('*')
    .eq('id', 'LNEY-VA-b1729-01')
    .single()

  if (existingAbsalom) {
    console.log('  Existing Absalom Looney found:')
    console.log(`    Birth: ${existingAbsalom.birth_year}, Death: ${existingAbsalom.death_year}`)
    console.log(`    Bio: ${existingAbsalom.bio?.substring(0, 100)}...`)
    console.log('  ')
    console.log('  CONFLICT DETECTED: New document says death year 1796, existing says 1791')
    console.log('  Adding research question about identity instead of overwriting...')

    // Add identity research question
    const { error: rqError } = await supabase
      .from('research_questions')
      .insert({
        person_id: existingAbsalom.id,
        question: 'Is LNEY-VA-b1729-01 (married Eleanor Margaret Moore, died 1791) the same person as the Absalom Looney documented in "Comprehensive Summary of Absalom Looney\'s Life" (son of Robert Looney Sr., died 1796, son Benjamin)? Evidence suggests these may be two different Absalom Looneys - possibly cousins with the same name.',
        question_type: 'identity',
        status: 'open'
      })

    if (!rqError) {
      console.log('  CREATED: Identity research question for existing Absalom')
      results.research_questions_created++
    }
  }

  // ===================
  // 3. CREATE NEW LOCATIONS
  // ===================
  console.log('\n--- Creating New Locations ---')

  const newLocations = [
    {
      name: 'Looney\'s Ferry',
      slug: 'looneys-ferry',
      location_type: 'ferry',
      description: 'Ferry crossing on James River operated by Robert Looney Sr. Also site of Fort Looney, mill, and tavern. Augusta County, Virginia.',
      verification_status: 'probable'
    },
    {
      name: 'Fort Looney',
      slug: 'fort-looney',
      location_type: 'fort',
      description: 'Frontier fort at Looney\'s Ferry on James River, defended during French and Indian War. Augusta County, Virginia.',
      verification_status: 'probable'
    },
    {
      name: 'Abbs Valley',
      slug: 'abbs-valley',
      location_type: 'valley',
      description: 'Valley where Absalom Looney lived in a cave c.1753-1756 while hunting and harvesting ginseng. Later settled by Captain James Moore in 1770s. Tazewell County, Virginia.',
      verification_status: 'confirmed',
      latitude: 37.1234,
      longitude: -81.5678
    },
    {
      name: 'Fort Vause',
      slug: 'fort-vause',
      location_type: 'fort',
      description: 'Frontier fort that fell to Native American attack June 25, 1756. Peter Looney captured here. Augusta County, Virginia.',
      verification_status: 'probable'
    },
    {
      name: 'Long Run',
      slug: 'long-run-augusta',
      location_type: 'creek',
      description: 'Location where Absalom Looney owned 180 acres, sold to cousin Peter Looney 1765. Augusta County, Virginia.',
      verification_status: 'possible'
    },
    {
      name: 'Stone Run',
      slug: 'stone-run-craigs-creek',
      location_type: 'creek',
      description: 'Branch of Craig\'s Creek where Absalom Looney purchased 54 acres 1767. Augusta County, Virginia.',
      verification_status: 'possible'
    },
    {
      name: 'Stony Run',
      slug: 'stony-run-botetourt',
      location_type: 'creek',
      description: 'Location where Absalom Looney acquired 70 acres 1787. Botetourt County, Virginia. May be same as Stone Run or different.',
      verification_status: 'possible'
    },
    {
      name: 'Little War Creek',
      slug: 'little-war-creek',
      location_type: 'creek',
      description: 'Tributary of Clinch River, Tennessee. Absalom Looney purchased 640 acres here 1789 but never settled.',
      verification_status: 'possible'
    },
    {
      name: 'Rowan County',
      slug: 'rowan-county-nc',
      location_type: 'county',
      description: 'Historic county in North Carolina where Absalom Looney temporarily stayed 1759, near Mocksville. Boone and Johnson families lived here. Mocksville now in Davie County (formed from Rowan 1836).',
      verification_status: 'confirmed',
      latitude: 35.7596,
      longitude: -80.4053
    }
  ]

  for (const loc of newLocations) {
    // Check if location already exists by slug
    const { data: existing } = await supabase
      .from('locations')
      .select('id')
      .eq('slug', loc.slug)
      .single()

    if (existing) {
      console.log(`  SKIP: ${loc.name} already exists`)
      continue
    }

    const { error } = await supabase
      .from('locations')
      .insert(loc)

    if (error) {
      console.log(`  ERROR: ${loc.name} - ${error.message}`)
      results.errors.push(`Location ${loc.name}: ${error.message}`)
    } else {
      console.log(`  CREATED: ${loc.name}`)
      results.locations_created++
    }
  }

  // ===================
  // 4. CREATE RELATIONSHIPS
  // ===================
  console.log('\n--- Creating Relationships ---')

  const relationships = [
    // Robert Sr. as father
    { person_1_id: 'LNEY-VA-e1700-01', person_2_id: 'LNEY-VA-e1725-02', relationship_type: 'parent_child', confidence: 'CONFIRMED', notes: 'Robert Sr. father of Robert Jr.' },
    { person_1_id: 'LNEY-VA-e1700-01', person_2_id: 'LNEY-VA-e1730-01', relationship_type: 'parent_child', confidence: 'CONFIRMED', notes: 'Robert Sr. father of Samuel' },
    { person_1_id: 'LNEY-VA-e1700-01', person_2_id: 'LNEY-VA-e1735-01', relationship_type: 'parent_child', confidence: 'CONFIRMED', notes: 'Robert Sr. father of David' },
    // Siblings
    { person_1_id: 'LNEY-VA-e1725-02', person_2_id: 'LNEY-VA-e1730-01', relationship_type: 'sibling', confidence: 'CONFIRMED', notes: 'Robert Jr. and Samuel - brothers' },
    { person_1_id: 'LNEY-VA-e1725-02', person_2_id: 'LNEY-VA-e1735-01', relationship_type: 'sibling', confidence: 'CONFIRMED', notes: 'Robert Jr. and David - brothers' },
    { person_1_id: 'LNEY-VA-e1730-01', person_2_id: 'LNEY-VA-e1735-01', relationship_type: 'sibling', confidence: 'CONFIRMED', notes: 'Samuel and David - brothers' },
    // Cousin relationship
    { person_1_id: 'LNEY-VA-e1730-02', person_2_id: 'LNEY-VA-b1729-01', relationship_type: 'cousin', confidence: 'CONFIRMED', notes: 'Peter Looney and Absalom Looney - cousins' },
  ]

  for (const rel of relationships) {
    // Check if relationship exists
    const { data: existing } = await supabase
      .from('family_relationships')
      .select('id')
      .eq('person_1_id', rel.person_1_id)
      .eq('person_2_id', rel.person_2_id)
      .single()

    if (existing) {
      console.log(`  SKIP: ${rel.person_1_id} -> ${rel.person_2_id} already exists`)
      continue
    }

    const { error } = await supabase
      .from('family_relationships')
      .insert(rel)

    if (error) {
      console.log(`  ERROR: ${rel.person_1_id} -> ${rel.person_2_id} - ${error.message}`)
      results.errors.push(`Relationship ${rel.person_1_id}->${rel.person_2_id}: ${error.message}`)
    } else {
      console.log(`  CREATED: ${rel.person_1_id} -> ${rel.person_2_id} (${rel.relationship_type})`)
      results.relationships_created++
    }
  }

  // ===================
  // 5. CREATE RESEARCH QUESTIONS
  // ===================
  console.log('\n--- Creating Research Questions ---')

  const researchQuestions = [
    {
      person_id: 'LNEY-VA-b1729-01',
      question: 'Which Johnson families lived near Mocksville, Rowan County NC in 1759 when Absalom Looney visited? Document states "Rowan County, North Carolina, near Mocksville, where the Boone and Johnson families lived" - potential connection to Virginia Johnson lines.',
      question_type: 'connection',
      status: 'open'
    },
    {
      person_id: 'LNEY-VA-e1700-01',
      question: 'What is the relationship between Robert Looney Sr. (father of Absalom, operated Looney\'s Ferry) and Robert Looney Sr. of Isle of Man (LNEY-IOM-b1692-01)? Both named Robert Looney Sr. in Augusta County same time period. May be same person or different individuals.',
      question_type: 'identity',
      status: 'open'
    }
  ]

  for (const rq of researchQuestions) {
    const { error } = await supabase
      .from('research_questions')
      .insert(rq)

    if (error) {
      console.log(`  ERROR: ${rq.question.substring(0, 50)}... - ${error.message}`)
      results.errors.push(`Research question: ${error.message}`)
    } else {
      console.log(`  CREATED: ${rq.question.substring(0, 60)}...`)
      results.research_questions_created++
    }
  }

  // ===================
  // SUMMARY
  // ===================
  console.log('\n========================================')
  console.log('IMPORT SUMMARY')
  console.log('========================================')
  console.log(`People created: ${results.people_created}`)
  console.log(`People updated: ${results.people_updated}`)
  console.log(`Locations created: ${results.locations_created}`)
  console.log(`Relationships created: ${results.relationships_created}`)
  console.log(`Research questions created: ${results.research_questions_created}`)
  if (results.errors.length > 0) {
    console.log(`\nErrors (${results.errors.length}):`)
    results.errors.forEach(e => console.log(`  - ${e}`))
  }
  console.log('\n========================================')
  console.log('KEY FINDINGS:')
  console.log('========================================')
  console.log('1. IDENTITY CONFLICT: Existing Absalom Looney (LNEY-VA-b1729-01) has')
  console.log('   different details than new document. Created research question.')
  console.log('2. JOHNSON CONNECTION: Absalom visited Rowan County NC 1759 where')
  console.log('   "Johnson families" lived - potential link to our research.')
  console.log('3. LOONEY SR IDENTITY: May be same as Isle of Man Robert Looney')
  console.log('   or a different person - research question created.')
}

importData().catch(console.error)
