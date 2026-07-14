import { Skeleton, ErrorState } from '../components'
import { useChannel } from '../hooks/useChannel'
import { ChannelHeader } from '../components/channel/ChannelHeader'
import { ChannelTabs } from '../components/channel/ChannelTabs'
import { ChannelVideos } from '../components/channel/ChannelVideos'
import { ChannelPlaylists } from '../components/channel/ChannelPlaylists'

export const Channel = () => {
  const {
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
  } = useChannel()

  if (loading) {
    return (
      <div className="container-custom py-8">
        <Skeleton className="w-full h-48 rounded-xl mb-6" />
        <div className="flex gap-4">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="container-custom py-8 text-center text-text-secondary">
        Channel not found
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <ChannelHeader 
        channel={channel}
        videos={videos}
        isSubscribed={isSubscribed}
        isChannelOwner={isChannelOwner}
        handleSubscribe={handleSubscribe}
        navigate={navigate}
      />

      <ChannelTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedPlaylist={setSelectedPlaylist}
      />

      {activeTab === 'videos' ? (
        <ChannelVideos 
          videos={videos}
          loading={loading}
          currentUser={currentUser}
          channel={channel}
          navigate={navigate}
          handleDeleteVideo={handleDeleteVideo}
        />
      ) : (
        <ChannelPlaylists 
          playlists={playlists}
          loading={loading}
          selectedPlaylist={selectedPlaylist}
          setSelectedPlaylist={setSelectedPlaylist}
          playlistVideos={playlistVideos}
          setPlaylistVideos={setPlaylistVideos}
          loadingPlaylistVideos={loadingPlaylistVideos}
          handleSelectPlaylist={handleSelectPlaylist}
        />
      )}
    </div>
  )
}
