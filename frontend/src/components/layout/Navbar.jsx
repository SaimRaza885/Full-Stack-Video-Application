import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useUI } from '../../context/UIContext'
import { SearchBar } from './SearchBar'
import { NavActions } from './NavActions'

const YoutubeLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#FF0000" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

export const Navbar = () => {
  const { toggleSidebar } = useUI()

  return (
    <header className="sticky top-0 z-40 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-[#2A2A42]">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6 gap-3">
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={toggleSidebar}
            className="w-9 h-9 flex items-center justify-center text-[#A1A1B5] hover:text-[#F0F0F8] hover:bg-[#1C1C2E] rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-[18px] h-[18px]" />
          </button>
          <Link to="/" className="flex items-center gap-1 font-bold text-lg tracking-tight px-1">
            <YoutubeLogo />
            <span className="text-white">S</span>
            <span className="text-[#FF0000]">Tube</span>
          </Link>
        </div>

        <div className="flex-1 max-w-xl">
          <SearchBar />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <NavActions />
        </div>
      </div>
    </header>
  )
}
