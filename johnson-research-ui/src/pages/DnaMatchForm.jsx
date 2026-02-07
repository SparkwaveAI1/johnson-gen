import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, X, Plus, AlertCircle, Search, Check, ChevronDown, ChevronRight, Trash2, GitBranch, UserCheck } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useWorkspace } from '../contexts/WorkspaceContext'
import PersonSelector from '../components/people/PersonSelector'

// Chromosome options (1-22 + X)
const chromosomeOptions = [
  ...Array.from({ length: 22 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })),
  { value: 'X', label: 'X' }
]

const testingCompanies = [
  { value: 'ancestry', label: 'AncestryDNA' },
  { value: '23andme', label: '23andMe' },
  { value: 'myheritage', label: 'MyHeritage' },
  { value: 'ftdna', label: 'FTDNA' },
  { value: 'gedmatch', label: 'GEDmatch' },
  { value: 'other', label: 'Other' }
]

const contactStatuses = [
  { value: 'not_contacted', label: 'Not Contacted' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'responded', label: 'Responded' },
  { value: 'no_response', label: 'No Response' },
  { value: 'collaborative', label: 'Collaborative' }
]

const commonRelationships = [
  'Parent/Child',
  'Full Sibling',
  'Half Sibling',
  'Grandparent/Grandchild',
  'Aunt/Uncle/Niece/Nephew',
  '1st Cousin',
  '1st Cousin Once Removed',
  '2nd Cousin',
  '2nd Cousin Once Removed',
  '3rd Cousin',
  '3rd Cousin Once Removed',
  '4th Cousin',
  '4th-6th Cousin',
  'Distant Cousin',
  'Unknown'
]

function DnaMatchFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { workspaceId } = useWorkspace()
  const isEdit = Boolean(id)

  // Form state
  const [formData, setFormData] = useState({
    match_name: '',
    testing_company: 'ancestry',
    shared_cm: '',
    shared_segments: '',
    largest_segment_cm: '',
    predicted_relationship: '',
    match_tree_url: '',
    match_tree_size: '',
    contact_status: 'not_contacted',
    confirmed_mrca_id: null,
    notes: ''
  })

  // Surnames state (managed separately for tag input)
  const [surnames, setSurnames] = useState([])
  const [surnameInput, setSurnameInput] = useState('')
  const [existingSurnameIds, setExistingSurnameIds] = useState([]) // Track IDs for updates

  // Segments state
  const [segments, setSegments] = useState([])
  const [originalSegmentIds, setOriginalSegmentIds] = useState([]) // Track original IDs for diff
  const [segmentsExpanded, setSegmentsExpanded] = useState(false)
  const [newSegment, setNewSegment] = useState({
    chromosome: '',
    start_position: '',
    end_position: '',
    cm: '',
    snps: ''
  })

  // Person search for MRCA
  const [mrcaSearch, setMrcaSearch] = useState('')
  const [mrcaResults, setMrcaResults] = useState([])
  const [selectedMrca, setSelectedMrca] = useState(null)
  const [showMrcaDropdown, setShowMrcaDropdown] = useState(false)

  // UI state
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // Load existing match data
  useEffect(() => {
    if (isEdit && workspaceId) {
      loadMatch()
    }
  }, [id, workspaceId, isEdit])

  const loadMatch = async () => {
    setLoading(true)
    try {
      // Fetch match
      const { data: matchData, error: matchError } = await supabase
        .from('dna_matches')
        .select('*')
        .eq('id', id)
        .eq('workspace_id', workspaceId)
        .single()

      if (matchError) throw matchError

      setFormData({
        match_name: matchData.match_name || '',
        testing_company: matchData.testing_company || 'ancestry',
        shared_cm: matchData.shared_cm || '',
        shared_segments: matchData.shared_segments || '',
        largest_segment_cm: matchData.largest_segment_cm || '',
        predicted_relationship: matchData.predicted_relationship || '',
        match_tree_url: matchData.match_tree_url || '',
        match_tree_size: matchData.match_tree_size || '',
        contact_status: matchData.contact_status || 'not_contacted',
        confirmed_mrca_id: matchData.confirmed_mrca_id || null,
        notes: matchData.notes || ''
      })

      // Load MRCA person if set
      if (matchData.confirmed_mrca_id) {
        const { data: personData } = await supabase
          .from('people')
          .select('id, given_name, surname, birth_year')
          .eq('id', matchData.confirmed_mrca_id)
          .single()

        if (personData) {
          setSelectedMrca(personData)
        }
      }

      // Fetch surnames
      const { data: surnameData, error: surnameError } = await supabase
        .from('dna_match_surnames')
        .select('id, surname')
        .eq('match_id', id)

      if (surnameError) throw surnameError

      setSurnames(surnameData?.map(s => s.surname) || [])
      setExistingSurnameIds(surnameData?.map(s => ({ id: s.id, surname: s.surname })) || [])

      // Fetch segments
      const { data: segmentData, error: segmentError } = await supabase
        .from('dna_segments')
        .select('id, chromosome, start_position, end_position, cm, snps')
        .eq('match_id', id)
        .order('chromosome', { ascending: true })
        .order('start_position', { ascending: true })

      if (segmentError) throw segmentError

      const loadedSegments = (segmentData || []).map(s => ({
        id: s.id,
        chromosome: s.chromosome || '',
        start_position: s.start_position ? String(s.start_position) : '',
        end_position: s.end_position ? String(s.end_position) : '',
        cm: s.cm ? String(s.cm) : '',
        snps: s.snps ? String(s.snps) : '',
        _original: true // Mark as existing in DB
      }))
      setSegments(loadedSegments)
      setOriginalSegmentIds(loadedSegments.map(s => s.id))
      
      // Auto-expand if there are segments
      if (loadedSegments.length > 0) {
        setSegmentsExpanded(true)
      }
    } catch (err) {
      console.error('Error loading match:', err)
      setError('Failed to load match data')
    } finally {
      setLoading(false)
    }
  }

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Surname tag management
  const handleAddSurname = () => {
    const trimmed = surnameInput.trim()
    if (trimmed && !surnames.includes(trimmed)) {
      setSurnames(prev => [...prev, trimmed])
      setSurnameInput('')
    }
  }

  const handleSurnameKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSurname()
    }
  }

  const handleRemoveSurname = (surnameToRemove) => {
    setSurnames(prev => prev.filter(s => s !== surnameToRemove))
  }

  // MRCA person search with debounce
  const searchPeople = useCallback(async (query) => {
    if (!query || query.length < 2 || !workspaceId) {
      setMrcaResults([])
      return
    }

    const { data } = await supabase
      .from('people')
      .select('id, given_name, surname, birth_year')
      .eq('workspace_id', workspaceId)
      .or(`surname.ilike.%${query}%,given_name.ilike.%${query}%`)
      .limit(10)

    setMrcaResults(data || [])
  }, [workspaceId])

  useEffect(() => {
    const timer = setTimeout(() => {
      searchPeople(mrcaSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [mrcaSearch, searchPeople])

  const handleSelectMrca = (person) => {
    setSelectedMrca(person)
    setFormData(prev => ({ ...prev, confirmed_mrca_id: person.id }))
    setMrcaSearch('')
    setShowMrcaDropdown(false)
    setMrcaResults([])
  }

  const handleClearMrca = () => {
    setSelectedMrca(null)
    setFormData(prev => ({ ...prev, confirmed_mrca_id: null }))
  }

  // Segment management
  const handleNewSegmentChange = (field, value) => {
    setNewSegment(prev => ({ ...prev, [field]: value }))
  }

  const validateSegment = (segment) => {
    if (!segment.chromosome) {
      return 'Chromosome is required'
    }
    const start = parseFloat(segment.start_position)
    const end = parseFloat(segment.end_position)
    if (segment.start_position && segment.end_position && start >= end) {
      return 'Start must be less than End'
    }
    const cm = parseFloat(segment.cm)
    if (segment.cm && cm <= 0) {
      return 'cM must be positive'
    }
    return null
  }

  const handleAddSegment = () => {
    const validationError = validateSegment(newSegment)
    if (validationError) {
      setError(validationError)
      return
    }

    setSegments(prev => [...prev, {
      ...newSegment,
      _tempId: Date.now(), // Temp ID for new segments
      _isNew: true
    }])
    setNewSegment({
      chromosome: '',
      start_position: '',
      end_position: '',
      cm: '',
      snps: ''
    })
    setError(null)
  }

  const handleUpdateSegment = (index, field, value) => {
    setSegments(prev => prev.map((seg, i) => 
      i === index 
        ? { ...seg, [field]: value, _modified: !seg._isNew } 
        : seg
    ))
  }

  const handleDeleteSegment = (index) => {
    setSegments(prev => prev.filter((_, i) => i !== index))
  }

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.match_name.trim()) {
      setError('Match name is required')
      return
    }

    setSaving(true)

    try {
      // Prepare match data
      const matchPayload = {
        match_name: formData.match_name.trim(),
        testing_company: formData.testing_company,
        shared_cm: formData.shared_cm ? parseFloat(formData.shared_cm) : null,
        shared_segments: formData.shared_segments ? parseInt(formData.shared_segments) : null,
        largest_segment_cm: formData.largest_segment_cm ? parseFloat(formData.largest_segment_cm) : null,
        predicted_relationship: formData.predicted_relationship || null,
        match_tree_url: formData.match_tree_url || null,
        match_tree_size: formData.match_tree_size ? parseInt(formData.match_tree_size) : null,
        contact_status: formData.contact_status,
        confirmed_mrca_id: formData.confirmed_mrca_id || null,
        notes: formData.notes || null,
        workspace_id: workspaceId
      }

      let matchId = id

      if (isEdit) {
        // Update existing match
        const { error: updateError } = await supabase
          .from('dna_matches')
          .update(matchPayload)
          .eq('id', id)

        if (updateError) throw updateError
      } else {
        // Insert new match
        const { data: newMatch, error: insertError } = await supabase
          .from('dna_matches')
          .insert(matchPayload)
          .select()
          .single()

        if (insertError) throw insertError
        matchId = newMatch.id
      }

      // Handle surnames - delete removed ones, insert new ones
      if (isEdit) {
        // Find surnames to delete (exist in DB but not in current list)
        const surnamesToDelete = existingSurnameIds
          .filter(existing => !surnames.includes(existing.surname))
          .map(s => s.id)

        if (surnamesToDelete.length > 0) {
          const { error: deleteError } = await supabase
            .from('dna_match_surnames')
            .delete()
            .in('id', surnamesToDelete)

          if (deleteError) throw deleteError
        }

        // Find surnames to add (in current list but not in DB)
        const existingSurnameList = existingSurnameIds.map(s => s.surname)
        const surnamesToAdd = surnames.filter(s => !existingSurnameList.includes(s))

        if (surnamesToAdd.length > 0) {
          const { error: insertSurnameError } = await supabase
            .from('dna_match_surnames')
            .insert(surnamesToAdd.map(surname => ({
              match_id: matchId,
              surname
            })))

          if (insertSurnameError) throw insertSurnameError
        }
      } else {
        // Insert all surnames for new match
        if (surnames.length > 0) {
          const { error: insertSurnameError } = await supabase
            .from('dna_match_surnames')
            .insert(surnames.map(surname => ({
              match_id: matchId,
              surname
            })))

          if (insertSurnameError) throw insertSurnameError
        }
      }

      // Handle segments
      // 1. Find segments to delete (original IDs not in current list)
      const currentSegmentIds = segments.filter(s => s.id).map(s => s.id)
      const segmentsToDelete = originalSegmentIds.filter(id => !currentSegmentIds.includes(id))

      if (segmentsToDelete.length > 0) {
        const { error: deleteSegmentError } = await supabase
          .from('dna_segments')
          .delete()
          .in('id', segmentsToDelete)

        if (deleteSegmentError) throw deleteSegmentError
      }

      // 2. Insert new segments
      const newSegments = segments.filter(s => s._isNew)
      if (newSegments.length > 0) {
        const { error: insertSegmentError } = await supabase
          .from('dna_segments')
          .insert(newSegments.map(seg => ({
            match_id: matchId,
            chromosome: seg.chromosome,
            start_position: seg.start_position ? parseInt(seg.start_position) : null,
            end_position: seg.end_position ? parseInt(seg.end_position) : null,
            cm: seg.cm ? parseFloat(seg.cm) : null,
            snps: seg.snps ? parseInt(seg.snps) : null
          })))

        if (insertSegmentError) throw insertSegmentError
      }

      // 3. Update modified segments
      const modifiedSegments = segments.filter(s => s._modified && s.id)
      for (const seg of modifiedSegments) {
        const { error: updateSegmentError } = await supabase
          .from('dna_segments')
          .update({
            chromosome: seg.chromosome,
            start_position: seg.start_position ? parseInt(seg.start_position) : null,
            end_position: seg.end_position ? parseInt(seg.end_position) : null,
            cm: seg.cm ? parseFloat(seg.cm) : null,
            snps: seg.snps ? parseInt(seg.snps) : null
          })
          .eq('id', seg.id)

        if (updateSegmentError) throw updateSegmentError
      }

      // Success - redirect to matches list
      navigate('/dna/matches')
    } catch (err) {
      console.error('Error saving match:', err)
      setError(err.message || 'Failed to save match')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-faded-ink">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <Link to="/dna/matches" className="text-faded-ink hover:text-ink flex items-center gap-1 mb-4">
        <ArrowLeft size={16} />
        Back to DNA Matches
      </Link>

      <div className="card">
        <h1 className="text-2xl font-display mb-6">
          {isEdit ? 'Edit DNA Match' : 'Add DNA Match'}
        </h1>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 text-red-800 rounded-lg">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium border-b border-sepia/20 pb-2">Basic Info</h2>

            <div>
              <label className="label">Match Name *</label>
              <input
                type="text"
                name="match_name"
                value={formData.match_name}
                onChange={handleChange}
                placeholder="e.g., John Smith"
                className="input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Testing Company</label>
                <select
                  name="testing_company"
                  value={formData.testing_company}
                  onChange={handleChange}
                  className="input"
                >
                  {testingCompanies.map(company => (
                    <option key={company.value} value={company.value}>
                      {company.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Shared cM</label>
                <input
                  type="number"
                  name="shared_cm"
                  value={formData.shared_cm}
                  onChange={handleChange}
                  placeholder="e.g., 125.5"
                  step="0.1"
                  min="0"
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Shared Segments</label>
                <input
                  type="number"
                  name="shared_segments"
                  value={formData.shared_segments}
                  onChange={handleChange}
                  placeholder="e.g., 8"
                  min="0"
                  className="input"
                />
              </div>

              <div>
                <label className="label">Largest Segment cM</label>
                <input
                  type="number"
                  name="largest_segment_cm"
                  value={formData.largest_segment_cm}
                  onChange={handleChange}
                  placeholder="e.g., 45.2"
                  step="0.1"
                  min="0"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="label">Predicted Relationship</label>
              <input
                type="text"
                name="predicted_relationship"
                value={formData.predicted_relationship}
                onChange={handleChange}
                placeholder="e.g., 2nd Cousin"
                list="relationship-suggestions"
                className="input"
              />
              <datalist id="relationship-suggestions">
                {commonRelationships.map(rel => (
                  <option key={rel} value={rel} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Section 2: Match Tree Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium border-b border-sepia/20 pb-2">Match Tree Info</h2>

            <div>
              <label className="label">Match Tree URL</label>
              <input
                type="url"
                name="match_tree_url"
                value={formData.match_tree_url}
                onChange={handleChange}
                placeholder="https://..."
                className="input"
              />
            </div>

            <div>
              <label className="label">Tree Size (approx. people count)</label>
              <input
                type="number"
                name="match_tree_size"
                value={formData.match_tree_size}
                onChange={handleChange}
                placeholder="e.g., 500"
                min="0"
                className="input"
              />
            </div>

            {/* Surname Tags */}
            <div>
              <label className="label">Match Tree Surnames</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {surnames.map(surname => (
                  <span
                    key={surname}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-sepia/10 text-sepia rounded-full text-sm"
                  >
                    {surname}
                    <button
                      type="button"
                      onClick={() => handleRemoveSurname(surname)}
                      className="hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={surnameInput}
                  onChange={(e) => setSurnameInput(e.target.value)}
                  onKeyDown={handleSurnameKeyDown}
                  placeholder="Add a surname..."
                  className="input flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddSurname}
                  className="btn-secondary flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
              <p className="text-xs text-faded-ink mt-1">
                Press Enter or click Add to add a surname
              </p>
            </div>
          </div>

          {/* Section 3: Connection Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium border-b border-sepia/20 pb-2">Connection Info</h2>

            {/* MRCA Person Selector */}
            <div>
              <label className="label">Confirmed MRCA (Most Recent Common Ancestor)</label>
              {selectedMrca ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Check size={18} className="text-green-600" />
                  <span className="flex-1">
                    {selectedMrca.given_name} {selectedMrca.surname}
                    {selectedMrca.birth_year && ` (b. ${selectedMrca.birth_year})`}
                  </span>
                  <button
                    type="button"
                    onClick={handleClearMrca}
                    className="text-faded-ink hover:text-red-600"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faded-ink" />
                    <input
                      type="text"
                      value={mrcaSearch}
                      onChange={(e) => {
                        setMrcaSearch(e.target.value)
                        setShowMrcaDropdown(true)
                      }}
                      onFocus={() => setShowMrcaDropdown(true)}
                      placeholder="Search for a person..."
                      className="input pl-10"
                    />
                  </div>
                  {showMrcaDropdown && mrcaResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-sepia/20 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {mrcaResults.map(person => (
                        <button
                          key={person.id}
                          type="button"
                          onClick={() => handleSelectMrca(person)}
                          className="w-full text-left px-4 py-2 hover:bg-parchment transition-colors"
                        >
                          <span className="font-medium">
                            {person.given_name} {person.surname}
                          </span>
                          {person.birth_year && (
                            <span className="text-faded-ink ml-2">
                              (b. {person.birth_year})
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-faded-ink mt-1">
                Search for a person in your tree to link as the confirmed common ancestor
              </p>
            </div>

            <div>
              <label className="label">Contact Status</label>
              <select
                name="contact_status"
                value={formData.contact_status}
                onChange={handleChange}
                className="input"
              >
                {contactStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Any additional notes about this match..."
                className="input"
              />
            </div>
          </div>

          {/* Section 4: DNA Segments */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setSegmentsExpanded(!segmentsExpanded)}
              className="flex items-center gap-2 w-full text-left text-lg font-medium border-b border-sepia/20 pb-2 hover:text-sepia transition-colors"
            >
              {segmentsExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              <span>Segments</span>
              {segments.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-sepia/10 text-sepia rounded-full">
                  {segments.length}
                </span>
              )}
            </button>

            {segmentsExpanded && (
              <div className="space-y-4">
                {/* Segments Table */}
                {segments.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-sepia/20">
                          <th className="text-left py-2 px-2 font-medium">Chr</th>
                          <th className="text-left py-2 px-2 font-medium">Start (Mbp)</th>
                          <th className="text-left py-2 px-2 font-medium">End (Mbp)</th>
                          <th className="text-left py-2 px-2 font-medium">cM</th>
                          <th className="text-left py-2 px-2 font-medium">SNPs</th>
                          <th className="text-left py-2 px-2 font-medium w-12"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {segments.map((segment, index) => (
                          <tr key={segment.id || segment._tempId} className="border-b border-sepia/10">
                            <td className="py-2 px-2">
                              <select
                                value={segment.chromosome}
                                onChange={(e) => handleUpdateSegment(index, 'chromosome', e.target.value)}
                                className="input py-1 px-2 w-16"
                              >
                                <option value="">-</option>
                                {chromosomeOptions.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                value={segment.start_position}
                                onChange={(e) => handleUpdateSegment(index, 'start_position', e.target.value)}
                                className="input py-1 px-2 w-24"
                                min="0"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                value={segment.end_position}
                                onChange={(e) => handleUpdateSegment(index, 'end_position', e.target.value)}
                                className="input py-1 px-2 w-24"
                                min="0"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                value={segment.cm}
                                onChange={(e) => handleUpdateSegment(index, 'cm', e.target.value)}
                                className="input py-1 px-2 w-20"
                                step="0.01"
                                min="0"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                value={segment.snps}
                                onChange={(e) => handleUpdateSegment(index, 'snps', e.target.value)}
                                className="input py-1 px-2 w-20"
                                min="0"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <button
                                type="button"
                                onClick={() => handleDeleteSegment(index)}
                                className="text-faded-ink hover:text-red-600 transition-colors p-1"
                                title="Delete segment"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Add New Segment Row */}
                <div className="bg-parchment/50 p-3 rounded-lg">
                  <p className="text-sm font-medium mb-3">Add New Segment</p>
                  <div className="grid grid-cols-6 gap-2 items-end">
                    <div>
                      <label className="text-xs text-faded-ink">Chromosome</label>
                      <select
                        value={newSegment.chromosome}
                        onChange={(e) => handleNewSegmentChange('chromosome', e.target.value)}
                        className="input py-1.5 text-sm"
                      >
                        <option value="">Select...</option>
                        {chromosomeOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-faded-ink">Start (Mbp)</label>
                      <input
                        type="number"
                        value={newSegment.start_position}
                        onChange={(e) => handleNewSegmentChange('start_position', e.target.value)}
                        placeholder="0"
                        className="input py-1.5 text-sm"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-faded-ink">End (Mbp)</label>
                      <input
                        type="number"
                        value={newSegment.end_position}
                        onChange={(e) => handleNewSegmentChange('end_position', e.target.value)}
                        placeholder="0"
                        className="input py-1.5 text-sm"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-faded-ink">cM</label>
                      <input
                        type="number"
                        value={newSegment.cm}
                        onChange={(e) => handleNewSegmentChange('cm', e.target.value)}
                        placeholder="0.00"
                        className="input py-1.5 text-sm"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-faded-ink">SNPs</label>
                      <input
                        type="number"
                        value={newSegment.snps}
                        onChange={(e) => handleNewSegmentChange('snps', e.target.value)}
                        placeholder="0"
                        className="input py-1.5 text-sm"
                        min="0"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleAddSegment}
                        className="btn-secondary py-1.5 w-full flex items-center justify-center gap-1"
                      >
                        <Plus size={14} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {segments.length === 0 && (
                  <p className="text-sm text-faded-ink text-center py-4">
                    No segments added yet. Use the form above to add shared DNA segments.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-sepia/20">
            <Link to="/dna/matches" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : isEdit ? 'Update Match' : 'Add Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DnaMatchFormPage
