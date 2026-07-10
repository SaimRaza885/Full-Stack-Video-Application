import { useState, useEffect, useCallback } from 'react'
import { commentAPI } from '../services/endpoints'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'

export const useComments = (videoId, video) => {
  const { isAuthenticated } = useAuth()
  const { addNotification } = useUI()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editCommentContent, setEditCommentContent] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState(null)

  useEffect(() => {
    if (video) {
      setComments(video.All_Comments || [])
    }
  }, [video?._id])

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

  return {
    comments, newComment, commentLoading,
    editingCommentId, editCommentContent, actionLoadingId,
    setNewComment, handleAddComment, handleUpdateComment, handleDeleteComment,
    setEditingCommentId, setEditCommentContent,
  }
}
