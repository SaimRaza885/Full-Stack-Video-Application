import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { videoAPI, commentAPI, likeAPI, channelAPI, playlistAPI } from '../services/endpoints'
import { Button, Skeleton } from '../components'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { ThumbsUp, ThumbsDown, Share2, BookmarkPlus, User, Check, ListMusic, Trash2, Pencil } from 'lucide-react'
import { fmt, ago } from '../utils'

export const VideoPlayer = () => {
  const { videoId } = useParams()
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


  // Comment Editing States
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editCommentContent, setEditCommentContent] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState(null)

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
      } catch (err) {
        setError('Failed to load video')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchVideo()
  }, [videoId, navigate])

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

  if (loading) return <div className="container-custom py-8"><Skeleton className="w-full aspect-video rounded-xl" /><div className="mt-6 space-y-4"><Skeleton className="h-8 w-2/3" /><Skeleton className="h-4 w-1/3" /><Skeleton className="h-24 w-full" /></div></div>
  if (!video) return <div className="container-custom py-8 text-center text-text-secondary">Video not found</div>

  const owner = video.owner || {}
  const ownerUsername = owner.username || 'Unknown'
  const ownerAvatar = owner.avatar.url || null

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
            <video src={video.videoFile?.url} controls className="w-full h-full" controlsList="nodownload" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-text-primary">{video.title}</h1>
            <div className="flex items-center justify-between flex-wrap gap-3 mt-2">
              <p className="text-sm text-text-tertiary">{fmt(video.views)} views &bull; {ago(video.createdAt)}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-tertiary rounded-full overJflow-hidden">
                  <button onClick={handleLike} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors hover:bg-elevated border-r border-border-subtle ${isLiked ? 'text-accent' : 'text-text-secondary'}`}>
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-accent' : ''}`} />
                    {likeCount > 0 && <span>{fmt(likeCount)}</span>}
                  </button>
                  <button onClick={handleDislike} className={`px-4 py-2 text-sm font-medium transition-colors hover:bg-elevated ${isDisliked ? 'text-accent' : 'text-text-secondary'}`}>
                    <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-accent' : ''}`} />
                  </button>
                </div>
                {/* on lcick it should copy the video id   */}
                <button className="flex items-center gap-1.5 px-4 py-2 bg-tertiary rounded-full text-sm font-medium text-text-secondary hover:bg-elevated transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                {isAuthenticated && (
                  <div className="relative">
                    <button onClick={() => setShowPlaylistMenu(!showPlaylistMenu)} className="flex items-center gap-1.5 px-4 py-2 bg-tertiary rounded-full text-sm font-medium text-text-secondary hover:bg-elevated transition-colors">
                      <BookmarkPlus className="w-4 h-4" />
                      <span className="hidden sm:inline">Save</span>
                    </button>
                    {showPlaylistMenu && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-secondary border border-border-subtle rounded-xl shadow-dropdown z-50 py-2">
                        <div className="flex items-center justify-between px-4 py-2">
                          <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Save to playlist</p>
                          <button onClick={handleRefreshPlaylists} className="text-xs text-accent hover:text-accent-hover transition-colors">Refresh</button>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {playlists.length > 0 ? playlists.map(p => (
                            <button
                              key={p._id}
                              onClick={() => handleSaveToPlaylist(p._id)}
                              disabled={savingToPlaylist === p._id}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-tertiary transition-colors disabled:opacity-50"
                            >
                              <ListMusic className="w-4 h-4 text-accent shrink-0" />
                              <span className="truncate">{p.name}</span>
                              {savingToPlaylist === p._id && <Check className="w-4 h-4 text-state-success ml-auto shrink-0" />}
                            </button>
                          )) : (
                            <p className="px-4 py-2 text-sm text-text-tertiary text-center">No playlists yet</p>
                          )}
                        </div>
                        <div className="border-t border-border-subtle mt-2 pt-2 px-4">
                          <input
                            type="text"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            placeholder="New playlist name..."
                            className="w-full bg-tertiary border border-border-subtle rounded-lg px-3 py-1.5 text-sm text-text-primary placeholder-text-tertiary/60 focus:outline-none focus:border-accent transition-colors mb-2"
                          />
                          <button
                            onClick={handleCreateAndSave}
                            disabled={!newPlaylistName.trim() || creatingPlaylist}
                            className="w-full py-1.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
                          >
                            {creatingPlaylist ? 'Creating...' : 'Create & Add'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-secondary border border-border-subtle rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Link to={`/channel/${ownerUsername}`}>
                {ownerAvatar ? (
                  <img src={ownerAvatar} alt={ownerUsername} className="w-10 h-10 rounded-full object-cover ring-2 ring-border-subtle" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center">
                    <User className="w-5 h-5 text-text-tertiary" />
                  </div>
                )}
              </Link>
              <div>
                <Link to={`/channel/${ownerUsername}`} className="font-semibold text-sm text-text-primary hover:text-accent transition-colors">
                  {owner.fullName || ownerUsername}
                </Link>
                <p className="text-xs text-text-tertiary">{fmt(subscriberCount)} subscribers</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user?._id === video.owner?._id && (
                <>
                  <Link to={`/video/edit/${video._id}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-tertiary text-text-secondary rounded-lg text-sm font-medium hover:bg-elevated transition-colors">
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Link>
                  <button onClick={handleDeleteVideo} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </>
              )}
              <Button size="sm" onClick={handleSubscribe}>
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </Button>
            </div>
          </div>

          {video.description && (
            <div className="bg-secondary border border-border-subtle rounded-xl p-4">
              <p className="text-sm text-text-primary whitespace-pre-wrap">{video.description}</p>
            </div>
          )}
          {/* ---------------------------- comment section -----------------------------  */}
          <div>
            <h2 className="text-lg font-bold text-text-primary mb-4">Comments ({comments.length})</h2>
            <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
              <input
                type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..." disabled={commentLoading}
                className="flex-1 bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder-text-tertiary/60 focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
              />
              <Button loading={commentLoading} type="submit" size="sm" disabled={!newComment.trim()}>Post</Button>
            </form>
            <div className="space-y-4">
              {comments.length > 0 ? comments.map((comment, idx) => {
                // FIX: Unify owner retrieval safely from either potential key
                const cOwner = comment.comment_owner || comment.owner || {}

                // FIX: Explicitly target the ID wherever it lives in the payload
                const commentOwnerId = cOwner._id || comment.owner?._id || comment.owner;
                const isCommentOwner = user?._id && String(user._id) === String(commentOwnerId);


                console.log(comments[0])

                const cAvatar = cOwner.avatar || null

                return (
                  <div key={comment._id || idx} className="flex gap-3 items-start bg-secondary/30 p-3 rounded-xl border border-border-subtle/20 transition-all">
                    {cAvatar?.url ? (
                      <img src={cAvatar.url} alt="" className="w-8 h-8 rounded-full object-cover ring-1 ring-border-subtle shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-text-tertiary" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-text-primary">@{cOwner.username || 'unknown'}</span>
                        <span className="text-xs text-text-tertiary">{ago(comment.createdAt)}</span>
                      </div>

                      {editingCommentId === comment._id ? (
                        <div className="mt-2 space-y-2">
                          <input
                            type="text"
                            value={editCommentContent}
                            onChange={(e) => setEditCommentContent(e.target.value)}
                            className="w-full bg-tertiary border border-border-subtle rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-accent"
                            disabled={actionLoadingId === comment._id}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              size="xs"
                              onClick={() => handleUpdateComment(comment._id)}
                              disabled={!editCommentContent.trim() || actionLoadingId === comment._id}
                            >
                              Save
                            </Button>
                            <Button
                              size="xs"
                              variant="secondary"
                              onClick={() => setEditingCommentId(null)}
                              disabled={actionLoadingId === comment._id}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-text-primary/90 leading-relaxed break-words">{comment.content}</p>
                      )}
                    </div>

                    {/* Action panel triggers cleanly now that IDs match string targets */}
                    {isCommentOwner && editingCommentId !== comment._id && (
                      <div className="flex items-center gap-2 ml-auto shrink-0 self-center">
                        <button
                          onClick={() => {
                            setEditingCommentId(comment._id)
                            setEditCommentContent(comment.content)
                          }}
                          disabled={actionLoadingId !== null}
                          className="p-2 bg-tertiary/60 hover:bg-accent/20 text-accent rounded-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
                          title="Edit comment"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          disabled={actionLoadingId !== null}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
                          title="Delete comment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )
              }) : (
                <p className="text-center text-text-tertiary/60 text-sm py-8">No comments yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-text-primary mb-4">Related Videos</h2>
          <p className="text-text-tertiary text-sm">More videos coming soon</p>
        </div>
      </div>
    </div>
  )
}
