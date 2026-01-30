import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle, AlertCircle, ChevronRight,
  Users, FileText, Save, Loader2, RefreshCw
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { EventList } from '../components/events'
import { getProcessingStatusDisplay, getEventTypeLabel } from '../lib/eventTypes'

function ExtractionReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [document, setDocument] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('events')

  useEffect(() => {
    fetchDocument()
  }, [id])

  const fetchDocument = async () => {
    setLoading(true)

    // Fetch document
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single()

    if (docError) {
      console.error('Error fetching document:', docError)
      setLoading(false)
      return
    }

    setDocument(docData)

    // Fetch events with participants
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select(`
        *,
        event_participants (
          *,
          person:people (id, given_name, surname, birth_year)
        )
      `)
      .eq('document_id', id)
      .order('line_start', { ascending: true })

    if (!eventError) {
      setEvents(eventData || [])
    }

    setLoading(false)
  }

  const handleConfirmParticipant = async (participant) => {
    const { error } = await supabase
      .from('event_participants')
      .update({
        identification_status: 'confirmed',
        updated_at: new Date().toISOString()
      })
      .eq('id', participant.id)

    if (!error) {
      // Update local state
      setEvents(prev => prev.map(event => ({
        ...event,
        event_participants: event.event_participants.map(p =>
          p.id === participant.id
            ? { ...p, identification_status: 'confirmed' }
            : p
        )
      })))

      // Update person's confirmed count if linked
      if (participant.person_id) {
        await supabase.rpc('increment_person_event_count', {
          p_person_id: participant.person_id,
          p_count_type: 'confirmed'
        })
      }
    }
  }

  const handleRejectParticipant = async (participant) => {
    const { error } = await supabase
      .from('event_participants')
      .update({
        identification_status: 'rejected',
        person_id: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', participant.id)

    if (!error) {
      setEvents(prev => prev.map(event => ({
        ...event,
        event_participants: event.event_participants.map(p =>
          p.id === participant.id
            ? { ...p, identification_status: 'rejected', person_id: null, person: null }
            : p
        )
      })))
    }
  }

  const handleChangeParticipant = async (participant) => {
    // This would open a modal to search for and select a different person
    // For now, just log
    console.log('Change participant:', participant)
    // TODO: Implement person search modal
  }

  const handleMarkComplete = async () => {
    setSaving(true)

    const { error } = await supabase
      .from('documents')
      .update({
        processing_status: 'complete',
        processing_completed_at: new Date().toISOString()
      })
      .eq('id', id)

    if (!error) {
      setDocument(prev => ({
        ...prev,
        processing_status: 'complete',
        processing_completed_at: new Date().toISOString()
      }))
    }

    setSaving(false)
  }

  // Calculate review stats
  const totalParticipants = events.reduce(
    (sum, e) => sum + (e.event_participants?.length || 0),
    0
  )
  const confirmedCount = events.reduce(
    (sum, e) => sum + (e.event_participants?.filter(p => p.identification_status === 'confirmed').length || 0),
    0
  )
  const probableCount = events.reduce(
    (sum, e) => sum + (e.event_participants?.filter(p => p.identification_status === 'probable').length || 0),
    0
  )
  const possibleCount = events.reduce(
    (sum, e) => sum + (e.event_participants?.filter(p => p.identification_status === 'possible').length || 0),
    0
  )
  const unidentifiedCount = events.reduce(
    (sum, e) => sum + (e.event_participants?.filter(p => p.identification_status === 'unidentified').length || 0),
    0
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-sepia" size={32} />
      </div>
    )
  }

  if (!document) {
    return (
      <div className="card text-center py-12">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <p className="text-faded-ink mb-4">Document not found.</p>
        <Link to="/processing" className="btn-secondary">
          Back to Processing
        </Link>
      </div>
    )
  }

  const status = getProcessingStatusDisplay(document.processing_status)
  const isReviewMode = document.processing_status === 'review'
  const isComplete = document.processing_status === 'complete'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            to="/processing"
            className="text-sm text-sepia hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft size={14} />
            Back to Processing
          </Link>
          <h1>{document.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`px-3 py-1 rounded-full text-sm ${
              isComplete ? 'bg-green-100 text-green-800' :
              isReviewMode ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {status.label}
            </span>
            {document.file_type && (
              <span className="text-sm text-faded-ink">
                {document.file_type.toUpperCase()}
              </span>
            )}
            {document.line_count && (
              <span className="text-sm text-faded-ink">
                {document.line_count.toLocaleString()} lines
              </span>
            )}
          </div>
        </div>

        {isReviewMode && (
          <button
            onClick={handleMarkComplete}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle size={16} />
            )}
            Mark Complete
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold">{events.length}</div>
          <div className="text-sm text-faded-ink">Events</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold">{totalParticipants}</div>
          <div className="text-sm text-faded-ink">Participants</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{confirmedCount}</div>
          <div className="text-sm text-faded-ink">Confirmed</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{probableCount}</div>
          <div className="text-sm text-faded-ink">Probable</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-500">{unidentifiedCount}</div>
          <div className="text-sm text-faded-ink">Unidentified</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-sepia/20">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'events'
                ? 'border-sepia text-sepia'
                : 'border-transparent text-faded-ink hover:text-ink'
            }`}
          >
            <FileText size={14} className="inline mr-1" />
            Events ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'text'
                ? 'border-sepia text-sepia'
                : 'border-transparent text-faded-ink hover:text-ink'
            }`}
          >
            Source Text
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'events' ? (
        events.length > 0 ? (
          <EventList
            events={events}
            onConfirmParticipant={handleConfirmParticipant}
            onRejectParticipant={handleRejectParticipant}
            onChangeParticipant={handleChangeParticipant}
            showActions={isReviewMode}
          />
        ) : (
          <div className="card text-center py-12">
            <FileText size={48} className="mx-auto text-faded-ink mb-4" />
            <p className="text-faded-ink">
              No events have been extracted from this document yet.
            </p>
          </div>
        )
      ) : (
        <div className="card">
          <h3 className="font-medium mb-3">Source Text</h3>
          {document.raw_text ? (
            <pre className="text-sm whitespace-pre-wrap font-mono bg-parchment/30 p-4 rounded max-h-[600px] overflow-auto">
              {document.raw_text}
            </pre>
          ) : document.transcription ? (
            <div className="prose prose-sm max-w-none">
              {document.transcription}
            </div>
          ) : (
            <p className="text-faded-ink italic">No text content available.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default ExtractionReview
