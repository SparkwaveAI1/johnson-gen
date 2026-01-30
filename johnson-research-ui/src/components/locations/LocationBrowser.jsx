import { useState } from 'react'
import { MapPin, Search, Filter, List, Map } from 'lucide-react'
import { useLocations, buildLocationTree } from '../../hooks/useLocations'
import LocationTreeNode from './LocationTreeNode'
import LocationsMapView from './LocationsMapView'

const LOCATION_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'colony', label: 'Colony' },
  { value: 'county', label: 'County' },
  { value: 'parish', label: 'Parish' },
  { value: 'region', label: 'Region' },
  { value: 'creek', label: 'Creek' },
  { value: 'river', label: 'River' },
  { value: 'swamp', label: 'Swamp' },
  { value: 'plantation', label: 'Plantation' }
]

function LocationBrowser() {
  const { locations, loading, error } = useLocations()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [viewMode, setViewMode] = useState('list') // 'list' or 'map'

  if (loading) {
    return (
      <div className="p-8 text-center text-faded-ink">
        Loading locations...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error loading locations: {error}
      </div>
    )
  }

  // Filter locations
  let filteredLocations = locations
  if (searchTerm) {
    const term = searchTerm.toLowerCase()
    filteredLocations = locations.filter(loc =>
      loc.name.toLowerCase().includes(term) ||
      (loc.name_variants && loc.name_variants.some(v => v.toLowerCase().includes(term)))
    )
  }
  if (typeFilter) {
    filteredLocations = filteredLocations.filter(loc => loc.location_type === typeFilter)
  }

  // Build tree structure (only if not filtering)
  const isFiltering = searchTerm || typeFilter
  const tree = isFiltering ? null : buildLocationTree(locations)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display flex items-center gap-2">
          <MapPin className="text-accent" />
          Locations
        </h1>
        <div className="flex items-center gap-4">
          {/* View toggle */}
          <div className="flex rounded-lg border border-sepia/20 overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 flex items-center gap-1.5 text-sm transition-colors ${
                viewMode === 'list'
                  ? 'bg-sepia text-white'
                  : 'bg-white text-ink hover:bg-parchment'
              }`}
            >
              <List size={16} />
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 flex items-center gap-1.5 text-sm transition-colors ${
                viewMode === 'map'
                  ? 'bg-sepia text-white'
                  : 'bg-white text-ink hover:bg-parchment'
              }`}
            >
              <Map size={16} />
              Map
            </button>
          </div>
          <span className="text-sm text-faded-ink">
            {locations.length} locations
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faded-ink" />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-sepia/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>

        {/* Type filter */}
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faded-ink" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="pl-9 pr-8 py-2 border border-sepia/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none bg-white"
          >
            {LOCATION_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' ? (
        <LocationsMapView locations={filteredLocations} />
      ) : (
        <>
          {/* Location Tree or Filtered List */}
          <div className="card">
            {isFiltering ? (
              // Show flat filtered list
              <div className="divide-y divide-sepia/10">
                {filteredLocations.length === 0 ? (
                  <div className="p-4 text-center text-faded-ink">
                    No locations match your filters
                  </div>
                ) : (
                  filteredLocations.map(loc => (
                    <LocationTreeNode key={loc.id} location={{ ...loc, children: [] }} />
                  ))
                )}
              </div>
            ) : (
              // Show hierarchical tree
              <div className="py-2">
                {tree.map(rootLocation => (
                  <LocationTreeNode key={rootLocation.id} location={rootLocation} />
                ))}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="text-xs text-faded-ink flex flex-wrap gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-600" /> Colony
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600" /> County
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-600" /> Parish
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-600" /> Region
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-600" /> Creek/River/Swamp
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-600" /> Plantation
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default LocationBrowser
