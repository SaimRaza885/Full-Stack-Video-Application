import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { Avatar } from '../ui/Avatar'

export const UserDropdown = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!user) return null
  const avatar = user.avatar?.url || null
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 p-1.5 hover:bg-tertiary rounded-lg transition-colors"
      >
        <Avatar src={avatar} size="sm" />
        <ChevronDown className={`w-3.5 h-3.5 text-text-tertiary/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} strokeWidth={2.5} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-48 bg-secondary border border-border-subtle rounded-xl shadow-dropdown animate-fade-in overflow-hidden z-50">
          <Link to={`/channel/${user.username}`} className="block px-4 py-2.5 text-sm text-text-primary hover:bg-tertiary transition-colors" onClick={() => setOpen(false)}>My Channel</Link>
          <Link to="/profile" className="block px-4 py-2.5 text-sm text-text-primary hover:bg-tertiary transition-colors" onClick={() => setOpen(false)}>Profile</Link>
          <hr className="border-border-subtle" />
          <button onClick={() => { onLogout(); setOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm text-text-tertiary hover:bg-tertiary hover:text-text-primary transition-colors">Logout</button>
        </div>
      )}
    </div>
  )
}
