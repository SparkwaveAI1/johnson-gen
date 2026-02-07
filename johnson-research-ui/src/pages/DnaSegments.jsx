import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Dna, Info, ZoomIn, ZoomOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useWorkspace } from '../contexts/WorkspaceContext'

// Chromosome lengths in Mbp (approximate, based on GRCh38)
const CHROMOSOME_LENGTHS = {
  '1': 249, '2': 243, '3': 198, '4': 191, '5': 182,
  '6': 171, '7': 159, '8': 146, '9': 141, '10': 136,
  '11': 135, '12': 134, '13': 115, '14': 107, '15': 102,
  '16': 90, '17': 83, '18': 80, '19': 59, '20': 64,
  '21': 47, '22': 51, 'X': 156
}

// Color palette for matches (distinct colors that work on light backgrounds)
const MATCH_COLORS = [
  '#2563eb', // blue
  '#dc2626', // red
  '#16a34a', // green
  '#9333ea', // purple
  '#ea580c', // orange
  '#0891b2', // cyan
  '#c026d3', // fuchsia
  '#4f46e5', // indigo
  '#059669', // emerald
  '#d97706', // amber
  '#7c3aed', // violet
  '#be185d', // pink
  '#0d9488', // teal
  '#65a30d', // lime
  '#e11d48', // rose
]

// Chromosome tabs
const CHROMOSOMES = [
  ...Array.from({ length: 22 }, (_, i) => String(i + 1)),
  'X'
]

export default function DnaSegmentsPage() {
  const { workspaceId } = useWorkspace()
  const [selectedChromosome, setSelectedChromosome] = useState('1')
  const [segments, setSegments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hoveredSegment, setHoveredSegment] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [minCmFilter, setMinCmFilter] = useState(0)

  // Load segments for selected chromosome
  useEffect(() => {
    if (workspaceId) {
      loadSegments()
    }
  }, [workspaceId, selectedChromosome])

  const loadSegments = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('dna_segments')
        .select(`
          id,
          chromosome,
          start_position,
          end_position,
          cm,
          snps,
          match_id,
          dna_matches!inner(
            id,
            match_name,
            shared_cm,
            predicted_relationship,
            workspace_id
          )
        `)
        .eq('chromosome', selectedChromosome)
        .eq('dna_matches.workspace_id', workspaceId)
        .order('start_position')

      if (fetchError) throw fetchError

      setSegments(data || [])
    } catch (err) {
      console.error('Error loading segments:', err)
      setError('Failed to load segments')
    } finally {
      setLoading(false)
    }
  }

  // Filter segments by minimum cM
  const filteredSegments = useMemo(() => {
    return segments.filter(s => (s.cm || 0) >= minCmFilter)
  }, [segments, minCmFilter])

  // Build color map for matches
  const matchColorMap = useMemo(() => {
    const uniqueMatches = [...new Set(filteredSegments.map(s => s.match_id))]
    const map = {}
    uniqueMatches.forEach((matchId, index) => {
      map[matchId] = MATCH_COLORS[index % MATCH_COLORS.length]
    })
    return map
  }, [filteredSegments])

  // Calculate segment rows (stack overlapping segments)
  const segmentRows = useMemo(() => {
    if (filteredSegments.length === 0) return []

    const rows = []
    const sortedSegments = [...filteredSegments].sort((a, b) => a.start_position - b.start_position)

    for (const segment of sortedSegments) {
      let placed = false
      
      // Try to place in existing row
      for (let i = 0; i < rows.length; i++) {
        const lastInRow = rows[i][rows[i].length - 1]
        // Leave small gap between segments on same row
        if (segment.start_position > lastInRow.end_position) {
          rows[i].push(segment)
          placed = true
          break
        }
      }

      // Create new row if couldn't place
      if (!placed) {
        rows.push([segment])
      }
    }

    return rows
  }, [filteredSegments])

  // Get chromosome length in Mbp
  const chromosomeLength = CHROMOSOME_LENGTHS[selectedChromosome] || 200

  // Generate tick marks for ruler (every 25 Mbp for shorter chromosomes, 50 for longer)
  const tickInterval = chromosomeLength > 150 ? 50 : 25
  const ticks = useMemo(() => {
    const result = []
    for (let i = 0; i <= chromosomeLength; i += tickInterval) {
      result.push(i)
    }
    return result
  }, [chromosomeLength, tickInterval])

  // Convert base pairs to percentage position
  const bpToPercent = useCallback((bp) => {
    const mbp = bp / 1_000_000 // Convert bp to Mbp
    return (mbp / chromosomeLength) * 100
  }, [chromosomeLength])

  // Handle mouse move for tooltip positioning
  const handleMouseMove = (e, segment) => {
    setHoveredSegment(segment)
    setTooltipPosition({ x: e.clientX, y: e.clientY })
  }

  // Format position for display
  const formatPosition = (bp) => {
    const mbp = bp / 1_000_000
    return mbp.toFixed(1) + ' Mbp'
  }

  // Stats
  const totalSegments = filteredSegments.length
  const uniqueMatches = new Set(filteredSegments.map(s => s.match_id)).size
  const avgCm = filteredSegments.length > 0
    ? (filteredSegments.reduce((sum, s) => sum + (s.cm || 0), 0) / filteredSegments.length).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Dna size={28} className="text-sepia" />
            Chromosome Segments
          </h1>
          <p className="text-faded-ink mt-1">
            Visualize shared DNA segments across chromosomes
          </p>
        </div>
      </div>

      {/* Chromosome Tabs */}
      <div className="card p-2">
        <div className="flex flex-wrap gap-1">
          {CHROMOSOMES.map(chr => (
            <button
              key={chr}
              onClick={() => setSelectedChromosome(chr)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                selectedChromosome === chr
                  ? 'bg-sepia text-white'
                  : 'bg-parchment hover:bg-aged-paper text-ink'
              }`}
            >
              {chr === 'X' ? 'X' : chr}
            </button>
          ))}
        </div>
      </div>

      {/* Stats and Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-faded-ink">Segments:</span>{' '}
            <span className="font-medium">{totalSegments}</span>
          </div>
          <div>
            <span className="text-faded-ink">Matches:</span>{' '}
            <span className="font-medium">{uniqueMatches}</span>
          </div>
          <div>
            <span className="text-faded-ink">Avg cM:</span>{' '}
            <span className="font-medium">{avgCm}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-faded-ink">Min cM:</label>
          <input
            type="number"
            min="0"
            step="5"
            value={minCmFilter}
            onChange={(e) => setMinCmFilter(Number(e.target.value) || 0)}
            className="w-20 px-2 py-1 text-sm border border-sepia/30 rounded"
          />
        </div>
      </div>

      {/* Visualization Area */}
      <div className="card">
        <div className="mb-4">
          <h2 className="text-lg font-medium">
            Chromosome {selectedChromosome}
            <span className="text-sm font-normal text-faded-ink ml-2">
              ({chromosomeLength} Mbp)
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-faded-ink">Loading segments...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48 text-red-600">
            <p>{error}</p>
          </div>
        ) : filteredSegments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-faded-ink">
            <Info size={32} className="mb-2" />
            <p>No segments on chromosome {selectedChromosome}</p>
            <p className="text-sm mt-1">
              Add segments from the{' '}
              <Link to="/dna/matches" className="text-sepia hover:underline">
                DNA Matches
              </Link>{' '}
              page
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Chromosome Ruler */}
            <div className="relative h-8 mb-2 border-b border-sepia/30">
              {/* Tick marks and labels */}
              {ticks.map(tick => {
                const percent = (tick / chromosomeLength) * 100
                return (
                  <div
                    key={tick}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${percent}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="w-px h-3 bg-sepia/50" />
                    <span className="text-xs text-faded-ink mt-0.5">{tick}</span>
                  </div>
                )
              })}
              {/* Ruler base line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-sepia/30" />
            </div>

            {/* Segment Rows */}
            <div className="space-y-1 min-h-[100px]">
              {segmentRows.map((row, rowIndex) => (
                <div key={rowIndex} className="relative h-7">
                  {row.map(segment => {
                    const startPercent = bpToPercent(segment.start_position)
                    const endPercent = bpToPercent(segment.end_position)
                    const widthPercent = endPercent - startPercent
                    const color = matchColorMap[segment.match_id]
                    const matchName = segment.dna_matches?.match_name || 'Unknown'
                    const showLabel = widthPercent > 8 // Only show label if segment is wide enough

                    return (
                      <Link
                        key={segment.id}
                        to={`/dna/matches/${segment.match_id}`}
                        className="absolute h-6 rounded cursor-pointer transition-all hover:ring-2 hover:ring-sepia hover:z-10"
                        style={{
                          left: `${startPercent}%`,
                          width: `${Math.max(widthPercent, 0.5)}%`,
                          backgroundColor: color,
                          opacity: hoveredSegment?.id === segment.id ? 1 : 0.85,
                        }}
                        onMouseMove={(e) => handleMouseMove(e, segment)}
                        onMouseLeave={() => setHoveredSegment(null)}
                      >
                        {showLabel && (
                          <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium truncate px-1">
                            {matchName}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-sepia/20">
              <h3 className="text-sm font-medium text-faded-ink mb-2">Matches</h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(matchColorMap).map(([matchId, color]) => {
                  const segment = filteredSegments.find(s => s.match_id === matchId)
                  const matchName = segment?.dna_matches?.match_name || 'Unknown'
                  const segmentCount = filteredSegments.filter(s => s.match_id === matchId).length

                  return (
                    <Link
                      key={matchId}
                      to={`/dna/matches/${matchId}`}
                      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-parchment transition-colors"
                    >
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm">{matchName}</span>
                      <span className="text-xs text-faded-ink">({segmentCount})</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tooltip */}
      {hoveredSegment && (
        <div
          className="fixed z-50 bg-ink text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none"
          style={{
            left: tooltipPosition.x + 12,
            top: tooltipPosition.y - 10,
            transform: 'translateY(-100%)',
          }}
        >
          <div className="font-medium">
            {hoveredSegment.dna_matches?.match_name || 'Unknown'}
          </div>
          <div className="text-gray-300 mt-1 space-y-0.5">
            <div>
              <span className="text-gray-400">cM:</span> {hoveredSegment.cm?.toFixed(1) || '—'}
            </div>
            <div>
              <span className="text-gray-400">Position:</span>{' '}
              {formatPosition(hoveredSegment.start_position)} – {formatPosition(hoveredSegment.end_position)}
            </div>
            {hoveredSegment.snps && (
              <div>
                <span className="text-gray-400">SNPs:</span> {hoveredSegment.snps.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-sm text-faded-ink">
        <p>
          <strong>Tip:</strong> Hover over segments to see details. Click to view the match.
          Overlapping segments are stacked vertically.
        </p>
      </div>
    </div>
  )
}
