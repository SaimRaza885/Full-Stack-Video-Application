import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useVideo } from '../hooks/useVideo'
import { useLike } from '../hooks/useLike'
import { useSubscription } from '../hooks/useSubscription'
import { usePlaylistMenu } from '../hooks/usePlaylistMenu'
import { useComments } from '../hooks/useComments'
import { useRelatedVideos } from '../hooks/useRelatedVideos'
import { fmt, ago } from '../utils'
import { Skeleton } from '../components'
import {
  VideoSection, VideoHeader, VideoActions, ChannelCard,
  VideoDescription, CommentSection, RelatedVideos,
} from '../components/videoPlayer'
import ad_image from '../tokens/ad_image.jpg';
export const VideoPlayer = () => {
  const { videoId } = useParams()
  const { user, isAuthenticated } = useAuth()

  const { video, loading, owner, ownerUsername, ownerAvatar, handleDeleteVideo } = useVideo(videoId)
  const { isLiked, isDisliked, likeCount, handleLike, handleDislike } = useLike(videoId, video)
  const { isSubscribed, subscriberCount, handleSubscribe } = useSubscription(video)
  const {
    playlists, showPlaylistMenu, savingToPlaylist, newPlaylistName, creatingPlaylist,
    handleSaveToPlaylist, handleCreateAndSave, setShowPlaylistMenu, setNewPlaylistName,
    handleRefreshPlaylists,
  } = usePlaylistMenu(videoId)
  const {
    comments, newComment, commentLoading,
    editingCommentId, editCommentContent, actionLoadingId,
    setNewComment, handleAddComment, handleUpdateComment, handleDeleteComment,
    setEditingCommentId, setEditCommentContent,
  } = useComments(videoId, video)
  const { relatedVideos, relatedLoading } = useRelatedVideos(video)

  if (!loading && !video) {
    return <div className="container-custom py-8 text-center text-text-secondary">Video not found</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <Skeleton className="w-full aspect-video rounded-xl" />
          ) : (
            <VideoSection
              video={video}
              adVideo={{
                image: ad_image,
                skipAfter: 5,
                title: 'Discover Premium',
                description: 'Unlock exclusive content with our premium plan.',
              }}
            />
          )}

          <div>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-7 w-3/4" />
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-8 w-64" />
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

          {loading ? (
            <Skeleton className="h-20 w-full rounded-xl" />
          ) : (
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
          )}

          {loading ? null : <VideoDescription description={video.description} />}

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-20 w-full rounded-xl" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
          )}
        </div>

        <RelatedVideos videos={relatedVideos} loading={loading} relatedvideos_loading={relatedLoading} />
      </div>
    </div>
  )
}
