import { Link } from 'react-router-dom'
import { Users, MapPin, Calendar, Dna } from 'lucide-react'

const GROUP_TYPE_LABELS = {
  nuclear: 'Nuclear Family',
  extended: 'Extended Family',
  cluster: 'Family Cluster',
  unproven: 'Unproven Connection'
}

const CONFIDENCE_COLORS = {
  confirmed: 'bg-green-100 text-green-800',
  likely: 'bg-blue-100 text-blue-800',
  possible: 'bg-amber-100 text-amber-800'
}

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  active: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800'
}

function FamilyGroupCard({ group }) {
  const confidenceClass = CONFIDENCE_COLORS[group.confidence] || 'bg-gray-100 text-gray-600'
  const statusClass = STATUS_COLORS[group.status] || 'bg-gray-100 text-gray-600'

  return (
    <Link
      to={`/families/${group.slug}`}
      className="card hover:shadow-md transition-shadow block"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Title */}
          <h3 className="font-display text-lg">{group.name}</h3>

          {/* Type and badges */}
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-sm text-faded-ink">
              {GROUP_TYPE_LABELS[group.group_type] || group.group_type}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${confidenceClass}`}>
              {group.confidence}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusClass}`}>
              {group.status}
            </span>
          </div>

          {/* Summary */}
          {group.summary && (
            <p className="text-sm text-faded-ink mt-2 line-clamp-2">
              {group.summary}
            </p>
          )}

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-faded-ink">
            {/* Anchor person */}
            {group.anchor && (
              <span className="flex items-center gap-1">
                <Users size={14} />
                {group.anchor.given_name} {group.anchor.surname}
              </span>
            )}

            {/* Location */}
            {group.location && (
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {group.location.name}
              </span>
            )}

            {/* Date range */}
            {(group.date_start || group.date_end) && (
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {group.date_start || '?'} - {group.date_end || '?'}
              </span>
            )}

            {/* DNA group */}
            {group.dna_group && (
              <span className="flex items-center gap-1">
                <Dna size={14} />
                {group.dna_group}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default FamilyGroupCard
