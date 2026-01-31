import { useState } from 'react'
import { X, AlertCircle, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import PersonSelector from '../people/PersonSelector'
import SourceSelector from '../sources/SourceSelector'

/**
 * DocumentForm - Add/Edit historical documents
 *
 * Props:
 * - document: existing document to edit (optional)
 * - onSave: callback with saved document
 * - onCancel: callback when cancelled
 * - isModal: whether displayed as modal (default: false)
 */

const documentTypes = [
  { value: 'land_patent', label: 'Land Patent' },
  { value: 'deed', label: 'Deed' },
  { value: 'will', label: 'Will' },
  { value: 'inventory', label: 'Inventory/Estate' },
  { value: 'tax_list', label: 'Tax List' },
  { value: 'court_record', label: 'Court Record' },
  { value: 'marriage_record', label: 'Marriage Record' },
  { value: 'church_record', label: 'Church Record' },
  { value: 'census', label: 'Census' },
  { value: 'headright', label: 'Headright Certificate' },
  { value: 'land_grant', label: 'Land Grant' },
  { value: 'survey', label: 'Survey' },
  { value: 'power_of_attorney', label: 'Power of Attorney' },
  { value: 'bond', label: 'Bond' },
  { value: 'narrative', label: 'Narrative' },
  { value: 'other', label: 'Other' }
]

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

const virginiaCounties = [
  'Accomack', 'Albemarle', 'Amelia', 'Amherst', 'Augusta',
  'Bedford', 'Botetourt', 'Brunswick', 'Buckingham',
  'Caroline', 'Charles City', 'Charlotte', 'Chesterfield', 'Culpeper', 'Cumberland',
  'Dinwiddie',
  'Elizabeth City', 'Essex',
  'Fairfax', 'Fauquier', 'Frederick', 'Fluvanna',
  'Gloucester', 'Goochland', 'Greensville',
  'Halifax', 'Hanover', 'Henrico', 'Henry',
  'Isle of Wight',
  'James City',
  'King George', 'King William', 'King and Queen',
  'Lancaster', 'Loudoun', 'Louisa', 'Lunenburg',
  'Mecklenburg', 'Middlesex',
  'Nansemond', 'New Kent', 'Norfolk', 'Northampton', 'Northumberland',
  'Orange',
  'Pittsylvania', 'Powhatan', 'Prince Edward', 'Prince George', 'Prince William', 'Princess Anne',
  'Richmond',
  'Spotsylvania', 'Stafford', 'Surry', 'Sussex',
  'Warwick', 'Westmoreland',
  'York'
]

function DocumentForm({
  document = null,
  onSave,
  onCancel,
  isModal = false
}) {
  const { workspaceId } = useWorkspace()
  const [formData, setFormData] = useState({
    document_type: document?.document_type || 'land_patent',
    title: document?.title || '',
    date: document?.date || '',
    county: document?.county || '',
    state: document?.state || 'Virginia',
    description: document?.description || '',
    transcription: document?.transcription || '',
    source_citation: document?.source_citation || '',
    acres: document?.acres || '',
    location_description: document?.location_description || '',
    url: document?.url || '',
    file_path: document?.file_path || '',
    notes: document?.notes || '',
    source: document?.source || null
  })

  const [participants, setParticipants] = useState(
    document?.participants || []
  )

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [multiSelectKey, setMultiSelectKey] = useState(0) // Used to reset multi-select after adding

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addParticipant = () => {
    setParticipants(prev => [...prev, {
      person: null,
      role: 'mentioned',
      acres: '',
      notes: ''
    }])
  }

  const updateParticipant = (index, field, value) => {
    setParticipants(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const removeParticipant = (index) => {
    setParticipants(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.document_type) {
      setError('Please select a document type')
      return
    }

    if (!formData.title && !formData.description) {
      setError('Please provide a title or description')
      return
    }

    setSaving(true)
    setError(null)

    try {
      // Parse date for normalized field
      let dateNormalized = null
      if (formData.date) {
        const dateMatch = formData.date.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/)
        if (dateMatch) {
          const year = dateMatch[1]
          const month = dateMatch[2] || '01'
          const day = dateMatch[3] || '01'
          dateNormalized = `${year}-${month}-${day}`
        }
      }

      const dataToSave = {
        document_type: formData.document_type,
        title: formData.title || null,
        date: formData.date || null,
        date_normalized: dateNormalized,
        county: formData.county || null,
        state: formData.state || null,
        description: formData.description || null,
        transcription: formData.transcription || null,
        source_citation: formData.source_citation || null,
        acres: formData.acres ? parseInt(formData.acres) : null,
        location_description: formData.location_description || null,
        url: formData.url || null,
        file_path: formData.file_path || null,
        notes: formData.notes || null,
        source_id: formData.source?.id || null
      }

      let result
      if (document?.id) {
        // Update existing document
        const { data, error: updateError } = await supabase
          .from('documents')
          .update(dataToSave)
          .eq('id', document.id)
          .select()
          .single()

        if (updateError) throw updateError
        result = data

        // Update participants - delete existing and re-add
        await supabase
          .from('document_people')
          .delete()
          .eq('document_id', document.id)
      } else {
        // Insert new document - include workspace_id
        const { data, error: insertError } = await supabase
          .from('documents')
          .insert({ ...dataToSave, workspace_id: workspaceId })
          .select()
          .single()

        if (insertError) throw insertError
        result = data
      }

      // Add participants
      if (participants.length > 0) {
        const participantData = participants
          .filter(p => p.person)
          .map(p => ({
            document_id: result.id,
            person_id: p.person.id,
            role: p.role,
            acres: p.acres ? parseInt(p.acres) : null,
            notes: p.notes || null,
            workspace_id: workspaceId
          }))

        if (participantData.length > 0) {
          const { error: partError } = await supabase
            .from('document_people')
            .insert(participantData)

          if (partError) throw partError
        }
      }

      // Fetch complete document with participants
      const { data: fullDoc } = await supabase
        .from('documents')
        .select(`
          *,
          participants:document_people(
            id, role, acres, notes,
            person:person_id(id, given_name, surname)
          )
        `)
        .eq('id', result.id)
        .single()

      if (onSave) {
        onSave(fullDoc || result)
      }
    } catch (err) {
      console.error('Error saving document:', err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const isLandRecord = ['land_patent', 'deed', 'land_grant', 'survey', 'headright'].includes(formData.document_type)

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Document Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Document Type *</label>
          <select
            name="document_type"
            value={formData.document_type}
            onChange={handleChange}
            className="input"
          >
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Date</label>
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="1714-05-12 or 1714"
            className="input"
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="label">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Descriptive title for the document"
          className="input"
        />
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">County</label>
          <select
            name="county"
            value={formData.county}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select county...</option>
            {virginiaCounties.map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">State/Colony</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="input"
          />
        </div>
      </div>

      {/* Land-specific fields */}
      {isLandRecord && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-parchment/50 rounded-lg">
          <div>
            <label className="label">Acres</label>
            <input
              type="number"
              name="acres"
              value={formData.acres}
              onChange={handleChange}
              placeholder="400"
              className="input"
            />
          </div>
          <div>
            <label className="label">Location Description</label>
            <input
              type="text"
              name="location_description"
              value={formData.location_description}
              onChange={handleChange}
              placeholder="S side main br of Tuckahoe Cr adj Wm Burton"
              className="input"
            />
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Brief summary of the document contents..."
          className="input"
        />
      </div>

      {/* Transcription */}
      <div>
        <label className="label">Transcription</label>
        <textarea
          name="transcription"
          value={formData.transcription}
          onChange={handleChange}
          rows={6}
          placeholder="Full or partial transcription of the document..."
          className="input font-mono text-sm"
        />
      </div>

      {/* Source Citation */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Source Citation</label>
          <input
            type="text"
            name="source_citation"
            value={formData.source_citation}
            onChange={handleChange}
            placeholder="Henrico Deed Book 3, p. 45"
            className="input"
          />
        </div>
        <div>
          <label className="label">Linked Source</label>
          <SourceSelector
            value={formData.source}
            onChange={(source) => setFormData(prev => ({ ...prev, source }))}
            placeholder="Link to source..."
          />
        </div>
      </div>

      {/* URL */}
      <div>
        <label className="label">URL (if available online)</label>
        <input
          type="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://..."
          className="input"
        />
      </div>

      {/* Participants Section */}
      <div className="border border-sepia/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">People in Document</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addParticipant}
              className="btn-secondary text-sm flex items-center gap-1"
            >
              <Plus size={14} />
              Add Person
            </button>
          </div>
        </div>

        {/* Quick Add Multiple */}
        <div className="mb-4">
          <label className="label text-xs mb-1">Quick Add Multiple People</label>
          <PersonSelector
            key={multiSelectKey}
            multiple
            placeholder="Search and select multiple people..."
            excludeIds={participants.filter(p => p.person).map(p => p.person.id)}
            onAddMultiple={(people) => {
              if (people && people.length > 0) {
                // Add each selected person as a new participant with default role
                const newParticipants = people.map(person => ({
                  person,
                  role: 'mentioned',
                  acres: '',
                  notes: ''
                }))
                setParticipants(prev => [...prev, ...newParticipants])
                // Reset the multi-select by changing key
                setMultiSelectKey(k => k + 1)
              }
            }}
          />
          <p className="text-xs text-faded-ink mt-1">
            Search and click people to select them, then click "Done" to add all at once.
          </p>
        </div>

        {participants.length === 0 ? (
          <p className="text-faded-ink text-sm">
            No people linked to this document yet. Use the search above or click "Add Person" to connect individuals.
          </p>
        ) : (
          <div className="space-y-3">
            {participants.map((participant, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-aged-paper rounded-lg">
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="label text-xs">Person</label>
                    <PersonSelector
                      value={participant.person}
                      onChange={(person) => updateParticipant(index, 'person', person)}
                      placeholder="Select person..."
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Role</label>
                    <select
                      value={participant.role}
                      onChange={(e) => updateParticipant(index, 'role', e.target.value)}
                      className="input text-sm"
                    >
                      {personRoles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                  {isLandRecord && (
                    <div>
                      <label className="label text-xs">Acres</label>
                      <input
                        type="number"
                        value={participant.acres}
                        onChange={(e) => updateParticipant(index, 'acres', e.target.value)}
                        placeholder="Acres received"
                        className="input text-sm"
                      />
                    </div>
                  )}
                  <div className={isLandRecord ? 'col-span-2' : 'col-span-3'}>
                    <label className="label text-xs">Notes</label>
                    <input
                      type="text"
                      value={participant.notes}
                      onChange={(e) => updateParticipant(index, 'notes', e.target.value)}
                      placeholder="Notes about this person's role..."
                      className="input text-sm"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeParticipant(index)}
                  className="text-red-600 hover:text-red-800 p-1 mt-5"
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="label">Research Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          placeholder="Internal notes about this document..."
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
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : document ? 'Update Document' : 'Add Document'}
        </button>
      </div>
    </form>
  )

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
          <div className="flex items-center justify-between p-4 border-b border-sepia/20 sticky top-0 bg-white">
            <h2 className="text-lg font-display">
              {document ? 'Edit Document' : 'Add Document'}
            </h2>
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

export default DocumentForm
