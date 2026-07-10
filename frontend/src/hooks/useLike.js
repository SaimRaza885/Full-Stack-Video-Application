import { useState, useEffect, useCallback } from 'react'
import { likeAPI } from '../services/endpoints'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'

export const useLike = (videoId, video) => {
  const { isAuthenticated } = useAuth()
  const { addNotification } = useUI()
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    if (video) {
      setIsLiked(video.isLiked || false)
      setIsDisliked(false)
      setLikeCount(video.like_Count || 0)
    }
  }, [video?._id])

  const handleLike = useCallback(async () => {
    if (!isAuthenticated) { addNotification('Please login to like', 'info'); return }
    try {
      const res = await likeAPI.likeVideo(videoId)
      setIsLiked(res.data.data.isLiked)
      setLikeCount(prev => res.data.data.isLiked ? prev + 1 : (prev > 0 ? prev - 1 : 0))
      if (isDisliked) setIsDisliked(false)
    } catch { addNotification('Failed to like video', 'error') }
  }, [videoId, isAuthenticated, isDisliked, addNotification])

  const handleDislike = useCallback(async () => {
    if (!isAuthenticated) { addNotification('Please login to dislike', 'info'); return }
    try {
      await likeAPI.likeVideo(videoId)
      setIsDisliked(!isDisliked)
      if (isLiked) { setIsLiked(false); setLikeCount(prev => (prev > 0 ? prev - 1 : 0)) }
    } catch { addNotification('Failed', 'error') }
  }, [videoId, isAuthenticated, isLiked, addNotification])

  return { isLiked, isDisliked, likeCount, handleLike, handleDislike }
}
