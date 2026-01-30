import { Link } from 'react-router-dom'
import {
  FileText, Clock, CheckCircle, AlertCircle, Pause, Play,
  Eye, RefreshCw, Loader2
} from 'lucide-react'
import { getProcessingStatusDisplay } from '../../lib/eventTypes'

/**
 * ProcessingStatusCard - Shows document processing status
 *
 * Props:
 * - document: Document with processing status
 * - onPause: Callback to pause processing
 * - onResume: Callback to resume processing
 * - onRetry: Callback to retry failed processing
 * - compact: Use compact layout
 */
function ProcessingStatusCard({
  document,
  onPause,
  onResume,
  onRetry,
  compact = false
}) {
  const status = getProcessingStatusDisplay(document.processing_status)
  const isProcessing = ['analyzing', 'extracting', 'matching'].includes(document.processing_status)
  const isComplete = document.processing_status === 'complete'
  const isError = document.processing_status === 'error'
  const needsReview = document.processing_status === 'review'

  // Calculate progress percentage
  const getProgressPercent = () => {
    if (isComplete) return 100
    if (document.processing_status === 'uploaded') return 0
    if (document.processing_status === 'analyzing') return 15
    if (document.processing_status === 'extracting') {
      // Estimate based on line count if available
      if (document.line_count && document.event_count) {
        return 15 + Math.min(60, (document.event_count / document.line_count) * 100 * 60)
      }
      return 40
    }
    if (document.processing_status === 'matching') return 80
    if (needsReview) return 95
    return 0
  }

  const progress = getProgressPercent()

  // Calculate identified percentage
  const identifiedPercent = document.participant_count > 0
    ? Math.round(((document.confirmed_count || 0) + (document.probable_count || 0)) / document.participant_count * 100)
    : 0

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-3 bg-white border border-sepia/20 rounded-lg">
        {/* Icon */}
        <div className={`p-2 rounded-full ${
          isComplete ? 'bg-green-100' :
          isError ? 'bg-red-100' :
          needsReview ? 'bg-yellow-100' :
          'bg-blue-100'
        }`}>
          {isProcessing ? (
            <Loader2 size={20} className="text-blue-600 animate-spin" />
          ) : isComplete ? (
            <CheckCircle size={20} className="text-green-600" />
          ) : isError ? (
            <AlertCircle size={20} className="text-red-600" />
          ) : (
            <FileText size={20} className="text-sepia" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{document.title}</h4>
          <div className="flex items-center gap-2 text-sm text-faded-ink">
            <span className={`px-2 py-0.5 rounded text-xs ${
              isComplete ? 'bg-green-100 text-green-800' :
              isError ? 'bg-red-100 text-red-800' :
              needsReview ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {status.label}
            </span>
            {isProcessing && (
              <span>{progress}%</span>
            )}
            {document.event_count > 0 && (
              <span>{document.event_count} events</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {document.processing_status === 'uploaded' && onResume && (
            <button
              onClick={() => onResume(document)}
              className="btn-primary text-sm flex items-center gap-1"
            >
              <Play size={14} />
              Start Processing
            </button>
          )}
          {needsReview && (
            <Link
              to={`/documents/${document.id}/review`}
              className="btn-primary text-sm"
            >
              Review
            </Link>
          )}
          {isComplete && (
            <Link
              to={`/documents/${document.id}`}
              className="btn-secondary text-sm flex items-center gap-1"
            >
              <Eye size={14} />
              View
            </Link>
          )}
          {isError && onRetry && (
            <button
              onClick={() => onRetry(document)}
              className="btn-secondary text-sm flex items-center gap-1"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          )}
        </div>
      </div>
    )
  }

  // Full card
  return (
    <div className="bg-white border border-sepia/20 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-sepia/10">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-lg">{document.title}</h3>
            {document.file_type && (
              <span className="text-sm text-faded-ink">
                {document.file_type.toUpperCase()}
              </span>
            )}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm ${
            isComplete ? 'bg-green-100 text-green-800' :
            isError ? 'bg-red-100 text-red-800' :
            needsReview ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {status.label}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {!isComplete && !isError && (
        <div className="px-4 py-2 bg-parchment/30">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-faded-ink">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-sepia/20 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isProcessing ? 'bg-blue-500' : 'bg-sepia'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="p-4 grid grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold">{document.line_count || '-'}</div>
          <div className="text-xs text-faded-ink uppercase">Lines</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{document.event_count || 0}</div>
          <div className="text-xs text-faded-ink uppercase">Events</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{document.participant_count || 0}</div>
          <div className="text-xs text-faded-ink uppercase">Participants</div>
        </div>
        <div>
          <div className="text-2xl font-bold">
            {identifiedPercent}%
          </div>
          <div className="text-xs text-faded-ink uppercase">Identified</div>
        </div>
      </div>

      {/* Error Message */}
      {isError && document.error_message && (
        <div className="px-4 pb-4">
          <div className="p-3 bg-red-50 text-red-800 rounded text-sm">
            <strong>Error:</strong> {document.error_message}
          </div>
        </div>
      )}

      {/* Processing Time */}
      {document.processing_started_at && (
        <div className="px-4 pb-4 text-sm text-faded-ink flex items-center gap-1">
          <Clock size={14} />
          Started: {new Date(document.processing_started_at).toLocaleString()}
          {document.processing_completed_at && (
            <span className="ml-2">
              Completed: {new Date(document.processing_completed_at).toLocaleString()}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        {isProcessing && onPause && (
          <button
            onClick={() => onPause(document)}
            className="btn-secondary flex items-center gap-1"
          >
            <Pause size={14} />
            Pause
          </button>
        )}
        {document.processing_status === 'uploaded' && onResume && (
          <button
            onClick={() => onResume(document)}
            className="btn-primary flex items-center gap-1"
          >
            <Play size={14} />
            Start Processing
          </button>
        )}
        {needsReview && (
          <Link
            to={`/documents/${document.id}/review`}
            className="btn-primary flex items-center gap-1"
          >
            <Eye size={14} />
            Review Results
          </Link>
        )}
        {isComplete && (
          <Link
            to={`/documents/${document.id}`}
            className="btn-secondary flex items-center gap-1"
          >
            <Eye size={14} />
            View Summary
          </Link>
        )}
        {isError && onRetry && (
          <button
            onClick={() => onRetry(document)}
            className="btn-secondary flex items-center gap-1"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        )}
      </div>
    </div>
  )
}

export default ProcessingStatusCard
