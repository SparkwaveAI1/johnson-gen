import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Users,
  FileText,
  Search,
  HelpCircle,
  Link as LinkIcon
} from 'lucide-react'
import { useRelatedPeople } from '../../hooks/useResearchQuestions'

/**
 * Question type configuration
 */
const questionTypes = {
  relationship: {
    label: 'Relationship',
    icon: Users,
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  identity: {
    label: 'Identity',
    icon: HelpCircle,
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  source_needed: {
    label: 'Source Needed',
    icon: FileText,
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  gap: {
    label: 'Gap in Record',
    icon: Search,
    color: 'bg-red-100 text-red-800 border-red-200'
  },
  verification: {
    label: 'Verification',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 border-green-200'
  }
}

/**
 * ResearchQuestionCard - Display a research question with evidence and actions
 */
function ResearchQuestionCard({
  question,
  onResolve,
  onCannotResolve,
  onReopen,
  showActions = true
}) {
  const [expanded, setExpanded] = useState(false)
  const [showResolveForm, setShowResolveForm] = useState(false)
  const [resolution, setResolution] = useState('')
  const [saving, setSaving] = useState(false)

  const { people: relatedPeople } = useRelatedPeople(question.related_people)

  const typeConfig = questionTypes[question.question_type] || questionTypes.verification
  const TypeIcon = typeConfig.icon

  const hasEvidence = question.evidence_for || question.evidence_against
  const hasResearchAction = question.research_action

  const handleResolve = async () => {
    if (!resolution.trim()) return
    setSaving(true)
    await onResolve(question.id, resolution)
    setSaving(false)
    setShowResolveForm(false)
    setResolution('')
  }

  const handleCannotResolve = async () => {
    setSaving(true)
    await onCannotResolve(question.id, resolution || null)
    setSaving(false)
    setShowResolveForm(false)
    setResolution('')
  }

  const isResolved = question.status === 'resolved'
  const isCannotResolve = question.status === 'cannot_resolve'

  return (
    <div
      className={`rounded-lg border ${
        isResolved
          ? 'bg-green-50/50 border-green-200'
          : isCannotResolve
          ? 'bg-gray-50 border-gray-200'
          : 'bg-amber-50/70 border-amber-200'
      }`}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Type Badge */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${typeConfig.color}`}
          >
            <TypeIcon size={12} />
            {typeConfig.label}
          </span>

          {/* Question */}
          <div className="flex-1">
            <p className={`font-medium ${isResolved || isCannotResolve ? 'text-faded-ink' : 'text-ink'}`}>
              {question.question}
            </p>

            {/* Status indicator for resolved questions */}
            {isResolved && (
              <div className="mt-2 flex items-center gap-2 text-green-700 text-sm">
                <CheckCircle size={14} />
                <span>Resolved {question.resolution_date}</span>
              </div>
            )}
            {isCannotResolve && (
              <div className="mt-2 flex items-center gap-2 text-gray-500 text-sm">
                <XCircle size={14} />
                <span>Cannot resolve {question.resolution_date}</span>
              </div>
            )}
          </div>

          {/* Expand/Collapse */}
          {(hasEvidence || hasResearchAction || question.resolution) && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-faded-ink hover:text-ink p-1"
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          )}
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="mt-4 space-y-3 text-sm">
            {/* Evidence For */}
            {question.evidence_for && (
              <div className="p-3 bg-green-50 rounded border border-green-100">
                <p className="text-xs font-medium text-green-800 uppercase mb-1">
                  Evidence For
                </p>
                <p className="text-green-900">{question.evidence_for}</p>
              </div>
            )}

            {/* Evidence Against */}
            {question.evidence_against && (
              <div className="p-3 bg-red-50 rounded border border-red-100">
                <p className="text-xs font-medium text-red-800 uppercase mb-1">
                  Evidence Against
                </p>
                <p className="text-red-900">{question.evidence_against}</p>
              </div>
            )}

            {/* Research Action */}
            {question.research_action && (
              <div className="p-3 bg-blue-50 rounded border border-blue-100">
                <p className="text-xs font-medium text-blue-800 uppercase mb-1">
                  Research Action
                </p>
                <p className="text-blue-900">{question.research_action}</p>
              </div>
            )}

            {/* Resolution (for resolved questions) */}
            {question.resolution && (
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs font-medium text-gray-600 uppercase mb-1">
                  Resolution
                </p>
                <p className="text-gray-800">{question.resolution}</p>
              </div>
            )}

            {/* Source File */}
            {question.source_file && (
              <p className="text-faded-ink">
                <FileText size={12} className="inline mr-1" />
                Source: {question.source_file}
              </p>
            )}

            {/* Related People */}
            {relatedPeople.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-faded-ink text-xs">
                  <LinkIcon size={12} className="inline mr-1" />
                  Related:
                </span>
                {relatedPeople.map((person) => (
                  <Link
                    key={person.id}
                    to={`/people/${person.id}`}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded border border-sepia/20 text-xs hover:bg-parchment"
                  >
                    {person.given_name} {person.surname}
                    {person.birth_year && (
                      <span className="text-faded-ink">(b.{person.birth_year})</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && question.status === 'open' && (
        <div className="px-4 py-3 border-t border-amber-200 bg-amber-50/50">
          {showResolveForm ? (
            <div className="space-y-3">
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="What did you find? Describe the resolution..."
                rows={2}
                className="w-full px-3 py-2 border border-sepia/30 rounded text-sm focus:outline-none focus:ring-2 focus:ring-sepia/20"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleResolve}
                  disabled={saving || !resolution.trim()}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Mark Resolved'}
                </button>
                <button
                  onClick={handleCannotResolve}
                  disabled={saving}
                  className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 disabled:opacity-50"
                >
                  Cannot Resolve
                </button>
                <button
                  onClick={() => {
                    setShowResolveForm(false)
                    setResolution('')
                  }}
                  className="px-3 py-1.5 text-sm text-faded-ink hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowResolveForm(true)}
              className="text-sm text-amber-800 hover:text-amber-900 font-medium"
            >
              <CheckCircle size={14} className="inline mr-1" />
              Update Status
            </button>
          )}
        </div>
      )}

      {/* Reopen action for resolved questions */}
      {showActions && (question.status === 'resolved' || question.status === 'cannot_resolve') && onReopen && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50/50">
          <button
            onClick={() => onReopen(question.id)}
            className="text-sm text-faded-ink hover:text-ink"
          >
            Reopen question
          </button>
        </div>
      )}
    </div>
  )
}

export default ResearchQuestionCard
