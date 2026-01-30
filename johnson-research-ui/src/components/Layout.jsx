import { Outlet, NavLink } from 'react-router-dom'
import {
  Home,
  Users,
  FileText,
  BookOpen,
  MapPin,
  Book,
  HelpCircle,
  GitCompare,
  AlertTriangle,
  Search,
  Upload
} from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/people', icon: Users, label: 'People' },
  { to: '/families', icon: Users, label: 'Families' },
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/processing', icon: Upload, label: 'Processing' },
  { to: '/locations', icon: MapPin, label: 'Locations' },
  { to: '/sources', icon: BookOpen, label: 'Sources' },
  { to: '/chapters', icon: Book, label: 'Chapters' },
  { to: '/identity', icon: GitCompare, label: 'Identity Queue' },
  { to: '/research', icon: HelpCircle, label: 'Research Questions' },
  { to: '/gaps', icon: AlertTriangle, label: 'Gap Analysis' },
]

function Layout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-aged-paper border-r border-sepia/20 flex flex-col">
        {/* Logo/Title */}
        <div className="p-6 border-b border-sepia/20">
          <h1 className="text-xl font-display font-semibold text-sepia">
            Johnson Family
          </h1>
          <p className="text-sm text-faded-ink">Research Database</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-sepia text-white'
                        : 'text-ink hover:bg-parchment'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sepia/20 text-xs text-faded-ink">
          <p>Johnson/Johnston Project</p>
          <p>Colonial Virginia Research</p>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-sepia/20 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-faded-ink" size={18} />
              <input
                type="text"
                placeholder="Search people, documents, sources..."
                className="input pl-10 max-w-md"
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
