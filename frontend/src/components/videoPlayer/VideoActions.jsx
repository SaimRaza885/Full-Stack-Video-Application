import { ThumbsUp, ThumbsDown, Share2, BookmarkPlus } from 'lucide-react'
import { fmt } from '../../utils'
import { PlaylistDropdown } from './PlaylistDropdown'

export const VideoActions = ({
  isLiked, isDisliked, likeCount, isAuthenticated,
  onLike, onDislike,
  showPlaylistMenu, playlists, savingToPlaylist, newPlaylistName, creatingPlaylist,
  onTogglePlaylist, onSaveToPlaylist, onCreatePlaylist, onNewPlaylistNameChange, onRefreshPlaylists,
}) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center bg-tertiary rounded-full overflow-hidden">
      <button onClick={onLike} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors hover:bg-elevated border-r border-border-subtle ${isLiked ? 'text-accent' : 'text-text-secondary'}`}>
        <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-accent' : ''}`} />
        {likeCount > 0 && <span>{fmt(likeCount)}</span>}
      </button>
      <button onClick={onDislike} className={`px-4 py-2 text-sm font-medium transition-colors hover:bg-elevated ${isDisliked ? 'text-accent' : 'text-text-secondary'}`}>
        <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-accent' : ''}`} />
      </button>
    </div>
    <button className="flex items-center gap-1.5 px-4 py-2 bg-tertiary rounded-full text-sm font-medium text-text-secondary hover:bg-elevated transition-colors">
      <Share2 className="w-4 h-4" />
      <span className="hidden sm:inline">Share</span>
    </button>
    {isAuthenticated && (
      <div className="relative">
        <button onClick={onTogglePlaylist} className="flex items-center gap-1.5 px-4 py-2 bg-tertiary rounded-full text-sm font-medium text-text-secondary hover:bg-elevated transition-colors">
          <BookmarkPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Save</span>
        </button>
        {showPlaylistMenu && (
          <PlaylistDropdown
            playlists={playlists}
            savingToPlaylist={savingToPlaylist}
            newPlaylistName={newPlaylistName}
            creatingPlaylist={creatingPlaylist}
            onSave={onSaveToPlaylist}
            onCreate={onCreatePlaylist}
            onNewPlaylistNameChange={onNewPlaylistNameChange}
            onRefresh={onRefreshPlaylists}
          />
        )}
      </div>
    )}
  </div>
)
