import { useEffect, useState } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { channelAPI, videoAPI, playlistAPI } from '../services/endpoints'
import { Button, Skeleton, EmptyState, ErrorState } from '../components'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { User, Video, ListMusic, ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { fmt } from '../utils'

export const Channel = () => {
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
  const [IsChannelOwner, setIsChannelOwner] = useState(false)




  useEffect(() => {
    const fetchChannel = async () => {
      try {
        setLoading(true)
        setError(null)
        const channelRes = await channelAPI.getChannelByUsername(username)
        const channelData = channelRes.data.data
        setChannel(channelData)
        setIsSubscribed(channelData.isSubscribe || false)
        if (channelData._id === currentUser._id) {
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
    fetchChannel()
  }, [username])

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
    if (!currentUser) { addNotification('Please login to subscribe', 'info'); return }
    try {
      const res = await channelAPI.subscribeChannel(channel._id)
      setIsSubscribed(res.data.data.isSubscribed)
    } catch { addNotification('Failed to subscribe', 'error') }
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

  if (loading) return <div className="container-custom py-8"><Skeleton className="w-full h-48 rounded-xl mb-6" /><div className="flex gap-4"><Skeleton className="w-20 h-20 rounded-full" /><div className="flex-1"><Skeleton className="h-8 w-48 mb-2" /><Skeleton className="h-4 w-32" /></div></div></div>
  if (error) return <div className="container-custom py-8"><ErrorState message={error} onRetry={() => window.location.reload()} /></div>
  if (!channel) return <div className="container-custom py-8 text-center text-text-secondary">Channel not found</div>

  const avatarUrl = channel?.avatar?.url || null

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="w-full h-40 bg-gradient-to-r from-accent to-accent-hover rounded-xl mb-6 relative" >
        {channel?.coverImage &&
          <img src={channel?.coverImage?.url} alt="" className='w-full h-full object-cover ' />

        }

      </div>


      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div className="flex items-start gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt={channel.username} className="w-20 h-20 rounded-full border-4 border-primary object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full border-4 border-primary bg-tertiary flex items-center justify-center">
              <User className="w-10 h-10 text-text-tertiary" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{channel.fullName}</h1>
            <p className="text-text-secondary text-sm">@{channel.username}</p>
            <p className="text-text-tertiary text-sm mt-1 flex items-center gap-1.5 flex-wrap">
              <span>{fmt(channel.subscriberCount || 0)} subscribers</span>
              <span>&bull;</span>
              <span>{fmt(channel.channelSubscribeToCount || 0)} subscribed</span>
              <span>&bull;</span>
              <span>{videos?.length || 0} videos</span>
            </p>
          </div>
        </div>
        {!IsChannelOwner ? (

          <Button onClick={handleSubscribe} variant={isSubscribed ? 'secondary' : 'primary opacity-90'}>
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </Button>
        )


          :
          (

            <div className='flex items-center gap-2'>
              <Button onClick={() => navigate('/upload')} variant='primary'>
                Upload Video
              </Button>
            </div>
          )
        }
      </div>

      <div className="flex gap-6 border-b border-border-subtle mb-6">
        <button
          onClick={() => { setActiveTab('videos'); setSelectedPlaylist(null) }}
          className={`px-4 py-3 font-semibold text-sm transition-colors ${activeTab === 'videos' ? 'text-accent border-b-2 border-accent' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Videos
        </button>
        <button
          onClick={() => setActiveTab('playlists')}
          className={`px-4 py-3 font-semibold text-sm transition-colors ${activeTab === 'playlists' ? 'text-accent border-b-2 border-accent' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Playlists
        </button>
      </div>

      {activeTab === 'videos' ? (
        videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
              <Link key={video._id} to={`/video/${video._id}`} className="group block">
                <div className="bg-secondary border border-border-subtle rounded-xl overflow-hidden transition-all duration-200 hover:border-accent/30 hover:shadow-card-hover" >
                  <div className="relative w-full aspect-video bg-tertiary overflow-hidden">
                    <img
                      src={video.thumbnail?.url || 'https://placehold.co/320x180/1C1C2E/6B6B80?text=No+Thumbnail'}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {currentUser?._id === channel._id && (
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/video/edit/${video._id}`) }}
                          className="p-1.5 bg-black/60 text-white rounded-full hover:bg-accent transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteVideo(video._id, e)}
                          className="p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-text-primary text-sm line-clamp-2">{video.title}</h3>
                    <p className="text-text-tertiary text-xs mt-1">{fmt(video.views)} views</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          !loading && <EmptyState icon={Video} title="No videos yet" description="This channel hasn't uploaded any videos" />
        )
      ) : !selectedPlaylist ? (
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
                  {playlist.description && (
                    <p className="text-text-tertiary text-xs mt-1 line-clamp-1">{playlist.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && <EmptyState icon={ListMusic} title="No playlists yet" description="This channel hasn't created any playlists" />
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
          <h2 className="text-xl font-bold text-text-primary mb-4">{selectedPlaylist.name}</h2>
          {loadingPlaylistVideos ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-full aspect-video rounded-xl" />
              ))}
            </div>
          ) : playlistVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {playlistVideos.map((video) => (
                <Link key={video._id} to={`/video/${video._id}`} className="">
                  <div className="bg-secondary border border-border-subtle rounded-xl overflow-hidden transition-all duration-200 hover:border-accent/30 hover:shadow-card-hover" >
                    <div className="relative w-full aspect-video bg-tertiary overflow-hidden">
                      <img
                        src={video.thumbnail?.url || 'https://placehold.co/320x180/1C1C2E/6B6B80?text=No+Thumbnail'}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-text-primary text-sm line-clamp-2">{video.title}</h3>
                      <p className="text-text-tertiary text-xs mt-1">{fmt(video.views)} views</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-text-tertiary text-sm">This playlist is empty</p>
          )}
        </div>
      )}
    </div>
  )
}
