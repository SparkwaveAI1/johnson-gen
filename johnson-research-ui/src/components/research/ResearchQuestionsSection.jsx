import { useState } from 'react'
import { AlertTriangle, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { useResearchQuestions } from '../../hooks/useResearchQuestions'
import ResearchQuestionCard from './ResearchQuestionCard'

/**
 * ResearchQuestionsSection - Display open research questions for a person
 */
function ResearchQuestionsSection({ personId }) {
  const [showResolved, setShowResolved] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const {
    questions: openQuestions,
    loading: loadingOpen,
    resolveQuestion,
    markCannotResolve,
    reopenQuestion
  } = useResearchQuestions(personId, { statusFilter: 'open' })

  const {
    questions: resolvedQuestions,
    loading: loadingResolved,
    refetch: refetchResolved
  } = useResearchQuestions(personId, { statusFilter: showResolved ? null : 'resolved' })

  // Filter resolved to only show resolved/cannot_resolve
  const closedQuestions = showResolved
    ? resolvedQuestions.filter(q => q.status !== 'open')
    : []

  const handleResolve = async (questionId, resolution) => {
    await resolveQuestion(questionId, resolution)
    refetchResolved()
  }

  const handleCannotResolve = async (questionId, resolution) => {
    await markCannotResolve(questionId, resolution)
    refetchResolved()
  }

  const handleReopen = async (questionId) => {
    await reopenQuestion(questionId)
    refetchResolved()
  }

  if (loadingOpen) {
    return (
      <div className="p-4 text-center text-faded-ink">
        Loading research questions...
      </div>
    )
  }

  // Don't show section if no questions at all
  if (openQuestions.length === 0 && closedQuestions.length === 0 && !showResolved) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <h2 className="text-lg font-display flex items-center gap-2">
          <AlertTriangle className="text-amber-600" size={20} />
          Open Research Questions
          {openQuestions.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-sm rounded-full">
              {openQuestions.length}
            </span>
          )}
        </h2>
        <button className="text-faded-ink hover:text-ink p-1">
          {collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Open Questions */}
          {openQuestions.length > 0 ? (
            <div className="space-y-3">
              {openQuestions.map((question) => (
                <ResearchQuestionCard
                  key={question.id}
                  question={question}
                  onResolve={handleResolve}
                  onCannotResolve={handleCannotResolve}
                />
              ))}
            </div>
          ) : (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center text-green-800">
              No open research questions for this person.
            </div>
          )}

          {/* Show Resolved Toggle */}
          <div className="pt-2 border-t border-sepia/10">
            <button
              onClick={() => setShowResolved(!showResolved)}
              className="text-sm text-faded-ink hover:text-ink"
            >
              {showResolved ? 'Hide' : 'Show'} resolved questions
              {!showResolved && closedQuestions.length > 0 && (
                <span className="ml-1">({closedQuestions.length})</span>
              )}
            </button>
          </div>

          {/* Resolved Questions */}
          {showResolved && closedQuestions.length > 0 && (
            <div className="space-y-3 opacity-75">
              <h3 className="text-sm font-medium text-faded-ink uppercase">
                Resolved Questions
              </h3>
              {closedQuestions.map((question) => (
                <ResearchQuestionCard
                  key={question.id}
                  question={question}
                  onReopen={handleReopen}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ResearchQuestionsSection
