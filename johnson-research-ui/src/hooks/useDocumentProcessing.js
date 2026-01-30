import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Hook for managing document processing status and operations
 *
 * @param {string} documentId - Optional document ID to track specific document
 */
export function useDocumentProcessing(documentId = null) {
  const [document, setDocument] = useState(null)
  const [events, setEvents] = useState([])
  const [nameRegistry, setNameRegistry] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch document details including processing status
  const fetchDocument = useCallback(async () => {
    if (!documentId) {
      setDocument(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single()

      if (fetchError) throw fetchError
      setDocument(data)
    } catch (err) {
      console.error('Error fetching document:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [documentId])

  // Fetch events for document
  const fetchEvents = useCallback(async () => {
    if (!documentId) {
      setEvents([])
      return
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('events')
        .select(`
          *,
          event_participants (
            *,
            person:people (id, given_name, surname, birth_year)
          )
        `)
        .eq('document_id', documentId)
        .order('line_start', { ascending: true })

      if (fetchError) throw fetchError
      setEvents(data || [])
    } catch (err) {
      console.error('Error fetching events:', err)
    }
  }, [documentId])

  // Fetch name registry for document
  const fetchNameRegistry = useCallback(async () => {
    if (!documentId) {
      setNameRegistry([])
      return
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('document_name_registry')
        .select(`
          *,
          person:people (id, given_name, surname, birth_year)
        `)
        .eq('document_id', documentId)
        .order('first_appearance_line', { ascending: true })

      if (fetchError) throw fetchError
      setNameRegistry(data || [])
    } catch (err) {
      console.error('Error fetching name registry:', err)
    }
  }, [documentId])

  useEffect(() => {
    fetchDocument()
    fetchEvents()
    fetchNameRegistry()
  }, [fetchDocument, fetchEvents, fetchNameRegistry])

  /**
   * Update document processing status
   */
  const updateStatus = async (status, additionalData = {}) => {
    if (!documentId) return { success: false, error: 'No document ID' }

    try {
      const updateData = {
        processing_status: status,
        ...additionalData
      }

      if (status === 'analyzing') {
        updateData.processing_started_at = new Date().toISOString()
      }

      if (status === 'complete') {
        updateData.processing_completed_at = new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('documents')
        .update(updateData)
        .eq('id', documentId)

      if (updateError) throw updateError

      await fetchDocument()
      return { success: true }
    } catch (err) {
      console.error('Error updating document status:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Add an event to the document
   */
  const addEvent = async (eventData) => {
    if (!documentId) return { success: false, error: 'No document ID' }

    try {
      const { data, error: insertError } = await supabase
        .from('events')
        .insert({
          document_id: documentId,
          ...eventData
        })
        .select()
        .single()

      if (insertError) throw insertError

      setEvents(prev => [...prev, { ...data, event_participants: [] }])

      // Update document event count
      await supabase
        .from('documents')
        .update({ event_count: events.length + 1 })
        .eq('id', documentId)

      return { success: true, event: data }
    } catch (err) {
      console.error('Error adding event:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Add a participant to an event
   */
  const addParticipant = async (eventId, participantData) => {
    try {
      const { data, error: insertError } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          ...participantData
        })
        .select(`
          *,
          person:people (id, given_name, surname, birth_year)
        `)
        .single()

      if (insertError) throw insertError

      // Update local events state
      setEvents(prev => prev.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            event_participants: [...(event.event_participants || []), data]
          }
        }
        return event
      }))

      return { success: true, participant: data }
    } catch (err) {
      console.error('Error adding participant:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Update participant identification status
   */
  const updateParticipantStatus = async (participantId, status, personId = null) => {
    try {
      const updateData = {
        identification_status: status,
        updated_at: new Date().toISOString()
      }

      if (personId !== undefined) {
        updateData.person_id = personId
      }

      const { error: updateError } = await supabase
        .from('event_participants')
        .update(updateData)
        .eq('id', participantId)

      if (updateError) throw updateError

      await fetchEvents()
      return { success: true }
    } catch (err) {
      console.error('Error updating participant status:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Add or update name in document name registry
   */
  const registerName = async (nameData) => {
    if (!documentId) return { success: false, error: 'No document ID' }

    try {
      const { data, error: upsertError } = await supabase
        .from('document_name_registry')
        .upsert({
          document_id: documentId,
          ...nameData
        }, {
          onConflict: 'document_id,name_as_written'
        })
        .select()
        .single()

      if (upsertError) throw upsertError

      await fetchNameRegistry()
      return { success: true, registry: data }
    } catch (err) {
      console.error('Error registering name:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Resolve a name in the registry to a person
   */
  const resolveNameToPerson = async (registryId, personId, confidence = 'probable') => {
    try {
      const { error: updateError } = await supabase
        .from('document_name_registry')
        .update({
          resolved_person_id: personId,
          resolution_confidence: confidence,
          updated_at: new Date().toISOString()
        })
        .eq('id', registryId)

      if (updateError) throw updateError

      await fetchNameRegistry()
      return { success: true }
    } catch (err) {
      console.error('Error resolving name:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Log processing activity
   */
  const logProcessing = async (message, level = 'info') => {
    if (!documentId || !document) return

    try {
      const newLog = {
        timestamp: new Date().toISOString(),
        level,
        message
      }

      const currentLog = document.processing_log || []

      await supabase
        .from('documents')
        .update({
          processing_log: [...currentLog, newLog]
        })
        .eq('id', documentId)

      setDocument(prev => ({
        ...prev,
        processing_log: [...currentLog, newLog]
      }))
    } catch (err) {
      console.error('Error logging processing activity:', err)
    }
  }

  return {
    document,
    events,
    nameRegistry,
    loading,
    error,
    refetch: fetchDocument,
    refetchEvents: fetchEvents,
    refetchNameRegistry: fetchNameRegistry,
    updateStatus,
    addEvent,
    addParticipant,
    updateParticipantStatus,
    registerName,
    resolveNameToPerson,
    logProcessing
  }
}

export default useDocumentProcessing
