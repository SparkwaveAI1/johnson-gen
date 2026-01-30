import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, CheckCircle, HelpCircle, AlertCircle, Navigation } from 'lucide-react'
import L from 'leaflet'

// Custom numbered markers for chronological display
const createNumberedIcon = (number, isFirst, isLast) => {
  let bgColor = '#2563eb' // default blue
  if (isFirst) bgColor = '#16a34a' // green for first
  if (isLast) bgColor = '#dc2626' // red for last

  return L.divIcon({
    className: 'custom-numbered-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
      ">${number}</div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  })
}

// Component to auto-fit map bounds
function MapBounds({ locations }) {
  const map = useMap()

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map(loc => [loc.location.latitude, loc.location.longitude])
      )
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 })
    }
  }, [locations, map])

  return null
}

function MigrationMap({ locations, personName }) {
  const [selectedIndex, setSelectedIndex] = useState(null)

  // Filter to only locations with coordinates, sorted by date
  const mappableLocations = locations
    .filter(loc => loc.location?.latitude != null && loc.location?.longitude != null)
    .sort((a, b) => {
      // Sort by date_first, treating null/undefined as early
      const dateA = a.date_first || '0000'
      const dateB = b.date_first || '0000'
      return dateA.localeCompare(dateB)
    })

  // Default center: Colonial Virginia area
  const defaultCenter = [37.5, -78.5]
  const defaultZoom = 7

  // Create path as array of [lat, lng] pairs
  const path = mappableLocations.map(loc => [loc.location.latitude, loc.location.longitude])

  if (mappableLocations.length === 0) {
    return (
      <div className="bg-parchment/50 rounded-lg p-6 text-center">
        <Navigation size={32} className="mx-auto mb-3 text-faded-ink opacity-50" />
        <p className="text-faded-ink">No geocoded locations for this person</p>
        {locations.length > 0 && (
          <p className="text-sm text-faded-ink mt-1">
            {locations.length} location{locations.length !== 1 ? 's' : ''} documented but not yet mapped
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Timeline Panel */}
        <div className="lg:w-1/3 max-h-[400px] overflow-y-auto">
          <h4 className="text-sm font-medium text-faded-ink mb-3 flex items-center gap-2">
            <Calendar size={14} />
            Migration Timeline
          </h4>
          <div className="space-y-2">
            {mappableLocations.map((loc, i) => (
              <button
                key={loc.id}
                onClick={() => setSelectedIndex(i)}
                className={`w-full text-left p-2 rounded-lg border transition-colors ${
                  selectedIndex === i
                    ? 'bg-accent/10 border-accent'
                    : 'bg-white border-sepia/10 hover:border-sepia/30'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    i === 0 ? 'bg-green-600' : i === mappableLocations.length - 1 ? 'bg-red-600' : 'bg-blue-600'
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {loc.location?.name}
                    </div>
                    <div className="text-xs text-faded-ink">
                      {loc.date_first || '?'} - {loc.date_last || 'present'}
                    </div>
                    {loc.residence_type && (
                      <span className="inline-block mt-1 text-xs px-1.5 py-0.5 bg-sepia/10 rounded capitalize">
                        {loc.residence_type}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Map Panel */}
        <div className="lg:w-2/3 rounded-lg overflow-hidden border border-sepia/20">
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            style={{ height: '400px', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapBounds locations={mappableLocations} />

            {/* Draw migration path as dashed line */}
            {path.length > 1 && (
              <Polyline
                positions={path}
                color="#3b82f6"
                weight={2}
                dashArray="8,8"
                opacity={0.7}
              />
            )}

            {/* Plot each location with numbered markers */}
            {mappableLocations.map((loc, i) => (
              <Marker
                key={loc.id}
                position={[loc.location.latitude, loc.location.longitude]}
                icon={createNumberedIcon(i + 1, i === 0, i === mappableLocations.length - 1)}
                eventHandlers={{
                  click: () => setSelectedIndex(i),
                }}
              >
                <Popup>
                  <div className="min-w-[180px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        i === 0 ? 'bg-green-600' : i === mappableLocations.length - 1 ? 'bg-red-600' : 'bg-blue-600'
                      }`}>
                        {i + 1}
                      </span>
                      <Link
                        to={`/locations/${loc.location.slug || loc.location.id}`}
                        className="font-semibold text-sepia hover:text-accent"
                      >
                        {loc.location.name}
                      </Link>
                    </div>
                    <div className="text-xs text-gray-600">
                      {loc.date_first || '?'} - {loc.date_last || 'present'}
                    </div>
                    {loc.residence_type && (
                      <div className="text-xs mt-1 capitalize">
                        {loc.residence_type}
                      </div>
                    )}
                    {loc.evidence && (
                      <div className="text-xs text-gray-500 mt-2 border-t border-gray-200 pt-1">
                        {loc.evidence}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-faded-ink px-1">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-600" /> First documented location
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-blue-600" /> Intermediate locations
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-600" /> Last documented location
        </span>
        <span className="flex items-center gap-1">
          <span className="w-6 border-t-2 border-dashed border-blue-500" /> Migration path (inferred)
        </span>
      </div>
    </div>
  )
}

export default MigrationMap
