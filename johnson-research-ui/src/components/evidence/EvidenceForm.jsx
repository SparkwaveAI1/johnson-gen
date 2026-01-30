import { useState } from 'react'
import { X, AlertCircle, Info } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import SourceSelector from '../sources/SourceSelector'

/**
 * EvidenceForm - Form for adding/editing evidence
 *
 * Props:
 * - evidence: existing evidence to edit (optional)
 * - entityType: type of entity this evidence supports
 * - entityId: ID of the entity
 * - onSave: callback with saved evidence
 * - onCancel: callback when cancelled
 * - isModal: whether displayed as modal (default: false)
 */

const evidenceTypes = [
  {
    value: 'direct',
    label: 'Direct Evidence',
    description: 'Source explicitly states the fact',
    example: '"...unto James Johnson, son of Michael Johnson..."'
  },
  {
    value: 'indirect',
    label: 'Indirect Evidence',
    description: 'Source implies the fact through circumstance',
    example: 'Adjacent landowners with same surname suggest family connection'
  },
  {
    value: 'negative',
    label: 'Negative Evidence',
    description: 'Absence of expected record is informative',
    example: 'No death record found before this date suggests person was alive'
  }
]

function EvidenceForm({
  evidence = null,
  entityType,
  entityId,
  onSave,
  onCancel,
  isModal = false
}) {
  const [formData, setFormData] = useState({
    source: evidence?.source || null,
    source_excerpt: evidence?.source_excerpt || '',
    interpretation: evidence?.interpretation || '',
    evidence_type: evidence?.evidence_type || 'direct'
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

  const handleSourceChange = (source) => {
    setFormData(prev => ({
      ...prev,
      source
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.source) {
      setError('Please select a source')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const dataToSave = {
        entity_type: entityType,
        entity_id: entityId,
        source_id: formData.source.id,
        source_excerpt: formData.source_excerpt || null,
        interpretation: formData.interpretation || null,
        evidence_type: formData.evidence_type
      }

      let result
      if (evidence?.id) {
        // Update existing
        const { data, error: updateError } = await supabase
          .from('evidence')
          .update(dataToSave)
          .eq('id', evidence.id)
          .select(`
            *,
            source:source_id(*)
          `)
          .single()

        if (updateError) throw updateError
        result = data
      } else {
        // Insert new
        const { data, error: insertError } = await supabase
          .from('evidence')
          .insert(dataToSave)
          .select(`
            *,
            source:source_id(*)
          `)
          .single()

        if (insertError) throw insertError
        result = data
      }

      if (onSave) {
        onSave(result)
      }
    } catch (err) {
      console.error('Error saving evidence:', err)
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

      {/* Source Selection */}
      <div>
        <label className="label">Source *</label>
        <SourceSelector
          value={formData.source}
          onChange={handleSourceChange}
          placeholder="Search for a source or add new..."
        />
      </div>

      {/* Source Excerpt */}
      <div>
        <label className="label">Source Excerpt</label>
        <textarea
          name="source_excerpt"
          value={formData.source_excerpt}
          onChange={handleChange}
          rows={3}
          placeholder='Quote the relevant portion: "...unto James Johnson, son of Michael Johnson..."'
          className="input"
        />
        <p className="text-xs text-faded-ink mt-1">
          Copy the exact text from the source that supports this claim
        </p>
      </div>

      {/* Evidence Type */}
      <div>
        <label className="label">Evidence Type</label>
        <div className="space-y-2">
          {evidenceTypes.map(type => (
            <label
              key={type.value}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                formData.evidence_type === type.value
                  ? 'border-sepia bg-sepia/5'
                  : 'border-sepia/20 hover:bg-parchment'
              }`}
            >
              <input
                type="radio"
                name="evidence_type"
                value={type.value}
                checked={formData.evidence_type === type.value}
                onChange={handleChange}
                className="mt-1"
              />
              <div className="flex-1">
                <span className="font-medium">{type.label}</span>
                <p className="text-sm text-faded-ink">{type.description}</p>
                <p className="text-xs text-faded-ink italic mt-1">
                  Example: {type.example}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Interpretation */}
      <div>
        <label className="label">Interpretation / Reasoning</label>
        <textarea
          name="interpretation"
          value={formData.interpretation}
          onChange={handleChange}
          rows={3}
          placeholder="Explain how this source supports the claim..."
          className="input"
        />
        <p className="text-xs text-faded-ink mt-1">
          Explain your reasoning, especially for indirect evidence
        </p>
      </div>

      {/* Guidance */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
        <Info size={18} className="mt-0.5 shrink-0" />
        <div>
          <p className="font-medium">Evidence Standards</p>
          <ul className="mt-1 space-y-1 text-blue-700">
            <li>• <strong>Confirmed</strong> claims need direct evidence from primary/derivative sources</li>
            <li>• <strong>Likely</strong> claims can use indirect evidence with clear reasoning</li>
            <li>• <strong>Possible</strong> claims should note what would confirm/refute them</li>
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : evidence ? 'Update Evidence' : 'Add Evidence'}
        </button>
      </div>
    </form>
  )

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-auto">
          <div className="flex items-center justify-between p-4 border-b border-sepia/20">
            <h2 className="text-lg font-display">
              {evidence ? 'Edit Evidence' : 'Add Evidence'}
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

export default EvidenceForm
