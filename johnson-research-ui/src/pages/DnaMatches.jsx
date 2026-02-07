import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Dna, ExternalLink, Edit, Trash2, Search, Filter, X, Users } from 'lucide-react'
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

const testingCompanyOptions = [
  { value: '', label: 'All Companies' },
  { value: 'ancestry', label: 'AncestryDNA' },
  { value: '23andme', label: '23andMe' },
  { value: 'myheritage', label: 'MyHeritage' },
  { value: 'ftdna', label: 'FTDNA' },
  { value: 'gedmatch', label: 'GEDmatch' },
  { value: 'other', label: 'Other' }
]

const contactStatusLabels = {
  not_contacted: 'Not Contacted',
  contacted: 'Contacted',
  responded: 'Responded',
  no_response: 'No Response',
  collaborative: 'Collaborative'
}

const contactStatusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'not_contacted', label: 'Not Contacted' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'responded', label: 'Responded' },
  { value: 'no_response', label: 'No Response' },
  { value: 'collaborative', label: 'Collaborative' }
]

const contactStatusColors = {
  not_contacted: 'bg-gray-100 text-gray-700',
  contacted: 'bg-blue-100 text-blue-700',
  responded: 'bg-green-100 text-green-700',
  no_response: 'bg-yellow-100 text-yellow-700',
  collaborative: 'bg-purple-100 text-purple-700'
}

const companyBadgeColors = {
  ancestry: 'bg-green-100 text-green-800',
  '23andme': 'bg-purple-100 text-purple-800',
  myheritage: 'bg-blue-100 text-blue-800',
  ftdna: 'bg-orange-100 text-orange-800',
  gedmatch: 'bg-gray-100 text-gray-800',
  other: 'bg-gray-100 text-gray-700'
}

export default function DnaMatchesPage() {
  const { workspaceId } = useWorkspace()
  const [searchParams, setSearchParams] = useSearchParams()
  const [matches, setMatches] = useState([])
  const [matchSurnames, setMatchSurnames] = useState({}) // { matchId: [surname1, surname2, ...] }
  const [loading, setLoading] = useState(true)
  const [deleteMatch, setDeleteMatch] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Filter state
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')
  const [contactStatusFilter, setContactStatusFilter] = useState('')
  const [minCm, setMinCm] = useState('')
  const [maxCm, setMaxCm] = useState('')
  const [hasSegmentsFilter, setHasSegmentsFilter] = useState(false)
  
  // Surname filter from URL (from Mystery Surnames page)
  const surnameFilter = searchParams.get('surname')?.toUpperCase() || ''

  useEffect(() => {
    if (workspaceId) {
      loadMatches()
      loadMatchSurnames()
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

  const loadMatchSurnames = async () => {
    const { data, error } = await supabase
      .from('dna_match_surnames')
      .select('match_id, surname')
    
    if (error) {
      console.error('Error loading match surnames:', error)
      return
    }

    // Group surnames by match_id
    const surnameMap = {}
    for (const row of data || []) {
      if (!surnameMap[row.match_id]) {
        surnameMap[row.match_id] = []
      }
      surnameMap[row.match_id].push(row.surname?.toUpperCase())
    }
    setMatchSurnames(surnameMap)
  }

  const clearSurnameFilter = () => {
    searchParams.delete('surname')
    setSearchParams(searchParams)
  }

  const handleDelete = async () => {
    if (!deleteMatch) return
    setDeleting(true)

    try {
      // Delete associated segments first
      await supabase
        .from('dna_segments')
        .delete()
        .eq('match_id', deleteMatch.id)

      // Delete associated surnames
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

  // Filter matches
  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!match.match_name?.toLowerCase().includes(query)) {
          return false
        }
      }
      
      // Company filter
      if (companyFilter && match.testing_company !== companyFilter) {
        return false
      }
      
      // Contact status filter
      if (contactStatusFilter && match.contact_status !== contactStatusFilter) {
        return false
      }
      
      // Min cM filter
      if (minCm && (match.shared_cm || 0) < parseFloat(minCm)) {
        return false
      }
      
      // Max cM filter
      if (maxCm && (match.shared_cm || 0) > parseFloat(maxCm)) {
        return false
      }
      
      // Has segments filter
      if (hasSegmentsFilter && (!match.shared_segments || match.shared_segments === 0)) {
        return false
      }
      
      // Surname filter (from Mystery Surnames page)
      if (surnameFilter) {
        const matchSurnameList = matchSurnames[match.id] || []
        if (!matchSurnameList.includes(surnameFilter)) {
          return false
        }
      }
      
      return true
    })
  }, [matches, searchQuery, companyFilter, contactStatusFilter, minCm, maxCm, hasSegmentsFilter, surnameFilter, matchSurnames])

  // Calculate stats from all matches (not filtered)
  const stats = useMemo(() => {
    const totalMatches = matches.length
    const avgCm = matches.length > 0
      ? Math.round(matches.reduce((sum, m) => sum + (m.shared_cm || 0), 0) / matches.length)
      : 0
    const withSegments = matches.filter(m => m.shared_segments && m.shared_segments > 0).length
    const linkedMatches = matches.filter(m => m.confirmed_mrca_id).length
    
    return { totalMatches, avgCm, withSegments, linkedMatches }
  }, [matches])

  const hasActiveFilters = searchQuery || companyFilter || contactStatusFilter || minCm || maxCm || hasSegmentsFilter || surnameFilter

  const clearFilters = () => {
    setSearchQuery('')
    setCompanyFilter('')
    setContactStatusFilter('')
    setMinCm('')
    setMaxCm('')
    setHasSegmentsFilter(false)
    clearSurnameFilter()
  }

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-sepia">{stats.totalMatches}</p>
          <p className="text-sm text-faded-ink">Total Matches</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-sepia">{stats.avgCm}</p>
          <p className="text-sm text-faded-ink">Avg Shared cM</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-sepia">{stats.withSegments}</p>
          <p className="text-sm text-faded-ink">With Segments</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-sepia">{stats.linkedMatches}</p>
          <p className="text-sm text-faded-ink">Confirmed MRCA</p>
        </div>
      </div>

      {/* Surname Filter Banner */}
      {surnameFilter && (
        <div className="flex items-center justify-between p-3 bg-sepia/10 border border-sepia/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-sepia" />
            <span>
              Showing matches with surname: <strong>{surnameFilter}</strong>
            </span>
          </div>
          <button
            onClick={clearSurnameFilter}
            className="flex items-center gap-1 text-sm text-sepia hover:underline"
          >
            <X size={14} />
            Clear
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-faded-ink" size={18} />
            <input
              type="text"
              placeholder="Search by match name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-sepia/10' : ''}`}
          >
            <Filter size={18} />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-sepia rounded-full" />
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-sepia/20 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="label">Testing Company</label>
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="input"
                >
                  {testingCompanyOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Min cM</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minCm}
                  onChange={(e) => setMinCm(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Max cM</label>
                <input
                  type="number"
                  placeholder="3400"
                  value={maxCm}
                  onChange={(e) => setMaxCm(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Contact Status</label>
                <select
                  value={contactStatusFilter}
                  onChange={(e) => setContactStatusFilter(e.target.value)}
                  className="input"
                >
                  {contactStatusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer pb-2">
                  <input
                    type="checkbox"
                    checked={hasSegmentsFilter}
                    onChange={(e) => setHasSegmentsFilter(e.target.checked)}
                    className="w-4 h-4 rounded border-sepia/30 text-sepia focus:ring-sepia"
                  />
                  <span className="text-sm">Has Segments</span>
                </label>
              </div>
            </div>
            {hasActiveFilters && (
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm text-sepia hover:underline flex items-center gap-1"
                >
                  <X size={14} />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
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
      ) : filteredMatches.length === 0 ? (
        <div className="card p-12 text-center">
          <Search size={48} className="mx-auto text-faded-ink mb-4" />
          <h3 className="text-lg font-medium mb-2">No matches found</h3>
          <p className="text-faded-ink mb-4">
            No matches match your current filters.
          </p>
          <button
            onClick={clearFilters}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <X size={18} />
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-parchment border-b border-sepia/20">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-sm">Match Name</th>
                  <th className="text-left px-4 py-3 font-medium text-sm">Company</th>
                  <th className="text-right px-4 py-3 font-medium text-sm">Shared cM</th>
                  <th className="text-right px-4 py-3 font-medium text-sm">Segments</th>
                  <th className="text-right px-4 py-3 font-medium text-sm">Largest</th>
                  <th className="text-left px-4 py-3 font-medium text-sm">Predicted</th>
                  <th className="text-left px-4 py-3 font-medium text-sm">MRCA</th>
                  <th className="text-right px-4 py-3 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sepia/10">
                {filteredMatches.map(match => (
                  <tr key={match.id} className="hover:bg-parchment/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/dna/matches/${match.id}`}
                          className="font-medium text-sepia hover:underline"
                        >
                          {match.match_name}
                        </Link>
                        {match.match_tree_url && (
                          <a
                            href={match.match_tree_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-faded-ink hover:text-sepia"
                            title="View match's tree"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${companyBadgeColors[match.testing_company] || companyBadgeColors.other}`}>
                        {testingCompanyLabels[match.testing_company] || match.testing_company || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {match.shared_cm ? parseFloat(match.shared_cm).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {match.shared_segments || '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {match.largest_segment_cm ? parseFloat(match.largest_segment_cm).toLocaleString() : '—'}
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
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/dna/matches/${match.id}`}
                          className="p-1.5 text-faded-ink hover:text-sepia hover:bg-sepia/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteMatch(match)}
                          className="p-1.5 text-faded-ink hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
          {hasActiveFilters && (
            <div className="px-4 py-2 bg-sepia/5 border-t border-sepia/20 text-sm text-faded-ink">
              Showing {filteredMatches.length} of {matches.length} matches
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteMatch !== null}
        title="Delete DNA Match"
        message={deleteMatch ? `Are you sure you want to delete "${deleteMatch.match_name}"? This will also remove all associated segments and surnames. This action cannot be undone.` : ''}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteMatch(null)}
        variant="danger"
      />
    </div>
  )
}
