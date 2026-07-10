import { useState, useEffect, useCallback } from 'react'
import { channelAPI } from '../services/endpoints'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'

export const useSubscription = (video) => {
  const { isAuthenticated } = useAuth()
  const { addNotification } = useUI()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(0)

  useEffect(() => {
    if (video) {
      setIsSubscribed(video.owner?.isSubscribed || false)
      setSubscriberCount(video.owner?.Subscribers_Count || 0)
    }
  }, [video?._id])

  const handleSubscribe = useCallback(async () => {
    if (!isAuthenticated) { addNotification('Please login to subscribe', 'info'); return }
    try {
      const res = await channelAPI.subscribeChannel(video.owner._id)
      setIsSubscribed(res.data.data.isSubscribed)
      setSubscriberCount(prev => res.data.data.isSubscribed ? prev + 1 : prev - 1)
    } catch { addNotification('Failed to subscribe', 'error') }
  }, [isAuthenticated, video, addNotification])

  return { isSubscribed, subscriberCount, handleSubscribe }
}
