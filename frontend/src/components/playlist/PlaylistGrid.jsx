import React from 'react'
import { ListMusic } from 'lucide-react'
import { EmptyState } from '../../components'

export const PlaylistGrid = ({ playlists, handleSelectPlaylist }) => {
    if (playlists.length === 0) {
        return <EmptyState icon={ListMusic} title="No playlists yet" description="Create your first playlist to organize videos" />
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
                    </div>
                </div>
            ))}
        </div>
    )
}
