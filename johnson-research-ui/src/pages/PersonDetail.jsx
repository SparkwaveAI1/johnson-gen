import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Users, FileText, MapPin, Plus, RefreshCw, Link as LinkIcon, BookOpen, ClipboardList, Upload, Navigation, Trash2, Calendar, Merge, Dna } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useWorkspace } from '../contexts/WorkspaceContext'
import ConfidenceIndicator from '../components/common/ConfidenceIndicator'
import ConfirmDialog from '../components/common/ConfirmDialog'
import PersonForm from '../components/people/PersonForm'
import RelationshipForm from '../components/relationships/RelationshipForm'
import AssociationForm from '../components/relationships/AssociationForm'
import DocumentLinkForm from '../components/documents/DocumentLinkForm'
import ResearchQuestionsSection from '../components/research/ResearchQuestionsSection'
import BioEditor from '../components/narrative/BioEditor'
import FactSheetGenerator from '../components/narrative/FactSheetGenerator'
import MigrationMap from '../components/locations/MigrationMap'
import LocationMapControls from '../components/locations/LocationMapControls'
import NetworkGraph from '../components/relationships/NetworkGraph'
import DocumentProcessor from '../components/documents/DocumentProcessor'
import VitalFactsEditor from '../components/people/VitalFactsEditor'
import LocationResidentForm from '../components/locations/LocationResidentForm'
import MergeProfilesModal from '../components/people/MergeProfilesModal'
import { useResearchQuestions } from '../hooks/useResearchQuestions'
import { EventList } from '../components/events'

function PersonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { workspaceId } = useWorkspace()
  const [person, setPerson] = useState(null)
  const [relationships, setRelationships] = useState([])
  const [associations, setAssociations] = useState([])
  const [documents, setDocuments] = useState([])
  const [locations, setLocations] = useState([])
  const [events, setEvents] = useState([])
  const [dnaMatches, setDnaMatches] = useState([])
  const [loading, setLoading] = useState(true)

  // View mode: 'details' or 'bio'
  const [activeView, setActiveView] = useState('details')

  // Research questions for fact sheet
  const { questions: researchQuestions } = useResearchQuestions(id)

  // Modal states
  const [showEditPerson, setShowEditPerson] = useState(false)
  const [showAddRelationship, setShowAddRelationship] = useState(false)
  const [showAddAssociation, setShowAddAssociation] = useState(false)
  const [showLinkDocument, setShowLinkDocument] = useState(false)
  const [showProcessDocument, setShowProcessDocument] = useState(false)

  // Inline editing states
  const [editingVitalFacts, setEditingVitalFacts] = useState(false)
  const [editingBio, setEditingBio] = useState(false)
  const [bioText, setBioText] = useState('')
  const [savingBio, setSavingBio] = useState(false)
  const [showAddLocation, setShowAddLocation] = useState(false)

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Merge modal state
  const [showMergeModal, setShowMergeModal] = useState(false)

  const fetchData = async () => {
    if (!workspaceId) return
    setLoading(true)

    // Fetch person details (filter by workspace for security)
    let personQuery = supabase
      .from('people')
      .select('*')
      .eq('id', id)
    
    if (workspaceId) {
      personQuery = personQuery.eq('workspace_id', workspaceId)
    }
    
    const { data: personData, error: personError } = await personQuery.single()

    if (personError) {
      console.error('Error fetching person:', personError)
      setLoading(false)
      return
    }

    setPerson(personData)

    // Fetch relationships
    const { data: relData } = await supabase
      .from('family_relationships')
      .select(`
        *,
        related_person:related_person_id(id, given_name, surname, birth_year)
      `)
      .eq('person_id', id)

    setRelationships(relData || [])

    // Fetch associations
    const { data: assocData } = await supabase
      .from('associations')
      .select(`
        *,
        associated_person:associated_person_id(id, given_name, surname)
      `)
      .eq('person_id', id)

    setAssociations(assocData || [])

    // Fetch documents linked to this person
    const { data: docData } = await supabase
      .from('document_people')
      .select(`
        *,
        document:document_id(id, title, document_type, date, county, state, acres)
      `)
      .eq('person_id', id)

    setDocuments(docData || [])

    // Fetch locations for this person (including coordinates for mapping)
    const { data: locData } = await supabase
      .from('location_residents')
      .select(`
        *,
        location:location_id(id, name, slug, location_type, parent_location_id, latitude, longitude)
      `)
      .eq('person_id', id)
      .order('date_first')

    // Fetch parent location names for hierarchy display
    if (locData && locData.length > 0) {
      const parentIds = locData
        .map(l => l.location?.parent_location_id)
        .filter(Boolean)

      if (parentIds.length > 0) {
        const { data: parentData } = await supabase
          .from('locations')
          .select('id, name')
          .in('id', parentIds)

        const parentMap = {}
        parentData?.forEach(p => { parentMap[p.id] = p.name })

        locData.forEach(l => {
          if (l.location?.parent_location_id) {
            l.location.parent_name = parentMap[l.location.parent_location_id]
          }
        })
      }
    }

    setLocations(locData || [])

    // Fetch events where this person is a participant
    const { data: eventData } = await supabase
      .from('event_participants')
      .select(`
        *,
        event:events (
          *,
          document:documents (id, title)
        )
      `)
      .eq('person_id', id)
      .order('created_at', { ascending: false })

    // Transform to get events with this person's participation info
    const personEvents = (eventData || []).map(ep => ({
      ...ep.event,
      participant_role: ep.role,
      participant_status: ep.identification_status,
      event_participants: [ep]
    }))
    setEvents(personEvents)

    // Fetch DNA matches where this person is confirmed MRCA
    const { data: dnaMatchData } = await supabase
      .from('dna_matches')
      .select('*')
      .eq('confirmed_mrca_id', id)
      .order('shared_cm', { ascending: false })

    setDnaMatches(dnaMatchData || [])

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [id, workspaceId])

  const handlePersonSave = (updatedPerson) => {
    setPerson(updatedPerson)
    setShowEditPerson(false)
  }

  const handleRelationshipSave = (newRel) => {
    setRelationships(prev => [...prev, newRel])
    setShowAddRelationship(false)
  }

  const handleAssociationSave = (newAssoc) => {
    setAssociations(prev => [...prev, newAssoc])
    setShowAddAssociation(false)
  }

  const handleDocumentLinkSave = (newDocLink) => {
    setDocuments(prev => [...prev, newDocLink])
    setShowLinkDocument(false)
  }

  const handleVitalFactsSave = (updatedPerson) => {
    setPerson(updatedPerson)
    setEditingVitalFacts(false)
  }

  const handleBioEdit = () => {
    setBioText(person.bio || '')
    setEditingBio(true)
  }

  const handleBioSave = async () => {
    setSavingBio(true)
    try {
      const { data, error } = await supabase
        .from('people')
        .update({ bio: bioText || null })
        .eq('id', person.id)
        .select()
        .single()

      if (error) throw error
      setPerson(data)
      setEditingBio(false)
    } catch (err) {
      console.error('Error saving bio:', err)
      alert('Failed to save biography')
    } finally {
      setSavingBio(false)
    }
  }

  const handleDeleteLocation = async (locationResidentId) => {
    if (!confirm('Are you sure you want to remove this location from the person\'s record?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('location_residents')
        .delete()
        .eq('id', locationResidentId)

      if (error) throw error
      setLocations(prev => prev.filter(l => l.id !== locationResidentId))
    } catch (err) {
      console.error('Error deleting location:', err)
      alert('Failed to delete location')
    }
  }

  const handleLocationSave = (newLocation) => {
    setLocations(prev => [...prev, newLocation])
    setShowAddLocation(false)
  }

  const handleDeletePerson = async () => {
    setDeleting(true)
    try {
      // Delete related records first (cascading)
      // 1. Delete event_participants
      await supabase
        .from('event_participants')
        .delete()
        .eq('person_id', id)

      // 2. Delete family_relationships (both directions)
      await supabase
        .from('family_relationships')
        .delete()
        .or(`person_id.eq.${id},related_person_id.eq.${id}`)

      // 3. Delete associations (both directions)
      await supabase
        .from('associations')
        .delete()
        .or(`person_id.eq.${id},associated_person_id.eq.${id}`)

      // 4. Delete document_people
      await supabase
        .from('document_people')
        .delete()
        .eq('person_id', id)

      // 5. Delete location_residents
      await supabase
        .from('location_residents')
        .delete()
        .eq('person_id', id)

      // 6. Delete research_questions
      await supabase
        .from('research_questions')
        .delete()
        .eq('person_id', id)

      // Finally, delete the person
      const { error } = await supabase
        .from('people')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Navigate back to people list
      navigate('/people')
    } catch (err) {
      console.error('Error deleting person:', err)
      alert('Failed to delete person. ' + err.message)
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-faded-ink">Loading...</p>
      </div>
    )
  }

  if (!person) {
    return (
      <div className="text-center py-12">
        <p className="text-faded-ink">Person not found.</p>
        <Link to="/people" className="btn-secondary mt-4 inline-block">
          Back to People
        </Link>
      </div>
    )
  }

  const fullName = [
    person.title,
    person.given_name,
    person.surname,
    person.suffix
  ].filter(Boolean).join(' ')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link to="/people" className="text-faded-ink hover:text-ink flex items-center gap-1 mb-2">
            <ArrowLeft size={16} />
            Back to People
          </Link>
          <div className="flex items-center gap-3">
            <ConfidenceIndicator level={person.confidence?.toLowerCase()} size="lg" />
            <h1>{fullName}</h1>
          </div>
          {person.designation && (
            <p className="text-lg text-faded-ink mt-1">"{person.designation}"</p>
          )}
          <p className="person-id mt-2">{person.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchData()}
            className="btn-secondary flex items-center gap-2"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => setShowEditPerson(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => setShowMergeModal(true)}
            className="btn-secondary flex items-center gap-2"
            title="Merge with another profile"
          >
            <Merge size={16} />
            Merge
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-secondary flex items-center gap-2 text-red-600 hover:bg-red-50 hover:border-red-300"
            title="Delete person"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* View Toggle Tabs */}
      <div className="flex border-b border-sepia/20">
        <button
          onClick={() => setActiveView('details')}
          className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeView === 'details'
              ? 'border-accent text-accent'
              : 'border-transparent text-faded-ink hover:text-ink'
          }`}
        >
          <ClipboardList size={16} />
          Research Details
        </button>
        <button
          onClick={() => setActiveView('bio')}
          className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeView === 'bio'
              ? 'border-accent text-accent'
              : 'border-transparent text-faded-ink hover:text-ink'
          }`}
        >
          <BookOpen size={16} />
          Biography Editor
          {person.bio_status && person.bio_status !== 'no_bio' && (
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              person.bio_status === 'final' ? 'bg-green-100 text-green-800' :
              person.bio_status === 'review' ? 'bg-purple-100 text-purple-800' :
              person.bio_status === 'draft' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {person.bio_status}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveView('events')}
          className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeView === 'events'
              ? 'border-accent text-accent'
              : 'border-transparent text-faded-ink hover:text-ink'
          }`}
        >
          <Calendar size={16} />
          Events
          {events.length > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-sepia/20">
              {events.length}
            </span>
          )}
        </button>
      </div>

      {/* Bio Editor View */}
      {activeView === 'bio' && (
        <div className="space-y-6">
          <FactSheetGenerator
            person={person}
            documents={documents}
            relationships={relationships}
            associations={associations}
            researchQuestions={researchQuestions}
          />
          <BioEditor
            person={person}
            documents={documents}
            relationships={relationships}
            onSave={(updatedPerson) => setPerson(updatedPerson)}
          />
        </div>
      )}

      {/* Events View */}
      {activeView === 'events' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg flex items-center gap-2">
                <Calendar size={18} />
                Historical Events
              </h2>
              <div className="text-sm text-faded-ink">
                {events.length} event{events.length !== 1 ? 's' : ''} found
              </div>
            </div>

            {/* Event counts by status */}
            {events.length > 0 && (
              <div className="flex gap-4 mb-4 text-sm">
                <span className="text-green-600">
                  {events.filter(e => e.participant_status === 'confirmed').length} confirmed
                </span>
                <span className="text-blue-600">
                  {events.filter(e => e.participant_status === 'probable').length} probable
                </span>
                <span className="text-yellow-600">
                  {events.filter(e => e.participant_status === 'possible').length} possible
                </span>
              </div>
            )}

            {events.length > 0 ? (
              <EventList
                events={events}
                showFilters={events.length > 5}
                showActions={false}
                emptyMessage="No events associated with this person."
              />
            ) : (
              <p className="text-faded-ink">
                No events have been associated with this person yet.
                Events are extracted from documents during processing.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Details View */}
      {activeView === 'details' && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vital Facts */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg flex items-center gap-2">
                <Users size={18} />
                Vital Facts
              </h2>
              {!editingVitalFacts && (
                <button
                  onClick={() => setEditingVitalFacts(true)}
                  className="btn-secondary text-sm flex items-center gap-1"
                >
                  <Edit size={14} />
                  Edit
                </button>
              )}
            </div>

            {editingVitalFacts ? (
              <VitalFactsEditor
                person={person}
                onSave={handleVitalFactsSave}
                onCancel={() => setEditingVitalFacts(false)}
              />
            ) : (
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="label">Birth</dt>
                  <dd>
                    {person.birth_year
                      ? `${person.birth_year_type === 'e' ? 'c. ' : ''}${person.birth_year}`
                      : 'Unknown'}
                    {person.birthplace_code && ` • ${person.birthplace_code}`}
                    {person.birthplace_detail && (
                      <span className="text-faded-ink"> ({person.birthplace_detail})</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="label">Death</dt>
                  <dd>
                    {person.death_year
                      ? `${person.death_year_type === 'e' ? 'c. ' : ''}${person.death_year}`
                      : 'Unknown'}
                    {person.death_place_code && ` • ${person.death_place_code}`}
                  </dd>
                </div>
                {person.occupation && (
                  <div>
                    <dt className="label">Occupation</dt>
                    <dd>{person.occupation}</dd>
                  </div>
                )}
                {person.religion && (
                  <div>
                    <dt className="label">Religion</dt>
                    <dd>{person.religion}</dd>
                  </div>
                )}
                {person.dna_group && (
                  <div>
                    <dt className="label">DNA Group</dt>
                    <dd>
                      <span className="px-2 py-1 bg-sepia/10 rounded text-sm">
                        {person.dna_group}
                      </span>
                      {person.dna_status && (
                        <span className="text-faded-ink ml-2">({person.dna_status})</span>
                      )}
                    </dd>
                  </div>
                )}
                {person.first_documented_date && (
                  <div>
                    <dt className="label">First Documented</dt>
                    <dd>{person.first_documented_date}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>

          {/* Biography */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg flex items-center gap-2">
                <FileText size={18} />
                Biography
              </h2>
              {!editingBio && (
                <button
                  onClick={handleBioEdit}
                  className="btn-secondary text-sm flex items-center gap-1"
                >
                  <Edit size={14} />
                  {person.bio ? 'Edit' : 'Add'}
                </button>
              )}
            </div>

            {editingBio ? (
              <div className="space-y-4">
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="input-field w-full h-64 resize-y"
                  placeholder="Enter biography text..."
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEditingBio(false)}
                    className="btn-secondary"
                    disabled={savingBio}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBioSave}
                    className="btn-primary"
                    disabled={savingBio}
                  >
                    {savingBio ? 'Saving...' : 'Save Biography'}
                  </button>
                </div>
              </div>
            ) : person.bio ? (
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{person.bio}</p>
              </div>
            ) : (
              <p className="text-faded-ink">No biography written yet.</p>
            )}
          </div>

          {/* Locations with Migration Map */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg flex items-center gap-2">
                <MapPin size={18} />
                Locations & Migration
              </h2>
              <button
                onClick={() => setShowAddLocation(true)}
                className="btn-secondary text-sm flex items-center gap-1"
              >
                <Plus size={14} />
                Add Location
              </button>
            </div>

            {/* Migration Map Visualization */}
            {locations.length > 0 && (
              <div className="mb-6">
                <MigrationMap locations={locations} personName={fullName} />
              </div>
            )}

            {/* Locations List */}
            {locations.length > 0 ? (
              <div className="border-t border-sepia/10 pt-4 mt-4">
                <h3 className="text-sm font-medium text-faded-ink mb-3">All Documented Locations</h3>
                <ul className="space-y-3">
                  {locations.map(loc => (
                    <li key={loc.id} className="p-3 rounded bg-parchment/50 hover:bg-parchment">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link
                            to={`/locations/${loc.location?.slug}`}
                            className="font-medium text-sepia hover:underline"
                          >
                            {loc.location?.name}
                            {loc.location?.parent_name && (
                              <span className="text-faded-ink font-normal">, {loc.location.parent_name}</span>
                            )}
                          </Link>
                          <div className="flex items-center gap-2 mt-1 text-sm">
                            {loc.residence_type && (
                              <span className="capitalize px-2 py-0.5 bg-sepia/10 rounded text-xs">
                                {loc.residence_type}
                              </span>
                            )}
                            {(loc.date_first || loc.date_last) && (
                              <span className="text-faded-ink">
                                {loc.date_first || '?'} - {loc.date_last || 'present'}
                              </span>
                            )}
                            {loc.location?.latitude && (
                              <span className="text-green-600 text-xs flex items-center gap-1">
                                <Navigation size={10} />
                                mapped
                              </span>
                            )}
                          </div>
                          {/* Map Controls */}
                          <LocationMapControls
                            locationResident={loc}
                            onUpdate={fetchData}
                          />
                        </div>
                        <button
                          onClick={() => handleDeleteLocation(loc.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove location"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {loc.evidence && (
                        <p className="text-sm text-faded-ink mt-2">{loc.evidence}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-faded-ink">No locations documented.</p>
            )}
          </div>

          {/* Family Relationships - Organized by Category */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg flex items-center gap-2">
                <Users size={18} />
                Family Relationships
              </h2>
              <button
                onClick={() => setShowAddRelationship(true)}
                className="btn-secondary text-sm flex items-center gap-1"
              >
                <Plus size={14} />
                Add
              </button>
            </div>
            {relationships.length > 0 ? (
              <div className="space-y-4">
                {/* Parents */}
                {(() => {
                  const parents = relationships.filter(r => r.relationship_type === 'father' || r.relationship_type === 'mother')
                  if (parents.length === 0) return null
                  return (
                    <div>
                      <h3 className="text-sm font-medium text-faded-ink mb-2 uppercase tracking-wide">Parents</h3>
                      <ul className="space-y-2">
                        {parents.map(rel => (
                          <li key={rel.id} className="flex items-start gap-3 p-2 rounded hover:bg-parchment">
                            <ConfidenceIndicator level={rel.relationship_status || rel.confidence} />
                            <div className="flex-1">
                              <div>
                                <span className="capitalize text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded mr-2">{rel.relationship_type}</span>
                                {rel.related_person && (
                                  <Link to={`/people/${rel.related_person.id}`} className="text-sepia hover:underline font-medium">
                                    {rel.related_person.given_name} {rel.related_person.surname}
                                    {rel.related_person.birth_year && ` (b. ${rel.related_person.birth_year})`}
                                  </Link>
                                )}
                              </div>
                              {rel.evidence && <p className="text-sm text-faded-ink mt-1">{rel.evidence}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })()}

                {/* Spouses */}
                {(() => {
                  const spouses = relationships.filter(r => r.relationship_type === 'spouse')
                  if (spouses.length === 0) return null
                  return (
                    <div>
                      <h3 className="text-sm font-medium text-faded-ink mb-2 uppercase tracking-wide">Spouse{spouses.length > 1 ? 's' : ''}</h3>
                      <ul className="space-y-2">
                        {spouses.map(rel => (
                          <li key={rel.id} className="flex items-start gap-3 p-2 rounded hover:bg-parchment">
                            <ConfidenceIndicator level={rel.relationship_status || rel.confidence} />
                            <div className="flex-1">
                              <div>
                                {rel.related_person && (
                                  <Link to={`/people/${rel.related_person.id}`} className="text-sepia hover:underline font-medium">
                                    {rel.related_person.given_name} {rel.related_person.surname}
                                    {rel.related_person.birth_year && ` (b. ${rel.related_person.birth_year})`}
                                  </Link>
                                )}
                              </div>
                              {rel.marriage_date && (
                                <p className="text-sm text-faded-ink mt-1">
                                  Married: {rel.marriage_date}
                                  {rel.marriage_place && ` at ${rel.marriage_place}`}
                                </p>
                              )}
                              {rel.evidence && <p className="text-sm text-faded-ink mt-1">{rel.evidence}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })()}

                {/* Siblings */}
                {(() => {
                  const siblings = relationships.filter(r => r.relationship_type === 'sibling')
                  if (siblings.length === 0) return null
                  return (
                    <div>
                      <h3 className="text-sm font-medium text-faded-ink mb-2 uppercase tracking-wide">Siblings</h3>
                      <ul className="space-y-2">
                        {siblings.map(rel => (
                          <li key={rel.id} className="flex items-start gap-3 p-2 rounded hover:bg-parchment">
                            <ConfidenceIndicator level={rel.relationship_status || rel.confidence} />
                            <div className="flex-1">
                              {rel.related_person && (
                                <Link to={`/people/${rel.related_person.id}`} className="text-sepia hover:underline font-medium">
                                  {rel.related_person.given_name} {rel.related_person.surname}
                                  {rel.related_person.birth_year && ` (b. ${rel.related_person.birth_year})`}
                                </Link>
                              )}
                              {rel.evidence && <p className="text-sm text-faded-ink mt-1">{rel.evidence}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })()}

                {/* Children */}
                {(() => {
                  const children = relationships.filter(r => r.relationship_type === 'child')
                  if (children.length === 0) return null
                  return (
                    <div>
                      <h3 className="text-sm font-medium text-faded-ink mb-2 uppercase tracking-wide">Children</h3>
                      <ul className="space-y-2">
                        {children
                          .sort((a, b) => (a.related_person?.birth_year || 0) - (b.related_person?.birth_year || 0))
                          .map(rel => (
                          <li key={rel.id} className="flex items-start gap-3 p-2 rounded hover:bg-parchment">
                            <ConfidenceIndicator level={rel.relationship_status || rel.confidence} />
                            <div className="flex-1">
                              {rel.related_person && (
                                <Link to={`/people/${rel.related_person.id}`} className="text-sepia hover:underline font-medium">
                                  {rel.related_person.given_name} {rel.related_person.surname}
                                  {rel.related_person.birth_year && ` (b. ${rel.related_person.birth_year})`}
                                </Link>
                              )}
                              {rel.evidence && <p className="text-sm text-faded-ink mt-1">{rel.evidence}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })()}

                {/* Other relationships */}
                {(() => {
                  const other = relationships.filter(r =>
                    !['father', 'mother', 'spouse', 'sibling', 'child'].includes(r.relationship_type)
                  )
                  if (other.length === 0) return null
                  return (
                    <div>
                      <h3 className="text-sm font-medium text-faded-ink mb-2 uppercase tracking-wide">Other</h3>
                      <ul className="space-y-2">
                        {other.map(rel => (
                          <li key={rel.id} className="flex items-start gap-3 p-2 rounded hover:bg-parchment">
                            <ConfidenceIndicator level={rel.relationship_status || rel.confidence} />
                            <div className="flex-1">
                              <div>
                                <span className="capitalize text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded mr-2">{rel.relationship_type}</span>
                                {rel.related_person && (
                                  <Link to={`/people/${rel.related_person.id}`} className="text-sepia hover:underline font-medium">
                                    {rel.related_person.given_name} {rel.related_person.surname}
                                    {rel.related_person.birth_year && ` (b. ${rel.related_person.birth_year})`}
                                  </Link>
                                )}
                              </div>
                              {rel.evidence && <p className="text-sm text-faded-ink mt-1">{rel.evidence}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })()}
              </div>
            ) : (
              <p className="text-faded-ink">No family relationships documented.</p>
            )}
          </div>

          {/* Associations */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg flex items-center gap-2">
                <MapPin size={18} />
                Associations
              </h2>
              <button
                onClick={() => setShowAddAssociation(true)}
                className="btn-secondary text-sm flex items-center gap-1"
              >
                <Plus size={14} />
                Add
              </button>
            </div>
            {associations.length > 0 ? (
              <ul className="space-y-3">
                {associations.map(assoc => (
                  <li key={assoc.id} className="flex items-start gap-3 p-2 rounded hover:bg-parchment">
                    <ConfidenceIndicator level={assoc.confidence || 'confirmed'} />
                    <div className="flex-1">
                      <div>
                        <span className="capitalize font-medium">
                          {assoc.association_type.replace(/_/g, ' ')}
                        </span>
                        {assoc.associated_person && (
                          <Link
                            to={`/people/${assoc.associated_person.id}`}
                            className="ml-2 text-sepia hover:underline"
                          >
                            {assoc.associated_person.given_name} {assoc.associated_person.surname}
                          </Link>
                        )}
                        {assoc.date && (
                          <span className="text-faded-ink ml-2">({assoc.date})</span>
                        )}
                      </div>
                      {assoc.context && (
                        <p className="text-sm text-faded-ink mt-1">{assoc.context}</p>
                      )}
                      {assoc.location && (
                        <p className="text-sm text-faded-ink">📍 {assoc.location}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-faded-ink">No associations documented.</p>
            )}
          </div>

          {/* Network Visualization */}
          <div className="card">
            <h2 className="text-lg mb-4 flex items-center gap-2">
              <Users size={18} />
              Relationship Network
            </h2>
            <NetworkGraph
              personId={person.id}
              personName={fullName}
              relationships={relationships}
              associations={associations}
            />
          </div>

          {/* Documents */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg flex items-center gap-2">
                <FileText size={18} />
                Documents
              </h2>
              <button
                onClick={() => setShowLinkDocument(true)}
                className="btn-secondary text-sm flex items-center gap-1"
              >
                <LinkIcon size={14} />
                Link
              </button>
            </div>
            {documents.length > 0 ? (
              <ul className="space-y-3">
                {documents.map(docLink => (
                  <li key={docLink.id} className="flex items-start gap-3 p-2 rounded hover:bg-parchment">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase px-1.5 py-0.5 bg-sepia/10 rounded text-sepia">
                          {docLink.role?.replace(/_/g, ' ')}
                        </span>
                        {docLink.document?.date && (
                          <span className="text-sm text-faded-ink">{docLink.document.date}</span>
                        )}
                      </div>
                      {docLink.document && (
                        <Link
                          to={`/documents/${docLink.document.id}`}
                          className="font-medium text-sepia hover:underline block mt-1"
                        >
                          {docLink.document.title || 'Untitled Document'}
                        </Link>
                      )}
                      {docLink.document?.county && (
                        <p className="text-sm text-faded-ink">
                          {docLink.document.county}, {docLink.document.state}
                        </p>
                      )}
                      {docLink.acres && (
                        <p className="text-sm text-faded-ink">{docLink.acres} acres</p>
                      )}
                      {docLink.notes && (
                        <p className="text-sm text-faded-ink mt-1">{docLink.notes}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-faded-ink">No documents linked to this person.</p>
            )}
          </div>

          {/* Research Questions */}
          <div className="card">
            <ResearchQuestionsSection personId={person.id} />
          </div>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Confidence Summary */}
          <div className="card">
            <h3 className="font-medium mb-3">Research Status</h3>
            <div className="flex items-center gap-2 mb-3">
              <ConfidenceIndicator level={person.confidence?.toLowerCase()} showLabel size="lg" />
            </div>
            <p className="text-sm text-faded-ink">
              {person.confidence === 'CONFIRMED' && 'This person is well-documented with primary sources.'}
              {person.confidence === 'PROBABLE' && 'Strong evidence supports this identification.'}
              {person.confidence === 'POSSIBLE' && 'Some evidence exists but needs verification.'}
              {person.confidence === 'UNCERTAIN' && 'Limited evidence; needs more research.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="card">
            <h3 className="font-medium mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowProcessDocument(true)}
                className="btn-primary w-full text-left flex items-center gap-2 bg-accent hover:bg-accent/90"
              >
                <Upload size={14} />
                Process Document (AI)
              </button>
              <hr className="border-sepia/20 my-2" />
              <button
                onClick={() => setShowAddRelationship(true)}
                className="btn-secondary w-full text-left flex items-center gap-2"
              >
                <Plus size={14} />
                Add Family Relationship
              </button>
              <button
                onClick={() => setShowAddAssociation(true)}
                className="btn-secondary w-full text-left flex items-center gap-2"
              >
                <Plus size={14} />
                Add Association
              </button>
              <button
                onClick={() => setShowAddLocation(true)}
                className="btn-secondary w-full text-left flex items-center gap-2"
              >
                <MapPin size={14} />
                Add Location
              </button>
              <button
                onClick={() => setShowLinkDocument(true)}
                className="btn-secondary w-full text-left flex items-center gap-2"
              >
                <LinkIcon size={14} />
                Link Document
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="card">
            <h3 className="font-medium mb-3">Record Statistics</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-faded-ink">Locations</dt>
                <dd>{locations.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-faded-ink">Family Relationships</dt>
                <dd>{relationships.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-faded-ink">Associations</dt>
                <dd>{associations.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-faded-ink">Documents</dt>
                <dd>{documents.length}</dd>
              </div>
            </dl>
          </div>

          {/* DNA Connections */}
          <div className="card">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Dna size={16} className="text-purple-600" />
              DNA Connections
            </h3>
            {dnaMatches.length > 0 ? (
              <ul className="space-y-3">
                {dnaMatches.map(match => (
                  <li key={match.id} className="p-2 rounded bg-parchment/50 hover:bg-parchment">
                    <Link
                      to={`/dna/matches/${match.id}`}
                      className="font-medium text-sepia hover:underline block"
                    >
                      {match.match_name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-sm text-faded-ink">
                      <span className="font-mono">{match.shared_cm?.toLocaleString() || '—'} cM</span>
                      {match.testing_company && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{match.testing_company}</span>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-faded-ink">
                No DNA matches confirmed through this ancestor.
              </p>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Modals */}
      {showEditPerson && (
        <PersonForm
          person={person}
          isModal
          onSave={handlePersonSave}
          onCancel={() => setShowEditPerson(false)}
        />
      )}

      {showAddRelationship && (
        <RelationshipForm
          personId={person.id}
          personName={fullName}
          isModal
          onSave={handleRelationshipSave}
          onCancel={() => setShowAddRelationship(false)}
        />
      )}

      {showAddAssociation && (
        <AssociationForm
          personId={person.id}
          personName={fullName}
          isModal
          onSave={handleAssociationSave}
          onCancel={() => setShowAddAssociation(false)}
        />
      )}

      {showLinkDocument && (
        <DocumentLinkForm
          personId={person.id}
          personName={fullName}
          isModal
          onSave={handleDocumentLinkSave}
          onCancel={() => setShowLinkDocument(false)}
        />
      )}

      {showProcessDocument && (
        <DocumentProcessor
          personId={person.id}
          personName={fullName}
          onComplete={() => {
            setShowProcessDocument(false)
            fetchData()
          }}
          onCancel={() => setShowProcessDocument(false)}
        />
      )}

      {showAddLocation && (
        <LocationResidentForm
          personId={person.id}
          personName={fullName}
          isModal
          onSave={handleLocationSave}
          onCancel={() => setShowAddLocation(false)}
        />
      )}

      {/* Merge Profiles Modal */}
      <MergeProfilesModal
        isOpen={showMergeModal}
        onClose={() => setShowMergeModal(false)}
        primaryPerson={person}
        onMergeComplete={(primaryId) => {
          setShowMergeModal(false)
          fetchData()
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Person"
        message={`Are you sure you want to delete "${fullName}"? This will also remove all their relationships, associations, document links, and event participations. This action cannot be undone.`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDeletePerson}
        onCancel={() => setShowDeleteConfirm(false)}
        variant="danger"
      />
    </div>
  )
}

export default PersonDetail
