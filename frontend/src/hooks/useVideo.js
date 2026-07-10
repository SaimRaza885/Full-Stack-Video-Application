import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { videoAPI } from '../services/endpoints'
import { useUI } from '../context/UIContext'

export const useVideo = (videoId) => {
  const navigate = useNavigate()
  const { addNotification } = useUI()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const viewTracked = useRef(false)

  useEffect(() => {
    viewTracked.current = false
    setLoading(true)
    videoAPI.getVideoById(videoId)
      .then(response => setVideo(response.data.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [videoId, navigate])

  useEffect(() => {
    if (video && !viewTracked.current) {
      viewTracked.current = true
      videoAPI.incrementViews(videoId).catch(() => {})
    }
  }, [video, videoId])

  const handleDeleteVideo = useCallback(async () => {
    if (!window.confirm('Are you sure you want to delete this video?')) return
    try {
      await videoAPI.deleteVideo(videoId)
      addNotification('Video deleted successfully', 'success')
      navigate('/')
    } catch {
      addNotification('Failed to delete video', 'error')
    }
  }, [videoId, navigate, addNotification])

  const owner = video?.owner || {}
  const ownerUsername = owner.username || 'Unknown'
  const ownerAvatar = owner.avatar?.url || null

  return { video, loading, owner, ownerUsername, ownerAvatar, handleDeleteVideo }
}
