import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import PersonSelector from '../people/PersonSelector'
import SourceSelector from '../sources/SourceSelector'

/**
 * RelationshipForm - Add/Edit family relationships
 *
 * Props:
 * - relationship: existing relationship to edit (optional)
 * - personId: the person this relationship is FROM
 * - personName: display name for context
 * - onSave: callback with saved relationship
 * - onCancel: callback when cancelled
 * - isModal: whether displayed as modal (default: false)
 */

const relationshipTypes = [
  { value: 'father', label: 'Father', reciprocal: 'child' },
  { value: 'mother', label: 'Mother', reciprocal: 'child' },
  { value: 'spouse', label: 'Spouse', reciprocal: 'spouse' },
  { value: 'child', label: 'Child', reciprocal: 'father' },
  { value: 'sibling', label: 'Sibling', reciprocal: 'sibling' },
  { value: 'stepfather', label: 'Stepfather', reciprocal: 'stepchild' },
  { value: 'stepmother', label: 'Stepmother', reciprocal: 'stepchild' },
  { value: 'stepchild', label: 'Stepchild', reciprocal: 'stepfather' },
  { value: 'half_sibling', label: 'Half-sibling', reciprocal: 'half_sibling' },
  { value: 'guardian', label: 'Guardian', reciprocal: 'ward' },
  { value: 'ward', label: 'Ward', reciprocal: 'guardian' }
]

const confidenceLevels = [
  { value: 'confirmed', label: 'Confirmed', description: 'Direct documentary evidence' },
  { value: 'probable', label: 'Probable', description: 'Strong circumstantial evidence' },
  { value: 'possible', label: 'Possible', description: 'Reasonable but unverified' },
  { value: 'speculative', label: 'Speculative', description: 'Hypothesis needing research' }
]

function RelationshipForm({
  relationship = null,
  personId,
  personName,
  onSave,
  onCancel,
  isModal = false
}) {
  const { workspaceId } = useWorkspace()
  const [formData, setFormData] = useState({
    related_person: relationship?.related_person || null,
    relationship_type: relationship?.relationship_type || 'father',
    relationship_status: relationship?.relationship_status || 'confirmed',
    confidence: relationship?.confidence || 'confirmed',
    evidence: relationship?.evidence || '',
    evidence_summary: relationship?.evidence_summary || '',
    competing_theory: relationship?.competing_theory || false,
    // For spouse relationships
    marriage_date: relationship?.marriage_date || '',
    marriage_place: relationship?.marriage_place || '',
    marriage_end_date: relationship?.marriage_end_date || '',
    marriage_end_type: relationship?.marriage_end_type || '',
    // Source
    source: relationship?.source || null,
    notes: relationship?.notes || ''
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [createReciprocal, setCreateReciprocal] = useState(true)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.related_person) {
      setError('Please select a related person')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const dataToSave = {
        person_id: personId,
        related_person_id: formData.related_person.id,
        relationship_type: formData.relationship_type,
        relationship_status: formData.relationship_status,
        confidence: formData.confidence,
        evidence: formData.evidence || null,
        evidence_summary: formData.evidence_summary || null,
        competing_theory: formData.competing_theory,
        marriage_date: formData.marriage_date || null,
        marriage_place: formData.marriage_place || null,
        marriage_end_date: formData.marriage_end_date || null,
        marriage_end_type: formData.marriage_end_type || null,
        source_id: formData.source?.id || null,
        notes: formData.notes || null,
        workspace_id: workspaceId
      }

      let result
      if (relationship?.id) {
        const { data, error: updateError } = await supabase
          .from('family_relationships')
          .update(dataToSave)
          .eq('id', relationship.id)
          .select(`
            *,
            related_person:related_person_id(id, given_name, surname, birth_year)
          `)
          .single()

        if (updateError) throw updateError
        result = data
      } else {
        const { data, error: insertError } = await supabase
          .from('family_relationships')
          .insert(dataToSave)
          .select(`
            *,
            related_person:related_person_id(id, given_name, surname, birth_year)
          `)
          .single()

        if (insertError) throw insertError
        result = data

        // Create reciprocal relationship if requested
        if (createReciprocal) {
          const reciprocalType = relationshipTypes.find(t => t.value === formData.relationship_type)?.reciprocal

          if (reciprocalType) {
            await supabase
              .from('family_relationships')
              .insert({
                person_id: formData.related_person.id,
                related_person_id: personId,
                relationship_type: reciprocalType,
                relationship_status: formData.relationship_status,
                confidence: formData.confidence,
                evidence: formData.evidence || null,
                source_id: formData.source?.id || null,
                notes: formData.notes ? `Reciprocal of: ${formData.notes}` : null,
                workspace_id: workspaceId
              })
          }
        }
      }

      if (onSave) {
        onSave(result)
      }
    } catch (err) {
      console.error('Error saving relationship:', err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const isSpouseRelationship = formData.relationship_type === 'spouse'

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
          Adding relationship for: <strong>{personName || personId}</strong>
        </p>
      </div>

      {/* Relationship Type */}
      <div>
        <label className="label">Relationship Type *</label>
        <select
          name="relationship_type"
          value={formData.relationship_type}
          onChange={handleChange}
          className="input"
        >
          {relationshipTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Related Person */}
      <div>
        <label className="label">
          {formData.relationship_type.charAt(0).toUpperCase() + formData.relationship_type.slice(1)} *
        </label>
        <PersonSelector
          value={formData.related_person}
          onChange={(person) => setFormData(prev => ({ ...prev, related_person: person }))}
          placeholder={`Search for ${formData.relationship_type}...`}
          excludeIds={[personId]}
        />
      </div>

      {/* Spouse-specific fields */}
      {isSpouseRelationship && (
        <div className="space-y-4 p-4 bg-parchment/50 rounded-lg">
          <h3 className="font-medium text-sm uppercase text-faded-ink">Marriage Details</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Marriage Date</label>
              <input
                type="text"
                name="marriage_date"
                value={formData.marriage_date}
                onChange={handleChange}
                placeholder="1718-03-15 or c. 1715"
                className="input"
              />
            </div>
            <div>
              <label className="label">Marriage Place</label>
              <input
                type="text"
                name="marriage_place"
                value={formData.marriage_place}
                onChange={handleChange}
                placeholder="Henrico County, Virginia"
                className="input"
              />
            </div>
            <div>
              <label className="label">Marriage End Date</label>
              <input
                type="text"
                name="marriage_end_date"
                value={formData.marriage_end_date}
                onChange={handleChange}
                placeholder="If ended"
                className="input"
              />
            </div>
            <div>
              <label className="label">Marriage End Type</label>
              <select
                name="marriage_end_type"
                value={formData.marriage_end_type}
                onChange={handleChange}
                className="input"
              >
                <option value="">Still married / Unknown</option>
                <option value="death">Death of spouse</option>
                <option value="divorce">Divorce</option>
                <option value="annulment">Annulment</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Confidence */}
      <div>
        <label className="label">Confidence Level</label>
        <div className="grid grid-cols-2 gap-2">
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

      {/* Evidence */}
      <div>
        <label className="label">Evidence</label>
        <textarea
          name="evidence"
          value={formData.evidence}
          onChange={handleChange}
          rows={3}
          placeholder='Quote or describe the evidence: "unto James Johnson, son of Michael Johnson..."'
          className="input"
        />
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

      {/* Competing Theory */}
      <label className="flex items-center gap-2 p-3 bg-parchment/50 rounded-lg cursor-pointer">
        <input
          type="checkbox"
          name="competing_theory"
          checked={formData.competing_theory}
          onChange={handleChange}
        />
        <div>
          <span className="font-medium">Competing theory exists</span>
          <p className="text-xs text-faded-ink">
            Check if there are alternative candidates for this relationship
          </p>
        </div>
      </label>

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

      {/* Create Reciprocal */}
      {!relationship && (
        <label className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={createReciprocal}
            onChange={(e) => setCreateReciprocal(e.target.checked)}
          />
          <div>
            <span className="font-medium text-blue-800">Create reciprocal relationship</span>
            <p className="text-xs text-blue-600">
              Also add the reverse relationship for the other person
            </p>
          </div>
        </label>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-sepia/20">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : relationship ? 'Update Relationship' : 'Add Relationship'}
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
              {relationship ? 'Edit Relationship' : 'Add Family Relationship'}
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

export default RelationshipForm
