import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar, MapPin, FileText, Users, ChevronDown, ChevronUp,
  CheckCircle, HelpCircle, AlertCircle, Eye
} from 'lucide-react'
import {
  getEventTypeLabel,
  formatEventDate,
  getStatusDisplay,
  getRoleLabel
} from '../../lib/eventTypes'

/**
 * EventCard - Displays a single event with its participants
 *
 * Props:
 * - event: Event object with participants
 * - onConfirm: Function to confirm participant identification
 * - onReject: Function to reject participant identification
 * - showActions: Whether to show confirm/reject buttons
 * - compact: Whether to use compact display mode
 */
function EventCard({
  event,
  onConfirm,
  onReject,
  onChange,
  showActions = true,
  compact = false
}) {
  const [expanded, setExpanded] = useState(!compact)

  const participants = event.event_participants || []

  // Group participants by status
  const confirmedParticipants = participants.filter(p => p.identification_status === 'confirmed')
  const probableParticipants = participants.filter(p => p.identification_status === 'probable')
  const possibleParticipants = participants.filter(p => p.identification_status === 'possible')
  const unidentifiedParticipants = participants.filter(p => p.identification_status === 'unidentified')

  const identifiedCount = confirmedParticipants.length + probableParticipants.length
  const totalCount = participants.length

  return (
    <div className="border border-sepia/20 rounded-lg bg-white hover:shadow-md transition-shadow">
      {/* Header */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Date and Type */}
            <div className="flex items-center gap-2 text-sm text-faded-ink mb-1">
              <Calendar size={14} />
              <span>{formatEventDate(event)}</span>
              <span className="px-2 py-0.5 bg-sepia/10 rounded text-xs">
                {getEventTypeLabel(event.event_type)}
              </span>
              {event.confidence && (
                <span className={`px-2 py-0.5 rounded text-xs ${
                  event.confidence === 'confirmed' ? 'bg-green-100 text-green-800' :
                  event.confidence === 'probable' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.confidence}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-medium text-ink">{event.title}</h3>

            {/* Location */}
            {(event.location_text || event.location) && (
              <div className="flex items-center gap-1 text-sm text-faded-ink mt-1">
                <MapPin size={14} />
                <span>{event.location?.name || event.location_text}</span>
              </div>
            )}

            {/* Participant count */}
            <div className="flex items-center gap-2 mt-2 text-sm">
              <Users size={14} className="text-faded-ink" />
              <span className="text-faded-ink">
                {totalCount} participant{totalCount !== 1 ? 's' : ''}
              </span>
              {identifiedCount > 0 && (
                <span className="text-green-600">
                  ({identifiedCount} identified)
                </span>
              )}
            </div>
          </div>

          {/* Expand/Collapse */}
          <button className="p-1 text-faded-ink hover:text-ink">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-sepia/20 p-4">
          {/* Description */}
          {event.description && (
            <p className="text-sm text-faded-ink mb-4">{event.description}</p>
          )}

          {/* Transcription */}
          {event.transcription && (
            <div className="mb-4 p-3 bg-parchment/50 rounded text-sm italic">
              "{event.transcription}"
            </div>
          )}

          {/* Participants */}
          {participants.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-faded-ink uppercase tracking-wide">
                Participants
              </h4>

              {/* Confirmed */}
              {confirmedParticipants.length > 0 && (
                <ParticipantGroup
                  title="Confirmed"
                  participants={confirmedParticipants}
                  statusColor="green"
                  icon={<CheckCircle size={14} className="text-green-600" />}
                  showActions={false}
                />
              )}

              {/* Probable */}
              {probableParticipants.length > 0 && (
                <ParticipantGroup
                  title="Probable"
                  participants={probableParticipants}
                  statusColor="blue"
                  icon={<CheckCircle size={14} className="text-blue-600" />}
                  showActions={showActions}
                  onConfirm={onConfirm}
                  onReject={onReject}
                  onChange={onChange}
                />
              )}

              {/* Possible */}
              {possibleParticipants.length > 0 && (
                <ParticipantGroup
                  title="Possible"
                  participants={possibleParticipants}
                  statusColor="yellow"
                  icon={<HelpCircle size={14} className="text-yellow-600" />}
                  showActions={showActions}
                  onConfirm={onConfirm}
                  onReject={onReject}
                  onChange={onChange}
                  showPossibleMatches
                />
              )}

              {/* Unidentified */}
              {unidentifiedParticipants.length > 0 && (
                <ParticipantGroup
                  title="Unidentified"
                  participants={unidentifiedParticipants}
                  statusColor="gray"
                  icon={<AlertCircle size={14} className="text-gray-400" />}
                  showActions={showActions}
                  onChange={onChange}
                />
              )}
            </div>
          )}

          {/* View Document Link */}
          {event.document && (
            <div className="mt-4 pt-4 border-t border-sepia/10">
              <Link
                to={`/documents/${event.document.id}`}
                className="text-sm text-sepia hover:underline flex items-center gap-1"
              >
                <FileText size={14} />
                View source document
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * ParticipantGroup - Group of participants with same status
 */
function ParticipantGroup({
  title,
  participants,
  statusColor,
  icon,
  showActions,
  onConfirm,
  onReject,
  onChange,
  showPossibleMatches
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        {icon}
        <span className={`font-medium text-${statusColor}-700`}>{title}</span>
        <span className="text-faded-ink">({participants.length})</span>
      </div>

      <div className="space-y-2 ml-6">
        {participants.map(participant => (
          <ParticipantRow
            key={participant.id}
            participant={participant}
            showActions={showActions}
            onConfirm={onConfirm}
            onReject={onReject}
            onChange={onChange}
            showPossibleMatches={showPossibleMatches}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * ParticipantRow - Single participant display
 */
function ParticipantRow({
  participant,
  showActions,
  onConfirm,
  onReject,
  onChange,
  showPossibleMatches
}) {
  const status = getStatusDisplay(participant.identification_status)
  const possibleMatches = participant.possible_matches || []

  return (
    <div className="p-2 rounded bg-parchment/30 hover:bg-parchment/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Name and Role */}
          <div className="flex items-center gap-2">
            <span className="font-medium">{participant.name_as_written}</span>
            <span className="text-xs text-faded-ink">
              ({getRoleLabel(participant.role)})
            </span>
          </div>

          {/* Linked Profile */}
          {participant.person && (
            <div className="mt-1">
              <Link
                to={`/people/${participant.person.id}`}
                className="text-sm text-sepia hover:underline flex items-center gap-1"
              >
                → {participant.person.given_name} {participant.person.surname}
                {participant.person.birth_year && (
                  <span className="text-faded-ink">(b. {participant.person.birth_year})</span>
                )}
              </Link>
              {participant.confidence && (
                <span className={`ml-2 text-xs px-1 py-0.5 rounded ${status.bgColor} ${status.textColor}`}>
                  Score: {participant.confidence}
                </span>
              )}
            </div>
          )}

          {/* Possible Matches */}
          {showPossibleMatches && possibleMatches.length > 0 && (
            <div className="mt-2 text-xs text-faded-ink">
              <span className="font-medium">Also possible:</span>
              <ul className="mt-1 space-y-1">
                {possibleMatches.slice(0, 3).map((match, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span>{match.person_name || match.person_id}</span>
                    <span className="px-1 bg-gray-100 rounded">[{match.score}]</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Evidence */}
          {participant.identification_evidence && (
            <p className="mt-1 text-xs text-faded-ink italic">
              {participant.identification_evidence}
            </p>
          )}
        </div>

        {/* Actions */}
        {showActions && participant.identification_status !== 'confirmed' && (
          <div className="flex items-center gap-1">
            {(participant.identification_status === 'probable' || participant.identification_status === 'possible') && (
              <>
                <button
                  onClick={() => onConfirm?.(participant)}
                  className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                >
                  Confirm
                </button>
                <button
                  onClick={() => onReject?.(participant)}
                  className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                >
                  Reject
                </button>
              </>
            )}
            {participant.identification_status === 'unidentified' && (
              <button
                onClick={() => onChange?.(participant)}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                Identify
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EventCard
