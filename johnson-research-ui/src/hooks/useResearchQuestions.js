import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Hook for fetching and managing research questions for a person
 *
 * @param {string} personId - The person ID to fetch questions for
 * @param {object} options - Options: { statusFilter: 'open' | 'resolved' | 'cannot_resolve' | null }
 */
export function useResearchQuestions(personId, options = {}) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { statusFilter = 'open' } = options

  const fetchQuestions = useCallback(async () => {
    if (!personId) {
      setQuestions([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('research_questions')
        .select('*')
        .eq('person_id', personId)
        .order('created_at', { ascending: false })

      if (statusFilter) {
        query = query.eq('status', statusFilter)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      setQuestions(data || [])
    } catch (err) {
      console.error('Error fetching research questions:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [personId, statusFilter])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  /**
   * Mark a question as resolved
   */
  const resolveQuestion = async (questionId, resolution) => {
    try {
      const { error: updateError } = await supabase
        .from('research_questions')
        .update({
          status: 'resolved',
          resolution,
          resolution_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', questionId)

      if (updateError) throw updateError

      // Refresh questions
      await fetchQuestions()
      return { success: true }
    } catch (err) {
      console.error('Error resolving question:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Mark a question as cannot resolve
   */
  const markCannotResolve = async (questionId, resolution) => {
    try {
      const { error: updateError } = await supabase
        .from('research_questions')
        .update({
          status: 'cannot_resolve',
          resolution: resolution || 'Unable to resolve with available sources',
          resolution_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', questionId)

      if (updateError) throw updateError

      await fetchQuestions()
      return { success: true }
    } catch (err) {
      console.error('Error marking question as cannot resolve:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Reopen a resolved question
   */
  const reopenQuestion = async (questionId) => {
    try {
      const { error: updateError } = await supabase
        .from('research_questions')
        .update({
          status: 'open',
          resolution: null,
          resolution_date: null
        })
        .eq('id', questionId)

      if (updateError) throw updateError

      await fetchQuestions()
      return { success: true }
    } catch (err) {
      console.error('Error reopening question:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Add a new research question
   */
  const addQuestion = async (questionData) => {
    try {
      const { error: insertError } = await supabase
        .from('research_questions')
        .insert({
          person_id: personId,
          ...questionData
        })

      if (insertError) throw insertError

      await fetchQuestions()
      return { success: true }
    } catch (err) {
      console.error('Error adding question:', err)
      return { success: false, error: err.message }
    }
  }

  return {
    questions,
    loading,
    error,
    refetch: fetchQuestions,
    resolveQuestion,
    markCannotResolve,
    reopenQuestion,
    addQuestion
  }
}

/**
 * Hook for fetching related people for a research question
 */
export function useRelatedPeople(relatedPeopleIds) {
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchRelatedPeople() {
      if (!relatedPeopleIds || relatedPeopleIds.length === 0) {
        setPeople([])
        return
      }

      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('people')
          .select('id, given_name, surname, birth_year')
          .in('id', relatedPeopleIds)

        if (error) throw error
        setPeople(data || [])
      } catch (err) {
        console.error('Error fetching related people:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedPeople()
  }, [relatedPeopleIds])

  return { people, loading }
}

export default useResearchQuestions
