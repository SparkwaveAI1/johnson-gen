/**
 * ConfidenceIndicator - Visual indicator for confidence levels
 *
 * Displays:
 * ● Confirmed (green) - Direct documentary evidence
 * ◐ Likely (amber) - Strong circumstantial evidence
 * ○ Possible (gray) - Reasonable but unverified
 */

const confidenceConfig = {
  confirmed: {
    symbol: '●',
    label: 'Confirmed',
    color: 'text-confidence-confirmed',
    bgColor: 'bg-confidence-confirmed/10',
    description: 'Direct documentary evidence'
  },
  likely: {
    symbol: '◐',
    label: 'Likely',
    color: 'text-confidence-likely',
    bgColor: 'bg-confidence-likely/10',
    description: 'Strong circumstantial evidence'
  },
  probable: {
    symbol: '◐',
    label: 'Probable',
    color: 'text-confidence-likely',
    bgColor: 'bg-confidence-likely/10',
    description: 'Strong circumstantial evidence'
  },
  possible: {
    symbol: '○',
    label: 'Possible',
    color: 'text-confidence-possible',
    bgColor: 'bg-confidence-possible/10',
    description: 'Reasonable but unverified'
  },
  uncertain: {
    symbol: '○',
    label: 'Uncertain',
    color: 'text-confidence-possible',
    bgColor: 'bg-confidence-possible/10',
    description: 'Needs more research'
  }
}

function ConfidenceIndicator({ level, showLabel = false, showTooltip = true, size = 'md' }) {
  const config = confidenceConfig[level?.toLowerCase()] || confidenceConfig.possible

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${config.color} ${sizeClasses[size]}`}
      title={showTooltip ? `${config.label}: ${config.description}` : undefined}
    >
      <span className="font-bold">{config.symbol}</span>
      {showLabel && (
        <span className={`text-xs px-1.5 py-0.5 rounded ${config.bgColor} ${config.color}`}>
          {config.label}
        </span>
      )}
    </span>
  )
}

export default ConfidenceIndicator
