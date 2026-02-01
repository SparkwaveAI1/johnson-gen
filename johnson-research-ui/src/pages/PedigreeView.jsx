import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Users, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useWorkspace } from '../contexts/WorkspaceContext'
import PedigreeChart from '../components/relationships/PedigreeChart'

function PedigreeView() {
  const { workspaceId } = useWorkspace()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  const selectedPersonId = searchParams.get('person')

  // Fetch people for selector
  useEffect(() => {
    if (!workspaceId) return
    
    async function fetchPeople() {
      setLoading(true)
      const { data, error } = await supabase
        .from('people')
        .select('id, given_name, surname, birth_year')
        .eq('workspace_id', workspaceId)
        .order('surname')
        .order('birth_year')

      if (!error) {
        setPeople(data || [])
        // If no person selected, default to Scott Christopher Johnson (or first person)
        if (!selectedPersonId && data?.length > 0) {
          // Try to find Scott Christopher Johnson born 1968
          const scott = data.find(p => 
            p.given_name === 'Scott Christopher' && 
            p.surname === 'Johnson' && 
            p.birth_year === 1968
          )
          // Fallback: any Scott Johnson born 1968
          const scottAlt = data.find(p => 
            p.given_name?.includes('Scott') && 
            p.surname === 'Johnson' && 
            p.birth_year === 1968
          )
          const defaultPerson = scott || scottAlt || data[0]
          console.log('Defaulting pedigree to:', defaultPerson?.given_name, defaultPerson?.surname)
          setSearchParams({ person: defaultPerson.id })
        }
      }
      setLoading(false)
    }

    fetchPeople()
  }, [workspaceId, selectedPersonId])

  const filteredPeople = people.filter(p => {
    if (!searchQuery) return true
    const name = `${p.given_name || ''} ${p.surname || ''}`.toLowerCase()
    return name.includes(searchQuery.toLowerCase())
  })

  function handlePersonSelect(personId) {
    setSearchParams({ person: personId })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={28} className="text-sepia" />
          <div>
            <h1 className="text-2xl font-display font-semibold">Pedigree Chart</h1>
            <p className="text-faded-ink">View ancestor tree in classic pedigree format</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Person Selector */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="font-medium mb-3">Select Person</h3>
            
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-faded-ink" size={16} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-9 py-2 text-sm"
              />
            </div>

            {/* Person List */}
            <div className="max-h-96 overflow-y-auto space-y-1">
              {loading ? (
                <p className="text-faded-ink text-sm p-2">Loading...</p>
              ) : filteredPeople.length === 0 ? (
                <p className="text-faded-ink text-sm p-2">No people found</p>
              ) : (
                filteredPeople.map(person => (
                  <button
                    key={person.id}
                    onClick={() => handlePersonSelect(person.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      selectedPersonId === person.id
                        ? 'bg-sepia text-white'
                        : 'hover:bg-parchment'
                    }`}
                  >
                    <div className="font-medium">
                      {person.given_name} {person.surname}
                    </div>
                    {person.birth_year && (
                      <div className={`text-xs ${selectedPersonId === person.id ? 'text-white/70' : 'text-faded-ink'}`}>
                        b. {person.birth_year}
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Pedigree Chart */}
        <div className="lg:col-span-3">
          {selectedPersonId ? (
            <PedigreeChart
              rootPersonId={selectedPersonId}
              onPersonSelect={handlePersonSelect}
            />
          ) : (
            <div className="card flex items-center justify-center h-96 text-faded-ink">
              <p>Select a person to view their pedigree</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PedigreeView
