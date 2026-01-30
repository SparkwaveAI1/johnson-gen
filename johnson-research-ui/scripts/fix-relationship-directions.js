/**
 * FIX RELATIONSHIP DIRECTIONS
 *
 * The database has some parent/child relationships stored with wrong direction.
 * This script detects and fixes them based on birth years:
 * - A parent must be born BEFORE their child
 * - If relationship_type=father but related_person was born AFTER person, it's backwards
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://oxpkqnmuwqcnmzvavsuz.supabase.co',
  'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
)

const timestamp = () => new Date().toISOString().replace('T', ' ').substring(0, 19)

async function main() {
  console.log(`[${timestamp()}] === FIX RELATIONSHIP DIRECTIONS ===\n`)

  // Get all people with birth years
  const { data: people } = await supabase
    .from('people')
    .select('id, given_name, surname, birth_year')

  const peopleMap = new Map(people.map(p => [p.id, p]))

  // Get all parent/child relationships
  const { data: rels } = await supabase
    .from('family_relationships')
    .select('*')
    .in('relationship_type', ['father', 'mother', 'child', 'parent'])

  console.log(`Found ${rels.length} parent/child relationships to check\n`)

  const toFix = []
  const toDelete = [] // For duplicates

  // Group relationships by person pair to detect duplicates
  const relsByPair = new Map()

  for (const rel of rels) {
    const person = peopleMap.get(rel.person_id)
    const relatedPerson = peopleMap.get(rel.related_person_id)

    if (!person || !relatedPerson) continue

    const pairKey = [rel.person_id, rel.related_person_id].sort().join('|')
    if (!relsByPair.has(pairKey)) {
      relsByPair.set(pairKey, [])
    }
    relsByPair.get(pairKey).push(rel)

    // Check if direction makes sense based on birth years
    const personBirth = person.birth_year
    const relatedBirth = relatedPerson.birth_year

    if (!personBirth || !relatedBirth) continue

    // If relationship says related_person is person's PARENT (father/mother)
    // then related_person should be born BEFORE person
    if ((rel.relationship_type === 'father' || rel.relationship_type === 'mother') && relatedBirth > personBirth) {
      console.log(`WRONG: ${person.given_name} ${person.surname} (b.${personBirth}) has ${rel.relationship_type} ${relatedPerson.given_name} ${relatedPerson.surname} (b.${relatedBirth})`)
      console.log(`  -> Should be: child (person was born BEFORE related)`)
      toFix.push({
        id: rel.id,
        person_id: rel.person_id,
        related_person_id: rel.related_person_id,
        current_type: rel.relationship_type,
        correct_type: 'child',
        reason: `Related person born ${relatedBirth} > person born ${personBirth}`
      })
    }

    // If relationship says related_person is person's CHILD
    // then related_person should be born AFTER person
    if (rel.relationship_type === 'child' && relatedBirth < personBirth - 10) { // Allow 10 year buffer
      console.log(`WRONG: ${person.given_name} ${person.surname} (b.${personBirth}) has child ${relatedPerson.given_name} ${relatedPerson.surname} (b.${relatedBirth})`)
      console.log(`  -> Should be: father (person was born AFTER related)`)
      toFix.push({
        id: rel.id,
        person_id: rel.person_id,
        related_person_id: rel.related_person_id,
        current_type: rel.relationship_type,
        correct_type: 'father', // Assume father, could be mother
        reason: `Related person born ${relatedBirth} < person born ${personBirth}`
      })
    }
  }

  // Check for duplicate relationships (same pair, conflicting types)
  console.log('\n--- Checking for duplicates ---\n')
  for (const [pairKey, pairRels] of relsByPair) {
    if (pairRels.length > 2) {
      console.log(`Duplicate relationships for pair: ${pairKey}`)
      for (const rel of pairRels) {
        const person = peopleMap.get(rel.person_id)
        const relatedPerson = peopleMap.get(rel.related_person_id)
        console.log(`  - ${rel.id}: ${person?.given_name} [${rel.relationship_type}] ${relatedPerson?.given_name}`)
      }

      // Keep only one of each logical relationship
      // If same person_id and same type, that's a real duplicate
      const seen = new Set()
      for (const rel of pairRels) {
        const key = `${rel.person_id}|${rel.relationship_type}`
        if (seen.has(key)) {
          toDelete.push(rel.id)
          console.log(`  -> DELETE duplicate: ${rel.id}`)
        } else {
          seen.add(key)
        }
      }
    }
  }

  console.log(`\n=== SUMMARY ===`)
  console.log(`Relationships to fix: ${toFix.length}`)
  console.log(`Duplicates to delete: ${toDelete.length}`)

  if (toFix.length === 0 && toDelete.length === 0) {
    console.log('\nNo fixes needed!')
    return
  }

  console.log('\n--- Applying fixes ---\n')

  // Delete duplicates first
  for (const id of toDelete) {
    const { error } = await supabase
      .from('family_relationships')
      .delete()
      .eq('id', id)

    if (error) {
      console.log(`ERROR deleting ${id}: ${error.message}`)
    } else {
      console.log(`DELETED duplicate: ${id}`)
    }
  }

  // Fix wrong directions
  for (const fix of toFix) {
    const { error } = await supabase
      .from('family_relationships')
      .update({ relationship_type: fix.correct_type })
      .eq('id', fix.id)

    if (error) {
      console.log(`ERROR fixing ${fix.id}: ${error.message}`)
    } else {
      console.log(`FIXED: ${fix.id} - ${fix.current_type} -> ${fix.correct_type}`)
    }
  }

  console.log('\n--- Verification ---\n')

  // Re-check Absalom specifically
  const { data: absalomRels } = await supabase
    .from('family_relationships')
    .select('*, related_person:related_person_id(id, given_name, surname, birth_year)')
    .eq('person_id', 'LNEY-VA-b1729-01')

  console.log('Absalom Looney relationships after fix:')
  for (const r of absalomRels || []) {
    const rp = r.related_person
    console.log(`  ${r.relationship_type}: ${rp?.given_name} ${rp?.surname} (b.${rp?.birth_year || '?'})`)
  }
}

main().catch(console.error)
