import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { playlistAPI, videoAPI } from '../services/endpoints'
import { Button, Modal, Input, Skeleton, EmptyState, ErrorState } from '../components'
import { Link } from 'react-router-dom'
import { useUI } from '../context/UIContext'
import { ListMusic, ArrowLeft, Trash2, Pencil } from 'lucide-react'

export const Playlists = () => {
  const { user } = useAuth()
  const { addNotification } = useUI()
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [playlistVideos, setPlaylistVideos] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('')
  const [addVideoId, setAddVideoId] = useState('')
  const [addingVideo, setAddingVideo] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPlaylist, setEditingPlaylist] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [removingVideo, setRemovingVideo] = useState(null)
  const [userVideos, setUserVideos] = useState([])
  const [loadingUserVideos, setLoadingUserVideos] = useState(false)
  const [showUserVideos, setShowUserVideos] = useState(false)
  const [userVideoPage, setUserVideoPage] = useState(1)
  const [hasMoreUserVideos, setHasMoreUserVideos] = useState(false)
  const [loadingMoreVideos, setLoadingMoreVideos] = useState(false)
  const [addingUserVideo, setAddingUserVideo] = useState(null)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    const fetchPlaylists = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await playlistAPI.getUserPlaylists(user._id)
        setPlaylists(response.data.data || [])

      } catch (err) {
        setError('Failed to load playlists')
      } finally {
        setLoading(false)
      }
    }
    fetchPlaylists()
  }, [user])

  const handleSelectPlaylist = async (playlist) => {
    setSelectedPlaylist(playlist)
    try {
      const response = await playlistAPI.getPlaylistById(playlist._id)
      setPlaylistVideos(response.data.data?.Videos || [])
    } catch {
      addNotification('Failed to load playlist videos', 'error')
    }
  }

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return
    try {
      const response = await playlistAPI.createPlaylist({ name: newPlaylistName, description: newPlaylistDescription })
      setPlaylists(prev => [...prev, response.data.data])
      setNewPlaylistName('')
      setNewPlaylistDescription('')
      setShowModal(false)
      addNotification('Playlist created!', 'success')
    } catch {
      addNotification('Failed to create playlist', 'error')
    }
  }

  const handleAddVideo = async () => {
    if (!addVideoId.trim()) return
    setAddingVideo(true)
    try {
      await playlistAPI.addVideoToPlaylist(selectedPlaylist._id, addVideoId.trim())
      addNotification('Video added to playlist!', 'success')
      setAddVideoId('')
      const response = await playlistAPI.getPlaylistById(selectedPlaylist._id)
      setPlaylistVideos(response.data.data?.Videos || [])
    } catch {
      addNotification('Failed to add video. Check the video ID.', 'error')
    } finally {
      setAddingVideo(false)
    }
  }

  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return
    try {
      await playlistAPI.deletePlaylist(playlistId)
      setPlaylists(prev => prev.filter(p => p._id !== playlistId))
      if (selectedPlaylist?._id === playlistId) {
        setSelectedPlaylist(null)
        setPlaylistVideos([])
      }
      addNotification('Playlist deleted!', 'success')
    } catch {
      addNotification('Failed to delete playlist', 'error')
    }
  }

  const handleEditPlaylist = async () => {
    if (!editName.trim()) return
    try {
      const response = await playlistAPI.updatePlaylist(editingPlaylist._id, {
        name: editName,
        description: editDescription,
      })
      setPlaylists(prev => prev.map(p => p._id === editingPlaylist._id ? response.data.data : p))
      if (selectedPlaylist?._id === editingPlaylist._id) {
        setSelectedPlaylist(response.data.data)
      }
      setShowEditModal(false)
      setEditingPlaylist(null)
      addNotification('Playlist updated!', 'success')
    } catch {
      addNotification('Failed to update playlist', 'error')
    }
  }

  const handleRemoveVideo = async (videoId) => {
    if (!window.confirm('Remove this video from the playlist?')) return
    setRemovingVideo(videoId)
    try {
      await playlistAPI.removeVideoFromPlaylist(selectedPlaylist._id, videoId)
      setPlaylistVideos(prev => prev.filter(v => v._id !== videoId))
      addNotification('Video removed from playlist', 'success')
    } catch {
      addNotification('Failed to remove video', 'error')
    } finally {
      setRemovingVideo(null)
    }
  }

  const fetchUserVideos = async (page = 1) => {
    if (!user) return
    if (page === 1) setLoadingUserVideos(true)
    else setLoadingMoreVideos(true)
    try {
      const res = await videoAPI.getVideosByUser(user._id, { page, limit: 12 })
      const data = res.data.data
      console.log(data)
      const newVideos = data.docs || []
      if (page === 1) {
        setUserVideos(newVideos)
      } else {
        setUserVideos(prev => [...prev, ...newVideos])
      }
      setUserVideoPage(page)
      setHasMoreUserVideos(data.hasNextPage || false)
    } catch {
      addNotification('Failed to load your videos', 'error')
    } finally {
      setLoadingUserVideos(false)
      setLoadingMoreVideos(false)
    }
  }

  const handleSelectUserVideo = async (videoId) => {
    setAddingUserVideo(videoId)
    try {
      await playlistAPI.addVideoToPlaylist(selectedPlaylist._id, videoId)
      addNotification('Video added to playlist!', 'success')
      const response = await playlistAPI.getPlaylistById(selectedPlaylist._id)
      setPlaylistVideos(response.data.data?.Videos || [])
    } catch {
      addNotification('Failed to add video', 'error')
    } finally {
      setAddingUserVideo(null)
    }
  }

  const toggleUserVideos = () => {
    if (!showUserVideos) {
      setShowUserVideos(true)
      fetchUserVideos(1)
    } else {
      setShowUserVideos(false)
    }
  }

  if (!user) return <div className="container-custom py-8 text-center text-text-secondary">Please log in to view playlists</div>
  if (loading) return <div className="container-custom py-8"><Skeleton className="w-full h-48 rounded-xl" /></div>
  if (error) return <div className="container-custom py-8"><ErrorState message={error} onRetry={() => window.location.reload()} /></div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Your Playlists</h1>
        <Button onClick={() => setShowModal(true)}>Create Playlist</Button>
      </div>

      {!selectedPlaylist ? (
        playlists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                onClick={() => handleSelectPlaylist(playlist)}
                className="bg-secondary border border-border-subtle rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-accent/30 hover:shadow-card-hover"
              >
                <div className="w-full aspect-video bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
                  <ListMusic className="w-12 h-12 text-white/80" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-text-primary truncate">{playlist.name}</h3>
                  <p className="text-text-tertiary text-sm">{playlist.totalVideos || 0} videos</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={ListMusic} title="No playlists yet" description="Create your first playlist to organize videos" />
        )
      ) : (
        <div>
          <button
            onClick={() => { setSelectedPlaylist(null); setPlaylistVideos([]) }}
            className="mb-4 flex items-center gap-2 text-accent hover:text-accent-hover transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Playlists
          </button>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary">{selectedPlaylist.name}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingPlaylist(selectedPlaylist)
                  setEditName(selectedPlaylist.name)
                  setEditDescription(selectedPlaylist.description || '')
                  setShowEditModal(true)
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-tertiary text-text-secondary rounded-lg text-sm font-medium hover:bg-elevated transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDeletePlaylist(selectedPlaylist._id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={addVideoId}
                onChange={(e) => setAddVideoId(e.target.value)}
                placeholder="Paste a video ID to add..."
                className="flex-1 bg-tertiary border border-border-subtle rounded-lg px-4 py-2 text-sm text-text-primary placeholder-text-tertiary/60 focus:outline-none focus:border-accent transition-colors"
              />
              <Button size="sm" loading={addingVideo} onClick={handleAddVideo} disabled={!addVideoId.trim()}>Add</Button>
            </div>
            <button
              onClick={toggleUserVideos}
              className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors"
            >
              {showUserVideos ? '▾' : '▸'} Browse your videos
            </button>
            {showUserVideos && (
              <div className="bg-secondary border border-border-subtle rounded-xl p-4">
                {loadingUserVideos ? (
                  <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="w-full aspect-video rounded-lg" />
                    ))}
                  </div>
                ) : userVideos.length > 0 ? (
                  <>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {userVideos.map((video) => {
                        const alreadyInPlaylist = playlistVideos.some(v => v._id === video._id)
                        return (
                          <button
                            key={video._id}
                            onClick={() => !alreadyInPlaylist && handleSelectUserVideo(video._id)}
                            disabled={alreadyInPlaylist || addingUserVideo === video._id}
                            className={`relative group text-left rounded-lg overflow-hidden border transition-all ${alreadyInPlaylist
                              ? 'border-state-success/30 opacity-60 cursor-not-allowed'
                              : 'border-border-subtle hover:border-accent/30 hover:shadow-card-hover'
                              }`}
                          >
                            <div className="w-full aspect-video bg-tertiary overflow-hidden">
                              <img
                                src={video.thumbnail?.url || 'https://placehold.co/320x180/1C1C2E/6B6B80?text=No+Thumbnail'}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="p-2">
                              <p className="text-xs text-text-primary line-clamp-2 leading-tight">{video.title}</p>
                            </div>
                            {alreadyInPlaylist && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="text-xs font-semibold text-white bg-state-success px-2 py-0.5 rounded">Added</span>
                              </div>
                            )}
                            {addingUserVideo === video._id && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-xs text-white">Adding...</span>
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                    {hasMoreUserVideos && (
                      <button
                        onClick={() => fetchUserVideos(userVideoPage + 1)}
                        disabled={loadingMoreVideos}
                        className="w-full py-2 text-sm text-accent hover:text-accent-hover transition-colors disabled:opacity-50 border border-border-subtle rounded-lg"
                      >
                        {loadingMoreVideos ? 'Loading...' : 'Load more'}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-text-tertiary text-center py-4">You haven't uploaded any videos yet</p>
                )}
              </div>
            )}
          </div>
          {playlistVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlistVideos.map((video) => (
                <div key={video._id} className="relative group">
                  <Link to={`/video/${video._id}`} className="block">
                    <div className="bg-secondary border border-border-subtle rounded-xl overflow-hidden transition-all duration-200 hover:border-accent/30 hover:shadow-card-hover">
                      <div className="w-full aspect-video bg-tertiary overflow-hidden">
                        <img
                          src={video.thumbnail?.url || 'https://placehold.co/320x180/1C1C2E/6B6B80?text=No+Thumbnail'}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-text-primary text-sm line-clamp-2">{video.title}</h3>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleRemoveVideo(video._id)}
                    disabled={removingVideo === video._id}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-tertiary text-sm">This playlist is empty</p>
          )}
        </div>
      )}

      <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setEditingPlaylist(null) }} title="Edit Playlist">
        <div className="space-y-4">
          <Input
            label="Playlist Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="My awesome playlist"
          />
          <Input
            label="Description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="A short description of this playlist"
          />
          <div className="flex gap-3">
            <Button fullWidth variant="secondary" onClick={() => { setShowEditModal(false); setEditingPlaylist(null) }}>Cancel</Button>
            <Button fullWidth onClick={handleEditPlaylist}>Save</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Playlist">
        <div className="space-y-4">
          <Input
            label="Playlist Name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="My awesome playlist"
          />
          <Input
            label="Description"
            value={newPlaylistDescription}
            onChange={(e) => setNewPlaylistDescription(e.target.value)}
            placeholder="A short description of this playlist"
          />
          <div className="flex gap-3">
            <Button fullWidth variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button fullWidth onClick={handleCreatePlaylist}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
