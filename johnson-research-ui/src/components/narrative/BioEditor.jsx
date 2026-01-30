import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Save, Check, Clock, ChevronRight, ChevronDown,
  Users, Calendar, AlertTriangle, BookOpen
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

const BIO_STATUS_OPTIONS = [
  { value: 'no_bio', label: 'No Bio', color: 'bg-gray-100 text-gray-600' },
  { value: 'notes_only', label: 'Notes Only', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'draft', label: 'Draft', color: 'bg-blue-100 text-blue-800' },
  { value: 'review', label: 'Review', color: 'bg-purple-100 text-purple-800' },
  { value: 'final', label: 'Final', color: 'bg-green-100 text-green-800' }
]

function BioEditor({ person, documents, relationships, onSave }) {
  const [bioText, setBioText] = useState(person.bio || '')
  const [bioStatus, setBioStatus] = useState(person.bio_status || 'no_bio')
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Sidebar panels
  const [showDocuments, setShowDocuments] = useState(true)
  const [showRelationships, setShowRelationships] = useState(true)
  const [showTimeline, setShowTimeline] = useState(false)

  useEffect(() => {
    setBioText(person.bio || '')
    setBioStatus(person.bio_status || 'no_bio')
    setHasChanges(false)
  }, [person.id])

  const handleTextChange = (e) => {
    setBioText(e.target.value)
    setHasChanges(true)
  }

  const handleStatusChange = async (newStatus) => {
    setBioStatus(newStatus)

    const { error } = await supabase
      .from('people')
      .update({ bio_status: newStatus })
      .eq('id', person.id)

    if (error) {
      console.error('Error updating bio status:', error)
    }
  }

  const saveBio = useCallback(async () => {
    if (!hasChanges) return

    setSaving(true)
    const { error } = await supabase
      .from('people')
      .update({
        bio: bioText,
        bio_status: bioStatus === 'no_bio' && bioText ? 'notes_only' : bioStatus
      })
      .eq('id', person.id)

    if (error) {
      console.error('Error saving bio:', error)
    } else {
      setLastSaved(new Date())
      setHasChanges(false)
      if (onSave) {
        onSave({ ...person, bio: bioText, bio_status: bioStatus })
      }
    }
    setSaving(false)
  }, [bioText, bioStatus, person.id, hasChanges, onSave])

  // Auto-save after 3 seconds of inactivity
  useEffect(() => {
    if (!hasChanges) return

    const timer = setTimeout(() => {
      saveBio()
    }, 3000)

    return () => clearTimeout(timer)
  }, [bioText, hasChanges, saveBio])

  // Build timeline from documents and vital dates
  const buildTimeline = () => {
    const events = []

    // Add birth
    if (person.birth_year) {
      events.push({
        date: person.birth_year,
        type: 'vital',
        label: 'Born',
        detail: person.birthplace_detail || person.birthplace_code
      })
    }

    // Add documents
    documents.forEach(docLink => {
      if (docLink.document?.date) {
        events.push({
          date: docLink.document.date,
          type: 'document',
          label: docLink.document.title,
          detail: docLink.role,
          id: docLink.document.id
        })
      }
    })

    // Add death
    if (person.death_year) {
      events.push({
        date: person.death_year,
        type: 'vital',
        label: 'Died',
        detail: person.death_place_code
      })
    }

    // Sort by date
    return events.sort((a, b) => {
      const dateA = parseInt(a.date) || 0
      const dateB = parseInt(b.date) || 0
      return dateA - dateB
    })
  }

  const timeline = buildTimeline()
  const currentStatusOption = BIO_STATUS_OPTIONS.find(s => s.value === bioStatus)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main editor area */}
      <div className="lg:col-span-2 space-y-4">
        {/* Status and save bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-faded-ink">Status:</span>
            <select
              value={bioStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`text-sm px-2 py-1 rounded border-0 font-medium ${currentStatusOption?.color}`}
            >
              {BIO_STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            {lastSaved && (
              <span className="text-xs text-faded-ink flex items-center gap-1">
                <Check size={12} className="text-green-600" />
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            {hasChanges && (
              <span className="text-xs text-amber-600 flex items-center gap-1">
                <Clock size={12} />
                Unsaved changes
              </span>
            )}
            <button
              onClick={saveBio}
              disabled={!hasChanges || saving}
              className="btn-primary text-sm flex items-center gap-1 disabled:opacity-50"
            >
              <Save size={14} />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="card">
          <h2 className="text-lg font-display flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-accent" />
            Biography
          </h2>
          <textarea
            value={bioText}
            onChange={handleTextChange}
            placeholder="Write the biography for this person...

Consider including:
- Key life events and dates
- Family connections
- Land ownership and occupations
- Document citations
- Research notes and questions"
            className="w-full h-96 p-4 border border-sepia/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 font-serif text-base leading-relaxed resize-y"
          />
          <div className="flex justify-between mt-2 text-xs text-faded-ink">
            <span>{bioText.length} characters</span>
            <span>~{Math.ceil(bioText.split(/\s+/).filter(Boolean).length)} words</span>
          </div>
        </div>
      </div>

      {/* Reference sidebar */}
      <div className="space-y-4">
        {/* Documents Panel */}
        <div className="card">
          <button
            onClick={() => setShowDocuments(!showDocuments)}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="font-display flex items-center gap-2">
              <FileText size={16} className="text-accent" />
              Documents
              <span className="text-sm font-normal text-faded-ink">({documents.length})</span>
            </h3>
            {showDocuments ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {showDocuments && (
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
              {documents.length === 0 ? (
                <p className="text-sm text-faded-ink">No documents linked</p>
              ) : (
                documents.map(docLink => (
                  <div
                    key={docLink.id}
                    className="text-sm p-2 bg-sepia/5 rounded hover:bg-sepia/10 cursor-pointer"
                    onClick={() => {
                      // Insert citation at cursor
                      const citation = `[${docLink.document?.title || 'Document'}, ${docLink.document?.date || 'n.d.'}]`
                      setBioText(prev => prev + ' ' + citation)
                      setHasChanges(true)
                    }}
                    title="Click to insert citation"
                  >
                    <div className="font-medium">{docLink.document?.title || 'Untitled'}</div>
                    <div className="text-xs text-faded-ink flex items-center gap-2">
                      <span>{docLink.document?.date}</span>
                      <span className="uppercase">{docLink.role}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Relationships Panel */}
        <div className="card">
          <button
            onClick={() => setShowRelationships(!showRelationships)}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="font-display flex items-center gap-2">
              <Users size={16} className="text-accent" />
              Relationships
              <span className="text-sm font-normal text-faded-ink">({relationships.length})</span>
            </h3>
            {showRelationships ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {showRelationships && (
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
              {relationships.length === 0 ? (
                <p className="text-sm text-faded-ink">No relationships documented</p>
              ) : (
                relationships.map(rel => (
                  <div
                    key={rel.id}
                    className="text-sm p-2 bg-sepia/5 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span className="capitalize font-medium">{rel.relationship_type}</span>
                      {rel.related_person && (
                        <Link
                          to={`/people/${rel.related_person.id}`}
                          className="text-accent hover:underline"
                        >
                          {rel.related_person.given_name} {rel.related_person.surname}
                        </Link>
                      )}
                    </div>
                    {rel.evidence && (
                      <p className="text-xs text-faded-ink mt-1">{rel.evidence}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Timeline Panel */}
        <div className="card">
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="font-display flex items-center gap-2">
              <Calendar size={16} className="text-accent" />
              Timeline
              <span className="text-sm font-normal text-faded-ink">({timeline.length})</span>
            </h3>
            {showTimeline ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {showTimeline && (
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
              {timeline.length === 0 ? (
                <p className="text-sm text-faded-ink">No dated events</p>
              ) : (
                timeline.map((event, idx) => (
                  <div
                    key={idx}
                    className={`text-sm p-2 rounded ${
                      event.type === 'vital' ? 'bg-green-50' : 'bg-sepia/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-faded-ink">{event.date}</span>
                      <span className="font-medium">{event.label}</span>
                    </div>
                    {event.detail && (
                      <p className="text-xs text-faded-ink">{event.detail}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Writing tips */}
        <div className="card bg-amber-50 border-amber-200">
          <h3 className="font-display flex items-center gap-2 text-amber-800">
            <AlertTriangle size={16} />
            Writing Tips
          </h3>
          <ul className="mt-2 text-sm text-amber-700 space-y-1">
            <li>Click a document to insert its citation</li>
            <li>Use the timeline to order events chronologically</li>
            <li>Note open research questions in the narrative</li>
            <li>Changes auto-save after 3 seconds</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BioEditor
