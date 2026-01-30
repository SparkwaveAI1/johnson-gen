import { useState } from 'react'
import { ChevronDown, ChevronRight, Edit, Plus, Quote } from 'lucide-react'
import ConfidenceIndicator from '../common/ConfidenceIndicator'
import SourceCitation from '../sources/SourceCitation'

/**
 * EvidenceBlock - Expandable block showing evidence for a claim
 *
 * Props:
 * - confidence: 'confirmed' | 'likely' | 'possible'
 * - evidenceItems: array of evidence records with sources
 * - primarySource: the main source (shown when collapsed)
 * - excerpt: source excerpt to display
 * - onEdit: callback when edit button clicked
 * - onAddEvidence: callback when add evidence button clicked
 * - editable: whether to show edit controls (default: false)
 * - compact: smaller display variant (default: false)
 */

function EvidenceBlock({
  confidence = 'possible',
  evidenceItems = [],
  primarySource = null,
  excerpt = null,
  onEdit,
  onAddEvidence,
  editable = false,
  compact = false
}) {
  const [expanded, setExpanded] = useState(false)

  const hasMultipleItems = evidenceItems.length > 1
  const displaySource = primarySource || evidenceItems[0]?.source
  const displayExcerpt = excerpt || evidenceItems[0]?.source_excerpt

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 text-sm">
        <ConfidenceIndicator level={confidence} size="sm" />
        {displaySource && (
          <SourceCitation source={displaySource} format="short" />
        )}
      </div>
    )
  }

  return (
    <div className="border border-sepia/20 rounded-lg overflow-hidden bg-white">
      {/* Header - always visible */}
      <div
        className={`flex items-center justify-between p-3 ${
          hasMultipleItems ? 'cursor-pointer hover:bg-parchment/50' : ''
        }`}
        onClick={() => hasMultipleItems && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {hasMultipleItems && (
            <span className="text-faded-ink">
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
          <ConfidenceIndicator level={confidence} showLabel size="md" />
        </div>

        {editable && (
          <div className="flex items-center gap-2">
            {onAddEvidence && (
              <button
                onClick={(e) => { e.stopPropagation(); onAddEvidence() }}
                className="text-faded-ink hover:text-sepia p-1"
                title="Add evidence"
              >
                <Plus size={16} />
              </button>
            )}
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit() }}
                className="text-faded-ink hover:text-sepia p-1"
                title="Edit evidence"
              >
                <Edit size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Primary source display */}
      {displaySource && (
        <div className="px-3 pb-3 border-t border-sepia/10">
          <div className="pt-2">
            <span className="text-xs text-faded-ink uppercase tracking-wide">Source:</span>
            <div className="mt-1">
              <SourceCitation source={displaySource} format="short" showIcon />
            </div>
          </div>

          {displayExcerpt && (
            <div className="mt-2 pl-3 border-l-2 border-sepia/30">
              <Quote size={12} className="text-faded-ink mb-1" />
              <p className="text-sm italic text-faded-ink">
                "{displayExcerpt}"
              </p>
            </div>
          )}

          {evidenceItems[0]?.interpretation && (
            <p className="text-sm text-faded-ink mt-2">
              {evidenceItems[0].interpretation}
            </p>
          )}
        </div>
      )}

      {/* Expanded view - additional evidence items */}
      {expanded && hasMultipleItems && (
        <div className="border-t border-sepia/20 bg-parchment/30">
          <div className="p-3">
            <span className="text-xs text-faded-ink uppercase tracking-wide">
              Additional Evidence ({evidenceItems.length - 1} more)
            </span>
          </div>
          {evidenceItems.slice(1).map((item, index) => (
            <div key={item.id || index} className="px-3 pb-3 border-t border-sepia/10">
              <div className="pt-2">
                {item.source && (
                  <SourceCitation source={item.source} format="short" showIcon />
                )}
              </div>
              {item.source_excerpt && (
                <div className="mt-2 pl-3 border-l-2 border-sepia/30">
                  <p className="text-sm italic text-faded-ink">
                    "{item.source_excerpt}"
                  </p>
                </div>
              )}
              {item.interpretation && (
                <p className="text-sm text-faded-ink mt-2">
                  {item.interpretation}
                </p>
              )}
              <div className="mt-1">
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  item.evidence_type === 'direct' ? 'bg-green-100 text-green-800' :
                  item.evidence_type === 'indirect' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {item.evidence_type || 'unspecified'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No evidence warning */}
      {!displaySource && evidenceItems.length === 0 && (
        <div className="px-3 pb-3 border-t border-sepia/10">
          <p className="text-sm text-confidence-possible italic">
            No source documentation linked.
            {editable && onAddEvidence && (
              <button
                onClick={onAddEvidence}
                className="ml-2 text-sepia hover:underline"
              >
                Add evidence
              </button>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export default EvidenceBlock
