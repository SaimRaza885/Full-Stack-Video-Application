import { useState, useEffect } from 'react'
import { playlistAPI } from '../services/endpoints'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'

export const usePlaylistMenu = (videoId) => {
  const { user, isAuthenticated } = useAuth()
  const { addNotification } = useUI()
  const [playlists, setPlaylists] = useState([])
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false)
  const [savingToPlaylist, setSavingToPlaylist] = useState(null)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [creatingPlaylist, setCreatingPlaylist] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      playlistAPI.getUserPlaylists(user._id).then(res => {
        setPlaylists(res.data.data || [])
      }).catch(() => {})
    }
  }, [isAuthenticated, user?._id])

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
      setPlaylists(prev => [...prev, newPlaylist])
    } catch {
      addNotification('Failed to create playlist', 'error')
    } finally {
      setCreatingPlaylist(false)
    }
  }

  const handleRefreshPlaylists = () => {
    if (isAuthenticated) {
      playlistAPI.getUserPlaylists(user._id).then(res => {
        setPlaylists(res.data.data || [])
      }).catch(() => {})
    }
    addNotification('Playlists refreshed', 'info')
  }

  return {
    playlists, showPlaylistMenu, savingToPlaylist, newPlaylistName, creatingPlaylist,
    handleSaveToPlaylist, handleCreateAndSave, setShowPlaylistMenu, setNewPlaylistName,
    handleRefreshPlaylists,
  }
}
