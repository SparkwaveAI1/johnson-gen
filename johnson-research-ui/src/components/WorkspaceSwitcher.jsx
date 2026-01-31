import { useState } from 'react'
import { ChevronDown, Check, FolderTree } from 'lucide-react'
import { useWorkspace } from '../contexts/WorkspaceContext'

function WorkspaceSwitcher() {
  const { workspaces, currentWorkspace, switchWorkspace, loading } = useWorkspace()
  const [isOpen, setIsOpen] = useState(false)

  if (loading) {
    return (
      <div className="px-3 py-2 text-sm text-faded-ink">
        Loading...
      </div>
    )
  }

  if (!currentWorkspace) {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-parchment transition-colors text-left"
      >
        <FolderTree size={18} className="text-sepia flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{currentWorkspace.name}</p>
          <p className="text-xs text-faded-ink truncate">{currentWorkspace.owner_name}</p>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-faded-ink transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown */}
          <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-md shadow-lg border border-sepia/20 z-20 overflow-hidden">
            <div className="p-2">
              <p className="text-xs text-faded-ink uppercase tracking-wide px-2 py-1">
                Workspaces
              </p>
              {workspaces.map(workspace => (
                <button
                  key={workspace.id}
                  onClick={() => {
                    switchWorkspace(workspace.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-2 rounded text-left text-sm transition-colors ${
                    workspace.id === currentWorkspace.id
                      ? 'bg-sepia/10 text-sepia'
                      : 'hover:bg-parchment'
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium">{workspace.name}</p>
                    <p className="text-xs text-faded-ink">{workspace.owner_name}</p>
                  </div>
                  {workspace.id === currentWorkspace.id && (
                    <Check size={16} className="text-sepia" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default WorkspaceSwitcher
