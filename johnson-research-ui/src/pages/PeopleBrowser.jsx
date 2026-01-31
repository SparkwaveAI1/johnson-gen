import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useWorkspace } from '../contexts/WorkspaceContext'
import ConfidenceIndicator from '../components/common/ConfidenceIndicator'
import ConfirmDialog from '../components/common/ConfirmDialog'
import PersonForm from '../components/people/PersonForm'

const PAGE_SIZE = 20

function PeopleBrowser() {
  const { workspaceId } = useWorkspace()
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [surnameFilter, setSurnameFilter] = useState('')
  const [confidenceFilter, setConfidenceFilter] = useState('')
  const [dnaGroupFilter, setDnaGroupFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Available filter options
  const [surnames, setSurnames] = useState([])
  const [dnaGroups, setDnaGroups] = useState([])

  // Modal state
  const [showAddPerson, setShowAddPerson] = useState(false)

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    // Fetch filter options when workspace changes
    async function fetchFilterOptions() {
      if (!workspaceId) return
      
      const [{ data: surnameData }, { data: dnaData }] = await Promise.all([
        supabase.from('people').select('surname').eq('workspace_id', workspaceId).order('surname'),
        supabase.from('people').select('dna_group').eq('workspace_id', workspaceId).not('dna_group', 'is', null)
      ])

      const uniqueSurnames = [...new Set(surnameData?.map(p => p.surname) || [])]
      const uniqueDnaGroups = [...new Set(dnaData?.map(p => p.dna_group) || [])]

      setSurnames(uniqueSurnames)
      setDnaGroups(uniqueDnaGroups)
    }
    fetchFilterOptions()
  }, [workspaceId])

  useEffect(() => {
    async function fetchPeople() {
      if (!workspaceId) return
      setLoading(true)

      let query = supabase
        .from('people')
        .select('id, given_name, surname, suffix, title, birth_year, birth_year_type, death_year, birthplace_code, death_place_code, confidence, dna_group, designation', { count: 'exact' })
        .eq('workspace_id', workspaceId)

      // Apply filters
      if (searchQuery) {
        query = query.or(`given_name.ilike.%${searchQuery}%,surname.ilike.%${searchQuery}%,id.ilike.%${searchQuery}%`)
      }
      if (surnameFilter) {
        query = query.eq('surname', surnameFilter)
      }
      if (confidenceFilter) {
        query = query.eq('confidence', confidenceFilter)
      }
      if (dnaGroupFilter) {
        query = query.eq('dna_group', dnaGroupFilter)
      }

      // Order and paginate
      query = query
        .order('surname')
        .order('birth_year', { nullsFirst: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

      const { data, count, error } = await query

      if (error) {
        console.error('Error fetching people:', error)
      } else {
        setPeople(data || [])
        setTotalCount(count || 0)
      }
      setLoading(false)
    }

    fetchPeople()
  }, [workspaceId, page, searchQuery, surnameFilter, confidenceFilter, dnaGroupFilter])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  function formatName(person) {
    const parts = []
    if (person.title) parts.push(person.title)
    if (person.given_name) parts.push(person.given_name)
    parts.push(person.surname)
    if (person.suffix) parts.push(person.suffix)
    return parts.join(' ')
  }

  function formatDates(person) {
    const parts = []
    if (person.birth_year) {
      const prefix = person.birth_year_type === 'e' ? 'c.' : ''
      parts.push(`b. ${prefix}${person.birth_year}`)
    }
    if (person.death_year) {
      parts.push(`d. ${person.death_year}`)
    }
    return parts.join(' – ') || 'Dates unknown'
  }

  const handlePersonSave = (newPerson) => {
    setPeople(prev => [newPerson, ...prev])
    setTotalCount(prev => prev + 1)
    setShowAddPerson(false)
  }

  const handleDeleteClick = (e, person) => {
    e.preventDefault() // Prevent navigation to detail page
    e.stopPropagation()
    setDeleteTarget(person)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    try {
      // Delete related records first (cascading)
      // 1. Delete event_participants
      await supabase
        .from('event_participants')
        .delete()
        .eq('person_id', deleteTarget.id)

      // 2. Delete family_relationships (both directions)
      await supabase
        .from('family_relationships')
        .delete()
        .or(`person_id.eq.${deleteTarget.id},related_person_id.eq.${deleteTarget.id}`)

      // 3. Delete associations (both directions)
      await supabase
        .from('associations')
        .delete()
        .or(`person_id.eq.${deleteTarget.id},associated_person_id.eq.${deleteTarget.id}`)

      // 4. Delete document_people
      await supabase
        .from('document_people')
        .delete()
        .eq('person_id', deleteTarget.id)

      // 5. Delete location_residents
      await supabase
        .from('location_residents')
        .delete()
        .eq('person_id', deleteTarget.id)

      // 6. Delete research_questions
      await supabase
        .from('research_questions')
        .delete()
        .eq('person_id', deleteTarget.id)

      // Finally, delete the person
      const { error } = await supabase
        .from('people')
        .delete()
        .eq('id', deleteTarget.id)

      if (error) throw error

      // Update local state
      setPeople(prev => prev.filter(p => p.id !== deleteTarget.id))
      setTotalCount(prev => prev - 1)
      setDeleteTarget(null)
    } catch (err) {
      console.error('Error deleting person:', err)
      alert('Failed to delete person. ' + err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>People</h1>
          <p className="text-faded-ink mt-1">
            {totalCount} {totalCount === 1 ? 'person' : 'people'} in database
          </p>
        </div>
        <button
          onClick={() => setShowAddPerson(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Add Person
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-faded-ink" size={18} />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0) }}
              className="input pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-sepia/10' : ''}`}
          >
            <Filter size={18} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-sepia/20">
            <div>
              <label className="label">Surname</label>
              <select
                value={surnameFilter}
                onChange={(e) => { setSurnameFilter(e.target.value); setPage(0) }}
                className="input"
              >
                <option value="">All surnames</option>
                {surnames.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Confidence</label>
              <select
                value={confidenceFilter}
                onChange={(e) => { setConfidenceFilter(e.target.value); setPage(0) }}
                className="input"
              >
                <option value="">All levels</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROBABLE">Probable</option>
                <option value="POSSIBLE">Possible</option>
                <option value="UNCERTAIN">Uncertain</option>
              </select>
            </div>
            <div>
              <label className="label">DNA Group</label>
              <select
                value={dnaGroupFilter}
                onChange={(e) => { setDnaGroupFilter(e.target.value); setPage(0) }}
                className="input"
              >
                <option value="">All groups</option>
                {dnaGroups.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-faded-ink">Loading...</p>
        </div>
      ) : people.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-faded-ink">No people found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {people.map(person => (
              <div
                key={person.id}
                className="card flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <Link
                  to={`/people/${person.id}`}
                  className="flex items-center gap-4 flex-1"
                >
                  <ConfidenceIndicator level={person.confidence?.toLowerCase()} />
                  <div>
                    <div className="font-medium">
                      {formatName(person)}
                      {person.designation && (
                        <span className="text-faded-ink font-normal ml-2">
                          "{person.designation}"
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-faded-ink">
                      {formatDates(person)}
                      {person.birthplace_code && ` • ${person.birthplace_code}`}
                      {person.dna_group && (
                        <span className="ml-2 px-2 py-0.5 bg-sepia/10 rounded text-xs">
                          {person.dna_group}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-3">
                  <span className="person-id">{person.id}</span>
                  <button
                    onClick={(e) => handleDeleteClick(e, person)}
                    className="text-red-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-colors"
                    title="Delete person"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn-secondary disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-faded-ink">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="btn-secondary disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Add Person Modal */}
      {showAddPerson && (
        <PersonForm
          isModal
          onSave={handlePersonSave}
          onCancel={() => setShowAddPerson(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Person"
        message={deleteTarget ? `Are you sure you want to delete "${formatName(deleteTarget)}"? This will also remove all their relationships, associations, document links, and event participations. This action cannot be undone.` : ''}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        variant="danger"
      />
    </div>
  )
}

export default PeopleBrowser
