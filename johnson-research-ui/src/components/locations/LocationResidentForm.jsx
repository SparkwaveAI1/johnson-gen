import { useState, useEffect } from 'react'
import { X, AlertCircle, Search, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

/**
 * LocationResidentForm - Add location association to a person
 */

const residenceTypes = [
  { value: 'residence', label: 'Residence' },
  { value: 'birth', label: 'Birthplace' },
  { value: 'death', label: 'Death Place' },
  { value: 'land', label: 'Land Ownership' },
  { value: 'military', label: 'Military Service' },
  { value: 'migration', label: 'Migration Stop' },
  { value: 'business', label: 'Business' },
  { value: 'church', label: 'Church Affiliation' },
  { value: 'other', label: 'Other' }
]

function LocationResidentForm({
  personId,
  personName,
  onSave,
  onCancel,
  isModal = false
}) {
  const [formData, setFormData] = useState({
    location: null,
    residence_type: 'residence',
    date_first: '',
    date_last: '',
    evidence: ''
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // Search locations as user types
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([])
      return
    }

    const searchLocations = async () => {
      setSearching(true)
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('id, name, location_type, slug, parent_location_id')
          .ilike('name', `%${searchTerm}%`)
          .limit(10)

        if (error) throw error

        // Fetch parent names for hierarchy display
        if (data && data.length > 0) {
          const parentIds = data
            .map(l => l.parent_location_id)
            .filter(Boolean)

          if (parentIds.length > 0) {
            const { data: parents } = await supabase
              .from('locations')
              .select('id, name')
              .in('id', parentIds)

            const parentMap = {}
            parents?.forEach(p => { parentMap[p.id] = p.name })
            data.forEach(l => {
              if (l.parent_location_id) {
                l.parent_name = parentMap[l.parent_location_id]
              }
            })
          }
        }

        setSearchResults(data || [])
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setSearching(false)
      }
    }

    const debounce = setTimeout(searchLocations, 300)
    return () => clearTimeout(debounce)
  }, [searchTerm])

  const handleSelectLocation = (location) => {
    setFormData(prev => ({ ...prev, location }))
    setSearchTerm('')
    setSearchResults([])
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.location) {
      setError('Please select a location')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const dataToSave = {
        person_id: personId,
        location_id: formData.location.id,
        residence_type: formData.residence_type,
        date_first: formData.date_first || null,
        date_last: formData.date_last || null,
        evidence: formData.evidence || null
      }

      const { data, error: insertError } = await supabase
        .from('location_residents')
        .insert(dataToSave)
        .select(`
          *,
          location:location_id(id, name, slug, location_type, latitude, longitude)
        `)
        .single()

      if (insertError) throw insertError

      if (onSave) {
        onSave(data)
      }
    } catch (err) {
      console.error('Error saving location:', err)
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
          Adding location for: <strong>{personName || personId}</strong>
        </p>
      </div>

      {/* Location Search */}
      <div>
        <label className="label">Location *</label>
        {formData.location ? (
          <div className="flex items-center justify-between p-3 bg-sepia/10 rounded-lg">
            <div>
              <span className="font-medium">{formData.location.name}</span>
              {formData.location.parent_name && (
                <span className="text-faded-ink">, {formData.location.parent_name}</span>
              )}
              <span className="text-xs text-faded-ink ml-2 capitalize">
                ({formData.location.location_type})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, location: null }))}
              className="text-faded-ink hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-faded-ink" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search locations..."
                className="input-field w-full pl-9"
              />
              {searching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-faded-ink animate-spin" size={16} />
              )}
            </div>
            {searchResults.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-sepia/20 rounded-lg shadow-lg max-h-60 overflow-auto">
                {searchResults.map(loc => (
                  <li key={loc.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectLocation(loc)}
                      className="w-full text-left px-4 py-2 hover:bg-parchment"
                    >
                      <span className="font-medium">{loc.name}</span>
                      {loc.parent_name && (
                        <span className="text-faded-ink">, {loc.parent_name}</span>
                      )}
                      <span className="text-xs text-faded-ink ml-2 capitalize">
                        ({loc.location_type})
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Residence Type */}
      <div>
        <label className="label">Type of Association</label>
        <select
          name="residence_type"
          value={formData.residence_type}
          onChange={handleChange}
          className="input-field w-full"
        >
          {residenceTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Date First Documented</label>
          <input
            type="text"
            name="date_first"
            value={formData.date_first}
            onChange={handleChange}
            placeholder="e.g., 1750"
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="label">Date Last Documented</label>
          <input
            type="text"
            name="date_last"
            value={formData.date_last}
            onChange={handleChange}
            placeholder="e.g., 1785"
            className="input-field w-full"
          />
        </div>
      </div>

      {/* Evidence */}
      <div>
        <label className="label">Evidence / Notes</label>
        <textarea
          name="evidence"
          value={formData.evidence}
          onChange={handleChange}
          rows={3}
          placeholder="Document references or other evidence for this location..."
          className="input-field w-full"
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
          {saving ? 'Saving...' : 'Add Location'}
        </button>
      </div>
    </form>
  )

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-auto">
          <div className="flex items-center justify-between p-4 border-b border-sepia/20 sticky top-0 bg-white">
            <h2 className="text-lg font-display">Add Location</h2>
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

export default LocationResidentForm
