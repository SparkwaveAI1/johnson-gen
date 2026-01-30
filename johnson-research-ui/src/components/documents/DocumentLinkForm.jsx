import { useState, useEffect, useRef } from 'react'
import { X, AlertCircle, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'

/**
 * DocumentLinkForm - Link existing documents to a person
 *
 * Props:
 * - personId: the person to link documents to
 * - personName: display name for context
 * - onSave: callback with saved link
 * - onCancel: callback when cancelled
 * - isModal: whether displayed as modal (default: false)
 */

const personRoles = [
  { value: 'patentee', label: 'Patentee' },
  { value: 'grantor', label: 'Grantor' },
  { value: 'grantee', label: 'Grantee' },
  { value: 'witness', label: 'Witness' },
  { value: 'adjacent_landowner', label: 'Adjacent Landowner' },
  { value: 'boundary_neighbor', label: 'Boundary Neighbor' },
  { value: 'transported', label: 'Transported (headright)' },
  { value: 'testator', label: 'Testator' },
  { value: 'executor', label: 'Executor' },
  { value: 'heir', label: 'Heir/Beneficiary' },
  { value: 'appraiser', label: 'Appraiser' },
  { value: 'mentioned', label: 'Mentioned' },
  { value: 'petitioner', label: 'Petitioner' },
  { value: 'defendant', label: 'Defendant' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'other', label: 'Other' }
]

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

function DocumentLinkForm({
  personId,
  personName,
  onSave,
  onCancel,
  isModal = false
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [role, setRole] = useState('mentioned')
  const [acres, setAcres] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const searchInputRef = useRef(null)

  // Search documents
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setSearching(true)

      const { data, error } = await supabase
        .from('documents')
        .select('id, title, document_type, date, county, state, acres')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,transcription.ilike.%${searchQuery}%`)
        .limit(10)

      if (!error) {
        setSearchResults(data || [])
      }
      setSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedDocument) {
      setError('Please select a document')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const dataToSave = {
        document_id: selectedDocument.id,
        person_id: personId,
        role: role,
        acres: acres ? parseInt(acres) : null,
        notes: notes || null
      }

      const { data, error: insertError } = await supabase
        .from('document_people')
        .insert(dataToSave)
        .select(`
          *,
          document:document_id(id, title, document_type, date, county)
        `)
        .single()

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('This person is already linked to this document with this role')
        }
        throw insertError
      }

      if (onSave) {
        onSave(data)
      }
    } catch (err) {
      console.error('Error linking document:', err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const isLandRecord = selectedDocument &&
    ['land_patent', 'deed', 'land_grant', 'survey', 'headright'].includes(selectedDocument.document_type)

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Context */}
      <div className="p-3 bg-aged-paper rounded-lg">
        <p className="text-sm">
          Linking document to: <strong>{personName || personId}</strong>
        </p>
      </div>

      {/* Document Search */}
      {!selectedDocument ? (
        <div>
          <label className="label">Search Documents *</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-faded-ink" size={16} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, or transcription..."
              className="input pl-9"
            />
          </div>

          {/* Search Results */}
          {searching && (
            <p className="text-sm text-faded-ink mt-2">Searching...</p>
          )}

          {!searching && searchQuery.length >= 2 && searchResults.length === 0 && (
            <p className="text-sm text-faded-ink mt-2">No documents found matching "{searchQuery}"</p>
          )}

          {searchResults.length > 0 && (
            <div className="mt-2 border border-sepia/20 rounded-lg max-h-60 overflow-auto">
              {searchResults.map(doc => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => {
                    setSelectedDocument(doc)
                    setSearchQuery('')
                    setSearchResults([])
                  }}
                  className="w-full text-left p-3 hover:bg-parchment border-b border-sepia/10 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase px-1.5 py-0.5 bg-sepia/10 rounded">
                      {documentTypeLabels[doc.document_type] || doc.document_type}
                    </span>
                    {doc.date && <span className="text-sm text-faded-ink">{doc.date}</span>}
                  </div>
                  <p className="font-medium mt-1">{doc.title || 'Untitled Document'}</p>
                  {doc.county && (
                    <p className="text-sm text-faded-ink">{doc.county}, {doc.state}</p>
                  )}
                </button>
              ))}
            </div>
          )}

          {searchQuery.length < 2 && (
            <p className="text-xs text-faded-ink mt-1">Type at least 2 characters to search</p>
          )}
        </div>
      ) : (
        <div>
          <label className="label">Selected Document</label>
          <div className="p-3 bg-parchment rounded-lg flex items-start justify-between">
            <div>
              <span className="text-xs uppercase px-1.5 py-0.5 bg-sepia/10 rounded">
                {documentTypeLabels[selectedDocument.document_type] || selectedDocument.document_type}
              </span>
              <p className="font-medium mt-1">{selectedDocument.title || 'Untitled Document'}</p>
              {selectedDocument.date && (
                <p className="text-sm text-faded-ink">{selectedDocument.date}</p>
              )}
              {selectedDocument.county && (
                <p className="text-sm text-faded-ink">{selectedDocument.county}, {selectedDocument.state}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSelectedDocument(null)}
              className="text-faded-ink hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Role */}
      <div>
        <label className="label">Role in Document *</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="input"
        >
          {personRoles.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* Acres (for land records) */}
      {isLandRecord && (
        <div>
          <label className="label">Acres Received</label>
          <input
            type="number"
            value={acres}
            onChange={(e) => setAcres(e.target.value)}
            placeholder="If this person received specific acreage"
            className="input"
          />
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="label">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Notes about this person's role in the document..."
          className="input"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-sepia/20">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" disabled={saving || !selectedDocument} className="btn-primary">
          {saving ? 'Linking...' : 'Link Document'}
        </button>
      </div>
    </form>
  )

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-auto">
          <div className="flex items-center justify-between p-4 border-b border-sepia/20 sticky top-0 bg-white">
            <h2 className="text-lg font-display">Link Document</h2>
            {onCancel && (
              <button onClick={onCancel} className="text-faded-ink hover:text-ink">
                <X size={20} />
              </button>
            )}
          </div>
          <div className="p-4">
            {formContent}
          </div>
        </div>
      </div>
    )
  }

  return formContent
}

export default DocumentLinkForm
