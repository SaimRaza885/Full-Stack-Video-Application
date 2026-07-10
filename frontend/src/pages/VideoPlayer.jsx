import { useParams } from 'react-router-dom'
import { useVideoPlayerData } from '../hooks/useVideoPlayerData'
import { useAuth } from '../context/AuthContext'
import { fmt, ago } from '../utils'
import { Skeleton } from '../components'
import {
  VideoSection, VideoHeader, VideoActions, ChannelCard,
  VideoDescription, CommentSection, RelatedVideos,
} from '../components/videoPlayer'

export const VideoPlayer = () => {
  const { videoId } = useParams()
  const { user, isAuthenticated } = useAuth()

  const {
    video, loading, owner, ownerUsername, ownerAvatar,
    isLiked, isDisliked, likeCount,
    isSubscribed, subscriberCount,
    handleLike, handleDislike, handleSubscribe, handleDeleteVideo,
    playlists, showPlaylistMenu, savingToPlaylist, newPlaylistName, creatingPlaylist,
    handleSaveToPlaylist, handleCreateAndSave, setShowPlaylistMenu, setNewPlaylistName,
    handleRefreshPlaylists,
    comments, newComment, commentLoading,
    editingCommentId, editCommentContent, actionLoadingId,
    setNewComment, handleAddComment, handleUpdateComment, handleDeleteComment,
    setEditingCommentId, setEditCommentContent,
    relatedVideos, relatedLoading,
  } = useVideoPlayerData(videoId)

  if (loading) {
    return (
      <div className="container-custom py-8">
        <Skeleton className="w-full aspect-video rounded-xl" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (!video) {
    return <div className="container-custom py-8 text-center text-text-secondary">Video not found</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <VideoSection video={video} />

          <div>
            <VideoHeader title={video.title} />
            <div className="flex items-center justify-between flex-wrap gap-3 mt-2">
              <p className="text-sm text-text-tertiary">{fmt(video.views)} views &bull; {ago(video.createdAt)}</p>
              <VideoActions
                isLiked={isLiked}
                isDisliked={isDisliked}
                likeCount={likeCount}
                isAuthenticated={isAuthenticated}
                onLike={handleLike}
                onDislike={handleDislike}
                showPlaylistMenu={showPlaylistMenu}
                playlists={playlists}
                savingToPlaylist={savingToPlaylist}
                newPlaylistName={newPlaylistName}
                creatingPlaylist={creatingPlaylist}
                onTogglePlaylist={() => setShowPlaylistMenu(!showPlaylistMenu)}
                onSaveToPlaylist={handleSaveToPlaylist}
                onCreatePlaylist={handleCreateAndSave}
                onNewPlaylistNameChange={setNewPlaylistName}
                onRefreshPlaylists={handleRefreshPlaylists}
              />
            </div>
          </div>

          <ChannelCard
            owner={owner}
            ownerUsername={ownerUsername}
            ownerAvatar={ownerAvatar}
            subscriberCount={subscriberCount}
            isSubscribed={isSubscribed}
            isOwner={user?._id === video.owner?._id}
            videoId={video._id}
            onSubscribe={handleSubscribe}
            onDelete={handleDeleteVideo}
          />

          <VideoDescription description={video.description} />

          <CommentSection
            comments={comments}
            newComment={newComment}
            commentLoading={commentLoading}
            editingCommentId={editingCommentId}
            editCommentContent={editCommentContent}
            actionLoadingId={actionLoadingId}
            currentUserId={user?._id}
            onAddComment={handleAddComment}
            onNewCommentChange={setNewComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
            onEditStart={(id, content) => { setEditingCommentId(id); setEditCommentContent(content) }}
            onEditCancel={() => setEditingCommentId(null)}
            onEditContentChange={setEditCommentContent}
          />
        </div>

        <RelatedVideos videos={relatedVideos} loading={relatedLoading} />
      </div>
    </div>
  )
}
