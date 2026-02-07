import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { 
  RefreshCw, 
  Users, 
  Check, 
  X, 
  ChevronDown,
  StickyNote,
  ExternalLink,
  AlertCircle
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useWorkspace } from '../contexts/WorkspaceContext'

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700' },
  { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-700' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-700' }
]

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-red-100 text-red-700'
}

export default function DnaSurnamesPage() {
  const { workspaceId } = useWorkspace()
  const [surnames, setSurnames] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [hideInTree, setHideInTree] = useState(true)
  const [error, setError] = useState(null)
  
  // Notes modal state
  const [notesModal, setNotesModal] = useState({ open: false, surname: null, notes: '' })
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    if (workspaceId) {
      loadSurnames()
    }
  }, [workspaceId])

  const loadSurnames = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: fetchError } = await supabase
        .from('mystery_surnames')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('total_shared_cm', { ascending: false })

      if (fetchError) throw fetchError
      setSurnames(data || [])
    } catch (err) {
      console.error('Error loading mystery surnames:', err)
      setError('Failed to load surnames')
    } finally {
      setLoading(false)
    }
  }

  // Aggregate function to recalculate all surname stats
  const refreshAggregations = async () => {
    setRefreshing(true)
    setError(null)

    try {
      // Step 1: Get all distinct surnames from dna_match_surnames with match data
      const { data: matchSurnames, error: surnameError } = await supabase
        .from('dna_match_surnames')
        .select(`
          surname,
          match:match_id (
            id,
            shared_cm,
            workspace_id
          )
        `)

      if (surnameError) throw surnameError

      // Filter to current workspace and aggregate
      const surnameStats = {}
      
      for (const record of matchSurnames || []) {
        if (!record.match || record.match.workspace_id !== workspaceId) continue
        
        const surname = record.surname?.toUpperCase() || ''
        if (!surname) continue
        
        if (!surnameStats[surname]) {
          surnameStats[surname] = {
            surname,
            match_count: 0,
            total_shared_cm: 0,
            match_ids: new Set()
          }
        }
        
        // Only count unique matches
        if (!surnameStats[surname].match_ids.has(record.match.id)) {
          surnameStats[surname].match_ids.add(record.match.id)
          surnameStats[surname].match_count += 1
          surnameStats[surname].total_shared_cm += (record.match.shared_cm || 0)
        }
      }

      // Step 2: Check which surnames exist in people table
      const { data: treePeople, error: peopleError } = await supabase
        .from('people')
        .select('surname')
        .eq('workspace_id', workspaceId)

      if (peopleError) throw peopleError

      const treeSurnames = new Set(
        (treePeople || []).map(p => p.surname?.toUpperCase()).filter(Boolean)
      )

      // Step 3: Get existing mystery_surnames to preserve notes/priority
      const { data: existingSurnames, error: existingError } = await supabase
        .from('mystery_surnames')
        .select('surname, notes, priority, in_tree')
        .eq('workspace_id', workspaceId)

      if (existingError) throw existingError

      const existingMap = {}
      for (const s of existingSurnames || []) {
        existingMap[s.surname?.toUpperCase()] = s
      }

      // Step 4: Delete all existing entries for this workspace
      const { error: deleteError } = await supabase
        .from('mystery_surnames')
        .delete()
        .eq('workspace_id', workspaceId)

      if (deleteError) throw deleteError

      // Step 5: Insert fresh aggregated data
      const surnameList = Object.values(surnameStats)
      
      if (surnameList.length > 0) {
        const insertData = surnameList.map(s => {
          const existing = existingMap[s.surname]
          const inTreeAuto = treeSurnames.has(s.surname)
          
          return {
            workspace_id: workspaceId,
            surname: s.surname,
            match_count: s.match_count,
            total_shared_cm: Math.round(s.total_shared_cm * 100) / 100,
            // Keep manual in_tree override, or detect automatically
            in_tree: existing?.in_tree ?? inTreeAuto,
            priority: existing?.priority || 'normal',
            notes: existing?.notes || null
          }
        })

        const { error: insertError } = await supabase
          .from('mystery_surnames')
          .insert(insertData)

        if (insertError) throw insertError
      }

      // Reload the data
      await loadSurnames()
    } catch (err) {
      console.error('Error refreshing aggregations:', err)
      setError(err.message || 'Failed to refresh aggregations')
    } finally {
      setRefreshing(false)
    }
  }

  // Mark a surname as in-tree
  const handleMarkInTree = async (surname) => {
    try {
      const { error } = await supabase
        .from('mystery_surnames')
        .update({ in_tree: true })
        .eq('workspace_id', workspaceId)
        .eq('surname', surname.surname)

      if (error) throw error

      setSurnames(prev => prev.map(s => 
        s.surname === surname.surname ? { ...s, in_tree: true } : s
      ))
    } catch (err) {
      console.error('Error marking in-tree:', err)
      setError('Failed to update surname')
    }
  }

  // Update priority
  const handlePriorityChange = async (surname, newPriority) => {
    try {
      const { error } = await supabase
        .from('mystery_surnames')
        .update({ priority: newPriority })
        .eq('workspace_id', workspaceId)
        .eq('surname', surname.surname)

      if (error) throw error

      setSurnames(prev => prev.map(s => 
        s.surname === surname.surname ? { ...s, priority: newPriority } : s
      ))
    } catch (err) {
      console.error('Error updating priority:', err)
      setError('Failed to update priority')
    }
  }

  // Open notes modal
  const handleOpenNotes = (surname) => {
    setNotesModal({
      open: true,
      surname: surname,
      notes: surname.notes || ''
    })
  }

  // Save notes
  const handleSaveNotes = async () => {
    if (!notesModal.surname) return
    setSavingNotes(true)

    try {
      const { error } = await supabase
        .from('mystery_surnames')
        .update({ notes: notesModal.notes || null })
        .eq('workspace_id', workspaceId)
        .eq('surname', notesModal.surname.surname)

      if (error) throw error

      setSurnames(prev => prev.map(s => 
        s.surname === notesModal.surname.surname 
          ? { ...s, notes: notesModal.notes || null } 
          : s
      ))
      setNotesModal({ open: false, surname: null, notes: '' })
    } catch (err) {
      console.error('Error saving notes:', err)
      setError('Failed to save notes')
    } finally {
      setSavingNotes(false)
    }
  }

  // Filter surnames based on toggle
  const displayedSurnames = hideInTree 
    ? surnames.filter(s => !s.in_tree)
    : surnames

  // Calculate stats
  const totalSurnames = surnames.length
  const inTreeCount = surnames.filter(s => s.in_tree).length
  const mysteryCount = surnames.filter(s => !s.in_tree).length
  const highPriorityCount = surnames.filter(s => s.priority === 'high' && !s.in_tree).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-faded-ink">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users size={28} className="text-sepia" />
            Mystery Surnames
          </h1>
          <p className="text-faded-ink mt-1">
            Surnames that appear in DNA matches but not in your tree
          </p>
        </div>
        <button
          onClick={refreshAggregations}
          disabled={refreshing}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-sepia">{totalSurnames}</p>
          <p className="text-sm text-faded-ink">Total Surnames</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-sepia">{mysteryCount}</p>
          <p className="text-sm text-faded-ink">Mystery</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-sepia">{inTreeCount}</p>
          <p className="text-sm text-faded-ink">In Tree</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{highPriorityCount}</p>
          <p className="text-sm text-faded-ink">High Priority</p>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hideInTree}
            onChange={(e) => setHideInTree(e.target.checked)}
            className="w-4 h-4 rounded border-sepia/30 text-sepia focus:ring-sepia"
          />
          <span className="text-sm">Hide in-tree surnames</span>
        </label>
      </div>

      {/* Table */}
      {displayedSurnames.length === 0 ? (
        <div className="card p-12 text-center">
          <Users size={48} className="mx-auto text-faded-ink mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {surnames.length === 0 
              ? 'No surnames found' 
              : 'All surnames are in your tree!'}
          </h3>
          <p className="text-faded-ink mb-4">
            {surnames.length === 0 
              ? 'Add DNA matches with surnames, then click Refresh to aggregate.'
              : 'Toggle "Hide in-tree surnames" to see all surnames.'}
          </p>
          {surnames.length === 0 && (
            <Link to="/dna/matches/new" className="btn-primary inline-block">
              Add DNA Match
            </Link>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-parchment">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Surname</th>
                <th className="text-right px-4 py-3 font-medium">Matches</th>
                <th className="text-right px-4 py-3 font-medium">Total cM</th>
                <th className="text-center px-4 py-3 font-medium">In Tree</th>
                <th className="text-center px-4 py-3 font-medium">Priority</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sepia/10">
              {displayedSurnames.map(surname => (
                <tr key={surname.id} className="hover:bg-parchment/50">
                  <td className="px-4 py-3">
                    <span className="font-medium">{surname.surname}</span>
                    {surname.notes && (
                      <span className="ml-2 text-xs text-faded-ink" title={surname.notes}>
                        📝
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {surname.match_count}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {surname.total_shared_cm?.toFixed(1) || '0'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {surname.in_tree ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        <Check size={12} />
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        <X size={12} />
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={surname.priority || 'normal'}
                      onChange={(e) => handlePriorityChange(surname, e.target.value)}
                      className={`text-xs px-2 py-1 rounded border-0 cursor-pointer ${priorityColors[surname.priority] || priorityColors.normal}`}
                    >
                      {priorityOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!surname.in_tree && (
                        <button
                          onClick={() => handleMarkInTree(surname)}
                          className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                          title="Mark as in tree"
                        >
                          Mark In-Tree
                        </button>
                      )}
                      <Link
                        to={`/dna/matches?surname=${encodeURIComponent(surname.surname)}`}
                        className="p-1 text-faded-ink hover:text-sepia"
                        title="View matches with this surname"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button
                        onClick={() => handleOpenNotes(surname)}
                        className="p-1 text-faded-ink hover:text-sepia"
                        title="Add/edit notes"
                      >
                        <StickyNote size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notes Modal */}
      {notesModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-cream rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-sepia/20">
              <h2 className="text-lg font-semibold">
                Notes for {notesModal.surname?.surname}
              </h2>
              <button
                onClick={() => setNotesModal({ open: false, surname: null, notes: '' })}
                className="text-faded-ink hover:text-ink p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <textarea
                value={notesModal.notes}
                onChange={(e) => setNotesModal(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
                placeholder="Add research notes about this surname..."
                className="input w-full"
              />
            </div>
            <div className="flex justify-end gap-3 p-4 bg-parchment/50 border-t border-sepia/20">
              <button
                onClick={() => setNotesModal({ open: false, surname: null, notes: '' })}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="btn-primary"
              >
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
