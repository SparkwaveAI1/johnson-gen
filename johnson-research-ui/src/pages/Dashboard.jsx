import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, FileText, BookOpen, GitCompare, HelpCircle, Plus, Upload, Dna } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useWorkspace } from '../contexts/WorkspaceContext'
import PersonForm from '../components/people/PersonForm'
import DocumentForm from '../components/documents/DocumentForm'
import SourceForm from '../components/sources/SourceForm'
import DocumentProcessor from '../components/documents/DocumentProcessor'

function StatCard({ icon: Icon, label, value, link, color }) {
  return (
    <Link to={link} className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        <div>
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-faded-ink">{label}</p>
        </div>
      </div>
    </Link>
  )
}

function Dashboard() {
  const { workspaceId, currentWorkspace } = useWorkspace()
  const [stats, setStats] = useState({
    people: 0,
    documents: 0,
    sources: 0,
    unresolvedIdentities: 0,
    openQuestions: 0,
  })
  const [dnaStats, setDnaStats] = useState({
    matchCount: 0,
    segmentCount: 0,
    mysterySurnameCount: 0,
    topMysterySurname: null,
  })
  const [loading, setLoading] = useState(true)
  const [recentPeople, setRecentPeople] = useState([])

  // Modal states
  const [showAddPerson, setShowAddPerson] = useState(false)
  const [showAddDocument, setShowAddDocument] = useState(false)
  const [showAddSource, setShowAddSource] = useState(false)
  const [showProcessDocument, setShowProcessDocument] = useState(false)

  const fetchStats = async () => {
    if (!workspaceId) return
    try {
      // Fetch counts in parallel (filtered by workspace)
      const [
        { count: peopleCount },
        { count: documentsCount },
        { count: sourcesCount },
        { count: identityCount },
        { count: questionsCount },
        { data: recent },
        // DNA stats
        { count: dnaMatchCount },
        { count: dnaSegmentCount },
        { data: mysterySurnames },
        { data: topSurnameData }
      ] = await Promise.all([
        supabase.from('people').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
        supabase.from('sources').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
        supabase.from('identity_candidates').select('*', { count: 'exact', head: true }).eq('status', 'unresolved'),
        supabase.from('research_questions').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('people').select('id, given_name, surname, birth_year, confidence').eq('workspace_id', workspaceId).order('created_at', { ascending: false }).limit(5),
        // DNA counts
        supabase.from('dna_matches').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
        supabase.from('dna_segments').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
        supabase.from('mystery_surnames').select('*').eq('workspace_id', workspaceId).eq('in_tree', false),
        supabase.from('mystery_surnames').select('surname, total_shared_cm').eq('workspace_id', workspaceId).eq('in_tree', false).order('total_shared_cm', { ascending: false }).limit(1)
      ])

      setStats({
        people: peopleCount || 0,
        documents: documentsCount || 0,
        sources: sourcesCount || 0,
        unresolvedIdentities: identityCount || 0,
        openQuestions: questionsCount || 0,
      })
      setRecentPeople(recent || [])
      setDnaStats({
        matchCount: dnaMatchCount || 0,
        segmentCount: dnaSegmentCount || 0,
        mysterySurnameCount: mysterySurnames?.length || 0,
        topMysterySurname: topSurnameData?.[0] || null,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [workspaceId])

  const handlePersonSave = () => {
    setShowAddPerson(false)
    fetchStats()
  }

  const handleDocumentSave = () => {
    setShowAddDocument(false)
    fetchStats()
  }

  const handleSourceSave = () => {
    setShowAddSource(false)
    fetchStats()
  }

  const handleProcessComplete = () => {
    setShowProcessDocument(false)
    fetchStats()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-faded-ink">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1>Dashboard</h1>
        <p className="text-faded-ink mt-1">Johnson/Johnston Family Research Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          icon={Users}
          label="People"
          value={stats.people}
          link="/people"
          color="bg-sepia"
        />
        <StatCard
          icon={FileText}
          label="Documents"
          value={stats.documents}
          link="/documents"
          color="bg-faded-ink"
        />
        <StatCard
          icon={BookOpen}
          label="Sources"
          value={stats.sources}
          link="/sources"
          color="bg-confidence-confirmed"
        />
        <StatCard
          icon={GitCompare}
          label="Unresolved IDs"
          value={stats.unresolvedIdentities}
          link="/identity"
          color="bg-confidence-likely"
        />
        <StatCard
          icon={HelpCircle}
          label="Open Questions"
          value={stats.openQuestions}
          link="/research"
          color="bg-confidence-possible"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg mb-4">Recently Added People</h2>
          {recentPeople.length > 0 ? (
            <ul className="space-y-2">
              {recentPeople.map(person => (
                <li key={person.id}>
                  <Link
                    to={`/people/${person.id}`}
                    className="flex items-center justify-between p-2 rounded hover:bg-parchment transition-colors"
                  >
                    <div>
                      <span className="font-medium">
                        {person.given_name} {person.surname}
                      </span>
                      {person.birth_year && (
                        <span className="text-faded-ink ml-2">
                          (b. {person.birth_year})
                        </span>
                      )}
                    </div>
                    <span className="person-id">{person.id}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-faded-ink">No people added yet.</p>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button
              onClick={() => setShowProcessDocument(true)}
              className="btn-primary w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90"
            >
              <Upload size={16} />
              Process Document (AI)
            </button>
            <hr className="border-sepia/20 my-2" />
            <button
              onClick={() => setShowAddPerson(true)}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Person
            </button>
            <button
              onClick={() => setShowAddDocument(true)}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Document
            </button>
            <button
              onClick={() => setShowAddSource(true)}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Source
            </button>
            <hr className="border-sepia/20 my-3" />
            <Link to="/people" className="btn-secondary w-full text-center block">
              Browse All People
            </Link>
            <Link to="/gaps" className="btn-secondary w-full text-center block">
              Check Gap Analysis
            </Link>
          </div>
        </div>
      </div>

      {/* Add Person Modal */}
      {showAddPerson && (
        <PersonForm
          isModal
          onSave={handlePersonSave}
          onCancel={() => setShowAddPerson(false)}
        />
      )}

      {/* Add Document Modal */}
      {showAddDocument && (
        <DocumentForm
          isModal
          onSave={handleDocumentSave}
          onCancel={() => setShowAddDocument(false)}
        />
      )}

      {/* Add Source Modal */}
      {showAddSource && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <h2 className="text-lg font-display mb-6">Add Source</h2>
              <SourceForm
                onSave={handleSourceSave}
                onCancel={() => setShowAddSource(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Process Document Modal */}
      {showProcessDocument && (
        <DocumentProcessor
          onComplete={handleProcessComplete}
          onCancel={() => setShowProcessDocument(false)}
        />
      )}
    </div>
  )
}

export default Dashboard
