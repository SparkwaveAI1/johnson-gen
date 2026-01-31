import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  MapPin, Droplets, Building, Church, Map,
  ChevronRight, Users, FileText, Calendar, ArrowLeft
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useWorkspace } from '../contexts/WorkspaceContext'

const LOCATION_ICONS = {
  colony: Map,
  county: Map,
  parish: Church,
  region: MapPin,
  creek: Droplets,
  river: Droplets,
  swamp: Droplets,
  plantation: Building,
  hundred: MapPin
}

const LOCATION_COLORS = {
  colony: 'bg-purple-100 text-purple-800',
  county: 'bg-blue-100 text-blue-800',
  parish: 'bg-amber-100 text-amber-800',
  region: 'bg-green-100 text-green-800',
  creek: 'bg-cyan-100 text-cyan-800',
  river: 'bg-cyan-100 text-cyan-800',
  swamp: 'bg-teal-100 text-teal-800',
  plantation: 'bg-orange-100 text-orange-800',
  hundred: 'bg-gray-100 text-gray-800'
}

const RESIDENCE_TYPE_LABELS = {
  landowner: 'Landowner',
  tenant: 'Tenant',
  resident: 'Resident',
  adjacent: 'Adjacent',
  documented: 'Documented'
}

function LocationDetail() {
  const { slug } = useParams()
  const [location, setLocation] = useState(null)
  const [parent, setParent] = useState(null)
  const [children, setChildren] = useState([])
  const [residents, setResidents] = useState([])
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchLocation() {
      setLoading(true)
      setError(null)

      try {
        // Fetch location by slug
        const { data: locationData, error: locationError } = await supabase
          .from('locations')
          .select('*')
          .eq('slug', slug)
          .single()

        if (locationError) throw locationError
        setLocation(locationData)

        // Fetch parent if exists
        if (locationData.parent_location_id) {
          const { data: parentData } = await supabase
            .from('locations')
            .select('id, name, slug')
            .eq('id', locationData.parent_location_id)
            .single()
          setParent(parentData)
        }

        // Fetch child locations
        const { data: childrenData } = await supabase
          .from('locations')
          .select('*')
          .eq('parent_location_id', locationData.id)
          .order('name')
        setChildren(childrenData || [])

        // Fetch residents with person details
        const { data: residentsData } = await supabase
          .from('location_residents')
          .select(`
            *,
            person:people(id, given_name, surname, birth_year, death_year)
          `)
          .eq('location_id', locationData.id)
          .order('date_first')
        setResidents(residentsData || [])

        // Fetch documents linked to this location
        const { data: docLinksData } = await supabase
          .from('document_locations')
          .select(`
            *,
            document:documents(id, title, document_date, document_type)
          `)
          .eq('location_id', locationData.id)
        setDocuments(docLinksData || [])

      } catch (err) {
        setError(err.message)
      }

      setLoading(false)
    }

    if (slug) {
      fetchLocation()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="p-8 text-center text-faded-ink">
        Loading location...
      </div>
    )
  }

  if (error || !location) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">Location not found</p>
        <Link to="/locations" className="text-accent hover:underline">
          Back to Locations
        </Link>
      </div>
    )
  }

  const Icon = LOCATION_ICONS[location.location_type] || MapPin
  const colorClass = LOCATION_COLORS[location.location_type] || 'bg-gray-100 text-gray-800'

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-faded-ink">
        <Link to="/locations" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} />
          Locations
        </Link>
        {parent && (
          <>
            <ChevronRight size={14} />
            <Link to={`/locations/${parent.slug}`} className="hover:text-accent">
              {parent.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="text-ink">{location.name}</span>
      </div>

      {/* Header */}
      <div className="card">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${colorClass}`}>
            <Icon size={24} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-display">{location.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
                {location.location_type}
              </span>
              {location.date_formed && (
                <span className="text-sm text-faded-ink flex items-center gap-1">
                  <Calendar size={14} />
                  Formed {location.date_formed}
                </span>
              )}
            </div>
            {location.name_variants && location.name_variants.length > 0 && (
              <p className="text-sm text-faded-ink mt-2">
                Also known as: {location.name_variants.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {location.description && (
          <div className="mt-4 pt-4 border-t border-sepia/10">
            <p className="text-ink">{location.description}</p>
          </div>
        )}

        {/* Formation info */}
        {(location.formed_from || location.border_notes) && (
          <div className="mt-4 pt-4 border-t border-sepia/10 text-sm">
            {location.formed_from && (
              <p className="text-faded-ink">
                <strong>Formed from:</strong> {location.formed_from}
              </p>
            )}
            {location.border_notes && (
              <p className="text-faded-ink mt-1">
                <strong>Notes:</strong> {location.border_notes}
              </p>
            )}
          </div>
        )}

        {/* Coordinates if known */}
        {location.coordinates_known && location.latitude && location.longitude && (
          <div className="mt-4 pt-4 border-t border-sepia/10 text-sm text-faded-ink">
            <strong>Coordinates:</strong> {location.latitude}, {location.longitude}
            {location.coordinate_precision && (
              <span className="ml-2">({location.coordinate_precision})</span>
            )}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Child Locations */}
        {children.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-display flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-accent" />
              Sub-locations
              <span className="ml-auto text-sm font-normal text-faded-ink">
                {children.length}
              </span>
            </h2>
            <div className="space-y-2">
              {children.map(child => {
                const ChildIcon = LOCATION_ICONS[child.location_type] || MapPin
                return (
                  <Link
                    key={child.id}
                    to={`/locations/${child.slug}`}
                    className="flex items-center gap-2 p-2 rounded hover:bg-sepia/5"
                  >
                    <ChildIcon size={16} className="text-accent" />
                    <span>{child.name}</span>
                    <span className="text-xs text-faded-ink">({child.location_type})</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Residents */}
        <div className="card">
          <h2 className="text-lg font-display flex items-center gap-2 mb-4">
            <Users size={18} className="text-accent" />
            Residents
            <span className="ml-auto text-sm font-normal text-faded-ink">
              {residents.length}
            </span>
          </h2>
          {residents.length === 0 ? (
            <p className="text-faded-ink text-sm">No residents documented yet.</p>
          ) : (
            <div className="space-y-2">
              {residents.map(resident => (
                <Link
                  key={resident.id}
                  to={`/people/${resident.person_id}`}
                  className="flex items-center justify-between p-2 rounded hover:bg-sepia/5"
                >
                  <div>
                    <span className="font-medium">
                      {resident.person ? `${resident.person.given_name} ${resident.person.surname}` : resident.person_id}
                    </span>
                    {resident.person?.birth_year && (
                      <span className="text-sm text-faded-ink ml-2">
                        ({resident.person.birth_year}-{resident.person.death_year || '?'})
                      </span>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    {resident.residence_type && (
                      <span className="text-faded-ink">
                        {RESIDENCE_TYPE_LABELS[resident.residence_type]}
                      </span>
                    )}
                    {resident.date_first && (
                      <span className="text-faded-ink ml-2">
                        {resident.date_first}{resident.date_last && resident.date_last !== resident.date_first ? `-${resident.date_last}` : ''}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Documents */}
        <div className="card">
          <h2 className="text-lg font-display flex items-center gap-2 mb-4">
            <FileText size={18} className="text-accent" />
            Documents
            <span className="ml-auto text-sm font-normal text-faded-ink">
              {documents.length}
            </span>
          </h2>
          {documents.length === 0 ? (
            <p className="text-faded-ink text-sm">No documents linked yet.</p>
          ) : (
            <div className="space-y-2">
              {documents.map(docLink => (
                <Link
                  key={docLink.id}
                  to={`/documents/${docLink.document_id}`}
                  className="flex items-center justify-between p-2 rounded hover:bg-sepia/5"
                >
                  <div>
                    <span className="font-medium">
                      {docLink.document?.title || 'Untitled Document'}
                    </span>
                    {docLink.document?.document_date && (
                      <span className="text-sm text-faded-ink ml-2">
                        ({docLink.document.document_date})
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-faded-ink">
                    {docLink.location_role}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LocationDetail
