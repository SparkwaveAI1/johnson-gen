import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Dna, ExternalLink, Edit, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useWorkspace } from '../contexts/WorkspaceContext'
import ConfirmDialog from '../components/common/ConfirmDialog'

const testingCompanyLabels = {
  ancestry: 'AncestryDNA',
  '23andme': '23andMe',
  myheritage: 'MyHeritage',
  ftdna: 'FTDNA',
  gedmatch: 'GEDmatch',
  other: 'Other'
}

const contactStatusLabels = {
  not_contacted: 'Not Contacted',
  contacted: 'Contacted',
  responded: 'Responded',
  no_response: 'No Response',
  collaborative: 'Collaborative'
}

const contactStatusColors = {
  not_contacted: 'bg-gray-100 text-gray-700',
  contacted: 'bg-blue-100 text-blue-700',
  responded: 'bg-green-100 text-green-700',
  no_response: 'bg-yellow-100 text-yellow-700',
  collaborative: 'bg-purple-100 text-purple-700'
}

export default function DnaMatchesPage() {
  const { workspaceId } = useWorkspace()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteMatch, setDeleteMatch] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (workspaceId) {
      loadMatches()
    }
  }, [workspaceId])

  const loadMatches = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('dna_matches')
      .select(`
        *,
        mrca:confirmed_mrca_id(id, given_name, surname)
      `)
      .eq('workspace_id', workspaceId)
      .order('shared_cm', { ascending: false })

    if (error) {
      console.error('Error loading matches:', error)
    } else {
      setMatches(data || [])
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!deleteMatch) return
    setDeleting(true)

    try {
      // Delete associated surnames first
      await supabase
        .from('dna_match_surnames')
        .delete()
        .eq('match_id', deleteMatch.id)

      // Delete the match
      const { error } = await supabase
        .from('dna_matches')
        .delete()
        .eq('id', deleteMatch.id)

      if (error) throw error

      setMatches(prev => prev.filter(m => m.id !== deleteMatch.id))
    } catch (err) {
      console.error('Error deleting match:', err)
    } finally {
      setDeleting(false)
      setDeleteMatch(null)
    }
  }

  // Calculate stats
  const totalMatches = matches.length
  const avgCm = matches.length > 0
    ? Math.round(matches.reduce((sum, m) => sum + (m.shared_cm || 0), 0) / matches.length)
    : 0
  const linkedMatches = matches.filter(m => m.confirmed_mrca_id).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-faded-ink">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Dna size={28} className="text-sepia" />
            DNA Matches
          </h1>
          <p className="text-faded-ink mt-1">
            Track and analyze your DNA matches
          </p>
        </div>
        <Link to="/dna/matches/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Add Match
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-sepia">{totalMatches}</p>
          <p className="text-sm text-faded-ink">Total Matches</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-sepia">{avgCm}</p>
          <p className="text-sm text-faded-ink">Avg Shared cM</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-sepia">{linkedMatches}</p>
          <p className="text-sm text-faded-ink">Linked to MRCA</p>
        </div>
      </div>

      {/* Matches Table */}
      {matches.length === 0 ? (
        <div className="card p-12 text-center">
          <Dna size={48} className="mx-auto text-faded-ink mb-4" />
          <h3 className="text-lg font-medium mb-2">No DNA matches yet</h3>
          <p className="text-faded-ink mb-4">
            Start by adding your DNA matches from any testing company.
          </p>
          <Link to="/dna/matches/new" className="btn-primary inline-flex items-center gap-2">
            <Plus size={18} />
            Add Your First Match
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-parchment">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Match Name</th>
                <th className="text-left px-4 py-3 font-medium">Company</th>
                <th className="text-right px-4 py-3 font-medium">Shared cM</th>
                <th className="text-right px-4 py-3 font-medium">Segments</th>
                <th className="text-left px-4 py-3 font-medium">Predicted</th>
                <th className="text-left px-4 py-3 font-medium">MRCA</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sepia/10">
              {matches.map(match => (
                <tr key={match.id} className="hover:bg-parchment/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{match.match_name}</span>
                      {match.match_tree_url && (
                        <a
                          href={match.match_tree_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-faded-ink hover:text-sepia"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {testingCompanyLabels[match.testing_company] || match.testing_company}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {match.shared_cm || '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {match.shared_segments || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {match.predicted_relationship || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {match.mrca ? (
                      <Link
                        to={`/people/${match.mrca.id}`}
                        className="text-sepia hover:underline"
                      >
                        {match.mrca.given_name} {match.mrca.surname}
                      </Link>
                    ) : (
                      <span className="text-faded-ink">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${contactStatusColors[match.contact_status] || 'bg-gray-100'}`}>
                      {contactStatusLabels[match.contact_status] || match.contact_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/dna/matches/${match.id}`}
                        className="p-1 text-faded-ink hover:text-sepia"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteMatch(match)}
                        className="p-1 text-faded-ink hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteMatch && (
        <ConfirmDialog
          title="Delete DNA Match"
          message={`Are you sure you want to delete "${deleteMatch.match_name}"? This will also remove all associated surnames.`}
          confirmLabel="Delete"
          confirmVariant="danger"
          onConfirm={handleDelete}
          onCancel={() => setDeleteMatch(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
