import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Users, MapPin, Calendar, Dna, FileText, ArrowLeft,
  ChevronRight, Edit2, Check, X
} from 'lucide-react'
import { supabase } from '../lib/supabase'

const GROUP_TYPE_LABELS = {
  nuclear: 'Nuclear Family',
  extended: 'Extended Family',
  cluster: 'Family Cluster',
  unproven: 'Unproven Connection'
}

const ROLE_LABELS = {
  anchor: 'Anchor',
  spouse: 'Spouse',
  child: 'Child',
  parent: 'Parent',
  sibling: 'Sibling',
  grandchild: 'Grandchild',
  in_law: 'In-law',
  associated: 'Associated'
}

// Helper to get a better generation label
function getGenerationLabel(gen, members) {
  // Check if this generation has only in-laws
  const genMembers = members.filter(m => (m.generation ?? 0) === gen)
  const allInLaws = genMembers.every(m => m.role === 'in_law')

  if (allInLaws && gen === -1) {
    return "In-Laws (Spouse's Parents)"
  }

  if (gen === 0) return 'Generation 0 (Anchor)'
  if (gen === 1) return 'Generation +1 (Children)'
  if (gen === 2) return 'Generation +2 (Grandchildren)'
  if (gen === -1) return 'Generation -1 (Parents)'
  if (gen === -2) return 'Generation -2 (Grandparents)'
  return `Generation ${gen > 0 ? '+' : ''}${gen}`
}

const CONFIDENCE_COLORS = {
  confirmed: 'bg-green-100 text-green-800',
  likely: 'bg-blue-100 text-blue-800',
  possible: 'bg-amber-100 text-amber-800'
}

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  active: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800'
}

function FamilyGroupDetail() {
  const { slug } = useParams()
  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [childGroups, setChildGroups] = useState([])
  const [parentGroup, setParentGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingNarrative, setEditingNarrative] = useState(false)
  const [narrativeText, setNarrativeText] = useState('')

  useEffect(() => {
    async function fetchGroup() {
      setLoading(true)
      setError(null)

      try {
        // Fetch group by slug
        const { data: groupData, error: groupError } = await supabase
          .from('family_groups')
          .select(`
            *,
            anchor:people!family_groups_anchor_person_id_fkey(id, given_name, surname, birth_year, death_year),
            location:locations!family_groups_primary_location_id_fkey(id, name, slug)
          `)
          .eq('slug', slug)
          .single()

        if (groupError) throw groupError
        setGroup(groupData)
        setNarrativeText(groupData.narrative || '')

        // Fetch parent group if exists
        if (groupData.parent_group_id) {
          const { data: parentData } = await supabase
            .from('family_groups')
            .select('id, name, slug')
            .eq('id', groupData.parent_group_id)
            .single()
          setParentGroup(parentData)
        }

        // Fetch members
        const { data: membersData } = await supabase
          .from('family_group_members')
          .select(`
            *,
            person:people(id, given_name, surname, birth_year, death_year, bio_status)
          `)
          .eq('family_group_id', groupData.id)
          .order('generation')
          .order('role')

        setMembers(membersData || [])

        // Fetch child groups
        const { data: childData } = await supabase
          .from('family_groups')
          .select('id, name, slug, group_type, confidence')
          .eq('parent_group_id', groupData.id)
          .order('name')

        setChildGroups(childData || [])

      } catch (err) {
        setError(err.message)
      }

      setLoading(false)
    }

    if (slug) {
      fetchGroup()
    }
  }, [slug])

  const saveNarrative = async () => {
    const { error } = await supabase
      .from('family_groups')
      .update({ narrative: narrativeText })
      .eq('id', group.id)

    if (!error) {
      setGroup({ ...group, narrative: narrativeText })
      setEditingNarrative(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-faded-ink">
        Loading family group...
      </div>
    )
  }

  if (error || !group) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">Family group not found</p>
        <Link to="/families" className="text-accent hover:underline">
          Back to Family Groups
        </Link>
      </div>
    )
  }

  const confidenceClass = CONFIDENCE_COLORS[group.confidence] || 'bg-gray-100 text-gray-600'
  const statusClass = STATUS_COLORS[group.status] || 'bg-gray-100 text-gray-600'

  // Separate associated members from core family members
  const associatedMembers = members.filter(m => m.role === 'associated')
  const coreMembers = members.filter(m => m.role !== 'associated')

  // Group core members by generation
  const membersByGeneration = coreMembers.reduce((acc, m) => {
    const gen = m.generation ?? 0
    if (!acc[gen]) acc[gen] = []
    acc[gen].push(m)
    return acc
  }, {})

  const generations = Object.keys(membersByGeneration).map(Number).sort((a, b) => a - b)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-faded-ink">
        <Link to="/families" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} />
          Family Groups
        </Link>
        {parentGroup && (
          <>
            <ChevronRight size={14} />
            <Link to={`/families/${parentGroup.slug}`} className="hover:text-accent">
              {parentGroup.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="text-ink">{group.name}</span>
      </div>

      {/* Header */}
      <div className="card">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-accent/10">
            <Users size={24} className="text-accent" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-display">{group.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-sm text-faded-ink">
                {GROUP_TYPE_LABELS[group.group_type]}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${confidenceClass}`}>
                {group.confidence}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusClass}`}>
                {group.status}
              </span>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-sepia/10 text-sm">
          {group.anchor && (
            <div>
              <span className="text-faded-ink">Anchor: </span>
              <Link to={`/people/${group.anchor.id}`} className="text-accent hover:underline">
                {group.anchor.given_name} {group.anchor.surname}
              </Link>
            </div>
          )}
          {group.location && (
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-faded-ink" />
              <Link to={`/locations/${group.location.slug}`} className="text-accent hover:underline">
                {group.location.name}
              </Link>
            </div>
          )}
          {(group.date_start || group.date_end) && (
            <div className="flex items-center gap-1">
              <Calendar size={14} className="text-faded-ink" />
              <span>{group.date_start || '?'} - {group.date_end || '?'}</span>
            </div>
          )}
          {group.dna_group && (
            <div className="flex items-center gap-1">
              <Dna size={14} className="text-faded-ink" />
              <span>{group.dna_group}</span>
            </div>
          )}
        </div>

        {/* Summary */}
        {group.summary && (
          <div className="mt-4 pt-4 border-t border-sepia/10">
            <p className="text-ink">{group.summary}</p>
          </div>
        )}

        {/* Connection evidence (if child of another group) */}
        {group.connection_evidence && (
          <div className="mt-4 pt-4 border-t border-sepia/10 text-sm">
            <p className="text-faded-ink">
              <strong>Connection to parent group:</strong> {group.connection_evidence}
              {group.connection_confidence && (
                <span className={`ml-2 px-2 py-0.5 rounded text-xs ${CONFIDENCE_COLORS[group.connection_confidence]}`}>
                  {group.connection_confidence}
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Members */}
        <div className="card">
          <h2 className="text-lg font-display flex items-center gap-2 mb-4">
            <Users size={18} className="text-accent" />
            Family Members
            <span className="ml-auto text-sm font-normal text-faded-ink">
              {coreMembers.length}
            </span>
          </h2>

          {coreMembers.length === 0 ? (
            <p className="text-faded-ink text-sm">No members added yet.</p>
          ) : (
            <div className="space-y-4">
              {generations.map(gen => (
                <div key={gen}>
                  <h3 className="text-xs uppercase text-faded-ink font-medium mb-2">
                    {getGenerationLabel(gen, members)}
                  </h3>
                  <div className="space-y-2">
                    {membersByGeneration[gen].map(member => {
                      // Check notes for "likely" indicator
                      const isLikely = member.notes?.toLowerCase().includes('likely')
                      return (
                        <div
                          key={member.id}
                          className="p-2 rounded hover:bg-sepia/5"
                        >
                          <div className="flex items-center justify-between">
                            <Link
                              to={`/people/${member.person_id}`}
                              className="font-medium hover:text-accent"
                            >
                              {member.person ? `${member.person.given_name} ${member.person.surname}` : member.person_id}
                              {member.person?.birth_year && (
                                <span className="text-sm text-faded-ink ml-2">
                                  ({member.person.birth_year}-{member.person.death_year || '?'})
                                </span>
                              )}
                            </Link>
                            <div className="flex items-center gap-2">
                              {isLikely && (
                                <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                                  likely
                                </span>
                              )}
                              <span className="text-xs text-faded-ink px-2 py-1 bg-sepia/5 rounded">
                                {ROLE_LABELS[member.role]}
                              </span>
                            </div>
                          </div>
                          {member.notes && (
                            <p className="text-xs text-faded-ink mt-1">{member.notes}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Associated Individuals and Families */}
        {associatedMembers.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-display flex items-center gap-2 mb-4">
              <Users size={18} className="text-accent" />
              Associated Individuals
              <span className="ml-auto text-sm font-normal text-faded-ink">
                {associatedMembers.length}
              </span>
            </h2>
            <div className="space-y-2">
              {associatedMembers.map(member => {
                const isLikely = member.notes?.toLowerCase().includes('likely')
                return (
                  <div
                    key={member.id}
                    className="p-2 rounded hover:bg-sepia/5"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/people/${member.person_id}`}
                        className="font-medium hover:text-accent"
                      >
                        {member.person ? `${member.person.given_name} ${member.person.surname}` : member.person_id}
                        {member.person?.birth_year && (
                          <span className="text-sm text-faded-ink ml-2">
                            ({member.person.birth_year}-{member.person.death_year || '?'})
                          </span>
                        )}
                      </Link>
                      {isLikely && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                          likely
                        </span>
                      )}
                    </div>
                    {member.notes && (
                      <p className="text-xs text-faded-ink mt-1">{member.notes}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Child groups */}
        {childGroups.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-display flex items-center gap-2 mb-4">
              <Users size={18} className="text-accent" />
              Sub-groups
              <span className="ml-auto text-sm font-normal text-faded-ink">
                {childGroups.length}
              </span>
            </h2>
            <div className="space-y-2">
              {childGroups.map(child => (
                <Link
                  key={child.id}
                  to={`/families/${child.slug}`}
                  className="flex items-center justify-between p-2 rounded hover:bg-sepia/5"
                >
                  <span className="font-medium">{child.name}</span>
                  <span className={`text-xs px-2 py-1 rounded ${CONFIDENCE_COLORS[child.confidence]}`}>
                    {child.confidence}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Narrative */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display flex items-center gap-2">
            <FileText size={18} className="text-accent" />
            Family Narrative
          </h2>
          {!editingNarrative ? (
            <button
              onClick={() => setEditingNarrative(true)}
              className="flex items-center gap-1 text-sm text-accent hover:underline"
            >
              <Edit2 size={14} />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={saveNarrative}
                className="flex items-center gap-1 text-sm text-green-600 hover:underline"
              >
                <Check size={14} />
                Save
              </button>
              <button
                onClick={() => {
                  setNarrativeText(group.narrative || '')
                  setEditingNarrative(false)
                }}
                className="flex items-center gap-1 text-sm text-red-600 hover:underline"
              >
                <X size={14} />
                Cancel
              </button>
            </div>
          )}
        </div>

        {editingNarrative ? (
          <textarea
            value={narrativeText}
            onChange={(e) => setNarrativeText(e.target.value)}
            className="w-full h-64 p-4 border border-sepia/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 font-serif"
            placeholder="Write the family narrative here..."
          />
        ) : group.narrative ? (
          <div className="prose prose-sepia max-w-none">
            <p className="whitespace-pre-wrap">{group.narrative}</p>
          </div>
        ) : (
          <p className="text-faded-ink text-sm italic">
            No narrative written yet. Click Edit to start writing.
          </p>
        )}
      </div>
    </div>
  )
}

export default FamilyGroupDetail
