import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

export const SearchBar = ({ initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery)
  const [focused, setFocused] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }, [query, navigate])

  return (
    <form onSubmit={handleSubmit} className="hidden md:flex items-center flex-1 max-w-xl mx-4 lg:mx-8">
      <div className={`relative w-full transition-all duration-200 rounded-full ${focused ? 'scale-[1.02]' : ''}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search"
          className="w-full bg-tertiary border rounded-full  px-4 py-2 text-sm text-text-primary placeholder-text-tertiary/60 focus:outline-none transition-all"
          style={{ borderColor: focused ? '#8B5CF6' : '#2A2A42', borderRight: 'none' }}
        />
        <button
          type="submit"
          className="absolute right-0 top-0 h-full px-5 bg-tertiary border border-l-0 rounded-r-full hover:bg-elevated transition-colors"
          style={{ borderColor: focused ? '#8B5CF6' : '#2A2A42' }}
        >
          <Search className="w-4 h-4 text-text-tertiary" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  )
}
