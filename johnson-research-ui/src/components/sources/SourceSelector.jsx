import { useState, useEffect, useRef } from 'react'
import { Search, Plus, X, BookOpen } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import SourceCitation from './SourceCitation'
import SourceForm from './SourceForm'

/**
 * SourceSelector - Search and select existing source, or create new
 *
 * Props:
 * - value: currently selected source object or ID
 * - onChange: callback with selected source
 * - placeholder: input placeholder text
 * - allowCreate: whether to allow creating new sources (default: true)
 */

function SourceSelector({ value, onChange, placeholder = 'Search sources...', allowCreate = true }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [recentSources, setRecentSources] = useState([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedSource, setSelectedSource] = useState(null)

  const containerRef = useRef(null)
  const inputRef = useRef(null)

  // Load selected source if value is an ID
  useEffect(() => {
    async function loadSource() {
      if (value && typeof value === 'string') {
        const { data } = await supabase
          .from('sources')
          .select('*')
          .eq('id', value)
          .single()
        setSelectedSource(data)
      } else if (value && typeof value === 'object') {
        setSelectedSource(value)
      } else {
        setSelectedSource(null)
      }
    }
    loadSource()
  }, [value])

  // Load recent sources on mount
  useEffect(() => {
    async function loadRecent() {
      const { data } = await supabase
        .from('sources')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(5)
      setRecentSources(data || [])
    }
    loadRecent()
  }, [])

  // Search sources when query changes
  useEffect(() => {
    async function searchSources() {
      if (query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      const { data } = await supabase
        .from('sources')
        .select('*')
        .or(`abbreviation.ilike.%${query}%,title.ilike.%${query}%,author.ilike.%${query}%`)
        .limit(10)

      setResults(data || [])
      setLoading(false)
    }

    const debounce = setTimeout(searchSources, 300)
    return () => clearTimeout(debounce)
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (source) => {
    setSelectedSource(source)
    setQuery('')
    setIsOpen(false)
    if (onChange) {
      onChange(source)
    }
  }

  const handleClear = () => {
    setSelectedSource(null)
    setQuery('')
    if (onChange) {
      onChange(null)
    }
    inputRef.current?.focus()
  }

  const handleAddSource = (newSource) => {
    setShowAddForm(false)
    handleSelect(newSource)
    // Add to recent sources
    setRecentSources(prev => [newSource, ...prev.slice(0, 4)])
  }

  const displaySources = query.length >= 2 ? results : recentSources

  // If a source is selected, show it
  if (selectedSource) {
    return (
      <div className="flex items-center gap-2 p-2 bg-aged-paper rounded-lg border border-sepia/20">
        <BookOpen size={16} className="text-sepia" />
        <div className="flex-1">
          <SourceCitation source={selectedSource} format="short" showLink={false} />
        </div>
        <button
          onClick={handleClear}
          className="text-faded-ink hover:text-ink p-1"
          title="Clear selection"
        >
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-faded-ink" size={16} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="input pl-9 pr-4"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-sepia/20 max-h-80 overflow-auto">
          {/* Loading state */}
          {loading && (
            <div className="p-3 text-center text-faded-ink">
              Searching...
            </div>
          )}

          {/* Results */}
          {!loading && displaySources.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs text-faded-ink uppercase border-b border-sepia/10">
                {query.length >= 2 ? 'Search Results' : 'Recent Sources'}
              </div>
              {displaySources.map(source => (
                <button
                  key={source.id}
                  onClick={() => handleSelect(source)}
                  className="w-full text-left px-3 py-2 hover:bg-parchment transition-colors border-b border-sepia/10 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {source.abbreviation && (
                      <span className="font-mono text-sm text-sepia">
                        {source.abbreviation}
                      </span>
                    )}
                    <span className="text-xs px-1.5 py-0.5 rounded bg-sepia/10 text-faded-ink">
                      {source.source_type}
                    </span>
                  </div>
                  <p className="text-sm mt-1 truncate">{source.title}</p>
                  {source.author && (
                    <p className="text-xs text-faded-ink truncate">{source.author}</p>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="p-3 text-center text-faded-ink">
              No sources found matching "{query}"
            </div>
          )}

          {/* Add new source option */}
          {allowCreate && (
            <button
              onClick={() => { setShowAddForm(true); setIsOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-3 text-sepia hover:bg-parchment transition-colors border-t border-sepia/20"
            >
              <Plus size={16} />
              <span>Add new source</span>
            </button>
          )}
        </div>
      )}

      {/* Add Source Modal */}
      {showAddForm && (
        <SourceForm
          isModal
          onSave={handleAddSource}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  )
}

export default SourceSelector
