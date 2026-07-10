import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { channelAPI } from '../services/endpoints'
import { Skeleton } from '../components'
import { useAuth } from '../context/AuthContext'
import { fmt, ago } from '../utils'
import { NewVideoCard } from '../components/NewVideoCard'

export const Subscriptions = () => {
  const { user, isAuthenticated } = useAuth()
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !user) { setLoading(false); return }
    const fetch = async () => {
      try {
        const res = await channelAPI.getSubscriptions(user._id)
        const data = res.data.data
        if (Array.isArray(data)) {
          setChannels(data.map(item => item.subscribedChannels).filter(Boolean))
        }
      } catch {
        setChannels([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [user, isAuthenticated])

  if (!isAuthenticated) {
    return <div className="container-custom py-8 text-center text-text-secondary">Please log in to see your subscriptions</div>
  }

  return (
    <div className="container-custom py-7">
      <h1 className="text-2xl font-bold text-text-primary mb-6 mt-2">Subscriptions</h1>

      {/* Top Bar: Horizontal Channel List Slider */}
      {!loading && channels.length > 0 && (
        <div className="flex gap-6 overflow-x-auto pb-4 mb-8 border-b border-secondary scrollbar-hide snap-x">
          {channels.map((ch, idx) => (
            <Link
              key={`logo-${idx}`}
              to={`/channel/${ch.username}`}
              className="flex flex-col items-center text-center gap-1.5 flex-shrink-0 snap-start group w-20"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-transparent group-hover:border-accent transition-all duration-200">
                <img
                  src={ch.avatar?.url || ch.avatar}
                  alt={ch.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-text-secondary group-hover:text-text-primary truncate w-full px-1">
                {ch.fullName}
              </span>
            </Link>
          ))}
        </div>
      )}



      <h1 className="text-2xl font-bold text-text-primary mb-6">Latest Vidoes</h1>
      {/* Main Video Section */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-video rounded-xl" />
              <div className="flex gap-3">
                <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : channels.length === 0 ? (
        <p className="text-text-tertiary text-center py-12">No subscriptions yet. Subscribe to channels to see their latest videos here.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {channels.map((ch, idx) => {
            const video = ch.latestVideo
            console.log()
            return (
              <NewVideoCard key={idx} video={video} ch={ch} />
            )
          })}
        </div>
      )}
    </div>
  )
}