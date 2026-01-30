import { useState } from 'react'
import { Filter, Search, SortAsc, SortDesc } from 'lucide-react'
import EventCard from './EventCard'
import { EVENT_TYPES, getEventTypeLabel } from '../../lib/eventTypes'

/**
 * EventList - Filterable, sortable list of events
 *
 * Props:
 * - events: Array of events
 * - onConfirmParticipant: Callback for confirming participant
 * - onRejectParticipant: Callback for rejecting participant
 * - onChangeParticipant: Callback for changing participant identification
 * - showFilters: Whether to show filter controls
 * - showActions: Whether to show action buttons on events
 * - emptyMessage: Message when no events
 */
function EventList({
  events = [],
  onConfirmParticipant,
  onRejectParticipant,
  onChangeParticipant,
  showFilters = true,
  showActions = true,
  emptyMessage = 'No events found.'
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortDir, setSortDir] = useState('desc')

  // Get unique event types from events
  const eventTypes = [...new Set(events.map(e => e.event_type))].sort()

  // Filter events
  let filteredEvents = events.filter(event => {
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      const matchesTitle = event.title?.toLowerCase().includes(search)
      const matchesLocation = event.location_text?.toLowerCase().includes(search)
      const matchesParticipant = event.event_participants?.some(
        p => p.name_as_written?.toLowerCase().includes(search)
      )
      if (!matchesTitle && !matchesLocation && !matchesParticipant) {
        return false
      }
    }

    // Type filter
    if (typeFilter && event.event_type !== typeFilter) {
      return false
    }

    // Status filter (has participants with this status)
    if (statusFilter) {
      const hasStatus = event.event_participants?.some(
        p => p.identification_status === statusFilter
      )
      if (!hasStatus) {
        return false
      }
    }

    return true
  })

  // Sort events
  filteredEvents = [...filteredEvents].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'date':
        const dateA = a.event_year || 0
        const dateB = b.event_year || 0
        comparison = dateA - dateB
        break
      case 'type':
        comparison = (a.event_type || '').localeCompare(b.event_type || '')
        break
      case 'participants':
        const countA = a.event_participants?.length || 0
        const countB = b.event_participants?.length || 0
        comparison = countA - countB
        break
      case 'title':
        comparison = (a.title || '').localeCompare(b.title || '')
        break
      default:
        comparison = 0
    }

    return sortDir === 'desc' ? -comparison : comparison
  })

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDir('desc')
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-parchment/30 rounded-lg">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-faded-ink" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events..."
              className="input-field w-full pl-9 py-2"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-faded-ink" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field py-2"
            >
              <option value="">All Types</option>
              {eventTypes.map(type => (
                <option key={type} value={type}>
                  {getEventTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field py-2"
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Has Confirmed</option>
            <option value="probable">Has Probable</option>
            <option value="possible">Has Possible</option>
            <option value="unidentified">Has Unidentified</option>
          </select>

          {/* Sort */}
          <div className="flex items-center gap-2 border-l border-sepia/20 pl-3">
            <span className="text-sm text-faded-ink">Sort:</span>
            <button
              onClick={() => toggleSort('date')}
              className={`px-2 py-1 text-sm rounded ${sortBy === 'date' ? 'bg-sepia/20' : 'hover:bg-sepia/10'}`}
            >
              Date
              {sortBy === 'date' && (sortDir === 'asc' ? <SortAsc size={12} className="inline ml-1" /> : <SortDesc size={12} className="inline ml-1" />)}
            </button>
            <button
              onClick={() => toggleSort('type')}
              className={`px-2 py-1 text-sm rounded ${sortBy === 'type' ? 'bg-sepia/20' : 'hover:bg-sepia/10'}`}
            >
              Type
            </button>
            <button
              onClick={() => toggleSort('participants')}
              className={`px-2 py-1 text-sm rounded ${sortBy === 'participants' ? 'bg-sepia/20' : 'hover:bg-sepia/10'}`}
            >
              Participants
            </button>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-faded-ink">
        Showing {filteredEvents.length} of {events.length} events
      </div>

      {/* Event Cards */}
      {filteredEvents.length > 0 ? (
        <div className="space-y-3">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              showActions={showActions}
              onConfirm={onConfirmParticipant}
              onReject={onRejectParticipant}
              onChange={onChangeParticipant}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-faded-ink">
          {emptyMessage}
        </div>
      )}
    </div>
  )
}

export default EventList
