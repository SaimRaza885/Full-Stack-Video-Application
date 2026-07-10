import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { videoAPI, commentAPI, likeAPI, channelAPI, playlistAPI } from '../services/endpoints'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'

export const useVideoPlayerData = (videoId) => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { addNotification } = useUI()

  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)

  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(0)
  const [playlists, setPlaylists] = useState([])
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false)
  const [savingToPlaylist, setSavingToPlaylist] = useState(null)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [creatingPlaylist, setCreatingPlaylist] = useState(false)

  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editCommentContent, setEditCommentContent] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState(null)

  const [relatedVideos, setRelatedVideos] = useState([])
  const [relatedLoading, setRelatedLoading] = useState(false)

  const viewTracked = useRef(false)

  const refreshPlaylists = useCallback(() => {
    if (isAuthenticated) {
      playlistAPI.getUserPlaylists(user._id).then(res => {
        setPlaylists(res.data.data || [])
      }).catch(() => { })
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    refreshPlaylists()
  }, [refreshPlaylists])

  useEffect(() => {
    if (video && !viewTracked.current) {
      viewTracked.current = true
      videoAPI.incrementViews(videoId).catch(() => { })
    }
  }, [video, videoId])

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true)
        const response = await videoAPI.getVideoById(videoId)
        const data = response.data.data
        setVideo(data)
        setIsLiked(data.isLiked || false)
        setLikeCount(data.like_Count || 0)
        setIsSubscribed(data.owner?.isSubscribed || false)
        setSubscriberCount(data.owner?.Subscribers_Count || 0)
        setComments(data.All_Comments || [])
      } catch {
        setError('Failed to load video')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchVideo()
  }, [videoId, navigate])

  useEffect(() => {
    if (!video?._id) return
    setRelatedLoading(true)
    videoAPI.getAllVideos({ limit: 12, sortBy: 'views', sortType: 'desc' })
      .then(res => {
        const all = res.data.data?.docs || res.data.data || []
        setRelatedVideos(all.filter(v => String(v._id) !== String(video._id)).slice(0, 10))
      })
      .catch(() => { })
      .finally(() => setRelatedLoading(false))
  }, [video])

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
      const res = await likeAPI.likeVideo(videoId)
      setIsDisliked(!isDisliked)
      if (isLiked) { setIsLiked(false); setLikeCount(prev => (prev > 0 ? prev - 1 : 0)) }
    } catch { addNotification('Failed', 'error') }
  }, [videoId, isAuthenticated, isLiked, addNotification])

  const handleSubscribe = useCallback(async () => {
    if (!isAuthenticated) { addNotification('Please login to subscribe', 'info'); return }
    try {
      const res = await channelAPI.subscribeChannel(video.owner._id)
      setIsSubscribed(res.data.data.isSubscribed)
      setSubscriberCount(prev => res.data.data.isSubscribed ? prev + 1 : prev - 1)
    } catch { addNotification('Failed to subscribe', 'error') }
  }, [isAuthenticated, video, addNotification])

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

  const handleSaveToPlaylist = async (playlistId) => {
    setSavingToPlaylist(playlistId)
    try {
      await playlistAPI.addVideoToPlaylist(playlistId, videoId)
      addNotification('Added to playlist!', 'success')
      setShowPlaylistMenu(false)
    } catch {
      addNotification('Failed to add to playlist', 'error')
    } finally {
      setSavingToPlaylist(null)
    }
  }

  const handleCreateAndSave = async () => {
    if (!newPlaylistName.trim()) return
    setCreatingPlaylist(true)
    try {
      const res = await playlistAPI.createPlaylist({ name: newPlaylistName.trim(), description: '' })
      const newPlaylist = res.data.data
      await playlistAPI.addVideoToPlaylist(newPlaylist._id, videoId)
      addNotification('Created and added to playlist!', 'success')
      setNewPlaylistName('')
      setShowPlaylistMenu(false)
      refreshPlaylists()
    } catch {
      addNotification('Failed to create playlist', 'error')
    } finally {
      setCreatingPlaylist(false)
    }
  }

  const handleRefreshPlaylists = () => {
    refreshPlaylists()
    addNotification('Playlists refreshed', 'info')
  }

  const handleUpdateComment = async (commentId) => {
    if (!editCommentContent.trim()) return
    try {
      setActionLoadingId(commentId)
      await commentAPI.updateComment(commentId, { content: editCommentContent.trim() })
      setComments(prev => prev.map(c => c._id === commentId ? { ...c, content: editCommentContent.trim() } : c))
      setEditingCommentId(null)
      setEditCommentContent('')
      addNotification('Comment updated successfully', 'success')
    } catch {
      addNotification('Failed to update comment', 'error')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment permanently?')) return
    try {
      setActionLoadingId(commentId)
      await commentAPI.deleteComment(commentId)
      setComments(prev => prev.filter(c => c._id !== commentId))
      addNotification('Comment deleted successfully', 'success')
    } catch {
      addNotification('Failed to delete comment', 'error')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleAddComment = useCallback(async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    if (!isAuthenticated) { addNotification('Please login to comment', 'info'); return }
    try {
      setCommentLoading(true)
      await commentAPI.addComment(videoId, { content: newComment })
      setNewComment('')
      const response = await commentAPI.getComments(videoId)
      setComments(response.data.data?.docs || [])
    } catch { addNotification('Failed to add comment', 'error') }
    finally { setCommentLoading(false) }
  }, [newComment, videoId, isAuthenticated, addNotification])

  const owner = video?.owner || {}
  const ownerUsername = owner.username || 'Unknown'
  const ownerAvatar = owner.avatar?.url || null

  return {
    video, loading, owner, ownerUsername, ownerAvatar,
    isLiked, isDisliked, likeCount,
    isSubscribed, subscriberCount,
    handleLike, handleDislike, handleSubscribe, handleDeleteVideo,
    playlists, showPlaylistMenu, savingToPlaylist, newPlaylistName, creatingPlaylist,
    handleSaveToPlaylist, handleCreateAndSave, setShowPlaylistMenu, setNewPlaylistName,
    handleRefreshPlaylists,
    comments, newComment, commentLoading,
    editingCommentId, editCommentContent, actionLoadingId,
    setNewComment, handleAddComment, handleUpdateComment, handleDeleteComment,
    setEditingCommentId, setEditCommentContent,
    relatedVideos, relatedLoading,
  }
}
