import { Button, Skeleton, ErrorState } from '../components'
import { usePlaylists } from '../hooks/usePlaylists'
import { PlaylistGrid } from '../components/playlist/PlaylistGrid'
import { PlaylistDetails } from '../components/playlist/PlaylistDetails'
import { CreatePlaylistModal, EditPlaylistModal } from '../components/playlist/PlaylistModals'

export const Playlists = () => {
  const {
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
  } = usePlaylists()



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
        <PlaylistGrid
          playlists={playlists}
          handleSelectPlaylist={handleSelectPlaylist}
        />
      ) : (
        <PlaylistDetails
          selectedPlaylist={selectedPlaylist}
          setSelectedPlaylist={setSelectedPlaylist}
          setPlaylistVideos={setPlaylistVideos}
          playlistVideos={playlistVideos}
          setEditingPlaylist={setEditingPlaylist}
          setEditName={setEditName}
          setEditDescription={setEditDescription}
          setShowEditModal={setShowEditModal}
          handleDeletePlaylist={handleDeletePlaylist}
          addVideoId={addVideoId}
          setAddVideoId={setAddVideoId}
          addingVideo={addingVideo}
          handleAddVideo={handleAddVideo}
          toggleUserVideos={toggleUserVideos}
          showUserVideos={showUserVideos}
          loadingUserVideos={loadingUserVideos}
          userVideos={userVideos}
          handleSelectUserVideo={handleSelectUserVideo}
          addingUserVideo={addingUserVideo}
          hasMoreUserVideos={hasMoreUserVideos}
          fetchUserVideos={fetchUserVideos}
          userVideoPage={userVideoPage}
          loadingMoreVideos={loadingMoreVideos}
          handleRemoveVideo={handleRemoveVideo}
          removingVideo={removingVideo}
        />
      )}

      <EditPlaylistModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        setEditingPlaylist={setEditingPlaylist}
        editName={editName}
        setEditName={setEditName}
        editDescription={editDescription}
        setEditDescription={setEditDescription}
        handleEditPlaylist={handleEditPlaylist}
      />

      <CreatePlaylistModal
        showModal={showModal}
        setShowModal={setShowModal}
        newPlaylistName={newPlaylistName}
        setNewPlaylistName={setNewPlaylistName}
        newPlaylistDescription={newPlaylistDescription}
        setNewPlaylistDescription={setNewPlaylistDescription}
        handleCreatePlaylist={handleCreatePlaylist}
      />
    </div>
  )
}
