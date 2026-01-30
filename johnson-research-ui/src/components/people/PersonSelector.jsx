import { useState, useEffect, useRef } from 'react'
import { Search, Plus, X, User, Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import ConfidenceIndicator from '../common/ConfidenceIndicator'
import PersonForm from './PersonForm'

/**
 * PersonSelector - Search and select existing person(s), or create new
 *
 * Props:
 * - value: currently selected person object, ID, or array of people (for multiple)
 * - onChange: callback with selected person or array of people (called on each selection)
 * - onAddMultiple: callback when "Add N people" is clicked in multi-select mode (use this for batch add)
 * - placeholder: input placeholder text
 * - allowCreate: whether to allow creating new people (default: true)
 * - excludeIds: array of person IDs to exclude from results
 * - multiple: allow selecting multiple people (default: false)
 */

function PersonSelector({
  value,
  onChange,
  onAddMultiple, // Called when "Done" is clicked in multi-select mode
  placeholder = 'Search people...',
  allowCreate = true,
  excludeIds = [],
  multiple = false
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  // For single select
  const [selectedPerson, setSelectedPerson] = useState(null)

  // For multi-select
  const [selectedPeople, setSelectedPeople] = useState([])

  const containerRef = useRef(null)
  const inputRef = useRef(null)

  // Load selected person(s) if value is provided
  useEffect(() => {
    async function loadPerson() {
      if (multiple) {
        // Handle array of people for multi-select
        if (Array.isArray(value)) {
          setSelectedPeople(value)
        } else {
          setSelectedPeople([])
        }
      } else {
        // Handle single person
        if (value && typeof value === 'string') {
          const { data } = await supabase
            .from('people')
            .select('*')
            .eq('id', value)
            .single()
          setSelectedPerson(data)
        } else if (value && typeof value === 'object') {
          setSelectedPerson(value)
        } else {
          setSelectedPerson(null)
        }
      }
    }
    loadPerson()
  }, [value, multiple])

  // Stable reference for excludeIds
  const excludeIdsRef = useRef(excludeIds)
  excludeIdsRef.current = excludeIds

  // Search people when query changes
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)

    const debounce = setTimeout(async () => {
      try {
        const { data } = await supabase
          .from('people')
          .select('id, given_name, surname, birth_year, death_year, confidence, designation')
          .or(`given_name.ilike.%${query}%,surname.ilike.%${query}%,id.ilike.%${query}%`)
          .limit(15)

        // Filter out excluded IDs and already selected people in multi-select mode
        const selectedIds = multiple ? selectedPeople.map(p => p.id) : []
        const filtered = (data || []).filter(p =>
          !excludeIdsRef.current.includes(p.id) && !selectedIds.includes(p.id)
        )
        setResults(filtered)
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [query, multiple, selectedPeople])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (showAddForm) return
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showAddForm])

  // Single select handler
  const handleSelect = (person) => {
    if (multiple) {
      // Add to selection
      const newSelection = [...selectedPeople, person]
      setSelectedPeople(newSelection)
      setQuery('')
      // Keep dropdown open for more selections
      inputRef.current?.focus()
      if (onChange) {
        onChange(newSelection)
      }
    } else {
      setSelectedPerson(person)
      setQuery('')
      setIsOpen(false)
      if (onChange) {
        onChange(person)
      }
    }
  }

  // Remove from multi-select
  const handleRemovePerson = (personId) => {
    const newSelection = selectedPeople.filter(p => p.id !== personId)
    setSelectedPeople(newSelection)
    if (onChange) {
      onChange(newSelection)
    }
  }

  const handleClear = () => {
    if (multiple) {
      setSelectedPeople([])
      if (onChange) {
        onChange([])
      }
    } else {
      setSelectedPerson(null)
      if (onChange) {
        onChange(null)
      }
    }
    setQuery('')
    inputRef.current?.focus()
  }

  const handleAddPerson = (newPerson) => {
    setShowAddForm(false)
    handleSelect(newPerson)
  }

  const formatName = (person) => {
    const parts = []
    if (person.given_name) parts.push(person.given_name)
    parts.push(person.surname)
    return parts.join(' ')
  }

  const formatDates = (person) => {
    const parts = []
    if (person.birth_year) parts.push(`b. ${person.birth_year}`)
    if (person.death_year) parts.push(`d. ${person.death_year}`)
    return parts.join(' – ')
  }

  // Single select: show selected person
  if (!multiple && selectedPerson) {
    return (
      <div className="flex items-center gap-2 p-2 bg-aged-paper rounded-lg border border-sepia/20">
        <ConfidenceIndicator level={selectedPerson.confidence?.toLowerCase()} size="sm" />
        <div className="flex-1">
          <span className="font-medium">{formatName(selectedPerson)}</span>
          {selectedPerson.birth_year && (
            <span className="text-faded-ink text-sm ml-2">
              ({formatDates(selectedPerson)})
            </span>
          )}
          <span className="person-id ml-2">{selectedPerson.id}</span>
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
      {/* Multi-select: show selected people as chips */}
      {multiple && selectedPeople.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedPeople.map(person => (
            <div
              key={person.id}
              className="flex items-center gap-1 px-2 py-1 bg-sepia/10 rounded-full text-sm"
            >
              <span>{formatName(person)}</span>
              {person.birth_year && (
                <span className="text-faded-ink">({person.birth_year})</span>
              )}
              <button
                onClick={() => handleRemovePerson(person.id)}
                className="text-faded-ink hover:text-red-600 ml-1"
                title="Remove"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={handleClear}
            className="text-xs text-faded-ink hover:text-red-600 underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-faded-ink" size={16} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={multiple && selectedPeople.length > 0 ? 'Add more people...' : placeholder}
          className="input pl-9 pr-4"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-sepia/20 max-h-80 overflow-auto">
          {/* Results */}
          {results.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs text-faded-ink uppercase border-b border-sepia/10 flex justify-between items-center">
                <span>Search Results</span>
                {multiple && <span className="normal-case">Click to add</span>}
              </div>
              {results.map(person => (
                <button
                  key={person.id}
                  onClick={() => handleSelect(person)}
                  className="w-full text-left px-3 py-2 hover:bg-parchment transition-colors border-b border-sepia/10 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {multiple && (
                      <div className="w-5 h-5 rounded border border-sepia/30 flex items-center justify-center">
                        <Plus size={14} className="text-sepia" />
                      </div>
                    )}
                    <ConfidenceIndicator level={person.confidence?.toLowerCase()} size="sm" />
                    <span className="font-medium">{formatName(person)}</span>
                    {person.designation && (
                      <span className="text-faded-ink text-sm">"{person.designation}"</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 ml-7">
                    <span className="person-id">{person.id}</span>
                    {person.birth_year && (
                      <span className="text-xs text-faded-ink">
                        {formatDates(person)}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Loading indicator */}
          {loading && query.length >= 2 && (
            <div className="px-3 py-2 text-xs text-faded-ink border-b border-sepia/10">
              Searching...
            </div>
          )}

          {/* No results */}
          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="p-3 text-center text-faded-ink">
              No people found matching "{query}"
            </div>
          )}

          {/* Instructions */}
          {!loading && query.length < 2 && results.length === 0 && (
            <div className="p-3 text-center text-faded-ink text-sm">
              Type at least 2 characters to search
            </div>
          )}

          {/* Add new person option */}
          {allowCreate && (
            <button
              onClick={() => { setShowAddForm(true); setIsOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-3 text-sepia hover:bg-parchment transition-colors border-t border-sepia/20"
            >
              <Plus size={16} />
              <span>Add new person</span>
            </button>
          )}

          {/* Done button for multi-select */}
          {multiple && selectedPeople.length > 0 && (
            <button
              onClick={() => {
                setIsOpen(false)
                if (onAddMultiple) {
                  onAddMultiple(selectedPeople)
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-3 bg-sepia text-cream hover:bg-sepia/90 transition-colors"
            >
              <Check size={16} />
              <span>Add {selectedPeople.length} {selectedPeople.length === 1 ? 'person' : 'people'}</span>
            </button>
          )}
        </div>
      )}

      {/* Add Person Modal */}
      {showAddForm && (
        <PersonForm
          isModal
          onSave={handleAddPerson}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  )
}

export default PersonSelector
