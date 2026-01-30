import { useState } from 'react'
import { MapPin, MapPinOff, AlertTriangle, X, Check, Navigation, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

/**
 * LocationMapControls - Buttons and modals for managing location map coordinates
 *
 * Features:
 * - "Add to Map" button for unmapped locations with auto-geocoding
 * - "Remove from Map" button for mapped locations
 * - "Report Issue" for correcting erroneous coordinates
 */
function LocationMapControls({ locationResident, onUpdate }) {
  const [showCoordinateForm, setShowCoordinateForm] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [saving, setSaving] = useState(false)
  const [geocoding, setGeocoding] = useState(false)
  const [geocodeStatus, setGeocodeStatus] = useState(null) // 'found', 'not_found', 'error'
  const [error, setError] = useState(null)

  // Form state for coordinates
  const [latitude, setLatitude] = useState(locationResident.location?.latitude || '')
  const [longitude, setLongitude] = useState(locationResident.location?.longitude || '')
  const [correctionNote, setCorrectionNote] = useState('')

  const location = locationResident.location
  const isMapped = location?.latitude != null && location?.longitude != null
  const locationId = location?.id

  // Geocode a location name using OpenStreetMap Nominatim
  const geocodeLocation = async (locationName) => {
    if (!locationName) return null

    try {
      // Build search query - try the full name first
      const searchQuery = encodeURIComponent(locationName)

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=1&countrycodes=us,gb`,
        {
          headers: {
            'User-Agent': 'JohnsonJohnstonGenealogy/1.0'
          }
        }
      )

      if (!response.ok) {
        throw new Error('Geocoding service unavailable')
      }

      const results = await response.json()

      if (results && results.length > 0) {
        return {
          latitude: parseFloat(results[0].lat),
          longitude: parseFloat(results[0].lon),
          displayName: results[0].display_name
        }
      }

      // If full name didn't work, try simplifying (e.g., remove ", Virginia" suffix and try again)
      const simplified = locationName.split(',')[0].trim()
      if (simplified !== locationName) {
        const response2 = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(simplified + ', Virginia, USA')}&format=json&limit=1`,
          {
            headers: {
              'User-Agent': 'JohnsonJohnstonGenealogy/1.0'
            }
          }
        )

        if (response2.ok) {
          const results2 = await response2.json()
          if (results2 && results2.length > 0) {
            return {
              latitude: parseFloat(results2[0].lat),
              longitude: parseFloat(results2[0].lon),
              displayName: results2[0].display_name
            }
          }
        }
      }

      return null
    } catch (err) {
      console.error('Geocoding error:', err)
      return null
    }
  }

  const handleAddToMap = async () => {
    setLatitude('')
    setLongitude('')
    setCorrectionNote('')
    setGeocodeStatus(null)
    setShowCoordinateForm(true)

    // Auto-geocode the location
    if (location?.name) {
      setGeocoding(true)
      const result = await geocodeLocation(location.name)
      setGeocoding(false)

      if (result) {
        setLatitude(result.latitude.toFixed(6))
        setLongitude(result.longitude.toFixed(6))
        setGeocodeStatus('found')
      } else {
        setGeocodeStatus('not_found')
      }
    }
  }

  const handleCorrectCoordinates = () => {
    setLatitude(location?.latitude || '')
    setLongitude(location?.longitude || '')
    setCorrectionNote('')
    setShowCoordinateForm(true)
  }

  const handleRemoveFromMap = async () => {
    if (!confirm('Remove this location from the map? This will clear its coordinates.')) {
      return
    }

    setIsRemoving(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('locations')
        .update({
          latitude: null,
          longitude: null
        })
        .eq('id', locationId)

      if (updateError) throw updateError

      // Notify parent to refresh data
      if (onUpdate) {
        onUpdate()
      }
    } catch (err) {
      console.error('Error removing coordinates:', err)
      setError(err.message)
    } finally {
      setIsRemoving(false)
    }
  }

  const handleSaveCoordinates = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    // Validate coordinates
    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90')
      setSaving(false)
      return
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180')
      setSaving(false)
      return
    }

    try {
      // Update location coordinates
      const { error: updateError } = await supabase
        .from('locations')
        .update({
          latitude: lat,
          longitude: lng
        })
        .eq('id', locationId)

      if (updateError) throw updateError

      // If there's a correction note, log it as evidence update on location_resident
      if (correctionNote.trim() && locationResident.id) {
        const currentEvidence = locationResident.evidence || ''
        const updatedEvidence = currentEvidence
          ? `${currentEvidence}\n[Coordinates corrected: ${correctionNote}]`
          : `[Coordinates corrected: ${correctionNote}]`

        await supabase
          .from('location_residents')
          .update({ evidence: updatedEvidence })
          .eq('id', locationResident.id)
      }

      setShowCoordinateForm(false)

      // Notify parent to refresh data
      if (onUpdate) {
        onUpdate()
      }
    } catch (err) {
      console.error('Error saving coordinates:', err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center gap-1 mt-2">
        {!isMapped ? (
          <button
            onClick={handleAddToMap}
            className="text-xs px-2 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded flex items-center gap-1 transition-colors"
            title="Add coordinates to show on map"
          >
            <MapPin size={12} />
            Add to Map
          </button>
        ) : (
          <>
            <button
              onClick={handleRemoveFromMap}
              disabled={isRemoving}
              className="text-xs px-2 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded flex items-center gap-1 transition-colors disabled:opacity-50"
              title="Remove from map"
            >
              <MapPinOff size={12} />
              {isRemoving ? 'Removing...' : 'Remove from Map'}
            </button>
            <button
              onClick={handleCorrectCoordinates}
              className="text-xs px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded flex items-center gap-1 transition-colors"
              title="Report incorrect placement and correct coordinates"
            >
              <AlertTriangle size={12} />
              Fix Position
            </button>
          </>
        )}
      </div>

      {/* Coordinate Entry Modal */}
      {showCoordinateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-sepia/20 flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <Navigation size={18} className="text-accent" />
                {isMapped ? 'Correct Location Coordinates' : 'Add Location to Map'}
              </h3>
              <button
                onClick={() => setShowCoordinateForm(false)}
                className="text-faded-ink hover:text-ink"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCoordinates} className="p-4 space-y-4">
              <div className="text-sm text-faded-ink mb-2">
                <strong>{location?.name}</strong>
                {location?.parent_name && <span>, {location.parent_name}</span>}
              </div>

              {isMapped && (
                <div className="text-sm bg-amber-50 text-amber-800 p-3 rounded">
                  <strong>Current coordinates:</strong>
                  <br />
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </div>
              )}

              {/* Geocoding status */}
              {geocoding && (
                <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 p-3 rounded">
                  <Loader2 size={16} className="animate-spin" />
                  Looking up coordinates...
                </div>
              )}

              {geocodeStatus === 'found' && !geocoding && (
                <div className="text-sm text-green-700 bg-green-50 p-3 rounded">
                  <strong>Coordinates found!</strong> Review and adjust if needed, then save.
                </div>
              )}

              {geocodeStatus === 'not_found' && !geocoding && (
                <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded">
                  <strong>Couldn't find coordinates automatically.</strong> Please enter them manually or try a different search.
                  <button
                    type="button"
                    onClick={async () => {
                      const searchTerm = prompt('Enter a location to search:', location?.name)
                      if (searchTerm) {
                        setGeocoding(true)
                        const result = await geocodeLocation(searchTerm)
                        setGeocoding(false)
                        if (result) {
                          setLatitude(result.latitude.toFixed(6))
                          setLongitude(result.longitude.toFixed(6))
                          setGeocodeStatus('found')
                        }
                      }
                    }}
                    className="ml-2 underline hover:no-underline"
                  >
                    Try different search
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="input-field w-full"
                    placeholder="e.g., 37.5407"
                    required
                    disabled={geocoding}
                  />
                  <p className="text-xs text-faded-ink mt-1">-90 to 90</p>
                </div>
                <div>
                  <label className="label">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="input-field w-full"
                    placeholder="e.g., -79.4007"
                    required
                    disabled={geocoding}
                  />
                  <p className="text-xs text-faded-ink mt-1">-180 to 180</p>
                </div>
              </div>

              {/* Quick coordinate lookup tip - only show if geocode failed */}
              {(geocodeStatus === 'not_found' || (!geocodeStatus && !geocoding)) && (
                <div className="text-xs bg-blue-50 text-blue-800 p-3 rounded">
                  <strong>Manual lookup:</strong> You can find coordinates by:
                  <ul className="list-disc ml-4 mt-1">
                    <li>Right-clicking on Google Maps and selecting "What's here?"</li>
                    <li>Searching for the location on <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="underline">OpenStreetMap</a></li>
                  </ul>
                </div>
              )}

              {isMapped && (
                <div>
                  <label className="label">Correction Note (optional)</label>
                  <textarea
                    value={correctionNote}
                    onChange={(e) => setCorrectionNote(e.target.value)}
                    className="input-field w-full h-20"
                    placeholder="Why is the current position incorrect? e.g., 'Location was placed in wrong county'"
                  />
                </div>
              )}

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCoordinateForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  <Check size={16} />
                  {saving ? 'Saving...' : 'Save Coordinates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default LocationMapControls
