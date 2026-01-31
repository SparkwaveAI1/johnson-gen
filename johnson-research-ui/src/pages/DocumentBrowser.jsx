import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Search, Plus, Filter } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useWorkspace } from '../contexts/WorkspaceContext'
import DocumentForm from '../components/documents/DocumentForm'

const documentTypeLabels = {
  land_patent: 'Land Patent',
  deed: 'Deed',
  will: 'Will',
  inventory: 'Inventory/Estate',
  tax_list: 'Tax List',
  court_record: 'Court Record',
  marriage_record: 'Marriage Record',
  church_record: 'Church Record',
  census: 'Census',
  headright: 'Headright',
  land_grant: 'Land Grant',
  survey: 'Survey',
  power_of_attorney: 'Power of Attorney',
  bond: 'Bond',
  other: 'Other'
}

function DocumentBrowser() {
  const { workspaceId } = useWorkspace()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [countyFilter, setCountyFilter] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  // Get unique counties from documents
  const [counties, setCounties] = useState([])

  const fetchDocuments = async () => {
    if (!workspaceId) return
    setLoading(true)

    let query = supabase
      .from('documents')
      .select(`
        *,
        participants:document_people(count)
      `)
      .eq('workspace_id', workspaceId)
      .order('date_normalized', { ascending: false })
      .limit(100)

    if (typeFilter) {
      query = query.eq('document_type', typeFilter)
    }

    if (countyFilter) {
      query = query.eq('county', countyFilter)
    }

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,transcription.ilike.%${searchQuery}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching documents:', error)
    } else {
      setDocuments(data || [])
    }
    setLoading(false)
  }

  // Fetch unique counties for filter
  useEffect(() => {
    async function fetchCounties() {
      if (!workspaceId) return
      const { data } = await supabase
        .from('documents')
        .select('county')
        .eq('workspace_id', workspaceId)
        .not('county', 'is', null)

      if (data) {
        const uniqueCounties = [...new Set(data.map(d => d.county).filter(Boolean))].sort()
        setCounties(uniqueCounties)
      }
    }
    fetchCounties()
  }, [workspaceId])

  useEffect(() => {
    fetchDocuments()
  }, [workspaceId, typeFilter, countyFilter])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDocuments()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleDocumentSave = (newDoc) => {
    setDocuments(prev => [newDoc, ...prev])
    setShowAddForm(false)
  }

  const formatDocType = (type) => {
    return documentTypeLabels[type] || type?.replace(/_/g, ' ')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1>Documents</h1>
          <p className="text-faded-ink mt-1">
            Land patents, deeds, wills, and other records
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Add Document
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-faded-ink" size={18} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input"
            >
              <option value="">All Types</option>
              {Object.entries(documentTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select
              value={countyFilter}
              onChange={(e) => setCountyFilter(e.target.value)}
              className="input"
            >
              <option value="">All Counties</option>
              {counties.map(county => (
                <option key={county} value={county}>{county}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-faded-ink">
          Showing {documents.length} document{documents.length !== 1 ? 's' : ''}
          {(typeFilter || countyFilter || searchQuery) && ' (filtered)'}
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-faded-ink">Loading...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="card text-center py-12">
          <FileText size={48} className="mx-auto text-faded-ink mb-4" />
          {searchQuery || typeFilter || countyFilter ? (
            <>
              <p className="text-faded-ink mb-4">No documents match your filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setTypeFilter('')
                  setCountyFilter('')
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </>
          ) : (
            <>
              <p className="text-faded-ink mb-4">No documents have been added yet.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary"
              >
                Add First Document
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map(doc => (
            <Link
              key={doc.id}
              to={`/documents/${doc.id}`}
              className="card block hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase px-2 py-0.5 bg-sepia/10 rounded text-faded-ink">
                      {formatDocType(doc.document_type)}
                    </span>
                    {doc.date && (
                      <span className="text-sm text-faded-ink">{doc.date}</span>
                    )}
                  </div>
                  <h3 className="font-medium mt-1">{doc.title || doc.description || 'Untitled Document'}</h3>
                  <p className="text-sm text-faded-ink mt-1">
                    {doc.county && `${doc.county}, `}
                    {doc.state}
                    {doc.location_description && ` • ${doc.location_description}`}
                  </p>
                  {doc.participants?.[0]?.count > 0 && (
                    <p className="text-xs text-faded-ink mt-1">
                      {doc.participants[0].count} people linked
                    </p>
                  )}
                </div>
                {doc.acres && (
                  <span className="text-sepia font-medium">{doc.acres} acres</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Document Modal */}
      {showAddForm && (
        <DocumentForm
          isModal
          onSave={handleDocumentSave}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  )
}

export default DocumentBrowser
