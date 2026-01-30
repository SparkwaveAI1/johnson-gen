import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { MapPin, CheckCircle, HelpCircle, AlertCircle } from 'lucide-react'
import L from 'leaflet'

// Fix for default marker icon in Leaflet with webpack/vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom marker icons by location type
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  })
}

const locationTypeColors = {
  colony: '#9333ea',      // purple
  county: '#2563eb',      // blue
  parish: '#d97706',      // amber
  region: '#16a34a',      // green
  creek: '#0891b2',       // cyan
  river: '#0891b2',       // cyan
  swamp: '#0891b2',       // cyan
  plantation: '#ea580c',  // orange
  default: '#6b7280',     // gray
}

const getIconForType = (locationType) => {
  const color = locationTypeColors[locationType] || locationTypeColors.default
  return createCustomIcon(color)
}

// Component to handle map bounds
function MapBounds({ locations }) {
  const map = useMap()

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map(loc => [loc.latitude, loc.longitude])
      )
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [locations, map])

  return null
}

// Verification status indicator
function VerificationBadge({ status }) {
  if (status === 'confirmed') {
    return <CheckCircle size={14} className="text-green-600 inline" />
  } else if (status === 'probable') {
    return <HelpCircle size={14} className="text-yellow-600 inline" />
  } else {
    return <AlertCircle size={14} className="text-gray-400 inline" />
  }
}

function LocationsMapView({ locations }) {
  // Filter to only locations with coordinates
  const mappableLocations = locations.filter(
    loc => loc.latitude != null && loc.longitude != null
  )

  // Default center: Colonial Virginia area
  const defaultCenter = [37.5, -78.5]
  const defaultZoom = 7

  if (mappableLocations.length === 0) {
    return (
      <div className="bg-parchment rounded-lg p-8 text-center">
        <MapPin size={48} className="mx-auto mb-4 text-faded-ink opacity-50" />
        <p className="text-faded-ink">No geocoded locations yet</p>
        <p className="text-sm text-faded-ink mt-2">
          Locations need coordinates to appear on the map.
          {locations.length > 0 && ` (${locations.length} locations without coordinates)`}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg overflow-hidden border border-sepia/20">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '500px', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBounds locations={mappableLocations} />

        {mappableLocations.map(loc => (
          <Marker
            key={loc.id}
            position={[loc.latitude, loc.longitude]}
            icon={getIconForType(loc.location_type)}
          >
            <Popup>
              <div className="min-w-[150px]">
                <Link
                  to={`/locations/${loc.slug || loc.id}`}
                  className="font-semibold text-sepia hover:text-accent"
                >
                  {loc.name}
                </Link>
                {loc.modern_name && loc.modern_name !== loc.name && (
                  <div className="text-xs text-gray-500">
                    (now: {loc.modern_name})
                  </div>
                )}
                <div className="text-xs text-gray-600 mt-1">
                  <span className="capitalize">{loc.location_type}</span>
                  {loc.parent?.name && ` • ${loc.parent.name}`}
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <VerificationBadge status={loc.verification_status || 'possible'} />
                  <span className="capitalize">{loc.verification_status || 'possible'}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="bg-white px-4 py-2 border-t border-sepia/10">
        <div className="text-xs text-faded-ink flex flex-wrap gap-4">
          <span className="font-medium">Location Types:</span>
          {Object.entries(locationTypeColors).filter(([k]) => k !== 'default').map(([type, color]) => (
            <span key={type} className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="capitalize">{type}</span>
            </span>
          ))}
        </div>
        <div className="text-xs text-faded-ink mt-1">
          Showing {mappableLocations.length} of {locations.length} locations with coordinates
        </div>
      </div>
    </div>
  )
}

export default LocationsMapView
