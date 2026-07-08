import { Link } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { useUI } from '../../context/UIContext'
import { useAuth } from '../../context/AuthContext'
import { UserDropdown } from './UserDropdown'

export const NavActions = () => {
  const { setShowUploadModal } = useUI()
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <div className="flex items-center gap-1">
      <Link to="/search" className="md:hidden text-text-tertiary hover:text-text-primary p-2 hover:bg-tertiary rounded-full transition-colors">
        <Search className="w-5 h-5" />
      </Link>
      {isAuthenticated ? (
        <>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 text-text-secondary hover:text-white px-3 py-1.5 hover:bg-tertiary rounded-full transition-colors text-sm font-medium border border-border-subtle"
            title="Create"
          >
            <Link to="/upload" className='flex items-center'>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </Link>
          </button>

          <UserDropdown user={user} onLogout={logout} />
        </>
      ) : (
        <div className="flex items-center gap-2">
          <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary px-3 py-1.5 transition-colors">Sign in</Link>
          <Link to="/register" className="text-sm font-medium bg-accent hover:bg-accent-hover text-white px-4 py-1.5 rounded-full transition-colors">Register</Link>
        </div>
      )}
    </div>
  )
}
