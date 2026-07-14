import React from 'react'
import { Link } from 'react-router-dom'
import { Video, Pencil, Trash2 } from 'lucide-react'
import { EmptyState } from '../../components'
import { fmt } from '../../utils'

export const ChannelVideos = ({
    videos,
    loading,
    currentUser,
    channel,
    navigate,
    handleDeleteVideo
}) => {
    if (videos.length === 0) {
        return !loading ? <EmptyState icon={Video} title="No videos yet" description="This channel hasn't uploaded any videos" /> : null
    }

    return (
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
    )
}
