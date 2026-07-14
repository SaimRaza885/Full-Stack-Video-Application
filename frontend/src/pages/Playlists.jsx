import { Button, Skeleton, ErrorState } from '../components'
import { usePlaylists } from '../hooks/usePlaylists'
import { PlaylistGrid } from '../components/playlist/PlaylistGrid'
import { PlaylistDetails } from '../components/playlist/PlaylistDetails'
import { CreatePlaylistModal, EditPlaylistModal } from '../components/playlist/PlaylistModals'

export const Playlists = () => {
  const { user, loading, error, playlists, handleSelectPlaylist, detail, create, edit } = usePlaylists()

  if (!user) return <div className="container-custom py-8 text-center text-text-secondary">Please log in to view playlists</div>
  if (loading) return <div className="container-custom py-8"><Skeleton className="w-full h-48 rounded-xl" /></div>
  if (error) return <div className="container-custom py-8"><ErrorState message={error} onRetry={() => window.location.reload()} /></div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Your Playlists</h1>
        <Button onClick={() => create.setShowModal(true)}>Create Playlist</Button>
      </div>

      {!detail.selectedPlaylist ? (
        <PlaylistGrid
          playlists={playlists}
          handleSelectPlaylist={handleSelectPlaylist}
        />
      ) : (
        <PlaylistDetails {...detail} />
      )}

      <EditPlaylistModal {...edit} />
      <CreatePlaylistModal {...create} />
    </div>
  )
}
