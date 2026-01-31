import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Search, Plus, Filter } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useWorkspace } from '../contexts/WorkspaceContext'
import SourceForm from '../components/sources/SourceForm'

const sourceTypeLabels = {
  primary: 'Primary Source',
  derivative: 'Derivative',
  authored: 'Authored Work',
  research_notes: 'Research Notes'
}

function SourceBrowser() {
  const { workspaceId } = useWorkspace()
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showAddSource, setShowAddSource] = useState(false)

  const fetchSources = async () => {
    if (!workspaceId) return
    setLoading(true)

    let query = supabase
      .from('sources')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('abbreviation')

    if (typeFilter) {
      query = query.eq('source_type', typeFilter)
    }

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%,abbreviation.ilike.%${searchQuery}%,repository.ilike.%${searchQuery}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching sources:', error)
    } else {
      setSources(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSources()
  }, [workspaceId, typeFilter])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSources()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSourceSave = (newSource) => {
    setSources(prev => [newSource, ...prev])
    setShowAddSource(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1>Sources</h1>
          <p className="text-faded-ink mt-1">
            {sources.length} sources in database
          </p>
        </div>
        <button
          onClick={() => setShowAddSource(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Add Source
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-faded-ink" size={18} />
            <input
              type="text"
              placeholder="Search by title, author, or abbreviation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input"
          >
            <option value="">All Types</option>
            {Object.entries(sourceTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-faded-ink">
          Showing {sources.length} source{sources.length !== 1 ? 's' : ''}
          {(typeFilter || searchQuery) && ' (filtered)'}
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-faded-ink">Loading...</p>
        </div>
      ) : sources.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen size={48} className="mx-auto text-faded-ink mb-4" />
          {searchQuery || typeFilter ? (
            <>
              <p className="text-faded-ink mb-4">No sources match your filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setTypeFilter('')
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </>
          ) : (
            <>
              <p className="text-faded-ink mb-4">No sources have been added yet.</p>
              <button
                onClick={() => setShowAddSource(true)}
                className="btn-primary"
              >
                Add First Source
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {sources.map(source => (
            <Link
              key={source.id}
              to={`/sources/${source.id}`}
              className="card block hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <BookOpen size={24} className="text-sepia mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs uppercase px-2 py-0.5 rounded bg-sepia/10 text-sepia">
                      {sourceTypeLabels[source.source_type] || source.source_type}
                    </span>
                    {source.abbreviation && (
                      <span className="font-mono text-sm text-faded-ink">
                        {source.abbreviation}
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium mt-2 truncate">{source.title}</h3>
                  {source.author && (
                    <p className="text-sm text-faded-ink">{source.author}</p>
                  )}
                  {source.repository && (
                    <p className="text-sm text-faded-ink">{source.repository}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Source Modal */}
      {showAddSource && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <h2 className="text-lg font-display mb-6">Add Source</h2>
              <SourceForm
                onSave={handleSourceSave}
                onCancel={() => setShowAddSource(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SourceBrowser
