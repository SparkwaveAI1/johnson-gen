import { useState, useEffect } from 'react'
import { X, AlertCircle, Info } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useWorkspace } from '../../contexts/WorkspaceContext'

/**
 * PersonForm - Add/Edit person
 *
 * Props:
 * - person: existing person to edit (optional)
 * - onSave: callback with saved person
 * - onCancel: callback when cancelled
 * - isModal: whether displayed as modal (default: false)
 */

const confidenceLevels = [
  { value: 'CONFIRMED', label: 'Confirmed', description: 'Well-documented with primary sources' },
  { value: 'PROBABLE', label: 'Probable', description: 'Strong evidence supports identification' },
  { value: 'POSSIBLE', label: 'Possible', description: 'Some evidence but needs verification' },
  { value: 'UNCERTAIN', label: 'Uncertain', description: 'Limited evidence, needs research' }
]

const dnaStatuses = [
  { value: 'ANCHOR', label: 'Anchor', description: 'DNA group progenitor' },
  { value: 'CONFIRMED', label: 'Confirmed', description: 'DNA confirms lineage' },
  { value: 'PROBABLE', label: 'Probable', description: 'DNA likely confirms' },
  { value: 'POSSIBLE', label: 'Possible', description: 'DNA may confirm' }
]

// Common Virginia county codes
const countyCodes = [
  { code: 'ENG', label: 'England' },
  { code: 'UNK', label: 'Unknown' },
  { code: 'JCC', label: 'James City County' },
  { code: 'HEN', label: 'Henrico County' },
  { code: 'CHA', label: 'Charles City County' },
  { code: 'ECC', label: 'Elizabeth City County' },
  { code: 'NFK', label: 'Norfolk County' },
  { code: 'NKT', label: 'New Kent County' },
  { code: 'KWM', label: 'King William County' },
  { code: 'HAN', label: 'Hanover County' },
  { code: 'GOO', label: 'Goochland County' },
  { code: 'AUG', label: 'Augusta County' },
  { code: 'SUR', label: 'Surry County' },
  { code: 'NAN', label: 'Nansemond County' }
]

function generatePersonId(formData) {
  // Format: SURNAME-BIRTHPLACE-b/eYEAR-##
  const surname = (formData.surname || 'UNK').substring(0, 4).toUpperCase()
  const place = formData.birthplace_code || 'UNK'
  const yearType = formData.birth_year_type || 'e'
  const year = formData.birth_year || '0000'

  return `${surname}-${place}-${yearType}${year}-01`
}

function PersonForm({ person = null, onSave, onCancel, isModal = false }) {
  const { workspaceId } = useWorkspace()
  const [formData, setFormData] = useState({
    id: '',
    surname: '',
    given_name: '',
    suffix: '',
    title: '',
    designation: '',
    occupation: '',
    birth_year: '',
    birth_year_type: 'e',
    birthplace_code: '',
    birthplace_detail: '',
    death_year: '',
    death_year_type: 'e',
    death_place_code: '',
    death_place_detail: '',
    burial_place: '',
    burial_notes: '',
    religion: '',
    religion_notes: '',
    confidence: 'POSSIBLE',
    dna_group: '',
    dna_status: '',
    first_documented_date: '',
    bio: ''
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [idManuallyEdited, setIdManuallyEdited] = useState(false)

  // Load existing person data
  useEffect(() => {
    if (person) {
      setFormData({
        id: person.id || '',
        surname: person.surname || '',
        given_name: person.given_name || '',
        suffix: person.suffix || '',
        title: person.title || '',
        designation: person.designation || '',
        occupation: person.occupation || '',
        birth_year: person.birth_year || '',
        birth_year_type: person.birth_year_type || 'e',
        birthplace_code: person.birthplace_code || '',
        birthplace_detail: person.birthplace_detail || '',
        death_year: person.death_year || '',
        death_year_type: person.death_year_type || 'e',
        death_place_code: person.death_place_code || '',
        death_place_detail: person.death_place_detail || '',
        burial_place: person.burial_place || '',
        burial_notes: person.burial_notes || '',
        religion: person.religion || '',
        religion_notes: person.religion_notes || '',
        confidence: person.confidence || 'POSSIBLE',
        dna_group: person.dna_group || '',
        dna_status: person.dna_status || '',
        first_documented_date: person.first_documented_date || '',
        bio: person.bio || ''
      })
      setIdManuallyEdited(true) // Don't auto-generate for existing
    }
  }, [person])

  // Auto-generate ID when relevant fields change (for new persons only)
  useEffect(() => {
    if (!person && !idManuallyEdited) {
      const newId = generatePersonId(formData)
      setFormData(prev => ({ ...prev, id: newId }))
    }
  }, [formData.surname, formData.birthplace_code, formData.birth_year, formData.birth_year_type, person, idManuallyEdited])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Track if ID was manually edited
    if (name === 'id') {
      setIdManuallyEdited(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.surname) {
      setError('Surname is required')
      return
    }

    if (!formData.id) {
      setError('Person ID is required')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const dataToSave = {
        ...formData,
        birth_year: formData.birth_year ? parseInt(formData.birth_year) : null,
        death_year: formData.death_year ? parseInt(formData.death_year) : null
      }

      // Remove empty strings
      Object.keys(dataToSave).forEach(key => {
        if (dataToSave[key] === '') {
          dataToSave[key] = null
        }
      })

      let result
      if (person) {
        // Update existing - can't change ID
        const { id, ...updateData } = dataToSave
        const { data, error: updateError } = await supabase
          .from('people')
          .update(updateData)
          .eq('id', person.id)
          .select()
          .single()

        if (updateError) throw updateError
        result = data
      } else {
        // Insert new - include workspace_id
        const { data, error: insertError } = await supabase
          .from('people')
          .insert({ ...dataToSave, workspace_id: workspaceId })
          .select()
          .single()

        if (insertError) throw insertError
        result = data
      }

      if (onSave) {
        onSave(result)
      }
    } catch (err) {
      console.error('Error saving person:', err)
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

      {/* Person ID */}
      <div className="p-4 bg-aged-paper rounded-lg">
        <label className="label">Person ID *</label>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          disabled={!!person}
          className="input font-mono"
          placeholder="JNSN-HEN-e1695-01"
        />
        <p className="text-xs text-faded-ink mt-1">
          Format: SURNAME-BIRTHPLACE-b/eYEAR-## (auto-generated, can be edited)
        </p>
      </div>

      {/* Name Fields */}
      <div className="space-y-4">
        <h3 className="font-medium text-sm uppercase text-faded-ink">Name</h3>
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-1">
            <label className="label">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Col."
              className="input"
            />
          </div>
          <div className="col-span-2">
            <label className="label">Given Name</label>
            <input
              type="text"
              name="given_name"
              value={formData.given_name}
              onChange={handleChange}
              placeholder="Michael"
              className="input"
            />
          </div>
          <div className="col-span-2">
            <label className="label">Surname *</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Johnson"
              className="input"
              required
            />
          </div>
          <div className="col-span-1">
            <label className="label">Suffix</label>
            <input
              type="text"
              name="suffix"
              value={formData.suffix}
              onChange={handleChange}
              placeholder="Jr."
              className="input"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder='"of Tuckahoe Creek" or "Ancient Planter"'
              className="input"
            />
          </div>
          <div>
            <label className="label">Occupation</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="planter, yeoman, cooper"
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Birth */}
      <div className="space-y-4 p-4 bg-parchment/50 rounded-lg">
        <h3 className="font-medium text-sm uppercase text-faded-ink">Birth</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="label">Year</label>
            <input
              type="number"
              name="birth_year"
              value={formData.birth_year}
              onChange={handleChange}
              placeholder="1695"
              className="input"
            />
          </div>
          <div>
            <label className="label">Type</label>
            <select
              name="birth_year_type"
              value={formData.birth_year_type}
              onChange={handleChange}
              className="input"
            >
              <option value="e">Estimated (c.)</option>
              <option value="b">Known (exact)</option>
            </select>
          </div>
          <div>
            <label className="label">Place Code</label>
            <select
              name="birthplace_code"
              value={formData.birthplace_code}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select...</option>
              {countyCodes.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Place Detail</label>
            <input
              type="text"
              name="birthplace_detail"
              value={formData.birthplace_detail}
              onChange={handleChange}
              placeholder="Tuckahoe Creek"
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Death */}
      <div className="space-y-4 p-4 bg-parchment/50 rounded-lg">
        <h3 className="font-medium text-sm uppercase text-faded-ink">Death</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="label">Year</label>
            <input
              type="number"
              name="death_year"
              value={formData.death_year}
              onChange={handleChange}
              placeholder="1718"
              className="input"
            />
          </div>
          <div>
            <label className="label">Type</label>
            <select
              name="death_year_type"
              value={formData.death_year_type}
              onChange={handleChange}
              className="input"
            >
              <option value="e">Estimated</option>
              <option value="b">Known (exact)</option>
            </select>
          </div>
          <div>
            <label className="label">Place Code</label>
            <select
              name="death_place_code"
              value={formData.death_place_code}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select...</option>
              {countyCodes.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Place Detail</label>
            <input
              type="text"
              name="death_place_detail"
              value={formData.death_place_detail}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Burial Place</label>
            <input
              type="text"
              name="burial_place"
              value={formData.burial_place}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Burial Notes</label>
            <input
              type="text"
              name="burial_notes"
              value={formData.burial_notes}
              onChange={handleChange}
              placeholder="Cemetery, GPS, inscription"
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Research Status */}
      <div className="space-y-4 p-4 bg-parchment/50 rounded-lg">
        <h3 className="font-medium text-sm uppercase text-faded-ink">Research Status</h3>

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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">DNA Group</label>
            <input
              type="text"
              name="dna_group"
              value={formData.dna_group}
              onChange={handleChange}
              placeholder="White Oak, Longleaf Pine"
              className="input"
            />
          </div>
          <div>
            <label className="label">DNA Status</label>
            <select
              name="dna_status"
              value={formData.dna_status}
              onChange={handleChange}
              className="input"
            >
              <option value="">None</option>
              {dnaStatuses.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">First Documented Date</label>
          <input
            type="text"
            name="first_documented_date"
            value={formData.first_documented_date}
            onChange={handleChange}
            placeholder="1714-12 or 1718-07-12"
            className="input"
          />
          <p className="text-xs text-faded-ink mt-1">
            Earliest known record (for unknown birth years)
          </p>
        </div>
      </div>

      {/* Religion */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Religion</label>
          <input
            type="text"
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            placeholder="Quaker, Anglican"
            className="input"
          />
        </div>
        <div>
          <label className="label">Religion Notes</label>
          <input
            type="text"
            name="religion_notes"
            value={formData.religion_notes}
            onChange={handleChange}
            className="input"
          />
        </div>
      </div>

      {/* Biography */}
      <div>
        <label className="label">Biography</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={6}
          placeholder="Narrative biography for the book..."
          className="input"
        />
        <p className="text-xs text-faded-ink mt-1">
          This is the narrative that will appear in the book.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-sepia/20">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : person ? 'Update Person' : 'Add Person'}
        </button>
      </div>
    </form>
  )

  if (isModal) {
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-sepia/20 sticky top-0 bg-white">
            <h2 className="text-lg font-display">
              {person ? 'Edit Person' : 'Add New Person'}
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

export default PersonForm
