import { Home, Video, Library, History } from 'lucide-react'
import { useUI } from '../../context/UIContext'
import { SidebarItem } from './SidebarItem'

const mainLinks = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Subscriptions', to: '/subscriptions', icon: Video },
  { label: 'Library', to: '/playlists', icon: Library },
  { label: 'History', to: '/history', icon: History },
]

// const libraryLinks = [
//   { label: 'Library', to: '/playlists', icon: Library },
//   { label: 'History', to: '/history', icon: History },
// ]

export const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useUI()

  const handleItemClick = () => {
    if (window.innerWidth < 1024) toggleSidebar()
  }

  return (
    <>
      {sidebarOpen && window.innerWidth < 1024 && (
        <div className="fixed inset-0 bg-black/60 z-30 animate-fade-in" onClick={toggleSidebar} />
      )}
      <aside
        className={`fixed lg:relative top-14 lg:top-0 left-0 h-[calc(100vh-56px)] lg:h-auto bg-[#0f0f0f] border-r border-[#2A2A42] transition-all duration-300 z-40 sidebar-scrollbar overflow-y-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } ${sidebarOpen ? 'w-56' : 'w-0 lg:w-[72px]'}`}
        style={{ overflowX: 'hidden' }}
      >
        <div className={`py-3 space-y-1 ${sidebarOpen ? 'px-3' : 'px-0'}`}>
          {mainLinks.map((item) => (
            <SidebarItem key={item.to} {...item} collapsed={!sidebarOpen} onClick={handleItemClick} />
          ))}

          {/* <div className="pt-4 pb-1">
            {sidebarOpen && (
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#6B6B80]">Library</p>
            )}
          </div>
          {libraryLinks.map((item) => (
            <SidebarItem key={item.to} {...item} collapsed={!sidebarOpen} onClick={handleItemClick} />
          ))} */}
        </div>
      </aside>
    </>
  )
}
