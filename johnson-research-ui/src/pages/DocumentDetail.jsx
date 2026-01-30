import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, FileText, Users, MapPin, RefreshCw, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'
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

function DocumentDetail() {
  const { id } = useParams()
  const [document, setDocument] = useState(null)
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEditForm, setShowEditForm] = useState(false)

  const fetchDocument = async () => {
    setLoading(true)

    // Fetch document details
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .select(`
        *,
        source:source_id(id, title, repository, collection)
      `)
      .eq('id', id)
      .single()

    if (docError) {
      console.error('Error fetching document:', docError)
      setLoading(false)
      return
    }

    setDocument(docData)

    // Fetch participants
    const { data: partData } = await supabase
      .from('document_people')
      .select(`
        *,
        person:person_id(id, given_name, surname, birth_year, death_year, confidence)
      `)
      .eq('document_id', id)
      .order('role')

    setParticipants(partData || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchDocument()
  }, [id])

  const handleDocumentSave = (updatedDoc) => {
    setDocument(updatedDoc)
    setShowEditForm(false)
    // Refresh to get updated participants
    fetchDocument()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-faded-ink">Loading...</p>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="text-center py-12">
        <p className="text-faded-ink">Document not found.</p>
        <Link to="/documents" className="btn-secondary mt-4 inline-block">
          Back to Documents
        </Link>
      </div>
    )
  }

  const formatDocType = (type) => {
    return documentTypeLabels[type] || type?.replace(/_/g, ' ')
  }

  // Group participants by role
  const groupedParticipants = participants.reduce((acc, p) => {
    const role = p.role || 'other'
    if (!acc[role]) acc[role] = []
    acc[role].push(p)
    return acc
  }, {})

  const isLandRecord = ['land_patent', 'deed', 'land_grant', 'survey', 'headright'].includes(document.document_type)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link to="/documents" className="text-faded-ink hover:text-ink flex items-center gap-1 mb-2">
            <ArrowLeft size={16} />
            Back to Documents
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase px-2 py-1 bg-sepia/10 rounded">
              {formatDocType(document.document_type)}
            </span>
            {document.date && <span className="text-faded-ink">{document.date}</span>}
          </div>
          <h1 className="mt-2">{document.title || document.description || 'Untitled Document'}</h1>
          {document.county && (
            <p className="text-faded-ink mt-1">
              {document.county}, {document.state}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchDocument()}
            className="btn-secondary flex items-center gap-2"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => setShowEditForm(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit size={16} />
            Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Details */}
          <div className="card">
            <h2 className="text-lg mb-4 flex items-center gap-2">
              <FileText size={18} />
              Document Details
            </h2>
            <dl className="grid grid-cols-2 gap-4">
              {document.date && (
                <div>
                  <dt className="label">Date</dt>
                  <dd>{document.date}</dd>
                </div>
              )}
              {document.county && (
                <div>
                  <dt className="label">Location</dt>
                  <dd>{document.county}, {document.state}</dd>
                </div>
              )}
              {isLandRecord && document.acres && (
                <div>
                  <dt className="label">Acres</dt>
                  <dd className="text-sepia font-medium">{document.acres}</dd>
                </div>
              )}
              {document.location_description && (
                <div className="col-span-2">
                  <dt className="label">Location Description</dt>
                  <dd className="italic">{document.location_description}</dd>
                </div>
              )}
              {document.source_citation && (
                <div className="col-span-2">
                  <dt className="label">Citation</dt>
                  <dd className="font-mono text-sm">{document.source_citation}</dd>
                </div>
              )}
              {document.url && (
                <div className="col-span-2">
                  <dt className="label">External Link</dt>
                  <dd>
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sepia hover:underline flex items-center gap-1"
                    >
                      View Online <ExternalLink size={14} />
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Description */}
          {document.description && (
            <div className="card">
              <h2 className="text-lg mb-4">Description</h2>
              <p className="whitespace-pre-wrap">{document.description}</p>
            </div>
          )}

          {/* Transcription */}
          {document.transcription && (
            <div className="card">
              <h2 className="text-lg mb-4">Transcription</h2>
              <div className="p-4 bg-aged-paper rounded-lg border border-sepia/20">
                <p className="whitespace-pre-wrap font-serif leading-relaxed">
                  {document.transcription}
                </p>
              </div>
            </div>
          )}

          {/* Participants */}
          <div className="card">
            <h2 className="text-lg mb-4 flex items-center gap-2">
              <Users size={18} />
              People in Document
            </h2>
            {participants.length > 0 ? (
              <div className="space-y-4">
                {Object.entries(groupedParticipants).map(([role, people]) => (
                  <div key={role}>
                    <h3 className="text-sm uppercase text-faded-ink mb-2">
                      {role.replace(/_/g, ' ')}
                      {people.length > 1 && ` (${people.length})`}
                    </h3>
                    <ul className="space-y-2">
                      {people.map(p => (
                        <li key={p.id} className="flex items-start gap-3 p-2 rounded hover:bg-parchment">
                          <div className="flex-1">
                            {p.person ? (
                              <Link
                                to={`/people/${p.person.id}`}
                                className="text-sepia hover:underline font-medium"
                              >
                                {p.person.given_name} {p.person.surname}
                                {p.person.birth_year && (
                                  <span className="text-faded-ink font-normal ml-1">
                                    (b. {p.person.birth_year})
                                  </span>
                                )}
                              </Link>
                            ) : (
                              <span className="text-faded-ink">Unknown Person</span>
                            )}
                            {p.acres && (
                              <span className="ml-2 text-sm text-faded-ink">
                                - {p.acres} acres
                              </span>
                            )}
                            {p.notes && (
                              <p className="text-sm text-faded-ink mt-1">{p.notes}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-faded-ink">No people have been linked to this document yet.</p>
            )}
          </div>

          {/* Research Notes */}
          {document.notes && (
            <div className="card">
              <h2 className="text-lg mb-4">Research Notes</h2>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm whitespace-pre-wrap">{document.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <h3 className="font-medium mb-3">Statistics</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-faded-ink">People Linked</dt>
                <dd>{participants.length}</dd>
              </div>
              {isLandRecord && document.acres && (
                <div className="flex justify-between">
                  <dt className="text-faded-ink">Total Acres</dt>
                  <dd className="font-medium">{document.acres}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Linked Source */}
          {document.source && (
            <div className="card">
              <h3 className="font-medium mb-3">Source</h3>
              <Link
                to={`/sources/${document.source.id}`}
                className="block p-3 bg-aged-paper rounded hover:bg-parchment"
              >
                <p className="font-medium text-sm">{document.source.title}</p>
                {document.source.repository && (
                  <p className="text-xs text-faded-ink mt-1">{document.source.repository}</p>
                )}
                {document.source.collection && (
                  <p className="text-xs text-faded-ink">{document.source.collection}</p>
                )}
              </Link>
            </div>
          )}

          {/* Metadata */}
          <div className="card">
            <h3 className="font-medium mb-3">Record Info</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-faded-ink text-xs">Created</dt>
                <dd>{new Date(document.created_at).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-faded-ink text-xs">Last Updated</dt>
                <dd>{new Date(document.updated_at).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-faded-ink text-xs">Document ID</dt>
                <dd className="font-mono text-xs break-all">{document.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditForm && (
        <DocumentForm
          document={{
            ...document,
            participants: participants.map(p => ({
              person: p.person,
              role: p.role,
              acres: p.acres,
              notes: p.notes
            }))
          }}
          isModal
          onSave={handleDocumentSave}
          onCancel={() => setShowEditForm(false)}
        />
      )}
    </div>
  )
}

export default DocumentDetail
