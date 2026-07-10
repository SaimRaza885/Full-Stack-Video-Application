import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { userAPI } from '../services/endpoints'
import { useAuth } from '../context/AuthContext'
import { Skeleton, EmptyState, ErrorState, VideoCard } from '../components'
import { History as HistoryIcon } from 'lucide-react'
import { fmt, ago } from '../utils'
import { NewVideoCard } from '../components/NewVideoCard'

export const History = () => {
  const { user } = useAuth()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    const fetchHistory = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await userAPI.getHistory()
        setVideos(res.data.data || [])
      } catch {
        setError('Failed to load history')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [user])

  if (!user) return <div className="container-custom py-8 text-center text-text-secondary">Please log in to view history</div>
  if (loading) return <div className="container-custom py-8"><Skeleton className="w-full h-48 rounded-xl mb-4" /><Skeleton className="w-full h-48 rounded-xl" /></div>
  if (error) return <div className="container-custom py-8"><ErrorState message={error} onRetry={() => window.location.reload()} /></div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <HistoryIcon className="w-6 h-6 text-accent" />
        <h1 className="text-2xl font-bold text-text-primary">Watch History</h1>
      </div>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => {
            return (
              <NewVideoCard video={video} key={video._id} />
            )
          })}
        </div>
      ) : (
        <EmptyState icon={HistoryIcon} title="No watch history" description="Videos you watch will appear here" />
      )}
    </div>
  )
}