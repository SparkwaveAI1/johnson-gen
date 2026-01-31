import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import PersonSelector from '../people/PersonSelector'
import SourceSelector from '../sources/SourceSelector'

/**
 * AssociationForm - Add/Edit non-family associations
 *
 * Props:
 * - association: existing association to edit (optional)
 * - personId: the person this association is FROM
 * - personName: display name for context
 * - onSave: callback with saved association
 * - onCancel: callback when cancelled
 * - isModal: whether displayed as modal (default: false)
 */

const associationTypes = [
  { value: 'neighbor', label: 'Neighbor' },
  { value: 'adjacent_landowner', label: 'Adjacent Landowner' },
  { value: 'witness', label: 'Witness' },
  { value: 'business_partner', label: 'Business Partner' },
  { value: 'executor', label: 'Executor' },
  { value: 'guardian', label: 'Guardian' },
  { value: 'transported_by', label: 'Transported By' },
  { value: 'transported', label: 'Transported (as headright)' },
  { value: 'father_in_law', label: 'Father-in-law' },
  { value: 'mother_in_law', label: 'Mother-in-law' },
  { value: 'brother_in_law', label: 'Brother-in-law' },
  { value: 'sister_in_law', label: 'Sister-in-law' },
  { value: 'creditor', label: 'Creditor' },
  { value: 'debtor', label: 'Debtor' },
  { value: 'apprentice_master', label: 'Apprentice Master' },
  { value: 'apprentice', label: 'Apprentice' },
  { value: 'overseer', label: 'Overseer' },
  { value: 'minister', label: 'Minister' },
  { value: 'other', label: 'Other' }
]

const confidenceLevels = [
  { value: 'confirmed', label: 'Confirmed', description: 'Direct documentary evidence' },
  { value: 'likely', label: 'Likely', description: 'Strong circumstantial evidence' },
  { value: 'possible', label: 'Possible', description: 'Reasonable but unverified' }
]

function AssociationForm({
  association = null,
  personId,
  personName,
  onSave,
  onCancel,
  isModal = false
}) {
  const [formData, setFormData] = useState({
    associated_person: association?.associated_person || null,
    association_type: association?.association_type || 'neighbor',
    date: association?.date || '',
    location: association?.location || '',
    context: association?.context || '',
    confidence: association?.confidence || 'confirmed',
    evidence_summary: association?.evidence_summary || '',
    source: association?.source || null,
    notes: association?.notes || ''
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.associated_person) {
      setError('Please select an associated person')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const dataToSave = {
        person_id: personId,
        associated_person_id: formData.associated_person.id,
        association_type: formData.association_type,
        date: formData.date || null,
        location: formData.location || null,
        context: formData.context || null,
        confidence: formData.confidence,
        evidence_summary: formData.evidence_summary || null,
        source_id: formData.source?.id || null,
        notes: formData.notes || null
      }

      let result
      if (association?.id) {
        const { data, error: updateError } = await supabase
          .from('associations')
          .update(dataToSave)
          .eq('id', association.id)
          .select(`
            *,
            associated_person:associated_person_id(id, given_name, surname)
          `)
          .single()

        if (updateError) throw updateError
        result = data
      } else {
        const { data, error: insertError } = await supabase
          .from('associations')
          .insert(dataToSave)
          .select(`
            *,
            associated_person:associated_person_id(id, given_name, surname)
          `)
          .single()

        if (insertError) throw insertError
        result = data
      }

      if (onSave) {
        onSave(result)
      }
    } catch (err) {
      console.error('Error saving association:', err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

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
          Adding association for: <strong>{personName || personId}</strong>
        </p>
      </div>

      {/* Association Type */}
      <div>
        <label className="label">Association Type *</label>
        <select
          name="association_type"
          value={formData.association_type}
          onChange={handleChange}
          className="input"
        >
          {associationTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Associated Person */}
      <div>
        <label className="label">Associated Person *</label>
        <PersonSelector
          value={formData.associated_person}
          onChange={(person) => setFormData(prev => ({ ...prev, associated_person: person }))}
          placeholder="Search for person..."
          excludeIds={[personId]}
        />
      </div>

      {/* Date and Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Date / Date Range</label>
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="1714-12 or 1714-1718"
            className="input"
          />
        </div>
        <div>
          <label className="label">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Tuckahoe Creek, Henrico County"
            className="input"
          />
        </div>
      </div>

      {/* Context */}
      <div>
        <label className="label">Context</label>
        <textarea
          name="context"
          value={formData.context}
          onChange={handleChange}
          rows={2}
          placeholder="Describe the context of this association..."
          className="input"
        />
        <p className="text-xs text-faded-ink mt-1">
          E.g., "witnessed deed for 400 acres" or "adjacent to Johnson in 1714 Mims patent"
        </p>
      </div>

      {/* Confidence */}
      <div>
        <label className="label">Confidence Level</label>
        <div className="grid grid-cols-3 gap-2">
          {confidenceLevels.map(level => (
            <label
              key={level.value}
              className={`flex items-start gap-2 p-2 rounded border cursor-pointer ${
                formData.confidence === level.value
                  ? 'border-sepia bg-sepia/5'
                  : 'border-sepia/20'
              }`}
            >
              <input
                type="radio"
                name="confidence"
                value={level.value}
                checked={formData.confidence === level.value}
                onChange={handleChange}
              />
              <div>
                <span className="font-medium text-sm">{level.label}</span>
                <p className="text-xs text-faded-ink">{level.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Source */}
      <div>
        <label className="label">Source</label>
        <SourceSelector
          value={formData.source}
          onChange={(source) => setFormData(prev => ({ ...prev, source }))}
          placeholder="Link to source document..."
        />
      </div>

      {/* Evidence Summary */}
      <div>
        <label className="label">Evidence Summary</label>
        <textarea
          name="evidence_summary"
          value={formData.evidence_summary}
          onChange={handleChange}
          rows={2}
          placeholder="Brief summary of the evidence for this association..."
          className="input"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="label">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
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
          {saving ? 'Saving...' : association ? 'Update Association' : 'Add Association'}
        </button>
      </div>
    </form>
  )

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-auto">
          <div className="flex items-center justify-between p-4 border-b border-sepia/20 sticky top-0 bg-white">
            <h2 className="text-lg font-display">
              {association ? 'Edit Association' : 'Add Association'}
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

export default AssociationForm
