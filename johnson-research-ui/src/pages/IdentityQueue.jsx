import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GitCompare, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useWorkspace } from '../contexts/WorkspaceContext'

function IdentityQueue() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCandidates() {
      const { data, error } = await supabase
        .from('identity_candidates')
        .select(`
          *,
          person1:person_id_1(id, given_name, surname, birth_year),
          person2:person_id_2(id, given_name, surname, birth_year)
        `)
        .eq('status', 'unresolved')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching candidates:', error)
      } else {
        setCandidates(data || [])
      }
      setLoading(false)
    }

    fetchCandidates()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1>Identity Queue</h1>
        <p className="text-faded-ink mt-1">
          Potential duplicate records that need resolution
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-faded-ink">Loading...</p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="card text-center py-12">
          <GitCompare size={48} className="mx-auto text-faded-ink mb-4" />
          <p className="text-faded-ink mb-2">No unresolved identity questions.</p>
          <p className="text-sm text-faded-ink">
            As you add records, potential duplicates will appear here for review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map(candidate => (
            <div key={candidate.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs uppercase px-2 py-1 rounded ${
                  candidate.likelihood === 'likely' ? 'bg-confidence-likely/10 text-confidence-likely' :
                  candidate.likelihood === 'possible' ? 'bg-confidence-possible/10 text-confidence-possible' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {candidate.likelihood}
                </span>
                <Link
                  to={`/compare/${candidate.person_id_1}/${candidate.person_id_2}`}
                  className="btn-secondary text-sm"
                >
                  Compare
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-parchment rounded">
                  <p className="font-medium">
                    {candidate.person1?.given_name} {candidate.person1?.surname}
                  </p>
                  <p className="text-sm text-faded-ink">
                    {candidate.person1?.birth_year && `b. ${candidate.person1.birth_year}`}
                  </p>
                  <p className="person-id mt-1">{candidate.person_id_1}</p>
                </div>
                <div className="p-3 bg-parchment rounded">
                  <p className="font-medium">
                    {candidate.person2?.given_name} {candidate.person2?.surname}
                  </p>
                  <p className="text-sm text-faded-ink">
                    {candidate.person2?.birth_year && `b. ${candidate.person2.birth_year}`}
                  </p>
                  <p className="person-id mt-1">{candidate.person_id_2}</p>
                </div>
              </div>

              {candidate.evidence_for && (
                <div className="mt-4 p-3 bg-green-50 rounded text-sm">
                  <p className="font-medium text-green-800">Evidence For:</p>
                  <p className="text-green-700">{candidate.evidence_for}</p>
                </div>
              )}

              {candidate.evidence_against && (
                <div className="mt-2 p-3 bg-red-50 rounded text-sm">
                  <p className="font-medium text-red-800">Evidence Against:</p>
                  <p className="text-red-700">{candidate.evidence_against}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default IdentityQueue
