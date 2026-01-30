import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Hook for fetching all chapters
 */
export function useChapters() {
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchChapters = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('book_chapters')
      .select('*')
      .order('chapter_number')

    if (fetchError) {
      setError(fetchError.message)
      setChapters([])
    } else {
      setChapters(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchChapters()
  }, [fetchChapters])

  const createChapter = async (chapterData) => {
    const { data, error } = await supabase
      .from('book_chapters')
      .insert(chapterData)
      .select()
      .single()

    if (!error && data) {
      setChapters([...chapters, data])
    }

    return { data, error }
  }

  const deleteChapter = async (chapterId) => {
    const { error } = await supabase
      .from('book_chapters')
      .delete()
      .eq('id', chapterId)

    if (!error) {
      setChapters(chapters.filter(c => c.id !== chapterId))
    }

    return { error }
  }

  return { chapters, loading, error, refetch: fetchChapters, createChapter, deleteChapter }
}

/**
 * Hook for fetching a single chapter with contents
 */
export function useChapter(chapterId) {
  const [chapter, setChapter] = useState(null)
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchChapter = useCallback(async () => {
    if (!chapterId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch chapter
      const { data: chapterData, error: chapterError } = await supabase
        .from('book_chapters')
        .select('*')
        .eq('id', chapterId)
        .single()

      if (chapterError) throw chapterError
      setChapter(chapterData)

      // Fetch contents with related entities
      const { data: contentsData } = await supabase
        .from('chapter_contents')
        .select(`
          *,
          family_group:family_groups(id, name, slug),
          location:locations(id, name, slug),
          person:people(id, given_name, surname)
        `)
        .eq('chapter_id', chapterId)
        .order('sequence')

      setContents(contentsData || [])

    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }, [chapterId])

  useEffect(() => {
    fetchChapter()
  }, [fetchChapter])

  const updateChapter = async (updates) => {
    const { error } = await supabase
      .from('book_chapters')
      .update(updates)
      .eq('id', chapterId)

    if (!error) {
      setChapter({ ...chapter, ...updates })
    }

    return { error }
  }

  const addContent = async (contentData) => {
    const nextSequence = contents.length > 0
      ? Math.max(...contents.map(c => c.sequence || 0)) + 1
      : 1

    const { data, error } = await supabase
      .from('chapter_contents')
      .insert({
        chapter_id: chapterId,
        sequence: nextSequence,
        ...contentData
      })
      .select(`
        *,
        family_group:family_groups(id, name, slug),
        location:locations(id, name, slug),
        person:people(id, given_name, surname)
      `)
      .single()

    if (!error && data) {
      setContents([...contents, data])
    }

    return { data, error }
  }

  const updateContent = async (contentId, updates) => {
    const { error } = await supabase
      .from('chapter_contents')
      .update(updates)
      .eq('id', contentId)

    if (!error) {
      setContents(contents.map(c =>
        c.id === contentId ? { ...c, ...updates } : c
      ))
    }

    return { error }
  }

  const removeContent = async (contentId) => {
    const { error } = await supabase
      .from('chapter_contents')
      .delete()
      .eq('id', contentId)

    if (!error) {
      setContents(contents.filter(c => c.id !== contentId))
    }

    return { error }
  }

  const reorderContents = async (newOrder) => {
    // Update sequence numbers
    const updates = newOrder.map((id, index) => ({
      id,
      sequence: index + 1
    }))

    for (const update of updates) {
      await supabase
        .from('chapter_contents')
        .update({ sequence: update.sequence })
        .eq('id', update.id)
    }

    // Reorder local state
    const reorderedContents = newOrder.map(id =>
      contents.find(c => c.id === id)
    ).filter(Boolean)

    setContents(reorderedContents)
  }

  return {
    chapter,
    contents,
    loading,
    error,
    refetch: fetchChapter,
    updateChapter,
    addContent,
    updateContent,
    removeContent,
    reorderContents
  }
}
