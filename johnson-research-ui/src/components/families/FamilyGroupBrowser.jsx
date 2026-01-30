import { useState } from 'react'
import { Users, Search, Filter, Plus } from 'lucide-react'
import { useFamilyGroups } from '../../hooks/useFamilyGroups'
import FamilyGroupCard from './FamilyGroupCard'

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'published', label: 'Published' }
]

function FamilyGroupBrowser() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const { groups, loading, error } = useFamilyGroups({
    statusFilter: statusFilter || undefined
  })

  if (loading) {
    return (
      <div className="p-8 text-center text-faded-ink">
        Loading family groups...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error loading family groups: {error}
      </div>
    )
  }

  // Filter groups by search term
  const filteredGroups = searchTerm
    ? groups.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.dna_group?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : groups

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display flex items-center gap-2">
          <Users className="text-accent" />
          Family Groups
        </h1>
        <span className="text-sm text-faded-ink">
          {groups.length} groups
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faded-ink" />
          <input
            type="text"
            placeholder="Search family groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-sepia/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faded-ink" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2 border border-sepia/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none bg-white"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Groups list */}
      {filteredGroups.length === 0 ? (
        <div className="card text-center py-8">
          <Users size={48} className="mx-auto text-faded-ink mb-4" />
          <p className="text-faded-ink">
            {searchTerm || statusFilter
              ? 'No family groups match your filters'
              : 'No family groups defined yet'}
          </p>
          {!searchTerm && !statusFilter && (
            <p className="text-sm text-faded-ink mt-2">
              Family groups help organize related people for research and narrative writing.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGroups.map(group => (
            <FamilyGroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  )
}

export default FamilyGroupBrowser
