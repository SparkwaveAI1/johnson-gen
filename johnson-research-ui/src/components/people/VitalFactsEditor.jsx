import { useState } from 'react'
import { X, Check, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

/**
 * VitalFactsEditor - Inline editor for person's vital facts
 */
function VitalFactsEditor({ person, onSave, onCancel }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    birth_year: person.birth_year || '',
    birth_year_type: person.birth_year_type || 'b',
    birthplace_code: person.birthplace_code || '',
    birthplace_detail: person.birthplace_detail || '',
    death_year: person.death_year || '',
    death_year_type: person.death_year_type || 'd',
    death_place_code: person.death_place_code || '',
    occupation: person.occupation || '',
    religion: person.religion || '',
    first_documented_date: person.first_documented_date || '',
    dna_group: person.dna_group || '',
    dna_status: person.dna_status || ''
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const updates = {
        birth_year: formData.birth_year ? parseInt(formData.birth_year) : null,
        birth_year_type: formData.birth_year_type || 'b',
        birthplace_code: formData.birthplace_code || null,
        birthplace_detail: formData.birthplace_detail || null,
        death_year: formData.death_year ? parseInt(formData.death_year) : null,
        death_year_type: formData.death_year_type || 'd',
        death_place_code: formData.death_place_code || null,
        occupation: formData.occupation || null,
        religion: formData.religion || null,
        first_documented_date: formData.first_documented_date || null,
        dna_group: formData.dna_group || null,
        dna_status: formData.dna_status || null
      }

      const { data, error: updateError } = await supabase
        .from('people')
        .update(updates)
        .eq('id', person.id)
        .select()
        .single()

      if (updateError) throw updateError

      onSave(data)
    } catch (err) {
      console.error('Error saving vital facts:', err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-800 rounded text-sm">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Birth */}
        <div className="space-y-2">
          <label className="label">Birth Year</label>
          <div className="flex gap-2">
            <select
              value={formData.birth_year_type}
              onChange={(e) => handleChange('birth_year_type', e.target.value)}
              className="input-field w-20"
            >
              <option value="b">Exact</option>
              <option value="e">Circa</option>
            </select>
            <input
              type="number"
              value={formData.birth_year}
              onChange={(e) => handleChange('birth_year', e.target.value)}
              placeholder="Year"
              className="input-field flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="label">Birthplace</label>
          <input
            type="text"
            value={formData.birthplace_code}
            onChange={(e) => handleChange('birthplace_code', e.target.value)}
            placeholder="e.g., Augusta County, VA"
            className="input-field w-full"
          />
          <input
            type="text"
            value={formData.birthplace_detail}
            onChange={(e) => handleChange('birthplace_detail', e.target.value)}
            placeholder="Additional detail"
            className="input-field w-full text-sm"
          />
        </div>

        {/* Death */}
        <div className="space-y-2">
          <label className="label">Death Year</label>
          <div className="flex gap-2">
            <select
              value={formData.death_year_type}
              onChange={(e) => handleChange('death_year_type', e.target.value)}
              className="input-field w-20"
            >
              <option value="d">Exact</option>
              <option value="e">Circa</option>
            </select>
            <input
              type="number"
              value={formData.death_year}
              onChange={(e) => handleChange('death_year', e.target.value)}
              placeholder="Year"
              className="input-field flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="label">Death Place</label>
          <input
            type="text"
            value={formData.death_place_code}
            onChange={(e) => handleChange('death_place_code', e.target.value)}
            placeholder="e.g., Hawkins County, TN"
            className="input-field w-full"
          />
        </div>

        {/* Other fields */}
        <div className="space-y-2">
          <label className="label">Occupation</label>
          <input
            type="text"
            value={formData.occupation}
            onChange={(e) => handleChange('occupation', e.target.value)}
            placeholder="e.g., Farmer, Blacksmith"
            className="input-field w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="label">Religion</label>
          <input
            type="text"
            value={formData.religion}
            onChange={(e) => handleChange('religion', e.target.value)}
            placeholder="e.g., Presbyterian"
            className="input-field w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="label">First Documented Date</label>
          <input
            type="text"
            value={formData.first_documented_date}
            onChange={(e) => handleChange('first_documented_date', e.target.value)}
            placeholder="e.g., 1750"
            className="input-field w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="label">DNA Group</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.dna_group}
              onChange={(e) => handleChange('dna_group', e.target.value)}
              placeholder="e.g., R-M269"
              className="input-field flex-1"
            />
            <select
              value={formData.dna_status}
              onChange={(e) => handleChange('dna_status', e.target.value)}
              className="input-field w-28"
            >
              <option value="">Status</option>
              <option value="tested">Tested</option>
              <option value="predicted">Predicted</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-sepia/20">
        <button onClick={onCancel} className="btn-secondary flex items-center gap-2">
          <X size={16} />
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

export default VitalFactsEditor
