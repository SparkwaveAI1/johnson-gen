import { useState, useEffect } from 'react'
import { X, Upload, FileText, Users, MapPin, Calendar, HelpCircle, Check, AlertCircle, Loader2, ChevronDown, ChevronRight, Link as LinkIcon, SquareCheck, Square, AlertTriangle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

/**
 * DocumentProcessor - AI-powered document extraction with smart duplicate handling
 *
 * Features:
 * - Detects existing records before import
 * - Shows which items already exist vs. new
 * - Allows selective import via checkboxes
 * - Prevents accidental bio overwrites
 * - Imports relationships and events
 * - Better name matching logic
 */

function DocumentProcessor({ personId = null, personName = null, onComplete, onCancel }) {
  const [text, setText] = useState('')
  const [processing, setProcessing] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState(null)
  const [extracted, setExtracted] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importResults, setImportResults] = useState(null)

  // Enriched data with existence status
  const [enrichedData, setEnrichedData] = useState(null)

  // Selection state for each category
  const [selections, setSelections] = useState({
    people: {},
    locations: {},
    relationships: {},
    events: {},
    researchQuestions: {},
    updateBio: false
  })

  // Expanded sections
  const [expanded, setExpanded] = useState({
    people: true,
    locations: true,
    relationships: true,
    events: true,
    researchQuestions: true,
    bio: true
  })

  // Current person's bio for comparison
  const [currentBio, setCurrentBio] = useState(null)

  // Fetch current person's bio if we have a personId
  useEffect(() => {
    if (personId) {
      supabase
        .from('people')
        .select('bio')
        .eq('id', personId)
        .single()
        .then(({ data }) => {
          setCurrentBio(data?.bio || null)
        })
    }
  }, [personId])

  const processDocument = async () => {
    if (!text.trim()) {
      setError('Please paste or enter document text')
      return
    }

    setProcessing(true)
    setError(null)
    setExtracted(null)
    setEnrichedData(null)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('process-document', {
        body: { text, personId, personName }
      })

      if (fnError) throw new Error(fnError.message || 'Failed to process document')
      if (data?.error) throw new Error(data.error)

      setExtracted(data.extracted)

      // Now check for existing records
      await checkExistingRecords(data.extracted)
    } catch (err) {
      console.error('Processing error:', err)
      setError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  // Check which extracted items already exist in the database
  const checkExistingRecords = async (data) => {
    setChecking(true)

    try {
      const enriched = {
        people: [],
        locations: [],
        relationships: [],
        events: data.events || [],
        researchQuestions: [],
        bio_summary: data.bio_summary
      }

      // Initial selections - select new items by default
      const newSelections = {
        people: {},
        locations: {},
        relationships: {},
        events: {},
        researchQuestions: {},
        updateBio: false
      }

      // Check people
      if (data.people?.length) {
        const { data: existingPeople } = await supabase
          .from('people')
          .select('id, given_name, surname, birth_year')

        const peopleMap = new Map()
        existingPeople?.forEach(p => {
          const key = `${p.given_name?.toLowerCase() || ''} ${p.surname?.toLowerCase() || ''}`.trim()
          peopleMap.set(key, p)
        })

        for (let i = 0; i < data.people.length; i++) {
          const person = data.people[i]
          const key = `${person.given_name?.toLowerCase() || ''} ${person.surname?.toLowerCase() || ''}`.trim()
          const existing = peopleMap.get(key)

          enriched.people.push({
            ...person,
            _index: i,
            _exists: !!existing,
            _existingId: existing?.id,
            _existingData: existing
          })

          // Select new items by default
          newSelections.people[i] = !existing
        }
      }

      // Check locations
      if (data.locations?.length) {
        const { data: existingLocations } = await supabase
          .from('locations')
          .select('id, name, slug')

        const locationMap = new Map()
        existingLocations?.forEach(l => {
          locationMap.set(l.name.toLowerCase(), l)
        })

        for (let i = 0; i < data.locations.length; i++) {
          const loc = data.locations[i]
          const existing = locationMap.get(loc.name?.toLowerCase())

          enriched.locations.push({
            ...loc,
            _index: i,
            _exists: !!existing,
            _existingId: existing?.id,
            _existingData: existing
          })

          newSelections.locations[i] = !existing
        }
      }

      // Check relationships
      if (data.relationships?.length) {
        const { data: existingPeople } = await supabase
          .from('people')
          .select('id, given_name, surname, birth_year')

        const { data: existingRels } = await supabase
          .from('family_relationships')
          .select('person_id, related_person_id, relationship_type')

        // Build lookup maps - include birth year for validation
        const peopleByName = new Map()
        const peopleById = new Map()
        existingPeople?.forEach(p => {
          const fullName = `${p.given_name} ${p.surname}`.toLowerCase()
          peopleByName.set(fullName, p)
          peopleById.set(p.id, p)
          // Also try surname only as fallback
          if (!peopleByName.has(p.surname.toLowerCase())) {
            peopleByName.set(p.surname.toLowerCase(), p)
          }
        })

        const relSet = new Set()
        existingRels?.forEach(r => {
          relSet.add(`${r.person_id}|${r.related_person_id}|${r.relationship_type}`)
        })

        for (let i = 0; i < data.relationships.length; i++) {
          const rel = data.relationships[i]

          // Try to find people (with their data including birth_year)
          const person1Data = peopleByName.get(rel.person1?.toLowerCase()) ||
                             peopleByName.get(rel.person1?.split(' ').pop()?.toLowerCase())
          const person2Data = peopleByName.get(rel.person2?.toLowerCase()) ||
                             peopleByName.get(rel.person2?.split(' ').pop()?.toLowerCase())

          const person1Id = person1Data?.id
          const person2Id = person2Data?.id

          const relKey = person1Id && person2Id
            ? `${person1Id}|${person2Id}|${rel.relationship_type}`
            : null
          const exists = relKey ? relSet.has(relKey) : false

          // Validate parent/child relationships based on birth years
          // relationship_type describes what person2 IS TO person1
          // So if type=father, person2 should be born BEFORE person1
          let validationWarning = null
          if (person1Data?.birth_year && person2Data?.birth_year) {
            const p1Birth = person1Data.birth_year
            const p2Birth = person2Data.birth_year

            if (rel.relationship_type === 'father' || rel.relationship_type === 'mother') {
              // person2 is person1's parent, so person2 should be born before person1
              if (p2Birth > p1Birth) {
                validationWarning = `Warning: ${rel.person2} (b.${p2Birth}) cannot be ${rel.person1}'s ${rel.relationship_type} - born after them (b.${p1Birth})`
              }
            } else if (rel.relationship_type === 'child') {
              // person2 is person1's child, so person2 should be born after person1
              if (p2Birth < p1Birth - 10) { // Allow some buffer
                validationWarning = `Warning: ${rel.person2} (b.${p2Birth}) cannot be ${rel.person1}'s child - born before them (b.${p1Birth})`
              }
            }
          }

          enriched.relationships.push({
            ...rel,
            _index: i,
            _exists: exists,
            _person1Id: person1Id,
            _person2Id: person2Id,
            _person1Birth: person1Data?.birth_year,
            _person2Birth: person2Data?.birth_year,
            _canImport: !!(person1Id && person2Id) && !validationWarning,
            _validationWarning: validationWarning
          })

          // Select new importable items by default (only if no validation warning)
          newSelections.relationships[i] = !exists && person1Id && person2Id && !validationWarning
        }
      }

      // Check events - events are usually unique, so we'll let user select
      if (data.events?.length) {
        for (let i = 0; i < data.events.length; i++) {
          enriched.events.push({
            ...data.events[i],
            _index: i,
            _exists: false // Events don't have a dedicated table currently
          })
          newSelections.events[i] = true
        }
      }

      // Check research questions for duplicates
      if (data.research_questions?.length && personId) {
        const { data: existingQuestions } = await supabase
          .from('research_questions')
          .select('question')
          .eq('person_id', personId)

        const existingSet = new Set(
          existingQuestions?.map(q => q.question?.substring(0, 50).toLowerCase()) || []
        )

        for (let i = 0; i < data.research_questions.length; i++) {
          const q = data.research_questions[i]
          const qText = typeof q === 'string' ? q : q.question
          const qStart = qText?.substring(0, 50).toLowerCase()
          const exists = existingSet.has(qStart)

          enriched.researchQuestions.push({
            question: qText,
            _index: i,
            _exists: exists
          })

          newSelections.researchQuestions[i] = !exists
        }
      }

      setEnrichedData(enriched)
      setSelections(newSelections)
    } catch (err) {
      console.error('Error checking existing records:', err)
      setError('Failed to check existing records: ' + err.message)
    } finally {
      setChecking(false)
    }
  }

  const toggleSelection = (category, index) => {
    setSelections(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [index]: !prev[category][index]
      }
    }))
  }

  const toggleAllInCategory = (category, items) => {
    const allSelected = items.every((_, i) => selections[category][i])
    const newSelections = {}
    items.forEach((item, i) => {
      // Only allow selecting items that can be imported
      if (category === 'relationships' && !item._canImport) {
        newSelections[i] = false
      } else {
        newSelections[i] = !allSelected
      }
    })
    setSelections(prev => ({
      ...prev,
      [category]: newSelections
    }))
  }

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const countSelected = (category) => {
    return Object.values(selections[category]).filter(Boolean).length
  }

  const importExtracted = async () => {
    if (!enrichedData) return

    setImporting(true)
    setError(null)
    const results = { people: 0, locations: 0, relationships: 0, events: 0, questions: 0, bioUpdated: false }

    try {
      // Import selected people
      for (let i = 0; i < enrichedData.people.length; i++) {
        if (!selections.people[i]) continue
        const person = enrichedData.people[i]
        if (person._exists) continue // Skip existing

        const birthYear = person.birth_year?.toString().replace(/^e/, '') || null
        const birthYearType = person.birth_year?.toString().startsWith('e') ? 'e' : 'b'

        const { error: insertError } = await supabase
          .from('people')
          .insert({
            given_name: person.given_name,
            surname: person.surname,
            birth_year: birthYear ? parseInt(birthYear) : null,
            birth_year_type: birthYearType,
            death_year: person.death_year ? parseInt(person.death_year) : null,
            confidence: 'PROBABLE',
            bio: person.bio_facts?.join(' ') || null
          })

        if (!insertError) results.people++
      }

      // Import selected locations
      for (let i = 0; i < enrichedData.locations.length; i++) {
        if (!selections.locations[i]) continue
        const loc = enrichedData.locations[i]
        if (loc._exists) continue

        const slug = loc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        const { error: insertError } = await supabase
          .from('locations')
          .insert({
            name: loc.name,
            slug,
            location_type: loc.location_type || 'region',
            modern_name: loc.modern_name || null,
            description: loc.context || null,
            verification_status: 'possible'
          })

        if (!insertError) results.locations++
      }

      // Import selected relationships (bidirectional!)
      for (let i = 0; i < enrichedData.relationships.length; i++) {
        if (!selections.relationships[i]) continue
        const rel = enrichedData.relationships[i]
        if (rel._exists || !rel._canImport) continue

        // Insert forward relationship
        const { error: fwdError } = await supabase
          .from('family_relationships')
          .insert({
            person_id: rel._person1Id,
            related_person_id: rel._person2Id,
            relationship_type: rel.relationship_type,
            relationship_status: rel.confidence || 'probable',
            evidence: rel.evidence || null
          })

        if (!fwdError) {
          results.relationships++

          // Insert inverse relationship
          const inverseType = getInverseRelationship(rel.relationship_type)
          if (inverseType) {
            await supabase
              .from('family_relationships')
              .insert({
                person_id: rel._person2Id,
                related_person_id: rel._person1Id,
                relationship_type: inverseType,
                relationship_status: rel.confidence || 'probable',
                evidence: rel.evidence ? `${rel.evidence} (inverse)` : null
              })
            results.relationships++
          }
        }
      }

      // Import selected research questions
      if (personId) {
        for (let i = 0; i < enrichedData.researchQuestions.length; i++) {
          if (!selections.researchQuestions[i]) continue
          const q = enrichedData.researchQuestions[i]
          if (q._exists) continue

          const { error: qError } = await supabase
            .from('research_questions')
            .insert({
              person_id: personId,
              question: q.question,
              question_type: 'gap',
              status: 'open'
            })

          if (!qError) results.questions++
        }
      }

      // Update bio if selected
      if (selections.updateBio && personId && enrichedData.bio_summary) {
        const { error: bioError } = await supabase
          .from('people')
          .update({ bio: enrichedData.bio_summary })
          .eq('id', personId)

        if (!bioError) results.bioUpdated = true
      }

      setImportResults(results)

      if (onComplete) {
        onComplete(results)
      }
    } catch (err) {
      console.error('Import error:', err)
      setError(err.message)
    } finally {
      setImporting(false)
    }
  }

  // Get inverse relationship type
  const getInverseRelationship = (type) => {
    const inverses = {
      'father': 'child',
      'mother': 'child',
      'child': 'parent',
      'parent': 'child',
      'spouse': 'spouse',
      'sibling': 'sibling'
    }
    return inverses[type] || null
  }

  // Render a selectable item row
  const renderSelectableItem = (item, category, index, content) => {
    const isSelected = selections[category][index]
    const canSelect = category !== 'relationships' || item._canImport

    return (
      <div
        key={index}
        className={`flex items-start gap-2 p-2 rounded ${
          item._exists ? 'bg-amber-50' : isSelected ? 'bg-green-50' : 'bg-gray-50'
        }`}
      >
        <button
          onClick={() => canSelect && toggleSelection(category, index)}
          disabled={!canSelect}
          className={`mt-0.5 flex-shrink-0 ${!canSelect ? 'opacity-30' : ''}`}
        >
          {isSelected ? (
            <SquareCheck size={18} className="text-green-600" />
          ) : (
            <Square size={18} className="text-gray-400" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          {content}
          {item._exists && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-700 mt-1">
              <AlertTriangle size={12} />
              Already exists in database
            </span>
          )}
          {category === 'relationships' && !item._canImport && !item._validationWarning && (
            <span className="inline-flex items-center gap-1 text-xs text-red-600 mt-1">
              <AlertCircle size={12} />
              Cannot import - people not found in database
            </span>
          )}
          {category === 'relationships' && item._validationWarning && (
            <span className="inline-flex items-center gap-1 text-xs text-red-600 mt-1">
              <AlertCircle size={12} />
              {item._validationWarning}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sepia/20">
          <div className="flex items-center gap-2">
            <FileText className="text-accent" size={20} />
            <h2 className="text-lg font-display">Process Document</h2>
            {personName && (
              <span className="text-sm text-faded-ink">for {personName}</span>
            )}
          </div>
          {onCancel && (
            <button onClick={onCancel} className="text-faded-ink hover:text-ink">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {!enrichedData ? (
            /* Input Phase */
            <div className="space-y-4">
              <div>
                <label className="label">Paste Document Text</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste the document text, research summary, or biographical information here..."
                  className="input font-mono text-sm"
                  rows={15}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-3">
                {onCancel && (
                  <button onClick={onCancel} className="btn-secondary">
                    Cancel
                  </button>
                )}
                <button
                  onClick={processDocument}
                  disabled={processing || checking || !text.trim()}
                  className="btn-primary flex items-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : checking ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Checking duplicates...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Process Document
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : importResults ? (
            /* Results Phase */
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-green-50 text-green-800 rounded-lg">
                <Check size={20} />
                <span className="font-medium">Import Complete!</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="p-4 bg-parchment rounded-lg text-center">
                  <div className="text-2xl font-bold">{importResults.people}</div>
                  <div className="text-sm text-faded-ink">People Added</div>
                </div>
                <div className="p-4 bg-parchment rounded-lg text-center">
                  <div className="text-2xl font-bold">{importResults.locations}</div>
                  <div className="text-sm text-faded-ink">Locations Added</div>
                </div>
                <div className="p-4 bg-parchment rounded-lg text-center">
                  <div className="text-2xl font-bold">{importResults.relationships}</div>
                  <div className="text-sm text-faded-ink">Relationships</div>
                </div>
                <div className="p-4 bg-parchment rounded-lg text-center">
                  <div className="text-2xl font-bold">{importResults.questions}</div>
                  <div className="text-sm text-faded-ink">Questions Added</div>
                </div>
                <div className="p-4 bg-parchment rounded-lg text-center">
                  <div className="text-2xl font-bold">{importResults.bioUpdated ? '✓' : '—'}</div>
                  <div className="text-sm text-faded-ink">Bio Updated</div>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={onCancel} className="btn-primary">
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Review Phase - with checkboxes */
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-800 rounded-lg">
                <Check size={18} />
                <span>Document processed! Select items to import below.</span>
              </div>

              <div className="text-sm text-faded-ink flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-green-100 rounded" /> New item (selected)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-amber-100 rounded" /> Already exists
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-gray-100 rounded" /> Not selected
                </span>
              </div>

              {/* People Section */}
              {enrichedData.people?.length > 0 && (
                <div className="border border-sepia/20 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('people')}
                    className="w-full flex items-center justify-between p-3 bg-parchment/50 hover:bg-parchment"
                  >
                    <div className="flex items-center gap-2">
                      {expanded.people ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <Users size={16} />
                      <span className="font-medium">People ({enrichedData.people.length})</span>
                      <span className="text-sm text-faded-ink">
                        {countSelected('people')} selected
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleAllInCategory('people', enrichedData.people) }}
                      className="text-xs text-accent hover:underline"
                    >
                      Toggle all
                    </button>
                  </button>
                  {expanded.people && (
                    <div className="p-3 space-y-2 max-h-60 overflow-auto">
                      {enrichedData.people.map((person, i) => renderSelectableItem(
                        person, 'people', i,
                        <div>
                          <span className="font-medium">{person.given_name} {person.surname}</span>
                          {person.birth_year && <span className="text-faded-ink ml-2">(b. {person.birth_year})</span>}
                          {person.role && <span className="text-xs px-1.5 py-0.5 bg-sepia/10 rounded ml-2">{person.role}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Locations Section */}
              {enrichedData.locations?.length > 0 && (
                <div className="border border-sepia/20 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('locations')}
                    className="w-full flex items-center justify-between p-3 bg-parchment/50 hover:bg-parchment"
                  >
                    <div className="flex items-center gap-2">
                      {expanded.locations ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <MapPin size={16} />
                      <span className="font-medium">Locations ({enrichedData.locations.length})</span>
                      <span className="text-sm text-faded-ink">
                        {countSelected('locations')} selected
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleAllInCategory('locations', enrichedData.locations) }}
                      className="text-xs text-accent hover:underline"
                    >
                      Toggle all
                    </button>
                  </button>
                  {expanded.locations && (
                    <div className="p-3 space-y-2 max-h-60 overflow-auto">
                      {enrichedData.locations.map((loc, i) => renderSelectableItem(
                        loc, 'locations', i,
                        <div>
                          <span className="font-medium">{loc.name}</span>
                          {loc.location_type && <span className="text-xs px-1.5 py-0.5 bg-sepia/10 rounded ml-2">{loc.location_type}</span>}
                          {loc.state && <span className="text-faded-ink ml-2">{loc.state}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Relationships Section */}
              {enrichedData.relationships?.length > 0 && (
                <div className="border border-sepia/20 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('relationships')}
                    className="w-full flex items-center justify-between p-3 bg-parchment/50 hover:bg-parchment"
                  >
                    <div className="flex items-center gap-2">
                      {expanded.relationships ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <LinkIcon size={16} />
                      <span className="font-medium">Relationships ({enrichedData.relationships.length})</span>
                      <span className="text-sm text-faded-ink">
                        {countSelected('relationships')} selected
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleAllInCategory('relationships', enrichedData.relationships) }}
                      className="text-xs text-accent hover:underline"
                    >
                      Toggle all
                    </button>
                  </button>
                  {expanded.relationships && (
                    <div className="p-3 space-y-2 max-h-60 overflow-auto">
                      {enrichedData.relationships.map((rel, i) => renderSelectableItem(
                        rel, 'relationships', i,
                        <div>
                          <span className="font-medium">{rel.person2}</span>
                          {rel._person2Birth && <span className="text-faded-ink text-sm"> (b.{rel._person2Birth})</span>}
                          <span className="text-faded-ink mx-2">is {rel.relationship_type} of</span>
                          <span className="font-medium">{rel.person1}</span>
                          {rel._person1Birth && <span className="text-faded-ink text-sm"> (b.{rel._person1Birth})</span>}
                          {rel.confidence && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ml-2 ${
                              rel.confidence === 'confirmed' ? 'bg-green-100 text-green-800' :
                              rel.confidence === 'probable' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {rel.confidence}
                            </span>
                          )}
                          {rel._canImport && !rel._validationWarning && (
                            <span className="text-xs text-green-600 ml-2">✓ Valid</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Research Questions Section */}
              {enrichedData.researchQuestions?.length > 0 && personId && (
                <div className="border border-sepia/20 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('researchQuestions')}
                    className="w-full flex items-center justify-between p-3 bg-parchment/50 hover:bg-parchment"
                  >
                    <div className="flex items-center gap-2">
                      {expanded.researchQuestions ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <HelpCircle size={16} />
                      <span className="font-medium">Research Questions ({enrichedData.researchQuestions.length})</span>
                      <span className="text-sm text-faded-ink">
                        {countSelected('researchQuestions')} selected
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleAllInCategory('researchQuestions', enrichedData.researchQuestions) }}
                      className="text-xs text-accent hover:underline"
                    >
                      Toggle all
                    </button>
                  </button>
                  {expanded.researchQuestions && (
                    <div className="p-3 space-y-2 max-h-60 overflow-auto">
                      {enrichedData.researchQuestions.map((q, i) => renderSelectableItem(
                        q, 'researchQuestions', i,
                        <div className="text-sm">{q.question}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Bio Section - special handling */}
              {enrichedData.bio_summary && personId && (
                <div className="border border-sepia/20 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('bio')}
                    className="w-full flex items-center justify-between p-3 bg-parchment/50 hover:bg-parchment"
                  >
                    <div className="flex items-center gap-2">
                      {expanded.bio ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <FileText size={16} />
                      <span className="font-medium">Biography Update</span>
                      {currentBio && (
                        <span className="text-xs text-amber-600 flex items-center gap-1">
                          <AlertTriangle size={12} />
                          Will replace existing bio
                        </span>
                      )}
                    </div>
                  </button>
                  {expanded.bio && (
                    <div className="p-3 space-y-3">
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => setSelections(prev => ({ ...prev, updateBio: !prev.updateBio }))}
                          className="mt-0.5 flex-shrink-0"
                        >
                          {selections.updateBio ? (
                            <SquareCheck size={18} className="text-green-600" />
                          ) : (
                            <Square size={18} className="text-gray-400" />
                          )}
                        </button>
                        <div className="flex-1">
                          <span className="font-medium">
                            {currentBio ? 'Replace existing bio with new version' : 'Add biography'}
                          </span>
                        </div>
                      </div>

                      {currentBio && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-amber-700 mb-1">Current Bio:</div>
                            <div className="p-2 bg-amber-50 rounded max-h-32 overflow-auto text-xs">
                              {currentBio}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-green-700 mb-1">New Bio:</div>
                            <div className="p-2 bg-green-50 rounded max-h-32 overflow-auto text-xs">
                              {enrichedData.bio_summary}
                            </div>
                          </div>
                        </div>
                      )}

                      {!currentBio && (
                        <div className="p-2 bg-parchment/50 rounded text-sm max-h-32 overflow-auto">
                          {enrichedData.bio_summary}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Events Section - informational only for now */}
              {enrichedData.events?.length > 0 && (
                <div className="border border-sepia/20 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('events')}
                    className="w-full flex items-center justify-between p-3 bg-parchment/50 hover:bg-parchment"
                  >
                    <div className="flex items-center gap-2">
                      {expanded.events ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <Calendar size={16} />
                      <span className="font-medium">Events & Dates ({enrichedData.events.length})</span>
                      <span className="text-xs text-faded-ink">(informational - review only)</span>
                    </div>
                  </button>
                  {expanded.events && (
                    <div className="p-3 space-y-2 max-h-60 overflow-auto">
                      {enrichedData.events.map((event, i) => (
                        <div key={i} className="p-2 bg-gray-50 rounded text-sm">
                          <span className="font-medium">{event.date}:</span> {event.description}
                          {event.event_type && (
                            <span className="text-xs px-1.5 py-0.5 bg-sepia/10 rounded ml-2">{event.event_type}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-sepia/20">
                <div className="text-sm text-faded-ink">
                  {countSelected('people') + countSelected('locations') + countSelected('relationships') + countSelected('researchQuestions')} items selected
                  {selections.updateBio && ' + bio update'}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setEnrichedData(null); setExtracted(null) }}
                    className="btn-secondary"
                  >
                    Back to Edit
                  </button>
                  <button
                    onClick={importExtracted}
                    disabled={importing}
                    className="btn-primary flex items-center gap-2"
                  >
                    {importing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Import Selected
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentProcessor
