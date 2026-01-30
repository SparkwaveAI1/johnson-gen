/**
 * CLEANUP DUPLICATE RELATIONSHIPS
 *
 * This script:
 * 1. Identifies duplicate relationships (same person pair with conflicting types)
 * 2. Keeps the CORRECT relationship based on birth years
 * 3. Deletes the incorrect/redundant ones
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://oxpkqnmuwqcnmzvavsuz.supabase.co',
  'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
)

const timestamp = () => new Date().toISOString().replace('T', ' ').substring(0, 19)

async function main() {
  console.log(`[${timestamp()}] === CLEANUP DUPLICATE RELATIONSHIPS ===\n`)

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

  console.log(`Found ${rels.length} parent/child relationships\n`)

  // Group by unordered pair
  const byPair = new Map()
  for (const rel of rels) {
    const pairKey = [rel.person_id, rel.related_person_id].sort().join('|')
    if (!byPair.has(pairKey)) {
      byPair.set(pairKey, [])
    }
    byPair.get(pairKey).push(rel)
  }

  const toDelete = []
  const toUpdate = []

  for (const [pairKey, pairRels] of byPair) {
    if (pairRels.length <= 2) continue // Normal bidirectional relationship

    const [id1, id2] = pairKey.split('|')
    const person1 = peopleMap.get(id1)
    const person2 = peopleMap.get(id2)

    if (!person1 || !person2) continue

    console.log(`\n--- Cleaning up: ${person1.given_name} ${person1.surname} (b.${person1.birth_year || '?'}) <-> ${person2.given_name} ${person2.surname} (b.${person2.birth_year || '?'}) ---`)
    console.log(`Found ${pairRels.length} relationship records:`)

    for (const rel of pairRels) {
      const fromPerson = peopleMap.get(rel.person_id)
      console.log(`  ${rel.id}: ${fromPerson?.given_name} [${rel.relationship_type}] -> ${rel.related_person_id === id1 ? person1.given_name : person2.given_name}`)
    }

    // Determine the correct relationship based on birth years
    let olderPerson, youngerPerson
    if (person1.birth_year && person2.birth_year) {
      if (person1.birth_year < person2.birth_year) {
        olderPerson = person1
        youngerPerson = person2
      } else {
        olderPerson = person2
        youngerPerson = person1
      }

      console.log(`\n  Based on birth years: ${olderPerson.given_name} (b.${olderPerson.birth_year}) is PARENT of ${youngerPerson.given_name} (b.${youngerPerson.birth_year})`)

      // We want exactly 2 records:
      // 1. olderPerson -> youngerPerson with type 'child' (meaning "my child is...")
      // 2. youngerPerson -> olderPerson with type 'father' (meaning "my father is...")

      const correctForward = {
        person_id: olderPerson.id,
        related_person_id: youngerPerson.id,
        relationship_type: 'child'
      }
      const correctInverse = {
        person_id: youngerPerson.id,
        related_person_id: olderPerson.id,
        relationship_type: 'father'
      }

      let hasCorrectForward = false
      let hasCorrectInverse = false

      for (const rel of pairRels) {
        // Check if this is the correct forward relationship
        if (rel.person_id === correctForward.person_id &&
            rel.related_person_id === correctForward.related_person_id &&
            rel.relationship_type === correctForward.relationship_type) {
          hasCorrectForward = true
          console.log(`  KEEP: ${rel.id} (correct forward)`)
        }
        // Check if this is the correct inverse relationship
        else if (rel.person_id === correctInverse.person_id &&
                 rel.related_person_id === correctInverse.related_person_id &&
                 rel.relationship_type === correctInverse.relationship_type) {
          hasCorrectInverse = true
          console.log(`  KEEP: ${rel.id} (correct inverse)`)
        }
        // Otherwise delete it
        else {
          console.log(`  DELETE: ${rel.id} (wrong direction or duplicate)`)
          toDelete.push(rel.id)
        }
      }

      // If we don't have the correct relationships, we need to create them
      if (!hasCorrectForward) {
        // Find an existing record we can update instead of delete
        const candidate = pairRels.find(r =>
          r.person_id === correctForward.person_id &&
          r.related_person_id === correctForward.related_person_id &&
          !toDelete.includes(r.id)
        )
        if (candidate) {
          toDelete.splice(toDelete.indexOf(candidate.id), 1) // Don't delete
          toUpdate.push({
            id: candidate.id,
            relationship_type: 'child'
          })
          console.log(`  UPDATE: ${candidate.id} -> child`)
        }
      }

      if (!hasCorrectInverse) {
        const candidate = pairRels.find(r =>
          r.person_id === correctInverse.person_id &&
          r.related_person_id === correctInverse.related_person_id &&
          !toDelete.includes(r.id)
        )
        if (candidate) {
          toDelete.splice(toDelete.indexOf(candidate.id), 1)
          toUpdate.push({
            id: candidate.id,
            relationship_type: 'father'
          })
          console.log(`  UPDATE: ${candidate.id} -> father`)
        }
      }
    }
  }

  console.log(`\n\n=== SUMMARY ===`)
  console.log(`Records to delete: ${toDelete.length}`)
  console.log(`Records to update: ${toUpdate.length}`)

  if (toDelete.length === 0 && toUpdate.length === 0) {
    console.log('\nNo changes needed!')
    return
  }

  console.log('\n--- Applying changes ---\n')

  // Delete first
  for (const id of toDelete) {
    const { error } = await supabase
      .from('family_relationships')
      .delete()
      .eq('id', id)

    if (error) {
      console.log(`ERROR deleting ${id}: ${error.message}`)
    } else {
      console.log(`DELETED: ${id}`)
    }
  }

  // Then update
  for (const upd of toUpdate) {
    const { error } = await supabase
      .from('family_relationships')
      .update({ relationship_type: upd.relationship_type })
      .eq('id', upd.id)

    if (error) {
      console.log(`ERROR updating ${upd.id}: ${error.message}`)
    } else {
      console.log(`UPDATED: ${upd.id} -> ${upd.relationship_type}`)
    }
  }

  // Verify Absalom
  console.log('\n--- Final Verification: Absalom Looney ---\n')
  const { data: absalomRels } = await supabase
    .from('family_relationships')
    .select('*, related_person:related_person_id(id, given_name, surname, birth_year)')
    .eq('person_id', 'LNEY-VA-b1729-01')

  for (const r of absalomRels || []) {
    const rp = r.related_person
    console.log(`  ${r.relationship_type}: ${rp?.given_name} ${rp?.surname} (b.${rp?.birth_year || '?'})`)
  }
}

main().catch(console.error)
