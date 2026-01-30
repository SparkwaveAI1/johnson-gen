import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Hook for fetching all locations with hierarchy
 */
export function useLocations() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchLocations = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('locations')
      .select('*')
      .order('name')

    if (fetchError) {
      setError(fetchError.message)
      setLocations([])
    } else {
      setLocations(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchLocations()
  }, [fetchLocations])

  return { locations, loading, error, refetch: fetchLocations }
}

/**
 * Hook for fetching a single location with details
 */
export function useLocation(locationId) {
  const [location, setLocation] = useState(null)
  const [children, setChildren] = useState([])
  const [residents, setResidents] = useState([])
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchLocation = useCallback(async () => {
    if (!locationId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch the location
      const { data: locationData, error: locationError } = await supabase
        .from('locations')
        .select('*')
        .eq('id', locationId)
        .single()

      if (locationError) throw locationError
      setLocation(locationData)

      // Fetch parent location if exists
      if (locationData.parent_location_id) {
        const { data: parentData } = await supabase
          .from('locations')
          .select('id, name, slug')
          .eq('id', locationData.parent_location_id)
          .single()

        if (parentData) {
          locationData.parent = parentData
          setLocation({ ...locationData, parent: parentData })
        }
      }

      // Fetch child locations
      const { data: childrenData } = await supabase
        .from('locations')
        .select('*')
        .eq('parent_location_id', locationId)
        .order('name')

      setChildren(childrenData || [])

      // Fetch residents with person details
      const { data: residentsData } = await supabase
        .from('location_residents')
        .select(`
          *,
          person:people(id, given_name, surname, birth_year, death_year)
        `)
        .eq('location_id', locationId)
        .order('date_first')

      setResidents(residentsData || [])

      // Fetch documents linked to this location
      const { data: docLinksData } = await supabase
        .from('document_locations')
        .select(`
          *,
          document:documents(id, title, document_date, document_type)
        `)
        .eq('location_id', locationId)

      setDocuments(docLinksData || [])

    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }, [locationId])

  useEffect(() => {
    fetchLocation()
  }, [fetchLocation])

  return { location, children, residents, documents, loading, error, refetch: fetchLocation }
}

/**
 * Build a tree structure from flat location list
 */
export function buildLocationTree(locations) {
  const locationMap = {}
  const roots = []

  // First pass: create map
  locations.forEach(loc => {
    locationMap[loc.id] = { ...loc, children: [] }
  })

  // Second pass: build tree
  locations.forEach(loc => {
    if (loc.parent_location_id && locationMap[loc.parent_location_id]) {
      locationMap[loc.parent_location_id].children.push(locationMap[loc.id])
    } else if (!loc.parent_location_id) {
      roots.push(locationMap[loc.id])
    }
  })

  // Sort children alphabetically
  const sortChildren = (node) => {
    node.children.sort((a, b) => a.name.localeCompare(b.name))
    node.children.forEach(sortChildren)
  }
  roots.forEach(sortChildren)

  return roots
}

/**
 * Hook for managing location residents
 */
export function useLocationResidents(locationId) {
  const [residents, setResidents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!locationId) {
      setLoading(false)
      return
    }

    async function fetchResidents() {
      setLoading(true)
      const { data } = await supabase
        .from('location_residents')
        .select(`
          *,
          person:people(id, given_name, surname, birth_year, death_year)
        `)
        .eq('location_id', locationId)
        .order('date_first')

      setResidents(data || [])
      setLoading(false)
    }

    fetchResidents()
  }, [locationId])

  const addResident = async (personId, residenceData) => {
    const { data, error } = await supabase
      .from('location_residents')
      .insert({
        location_id: locationId,
        person_id: personId,
        ...residenceData
      })
      .select()

    if (!error && data) {
      // Refetch to get person details
      const { data: newResident } = await supabase
        .from('location_residents')
        .select(`
          *,
          person:people(id, given_name, surname, birth_year, death_year)
        `)
        .eq('id', data[0].id)
        .single()

      if (newResident) {
        setResidents([...residents, newResident])
      }
    }

    return { data, error }
  }

  const removeResident = async (residentId) => {
    const { error } = await supabase
      .from('location_residents')
      .delete()
      .eq('id', residentId)

    if (!error) {
      setResidents(residents.filter(r => r.id !== residentId))
    }

    return { error }
  }

  return { residents, loading, addResident, removeResident }
}
