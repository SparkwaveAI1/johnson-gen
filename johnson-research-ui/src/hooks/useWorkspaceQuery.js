import { useWorkspace } from '../contexts/WorkspaceContext'
import { supabase } from '../lib/supabase'

/**
 * Helper hook for workspace-filtered queries
 * Returns the workspace ID and a helper to add workspace filter to queries
 */
export function useWorkspaceQuery() {
  const { workspaceId } = useWorkspace()

  /**
   * Add workspace filter to a Supabase query
   * @param {object} query - Supabase query builder
   * @returns {object} - Query with workspace filter
   */
  const withWorkspace = (query) => {
    if (!workspaceId) {
      console.warn('No workspace selected')
      return query
    }
    return query.eq('workspace_id', workspaceId)
  }

  /**
   * Create a new query with workspace filter already applied
   * @param {string} table - Table name
   * @returns {object} - Supabase query builder with workspace filter
   */
  const fromWorkspace = (table) => {
    const query = supabase.from(table)
    return {
      select: (...args) => withWorkspace(query.select(...args)),
      insert: (data) => query.insert({ ...data, workspace_id: workspaceId }),
      update: (data) => withWorkspace(query.update(data)),
      delete: () => withWorkspace(query.delete()),
    }
  }

  return {
    workspaceId,
    withWorkspace,
    fromWorkspace,
    isReady: !!workspaceId
  }
}

export default useWorkspaceQuery
