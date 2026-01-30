import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Users, FileText, HelpCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

function GapAnalysis() {
  const [gaps, setGaps] = useState({
    noParents: [],
    noBio: [],
    singleDocument: [],
    lowConfidence: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGaps() {
      try {
        // People with no parent relationships documented
        const { data: allPeople } = await supabase
          .from('people')
          .select('id, given_name, surname, birth_year, confidence, bio')

        const { data: parentRels } = await supabase
          .from('family_relationships')
          .select('person_id')
          .in('relationship_type', ['father', 'mother'])

        const peopleWithParents = new Set(parentRels?.map(r => r.person_id) || [])

        const noParents = allPeople?.filter(p =>
          !peopleWithParents.has(p.id) && p.surname === 'Johnson'
        ) || []

        const noBio = allPeople?.filter(p => !p.bio && p.surname === 'Johnson') || []

        const lowConfidence = allPeople?.filter(p =>
          ['POSSIBLE', 'UNCERTAIN'].includes(p.confidence)
        ) || []

        setGaps({
          noParents: noParents.slice(0, 10),
          noBio: noBio.slice(0, 10),
          singleDocument: [], // Would need document counts
          lowConfidence: lowConfidence.slice(0, 10)
        })
      } catch (error) {
        console.error('Error fetching gaps:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGaps()
  }, [])

  const GapSection = ({ title, icon: Icon, items, emptyMessage }) => (
    <div className="card">
      <h2 className="text-lg mb-4 flex items-center gap-2">
        <Icon size={18} />
        {title}
        <span className="text-sm font-normal text-faded-ink">({items.length})</span>
      </h2>
      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map(person => (
            <li key={person.id}>
              <Link
                to={`/people/${person.id}`}
                className="flex items-center justify-between p-2 rounded hover:bg-parchment"
              >
                <span>
                  {person.given_name} {person.surname}
                  {person.birth_year && (
                    <span className="text-faded-ink ml-2">(b. {person.birth_year})</span>
                  )}
                </span>
                <span className="person-id">{person.id}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-faded-ink">{emptyMessage}</p>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-faded-ink">Analyzing gaps...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Gap Analysis</h1>
        <p className="text-faded-ink mt-1">
          Identify areas needing more research
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GapSection
          title="No Parents Documented"
          icon={Users}
          items={gaps.noParents}
          emptyMessage="All Johnson individuals have parent relationships documented."
        />

        <GapSection
          title="Missing Biography"
          icon={FileText}
          items={gaps.noBio}
          emptyMessage="All Johnson individuals have biographies."
        />

        <GapSection
          title="Low Confidence Records"
          icon={AlertTriangle}
          items={gaps.lowConfidence}
          emptyMessage="All records have sufficient confidence."
        />

        <div className="card">
          <h2 className="text-lg mb-4 flex items-center gap-2">
            <HelpCircle size={18} />
            Research Priorities
          </h2>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-red-50 rounded">
              <p className="font-medium text-red-800">High Priority</p>
              <p className="text-red-700">
                Focus on people with no parent documentation - these are potential
                line breaks that could connect family groups.
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded">
              <p className="font-medium text-yellow-800">Medium Priority</p>
              <p className="text-yellow-700">
                Low confidence records need additional sources to strengthen
                identifications.
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded">
              <p className="font-medium text-blue-800">Ongoing</p>
              <p className="text-blue-700">
                Biography development for the book - ensure all individuals have
                written narratives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GapAnalysis
