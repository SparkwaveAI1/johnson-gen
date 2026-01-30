import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://oxpkqnmuwqcnmzvavsuz.supabase.co',
  'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
)

async function main() {
  const { data } = await supabase
    .from('family_relationships')
    .select('relationship_type, related_person:related_person_id(given_name, surname, birth_year)')
    .eq('person_id', 'LNEY-VA-b1729-01')
    .order('relationship_type')

  console.log('=== ABSALOM LOONEY (b. 1729) ===')
  console.log('What the UI SHOULD display:\n')

  const byType = {}
  for (const r of data || []) {
    if (!byType[r.relationship_type]) byType[r.relationship_type] = []
    byType[r.relationship_type].push(r.related_person)
  }

  if (byType.father || byType.mother) {
    console.log('PARENTS:')
    for (const p of [...(byType.father || []), ...(byType.mother || [])]) {
      console.log(`  - ${p.given_name} ${p.surname} (b. ${p.birth_year})`)
    }
  }

  if (byType.spouse) {
    console.log('\nSPOUSE:')
    for (const p of byType.spouse) {
      console.log(`  - ${p.given_name} ${p.surname} (b. ${p.birth_year})`)
    }
  }

  if (byType.sibling) {
    console.log('\nSIBLINGS:')
    for (const p of byType.sibling) {
      console.log(`  - ${p.given_name} ${p.surname} (b. ${p.birth_year})`)
    }
  }

  if (byType.child) {
    console.log('\nCHILDREN:')
    for (const p of byType.child.sort((a, b) => (a.birth_year || 0) - (b.birth_year || 0))) {
      console.log(`  - ${p.given_name} ${p.surname} (b. ${p.birth_year})`)
    }
  }
}

main().catch(console.error)
