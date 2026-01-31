import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const WorkspaceContext = createContext(null)

export function WorkspaceProvider({ children }) {
  const [workspaces, setWorkspaces] = useState([])
  const [currentWorkspace, setCurrentWorkspace] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWorkspaces()
  }, [])

  async function loadWorkspaces() {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .order('is_default', { ascending: false })
        .order('name')

      if (error) throw error

      setWorkspaces(data || [])
      
      // Set default workspace (first one with is_default=true, or first one)
      const saved = localStorage.getItem('currentWorkspaceId')
      const savedWorkspace = data?.find(w => w.id === saved)
      const defaultWorkspace = data?.find(w => w.is_default) || data?.[0]
      
      setCurrentWorkspace(savedWorkspace || defaultWorkspace || null)
    } catch (err) {
      console.error('Error loading workspaces:', err)
    } finally {
      setLoading(false)
    }
  }

  function switchWorkspace(workspaceId) {
    const workspace = workspaces.find(w => w.id === workspaceId)
    if (workspace) {
      setCurrentWorkspace(workspace)
      localStorage.setItem('currentWorkspaceId', workspaceId)
    }
  }

  const value = {
    workspaces,
    currentWorkspace,
    switchWorkspace,
    loading,
    // Helper for queries
    workspaceId: currentWorkspace?.id
  }

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}

export default WorkspaceContext
