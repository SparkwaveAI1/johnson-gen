import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, BookOpen, FileText, AlertCircle, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'
import SourceCitation, { formatFullCitation } from '../components/sources/SourceCitation'
import SourceForm from '../components/sources/SourceForm'

const sourceTypeConfig = {
  primary: { label: 'Primary Source', color: 'bg-confidence-confirmed/10 text-confidence-confirmed' },
  derivative: { label: 'Derivative', color: 'bg-confidence-likely/10 text-confidence-likely' },
  authored: { label: 'Authored Work', color: 'bg-sepia/10 text-sepia' },
  research_notes: { label: 'Research Notes', color: 'bg-confidence-possible/10 text-confidence-possible' }
}

function SourceDetail() {
  const { id } = useParams()
  const [source, setSource] = useState(null)
  const [evidenceUsage, setEvidenceUsage] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    async function fetchSource() {
      setLoading(true)

      // Fetch source details
      const { data: sourceData, error: sourceError } = await supabase
        .from('sources')
        .select('*')
        .eq('id', id)
        .single()

      if (sourceError) {
        console.error('Error fetching source:', sourceError)
        setLoading(false)
        return
      }

      setSource(sourceData)

      // Fetch evidence records that use this source
      const { data: evidenceData } = await supabase
        .from('evidence')
        .select('*')
        .eq('source_id', id)

      setEvidenceUsage(evidenceData || [])
      setLoading(false)
    }

    fetchSource()
  }, [id])

  const handleSave = (updatedSource) => {
    setSource(updatedSource)
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-faded-ink">Loading...</p>
      </div>
    )
  }

  if (!source) {
    return (
      <div className="text-center py-12">
        <p className="text-faded-ink">Source not found.</p>
        <Link to="/sources" className="btn-secondary mt-4 inline-block">
          Back to Sources
        </Link>
      </div>
    )
  }

  if (editing) {
    return (
      <div className="max-w-2xl mx-auto">
        <Link to="/sources" className="text-faded-ink hover:text-ink flex items-center gap-1 mb-4">
          <ArrowLeft size={16} />
          Back to Sources
        </Link>
        <div className="card">
          <h1 className="mb-6">Edit Source</h1>
          <SourceForm
            source={source}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
          />
        </div>
      </div>
    )
  }

  const typeConfig = sourceTypeConfig[source.source_type] || sourceTypeConfig.authored

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link to="/sources" className="text-faded-ink hover:text-ink flex items-center gap-1 mb-2">
            <ArrowLeft size={16} />
            Back to Sources
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-xs uppercase px-2 py-1 rounded ${typeConfig.color}`}>
              {typeConfig.label}
            </span>
            {source.abbreviation && (
              <span className="font-mono text-lg text-sepia">
                {source.abbreviation}
              </span>
            )}
          </div>
          <h1>{source.title || 'Untitled Source'}</h1>
          {source.author && (
            <p className="text-lg text-faded-ink mt-1">{source.author}</p>
          )}
        </div>
        <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2">
          <Edit size={16} />
          Edit
        </button>
      </div>

      {/* Research Notes Warning */}
      {source.source_type === 'research_notes' && (
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-yellow-800">Research Notes - Not Evidence</p>
            <p className="text-sm text-yellow-700 mt-1">
              Claims from research notes need original source verification before they can be used as evidence.
              Trace any claims back to the actual documents cited.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Full Citation */}
          <div className="card">
            <h2 className="text-lg mb-4 flex items-center gap-2">
              <BookOpen size={18} />
              Full Citation
            </h2>
            <div className="p-4 bg-parchment rounded-lg">
              <p className="text-sm leading-relaxed">
                {source.full_citation || formatFullCitation(source)}
              </p>
            </div>

            {!source.original_examined && source.cited_in && (
              <div className="mt-3 p-3 bg-yellow-50 rounded text-sm">
                <p className="text-yellow-800">
                  <strong>Note:</strong> Original not examined. Cited in: {source.cited_in}
                </p>
              </div>
            )}
          </div>

          {/* Source Details */}
          <div className="card">
            <h2 className="text-lg mb-4 flex items-center gap-2">
              <FileText size={18} />
              Source Details
            </h2>
            <dl className="grid grid-cols-2 gap-4">
              {source.source_type === 'primary' && (
                <>
                  {source.repository && (
                    <div>
                      <dt className="label">Repository</dt>
                      <dd>{source.repository}</dd>
                    </div>
                  )}
                  {source.collection && (
                    <div>
                      <dt className="label">Collection</dt>
                      <dd>{source.collection}</dd>
                    </div>
                  )}
                  {source.volume && (
                    <div>
                      <dt className="label">Volume</dt>
                      <dd>{source.volume}</dd>
                    </div>
                  )}
                  {source.page && (
                    <div>
                      <dt className="label">Page</dt>
                      <dd>{source.page}</dd>
                    </div>
                  )}
                  {source.record_date && (
                    <div>
                      <dt className="label">Record Date</dt>
                      <dd>{new Date(source.record_date).toLocaleDateString()}</dd>
                    </div>
                  )}
                  {source.item_description && (
                    <div className="col-span-2">
                      <dt className="label">Description</dt>
                      <dd>{source.item_description}</dd>
                    </div>
                  )}
                </>
              )}

              {(source.source_type === 'derivative' || source.source_type === 'authored') && (
                <>
                  {source.publication_place && (
                    <div>
                      <dt className="label">Publication Place</dt>
                      <dd>{source.publication_place}</dd>
                    </div>
                  )}
                  {source.publisher && (
                    <div>
                      <dt className="label">Publisher</dt>
                      <dd>{source.publisher}</dd>
                    </div>
                  )}
                  {source.publication_year && (
                    <div>
                      <dt className="label">Publication Year</dt>
                      <dd>{source.publication_year}</dd>
                    </div>
                  )}
                  {source.page_range && (
                    <div>
                      <dt className="label">Page Range</dt>
                      <dd>{source.page_range}</dd>
                    </div>
                  )}
                </>
              )}

              {source.url && (
                <div className="col-span-2">
                  <dt className="label">URL</dt>
                  <dd>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sepia hover:underline flex items-center gap-1"
                    >
                      {source.url}
                      <ExternalLink size={14} />
                    </a>
                  </dd>
                </div>
              )}

              <div>
                <dt className="label">Original Examined</dt>
                <dd>{source.original_examined ? 'Yes' : 'No'}</dd>
              </div>
            </dl>

            {source.notes && (
              <div className="mt-4 pt-4 border-t border-sepia/20">
                <dt className="label">Notes</dt>
                <dd className="mt-1 text-sm whitespace-pre-wrap">{source.notes}</dd>
              </div>
            )}
          </div>

          {/* Evidence Usage */}
          <div className="card">
            <h2 className="text-lg mb-4">
              Evidence Usage
              <span className="text-sm font-normal text-faded-ink ml-2">
                ({evidenceUsage.length} claims cite this source)
              </span>
            </h2>

            {evidenceUsage.length > 0 ? (
              <ul className="space-y-3">
                {evidenceUsage.map(ev => (
                  <li key={ev.id} className="p-3 bg-parchment/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-xs uppercase text-faded-ink">
                        {ev.entity_type.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        ev.evidence_type === 'direct' ? 'bg-green-100 text-green-800' :
                        ev.evidence_type === 'indirect' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {ev.evidence_type}
                      </span>
                    </div>
                    {ev.source_excerpt && (
                      <p className="text-sm italic text-faded-ink mt-2">
                        "{ev.source_excerpt}"
                      </p>
                    )}
                    {ev.interpretation && (
                      <p className="text-sm text-faded-ink mt-1">
                        {ev.interpretation}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-faded-ink">
                This source has not been linked to any claims yet.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Reference */}
          <div className="card">
            <h3 className="font-medium mb-3">Quick Reference</h3>
            {source.abbreviation && (
              <div className="mb-3">
                <span className="label">Abbreviation</span>
                <p className="font-mono text-lg text-sepia">{source.abbreviation}</p>
              </div>
            )}
            <div>
              <span className="label">Short Citation</span>
              <p className="font-mono text-sm">
                <SourceCitation source={source} format="short" showLink={false} />
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="card">
            <h3 className="font-medium mb-3">Metadata</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-faded-ink">Created</dt>
                <dd>{new Date(source.created_at).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-faded-ink">Last Updated</dt>
                <dd>{new Date(source.updated_at).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-faded-ink">Source ID</dt>
                <dd className="font-mono text-xs break-all">{source.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SourceDetail
