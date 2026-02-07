import { useState, useEffect, useMemo, useRef } from 'react'
import { Dna, Search, X, Info, Filter, ChevronDown, Users, Layers } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useWorkspace } from '../contexts/WorkspaceContext'

// Chromosome lengths in base pairs (approximate, for visualization scaling)
const CHROMOSOME_LENGTHS = {
  '1': 249000000, '2': 243000000, '3': 198000000, '4': 191000000,
  '5': 181000000, '6': 171000000, '7': 159000000, '8': 146000000,
  '9': 138000000, '10': 135000000, '11': 135000000, '12': 134000000,
  '13': 115000000, '14': 107000000, '15': 102000000, '16': 90000000,
  '17': 84000000, '18': 80000000, '19': 59000000, '20': 63000000,
  '21': 47000000, '22': 51000000, 'X': 155000000
}

const CHROMOSOMES = [...Array.from({ length: 22 }, (_, i) => String(i + 1)), 'X']

// Color palette for matches
const MATCH_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
  '#14B8A6', '#A855F7', '#F43F5E', '#22C55E', '#0EA5E9'
]

function getMatchColor(index) {
  return MATCH_COLORS[index % MATCH_COLORS.length]
}

// Striped pattern for overlaps
const OVERLAP_PATTERN_ID = 'overlap-pattern'

function OverlapPattern() {
  return (
    <defs>
      <pattern
        id={OVERLAP_PATTERN_ID}
        patternUnits="userSpaceOnUse"
        width="8"
        height="8"
        patternTransform="rotate(45)"
      >
        <rect width="4" height="8" fill="#EF4444" fillOpacity="0.7" />
        <rect x="4" width="4" height="8" fill="#F59E0B" fillOpacity="0.7" />
      </pattern>
    </defs>
  )
}

// Detect overlapping segments
function findOverlaps(segments) {
  const overlaps = []
  
  // Group by chromosome
  const byChromosome = {}
  segments.forEach(seg => {
    const chr = seg.chromosome
    if (!byChromosome[chr]) byChromosome[chr] = []
    byChromosome[chr].push(seg)
  })
  
  // Find overlaps within each chromosome
  Object.entries(byChromosome).forEach(([chromosome, segs]) => {
    for (let i = 0; i < segs.length; i++) {
      for (let j = i + 1; j < segs.length; j++) {
        const a = segs[i]
        const b = segs[j]
        
        // Check overlap: a.start <= b.end AND a.end >= b.start
        const aStart = parseInt(a.start_position) || 0
        const aEnd = parseInt(a.end_position) || 0
        const bStart = parseInt(b.start_position) || 0
        const bEnd = parseInt(b.end_position) || 0
        
        if (aStart <= bEnd && aEnd >= bStart) {
          // Calculate overlap region
          const overlapStart = Math.max(aStart, bStart)
          const overlapEnd = Math.min(aEnd, bEnd)
          
          // Check if this overlap region already exists
          const existingOverlap = overlaps.find(o =>
            o.chromosome === chromosome &&
            o.start === overlapStart &&
            o.end === overlapEnd
          )
          
          if (existingOverlap) {
            // Add matches to existing overlap
            if (!existingOverlap.matchIds.includes(a.match_id)) {
              existingOverlap.matchIds.push(a.match_id)
              existingOverlap.segments.push(a)
            }
            if (!existingOverlap.matchIds.includes(b.match_id)) {
              existingOverlap.matchIds.push(b.match_id)
              existingOverlap.segments.push(b)
            }
          } else {
            overlaps.push({
              chromosome,
              start: overlapStart,
              end: overlapEnd,
              matchIds: [a.match_id, b.match_id],
              segments: [a, b]
            })
          }
        }
      }
    }
  })
  
  return overlaps
}

// Overlap popup component
function OverlapPopup({ overlap, matches, position, onClose }) {
  const popupRef = useRef(null)
  
  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])
  
  const overlappingMatches = matches.filter(m => overlap.matchIds.includes(m.id))
  const overlapCm = overlap.segments.reduce((max, seg) => 
    Math.max(max, parseFloat(seg.cm) || 0), 0
  )
  
  return (
    <div
      ref={popupRef}
      className="absolute z-50 bg-white rounded-lg shadow-xl border border-sepia/30 p-4 min-w-[280px]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, 8px)'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-orange-500" />
          <h3 className="font-semibold">Overlap Region</h3>
        </div>
        <button onClick={onClose} className="text-faded-ink hover:text-ink">
          <X size={16} />
        </button>
      </div>
      
      <div className="text-sm text-faded-ink mb-3">
        <div>Chromosome {overlap.chromosome}</div>
        <div>Position: {overlap.start.toLocaleString()} - {overlap.end.toLocaleString()}</div>
        {overlapCm > 0 && <div>Max cM: {overlapCm.toFixed(2)}</div>}
      </div>
      
      <div className="border-t border-sepia/20 pt-3">
        <div className="text-xs text-faded-ink uppercase mb-2">
          {overlappingMatches.length} Matches Share This Region
        </div>
        <ul className="space-y-2">
          {overlappingMatches.map(match => (
            <li key={match.id} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: match.color }}
              />
              <span className="font-medium">{match.match_name}</span>
              <span className="text-xs text-faded-ink">
                ({match.shared_cm?.toFixed(1) || '?'} cM)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Single chromosome visualization
function ChromosomeBar({ 
  chromosome, 
  segments, 
  overlaps,
  maxLength, 
  matches,
  highlightMatchId,
  onOverlapClick
}) {
  const chrLength = CHROMOSOME_LENGTHS[chromosome] || 100000000
  const scale = 100 / maxLength
  const widthPercent = (chrLength / maxLength) * 100
  
  const chrSegments = segments.filter(s => s.chromosome === chromosome)
  const chrOverlaps = overlaps.filter(o => o.chromosome === chromosome)
  
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="w-8 text-right text-sm font-mono text-faded-ink">
        {chromosome}
      </div>
      <div 
        className="relative h-6 bg-gray-100 rounded-full overflow-hidden border border-gray-200"
        style={{ width: `${widthPercent}%`, minWidth: '100px' }}
      >
        <svg width="100%" height="100%" className="absolute inset-0">
          <OverlapPattern />
          
          {/* Regular segments */}
          {chrSegments.map((seg, idx) => {
            const start = (parseInt(seg.start_position) || 0) / chrLength * 100
            const end = (parseInt(seg.end_position) || 0) / chrLength * 100
            const width = end - start
            const match = matches.find(m => m.id === seg.match_id)
            const isHighlighted = highlightMatchId && seg.match_id === highlightMatchId
            
            return (
              <rect
                key={seg.id || idx}
                x={`${start}%`}
                y="2"
                width={`${Math.max(width, 0.5)}%`}
                height="20"
                fill={match?.color || '#888'}
                fillOpacity={isHighlighted ? 1 : (highlightMatchId ? 0.3 : 0.7)}
                rx="2"
                className="transition-opacity duration-200"
              />
            )
          })}
          
          {/* Overlap regions */}
          {chrOverlaps.map((overlap, idx) => {
            const start = overlap.start / chrLength * 100
            const end = overlap.end / chrLength * 100
            const width = end - start
            
            return (
              <rect
                key={`overlap-${idx}`}
                x={`${start}%`}
                y="0"
                width={`${Math.max(width, 1)}%`}
                height="24"
                fill={`url(#${OVERLAP_PATTERN_ID})`}
                className="cursor-pointer hover:stroke-red-500 hover:stroke-2"
                onClick={(e) => onOverlapClick(overlap, e)}
              />
            )
          })}
        </svg>
      </div>
      <div className="w-16 text-xs text-faded-ink">
        {chrSegments.length} seg
      </div>
    </div>
  )
}

export default function DnaSegmentsPage() {
  const { workspaceId } = useWorkspace()
  const [segments, setSegments] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [minCm, setMinCm] = useState(0)
  const [selectedMatchId, setSelectedMatchId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // Overlap popup
  const [activeOverlap, setActiveOverlap] = useState(null)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  
  const containerRef = useRef(null)

  useEffect(() => {
    if (workspaceId) {
      loadData()
    }
  }, [workspaceId])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load all segments with match info
      const { data: segmentData, error: segError } = await supabase
        .from('dna_segments')
        .select(`
          id,
          match_id,
          chromosome,
          start_position,
          end_position,
          cm,
          snps
        `)
        .order('chromosome')
        .order('start_position')

      if (segError) throw segError

      // Load matches for color coding
      const { data: matchData, error: matchError } = await supabase
        .from('dna_matches')
        .select('id, match_name, shared_cm, testing_company')
        .eq('workspace_id', workspaceId)
        .order('match_name')

      if (matchError) throw matchError

      // Assign colors to matches
      const matchesWithColors = (matchData || []).map((m, idx) => ({
        ...m,
        color: getMatchColor(idx)
      }))

      setMatches(matchesWithColors)
      setSegments(segmentData || [])
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter segments
  const filteredSegments = useMemo(() => {
    return segments.filter(seg => {
      // Min cM filter
      if (minCm > 0 && (parseFloat(seg.cm) || 0) < minCm) {
        return false
      }
      
      // Match filter
      if (selectedMatchId && seg.match_id !== selectedMatchId) {
        return false
      }
      
      return true
    })
  }, [segments, minCm, selectedMatchId])

  // Filter matches for dropdown
  const filteredMatches = useMemo(() => {
    if (!searchQuery) return matches
    const query = searchQuery.toLowerCase()
    return matches.filter(m => m.match_name?.toLowerCase().includes(query))
  }, [matches, searchQuery])

  // Calculate overlaps
  const overlaps = useMemo(() => {
    return findOverlaps(filteredSegments)
  }, [filteredSegments])

  // Stats
  const stats = useMemo(() => {
    const uniqueMatches = new Set(filteredSegments.map(s => s.match_id)).size
    const totalCm = filteredSegments.reduce((sum, s) => sum + (parseFloat(s.cm) || 0), 0)
    return {
      totalSegments: filteredSegments.length,
      uniqueMatches,
      totalCm: totalCm.toFixed(1),
      overlapCount: overlaps.length
    }
  }, [filteredSegments, overlaps])

  // Max chromosome length for scaling
  const maxLength = Math.max(...Object.values(CHROMOSOME_LENGTHS))

  const handleOverlapClick = (overlap, event) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setPopupPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      })
      setActiveOverlap(overlap)
    }
  }

  const selectedMatch = matches.find(m => m.id === selectedMatchId)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-faded-ink">Loading DNA segments...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6" ref={containerRef}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Dna size={28} className="text-sepia" />
            DNA Segment Visualizer
          </h1>
          <p className="text-faded-ink mt-1">
            View shared segments across all chromosomes
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-sepia">{stats.totalSegments}</p>
          <p className="text-sm text-faded-ink">Total Segments</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-sepia">{stats.uniqueMatches}</p>
          <p className="text-sm text-faded-ink">Matches Shown</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-sepia">{stats.totalCm}</p>
          <p className="text-sm text-faded-ink">Total cM</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-orange-500">{stats.overlapCount}</p>
          <p className="text-sm text-faded-ink">Overlap Regions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Match Selector */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-faded-ink uppercase mb-1 block">
              Highlight Match
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faded-ink" />
              <select
                value={selectedMatchId}
                onChange={(e) => setSelectedMatchId(e.target.value)}
                className="input pl-9 pr-8 appearance-none"
              >
                <option value="">All Matches</option>
                {matches.map(match => (
                  <option key={match.id} value={match.id}>
                    {match.match_name} ({match.shared_cm?.toFixed(1) || '?'} cM)
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-faded-ink pointer-events-none" />
            </div>
          </div>

          {/* cM Filter */}
          <div className="w-48">
            <label className="text-xs text-faded-ink uppercase mb-1 block">
              Minimum cM: {minCm}
            </label>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={minCm}
              onChange={(e) => setMinCm(parseInt(e.target.value))}
              className="w-full accent-sepia"
            />
          </div>

          {/* Quick cM buttons */}
          <div className="flex gap-2">
            {[0, 7, 15, 25].map(val => (
              <button
                key={val}
                onClick={() => setMinCm(val)}
                className={`px-3 py-1 text-sm rounded ${
                  minCm === val 
                    ? 'bg-sepia text-cream' 
                    : 'bg-sepia/10 text-sepia hover:bg-sepia/20'
                }`}
              >
                {val === 0 ? 'All' : `≥${val}`}
              </button>
            ))}
          </div>
        </div>

        {/* Selected match indicator */}
        {selectedMatch && (
          <div className="mt-4 pt-4 border-t border-sepia/20 flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: selectedMatch.color }}
            />
            <span className="font-medium">{selectedMatch.match_name}</span>
            <span className="text-faded-ink">
              {selectedMatch.shared_cm?.toFixed(1)} cM total
            </span>
            <button
              onClick={() => setSelectedMatchId('')}
              className="ml-auto text-sm text-sepia hover:underline flex items-center gap-1"
            >
              <X size={14} />
              Clear selection
            </button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="card p-4">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-faded-ink" />
            <span className="text-sm text-faded-ink">Legend:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded bg-gradient-to-r from-blue-500 to-green-500" />
            <span className="text-sm">Segment (color = match)</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-4 rounded"
              style={{
                background: 'repeating-linear-gradient(45deg, #EF4444, #EF4444 4px, #F59E0B 4px, #F59E0B 8px)'
              }}
            />
            <span className="text-sm">Overlap region (click for details)</span>
          </div>

          {overlaps.length > 0 && (
            <div className="ml-auto text-sm text-orange-600 flex items-center gap-1">
              <Layers size={16} />
              {overlaps.length} overlap{overlaps.length !== 1 ? 's' : ''} detected
            </div>
          )}
        </div>
      </div>

      {/* Chromosome Visualization */}
      {segments.length === 0 ? (
        <div className="card p-12 text-center">
          <Dna size={48} className="mx-auto text-faded-ink mb-4" />
          <h3 className="text-lg font-medium mb-2">No segments yet</h3>
          <p className="text-faded-ink">
            Add DNA segments to your matches to see them visualized here.
          </p>
        </div>
      ) : (
        <div className="card p-6 relative">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Dna size={20} className="text-sepia" />
            Chromosome Map
          </h2>
          
          <div className="space-y-1">
            {CHROMOSOMES.map(chr => (
              <ChromosomeBar
                key={chr}
                chromosome={chr}
                segments={filteredSegments}
                overlaps={overlaps}
                maxLength={maxLength}
                matches={matches}
                highlightMatchId={selectedMatchId}
                onOverlapClick={handleOverlapClick}
              />
            ))}
          </div>
          
          {/* Overlap popup */}
          {activeOverlap && (
            <OverlapPopup
              overlap={activeOverlap}
              matches={matches}
              position={popupPosition}
              onClose={() => setActiveOverlap(null)}
            />
          )}
        </div>
      )}

      {/* Match Color Legend */}
      {matches.length > 0 && !selectedMatchId && (
        <div className="card p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Users size={16} className="text-faded-ink" />
            Match Colors
          </h3>
          <div className="flex flex-wrap gap-3">
            {matches.slice(0, 15).map(match => {
              const segCount = filteredSegments.filter(s => s.match_id === match.id).length
              if (segCount === 0) return null
              return (
                <button
                  key={match.id}
                  onClick={() => setSelectedMatchId(match.id)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: match.color }}
                  />
                  <span className="text-sm">{match.match_name}</span>
                  <span className="text-xs text-faded-ink">({segCount})</span>
                </button>
              )
            })}
            {matches.length > 15 && (
              <span className="text-sm text-faded-ink self-center">
                +{matches.length - 15} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
