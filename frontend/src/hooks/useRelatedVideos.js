import { useState, useEffect } from 'react'
import { videoAPI } from '../services/endpoints'

export const useRelatedVideos = (video) => {
  const [relatedVideos, setRelatedVideos] = useState([])
  const [relatedLoading, setRelatedLoading] = useState(false)

  useEffect(() => {
    if (!video?._id) return
    setRelatedLoading(true)
    videoAPI.getAllVideos({ limit: 12, sortBy: 'views', sortType: 'desc' })
      .then(res => {
        const all = res.data.data?.docs || res.data.data || []
        setRelatedVideos(all.filter(v => String(v._id) !== String(video._id)).slice(0, 10))
      })
      .catch(() => {})
      .finally(() => setRelatedLoading(false))
  }, [video])

  return { relatedVideos, relatedLoading }
}
