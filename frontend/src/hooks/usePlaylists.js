import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { playlistAPI, videoAPI } from '../services/endpoints'
import { useUI } from '../context/UIContext'

export const usePlaylists = () => {
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

    return {
        user,
        playlists,
        loading,
        error,
        selectedPlaylist,
        setSelectedPlaylist,
        playlistVideos,
        setPlaylistVideos,
        showModal,
        setShowModal,
        newPlaylistName,
        setNewPlaylistName,
        newPlaylistDescription,
        setNewPlaylistDescription,
        addVideoId,
        setAddVideoId,
        addingVideo,
        showEditModal,
        setShowEditModal,
        editingPlaylist,
        setEditingPlaylist,
        editName,
        setEditName,
        editDescription,
        setEditDescription,
        removingVideo,
        userVideos,
        loadingUserVideos,
        showUserVideos,
        userVideoPage,
        hasMoreUserVideos,
        loadingMoreVideos,
        addingUserVideo,
        handleSelectPlaylist,
        handleCreatePlaylist,
        handleAddVideo,
        handleDeletePlaylist,
        handleEditPlaylist,
        handleRemoveVideo,
        fetchUserVideos,
        handleSelectUserVideo,
        toggleUserVideos
    }
}
