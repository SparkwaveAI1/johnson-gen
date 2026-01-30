import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Hook for fetching and managing events
 *
 * @param {object} options - Filter options
 * @param {string} options.personId - Filter by person ID
 * @param {string} options.documentId - Filter by document ID
 * @param {string} options.eventType - Filter by event type
 * @param {string} options.yearStart - Filter by start year
 * @param {string} options.yearEnd - Filter by end year
 * @param {number} options.limit - Maximum results (default 100)
 */
export function useEvents(options = {}) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const {
    personId,
    documentId,
    eventType,
    yearStart,
    yearEnd,
    limit = 100
  } = options

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // If filtering by person, we need to join through event_participants
      if (personId) {
        const { data: participantData, error: participantError } = await supabase
          .from('event_participants')
          .select(`
            *,
            event:events (
              *,
              document:documents (id, title),
              location:locations (id, name, slug)
            )
          `)
          .eq('person_id', personId)
          .limit(limit)

        if (participantError) throw participantError

        // Transform to event-centric structure
        const eventMap = new Map()
        (participantData || []).forEach(ep => {
          if (!ep.event) return
          if (!eventMap.has(ep.event.id)) {
            eventMap.set(ep.event.id, {
              ...ep.event,
              event_participants: []
            })
          }
          eventMap.get(ep.event.id).event_participants.push(ep)
        })

        setEvents(Array.from(eventMap.values()))
      } else {
        // Direct event query
        let query = supabase
          .from('events')
          .select(`
            *,
            document:documents (id, title),
            location:locations (id, name, slug),
            event_participants (
              *,
              person:people (id, given_name, surname, birth_year)
            )
          `)
          .order('event_year', { ascending: false })
          .limit(limit)

        if (documentId) {
          query = query.eq('document_id', documentId)
        }

        if (eventType) {
          query = query.eq('event_type', eventType)
        }

        if (yearStart) {
          query = query.gte('event_year', yearStart)
        }

        if (yearEnd) {
          query = query.lte('event_year', yearEnd)
        }

        const { data, error: fetchError } = await query

        if (fetchError) throw fetchError
        setEvents(data || [])
      }
    } catch (err) {
      console.error('Error fetching events:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [personId, documentId, eventType, yearStart, yearEnd, limit])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  /**
   * Create a new event
   */
  const createEvent = async (eventData) => {
    try {
      const { data, error: insertError } = await supabase
        .from('events')
        .insert(eventData)
        .select(`
          *,
          document:documents (id, title),
          location:locations (id, name, slug)
        `)
        .single()

      if (insertError) throw insertError

      setEvents(prev => [{ ...data, event_participants: [] }, ...prev])
      return { success: true, event: data }
    } catch (err) {
      console.error('Error creating event:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Update an event
   */
  const updateEvent = async (eventId, updates) => {
    try {
      const { error: updateError } = await supabase
        .from('events')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)

      if (updateError) throw updateError

      setEvents(prev => prev.map(event =>
        event.id === eventId ? { ...event, ...updates } : event
      ))

      return { success: true }
    } catch (err) {
      console.error('Error updating event:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Delete an event
   */
  const deleteEvent = async (eventId) => {
    try {
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (deleteError) throw deleteError

      setEvents(prev => prev.filter(event => event.id !== eventId))
      return { success: true }
    } catch (err) {
      console.error('Error deleting event:', err)
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
   * Confirm a participant's identity
   */
  const confirmParticipant = async (participantId, personId = null) => {
    try {
      const updateData = {
        identification_status: 'confirmed',
        updated_at: new Date().toISOString()
      }

      if (personId) {
        updateData.person_id = personId
      }

      const { error: updateError } = await supabase
        .from('event_participants')
        .update(updateData)
        .eq('id', participantId)

      if (updateError) throw updateError

      // Update local state
      setEvents(prev => prev.map(event => ({
        ...event,
        event_participants: event.event_participants?.map(p =>
          p.id === participantId
            ? { ...p, identification_status: 'confirmed', person_id: personId || p.person_id }
            : p
        )
      })))

      return { success: true }
    } catch (err) {
      console.error('Error confirming participant:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Reject a participant's identification
   */
  const rejectParticipant = async (participantId) => {
    try {
      const { error: updateError } = await supabase
        .from('event_participants')
        .update({
          identification_status: 'rejected',
          person_id: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', participantId)

      if (updateError) throw updateError

      setEvents(prev => prev.map(event => ({
        ...event,
        event_participants: event.event_participants?.map(p =>
          p.id === participantId
            ? { ...p, identification_status: 'rejected', person_id: null, person: null }
            : p
        )
      })))

      return { success: true }
    } catch (err) {
      console.error('Error rejecting participant:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Link a participant to a person
   */
  const linkParticipantToPerson = async (participantId, personId, confidence = 'probable') => {
    try {
      const { data: person } = await supabase
        .from('people')
        .select('id, given_name, surname, birth_year')
        .eq('id', personId)
        .single()

      const { error: updateError } = await supabase
        .from('event_participants')
        .update({
          person_id: personId,
          identification_status: confidence,
          updated_at: new Date().toISOString()
        })
        .eq('id', participantId)

      if (updateError) throw updateError

      setEvents(prev => prev.map(event => ({
        ...event,
        event_participants: event.event_participants?.map(p =>
          p.id === participantId
            ? { ...p, person_id: personId, person, identification_status: confidence }
            : p
        )
      })))

      return { success: true }
    } catch (err) {
      console.error('Error linking participant:', err)
      return { success: false, error: err.message }
    }
  }

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    addParticipant,
    confirmParticipant,
    rejectParticipant,
    linkParticipantToPerson
  }
}

/**
 * Hook for fetching event statistics
 */
export function useEventStats() {
  const [stats, setStats] = useState({
    total: 0,
    byType: {},
    byStatus: {},
    byYear: {}
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)

      try {
        // Get total events
        const { count: total } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })

        // Get events by type
        const { data: typeData } = await supabase
          .from('events')
          .select('event_type')

        const byType = {}
        typeData?.forEach(e => {
          byType[e.event_type] = (byType[e.event_type] || 0) + 1
        })

        // Get participants by identification status
        const { data: statusData } = await supabase
          .from('event_participants')
          .select('identification_status')

        const byStatus = {}
        statusData?.forEach(p => {
          byStatus[p.identification_status] = (byStatus[p.identification_status] || 0) + 1
        })

        setStats({
          total: total || 0,
          byType,
          byStatus,
          byYear: {}
        })
      } catch (err) {
        console.error('Error fetching event stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading }
}

export default useEvents
