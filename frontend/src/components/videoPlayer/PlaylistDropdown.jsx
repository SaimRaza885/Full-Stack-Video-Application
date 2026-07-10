import { ListMusic, Check } from 'lucide-react'

export const PlaylistDropdown = ({
  playlists, savingToPlaylist, newPlaylistName, creatingPlaylist,
  onSave, onCreate, onNewPlaylistNameChange, onRefresh, onClose,
}) => (
  <div className="absolute right-0 top-full mt-2 w-64 bg-secondary border border-border-subtle rounded-xl shadow-dropdown z-50 py-2">
    <div className="flex items-center justify-between px-4 py-2">
      <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Save to playlist</p>
      <button onClick={onRefresh} className="text-xs text-accent hover:text-accent-hover transition-colors">Refresh</button>
    </div>
    <div className="max-h-48 overflow-y-auto">
      {playlists.length > 0 ? playlists.map(p => (
        <button
          key={p._id}
          onClick={() => onSave(p._id)}
          disabled={savingToPlaylist === p._id}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-tertiary transition-colors disabled:opacity-50"
        >
          <ListMusic className="w-4 h-4 text-accent shrink-0" />
          <span className="truncate">{p.name}</span>
          {savingToPlaylist === p._id && <Check className="w-4 h-4 text-state-success ml-auto shrink-0" />}
        </button>
      )) : (
        <p className="px-4 py-2 text-sm text-text-tertiary text-center">No playlists yet</p>
      )}
    </div>
    <div className="border-t border-border-subtle mt-2 pt-2 px-4">
      <input
        type="text"
        value={newPlaylistName}
        onChange={(e) => onNewPlaylistNameChange(e.target.value)}
        placeholder="New playlist name..."
        className="w-full bg-tertiary border border-border-subtle rounded-lg px-3 py-1.5 text-sm text-text-primary placeholder-text-tertiary/60 focus:outline-none focus:border-accent transition-colors mb-2"
      />
      <button
        onClick={onCreate}
        disabled={!newPlaylistName.trim() || creatingPlaylist}
        className="w-full py-1.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
      >
        {creatingPlaylist ? 'Creating...' : 'Create & Add'}
      </button>
    </div>
  </div>
)
