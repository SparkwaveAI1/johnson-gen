import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ChevronDown, MapPin, Droplets, Building, Church, Map } from 'lucide-react'

const LOCATION_ICONS = {
  colony: Map,
  county: Map,
  parish: Church,
  region: MapPin,
  creek: Droplets,
  river: Droplets,
  swamp: Droplets,
  plantation: Building,
  hundred: MapPin
}

const LOCATION_COLORS = {
  colony: 'text-purple-600',
  county: 'text-blue-600',
  parish: 'text-amber-600',
  region: 'text-green-600',
  creek: 'text-cyan-600',
  river: 'text-cyan-600',
  swamp: 'text-teal-600',
  plantation: 'text-orange-600',
  hundred: 'text-gray-600'
}

function LocationTreeNode({ location, level = 0 }) {
  const [expanded, setExpanded] = useState(level < 2) // Auto-expand first two levels
  const hasChildren = location.children && location.children.length > 0

  const Icon = LOCATION_ICONS[location.location_type] || MapPin
  const colorClass = LOCATION_COLORS[location.location_type] || 'text-gray-600'

  return (
    <div>
      <div
        className="flex items-center gap-1 py-1 px-2 hover:bg-sepia/5 rounded group"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {/* Expand/collapse toggle */}
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-0.5 hover:bg-sepia/10 rounded"
          >
            {expanded ? (
              <ChevronDown size={14} className="text-faded-ink" />
            ) : (
              <ChevronRight size={14} className="text-faded-ink" />
            )}
          </button>
        ) : (
          <span className="w-5" /> // Spacer for alignment
        )}

        {/* Icon */}
        <Icon size={14} className={colorClass} />

        {/* Name and link */}
        <Link
          to={`/locations/${location.slug}`}
          className="flex-1 text-sm hover:text-accent"
        >
          {location.name}
        </Link>

        {/* Type badge */}
        <span className="text-xs text-faded-ink opacity-0 group-hover:opacity-100 transition-opacity">
          {location.location_type}
        </span>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div>
          {location.children.map(child => (
            <LocationTreeNode
              key={child.id}
              location={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default LocationTreeNode
