import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { channelAPI, videoAPI, playlistAPI } from '../services/endpoints'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'

export const useChannel = () => {
    const { username } = useParams()
    const navigate = useNavigate()
    const { user: currentUser } = useAuth()
    const { addNotification } = useUI()
    
    const [channel, setChannel] = useState(null)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [playlists, setPlaylists] = useState([])
    const [activeTab, setActiveTab] = useState('videos')
    const [selectedPlaylist, setSelectedPlaylist] = useState(null)
    const [playlistVideos, setPlaylistVideos] = useState([])
    const [loadingPlaylistVideos, setLoadingPlaylistVideos] = useState(false)
    const [isChannelOwner, setIsChannelOwner] = useState(false)

    useEffect(() => {
        const fetchChannel = async () => {
            try {
                setLoading(true)
                setError(null)
                const channelRes = await channelAPI.getChannelByUsername(username)
                const channelData = channelRes.data.data
                setChannel(channelData)
                setIsSubscribed(channelData.isSubscribe || false)
                if (currentUser && channelData._id === currentUser._id) {
                    setIsChannelOwner(true)
                }

                const [videosRes, playlistsRes] = await Promise.allSettled([
                    videoAPI.getVideosByUser(channelData._id),
                    playlistAPI.getUserPlaylists(channelData._id),
                ])
                if (videosRes.status === 'fulfilled') {
                    setVideos(videosRes.value.data.data?.docs || videosRes.value.data.data || [])
                }
                if (playlistsRes.status === 'fulfilled') {
                    setPlaylists(playlistsRes.value.data.data || [])
                }
            } catch (err) {
                setError('Failed to load channel')
            } finally {
                setLoading(false)
            }
        }
        if (username) {
            fetchChannel()
        }
    }, [username, currentUser])

    const handleSelectPlaylist = async (playlist) => {
        setSelectedPlaylist(playlist)
        setLoadingPlaylistVideos(true)
        try {
            const res = await playlistAPI.getPlaylistById(playlist._id)
            setPlaylistVideos(res.data.data?.Videos || [])
        } catch {
            addNotification('Failed to load playlist', 'error')
        } finally {
            setLoadingPlaylistVideos(false)
        }
    }

    const handleSubscribe = async () => {
        if (!currentUser) { 
            addNotification('Please login to subscribe', 'info')
            return 
        }
        try {
            const res = await channelAPI.subscribeChannel(channel._id)
            setIsSubscribed(res.data.data.isSubscribed)
        } catch { 
            addNotification('Failed to subscribe', 'error') 
        }
    }

    const handleDeleteVideo = async (videoId, e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!window.confirm('Delete this video permanently?')) return
        try {
            await videoAPI.deleteVideo(videoId)
            setVideos(prev => prev.filter(v => v._id !== videoId))
            addNotification('Video deleted', 'success')
        } catch {
            addNotification('Failed to delete video', 'error')
        }
    }

    return {
        channel,
        currentUser,
        videos,
        loading,
        error,
        isSubscribed,
        playlists,
        activeTab,
        setActiveTab,
        selectedPlaylist,
        setSelectedPlaylist,
        playlistVideos,
        setPlaylistVideos,
        loadingPlaylistVideos,
        isChannelOwner,
        handleSelectPlaylist,
        handleSubscribe,
        handleDeleteVideo,
        navigate
    }
}
