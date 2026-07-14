
import { Link } from 'react-router-dom'
import { ListMusic, ArrowLeft } from 'lucide-react'
import { EmptyState, Skeleton } from '../../components'
import { fmt } from '../../utils'

export const ChannelPlaylists = ({
    playlists,
    loading,
    selectedPlaylist,
    setSelectedPlaylist,
    playlistVideos,
    setPlaylistVideos,
    loadingPlaylistVideos,
    handleSelectPlaylist
}) => {
    if (!selectedPlaylist) {
        if (playlists.length === 0) {
            return !loading ? <EmptyState icon={ListMusic} title="No playlists yet" description="This channel hasn't created any playlists" /> : null
        }

        return (
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
        )
    }

    return (
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
    )
}
