import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Hook for fetching all family groups
 */
export function useFamilyGroups(options = {}) {
  const { statusFilter } = options
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchGroups = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('family_groups')
      .select(`
        *,
        anchor:people!family_groups_anchor_person_id_fkey(id, given_name, surname),
        location:locations!family_groups_primary_location_id_fkey(id, name, slug)
      `)
      .order('name')

    if (statusFilter) {
      query = query.eq('status', statusFilter)
    }

    const { data, error: fetchError } = await query

    if (fetchError) {
      setError(fetchError.message)
      setGroups([])
    } else {
      setGroups(data || [])
    }
    setLoading(false)
  }, [statusFilter])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  return { groups, loading, error, refetch: fetchGroups }
}

/**
 * Hook for fetching a single family group with details
 */
export function useFamilyGroup(groupId) {
  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [childGroups, setChildGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchGroup = useCallback(async () => {
    if (!groupId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch the group
      const { data: groupData, error: groupError } = await supabase
        .from('family_groups')
        .select(`
          *,
          anchor:people!family_groups_anchor_person_id_fkey(id, given_name, surname, birth_year, death_year),
          location:locations!family_groups_primary_location_id_fkey(id, name, slug),
          parent_group:family_groups!family_groups_parent_group_id_fkey(id, name, slug)
        `)
        .eq('id', groupId)
        .single()

      if (groupError) throw groupError
      setGroup(groupData)

      // Fetch members with person details
      const { data: membersData } = await supabase
        .from('family_group_members')
        .select(`
          *,
          person:people(id, given_name, surname, birth_year, death_year, bio_status)
        `)
        .eq('family_group_id', groupId)
        .order('generation')
        .order('role')

      setMembers(membersData || [])

      // Fetch child groups
      const { data: childData } = await supabase
        .from('family_groups')
        .select('id, name, slug, group_type, confidence')
        .eq('parent_group_id', groupId)
        .order('name')

      setChildGroups(childData || [])

    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }, [groupId])

  useEffect(() => {
    fetchGroup()
  }, [fetchGroup])

  // Add member to group
  const addMember = async (personId, role, generation, notes) => {
    const { data, error } = await supabase
      .from('family_group_members')
      .insert({
        family_group_id: groupId,
        person_id: personId,
        role,
        generation,
        notes
      })
      .select(`
        *,
        person:people(id, given_name, surname, birth_year, death_year, bio_status)
      `)
      .single()

    if (!error && data) {
      setMembers([...members, data])
    }

    return { data, error }
  }

  // Remove member from group
  const removeMember = async (memberId) => {
    const { error } = await supabase
      .from('family_group_members')
      .delete()
      .eq('id', memberId)

    if (!error) {
      setMembers(members.filter(m => m.id !== memberId))
    }

    return { error }
  }

  // Update group narrative
  const updateNarrative = async (narrative) => {
    const { error } = await supabase
      .from('family_groups')
      .update({ narrative })
      .eq('id', groupId)

    if (!error) {
      setGroup({ ...group, narrative })
    }

    return { error }
  }

  // Update group status
  const updateStatus = async (status) => {
    const { error } = await supabase
      .from('family_groups')
      .update({ status })
      .eq('id', groupId)

    if (!error) {
      setGroup({ ...group, status })
    }

    return { error }
  }

  return {
    group,
    members,
    childGroups,
    loading,
    error,
    refetch: fetchGroup,
    addMember,
    removeMember,
    updateNarrative,
    updateStatus
  }
}

/**
 * Hook for fetching family groups for a specific person
 */
export function usePersonFamilyGroups(personId) {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!personId) {
      setLoading(false)
      return
    }

    async function fetchGroups() {
      setLoading(true)

      const { data } = await supabase
        .from('family_group_members')
        .select(`
          role,
          generation,
          family_group:family_groups(id, name, slug, group_type, confidence)
        `)
        .eq('person_id', personId)

      setGroups(data || [])
      setLoading(false)
    }

    fetchGroups()
  }, [personId])

  return { groups, loading }
}

/**
 * Create a new family group
 */
export async function createFamilyGroup(groupData) {
  const { data, error } = await supabase
    .from('family_groups')
    .insert(groupData)
    .select()
    .single()

  return { data, error }
}
