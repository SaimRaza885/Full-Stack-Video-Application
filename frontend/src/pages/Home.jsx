import { useEffect, useState } from 'react'
import { CategoryChip, VideoGrid } from '../components'
import { videoAPI } from '../services/endpoints'

export const Home = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const res = await videoAPI.getAllVideos({ limit: 24, sortBy: 'createdAt', sortType: 'desc' })
        setVideos(res.data.data?.docs || res.data.data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load videos')
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  return (
    <div>

      <div className="px-4 lg:px-6 py-5">
        <VideoGrid
          videos={videos}
          loading={loading}
          error={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    </div>
  )
}
