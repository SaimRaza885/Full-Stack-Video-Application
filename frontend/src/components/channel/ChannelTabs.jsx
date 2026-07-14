import React from 'react'

export const ChannelTabs = ({ activeTab, setActiveTab, setSelectedPlaylist }) => {
    return (
        <div className="flex gap-6 border-b border-border-subtle mb-6">
            <button
                onClick={() => { setActiveTab('videos'); setSelectedPlaylist(null) }}
                className={`px-4 py-3 font-semibold text-sm transition-colors ${activeTab === 'videos' ? 'text-accent border-b-2 border-accent' : 'text-text-secondary hover:text-text-primary'}`}
            >
                Videos
            </button>
            <button
                onClick={() => setActiveTab('playlists')}
                className={`px-4 py-3 font-semibold text-sm transition-colors ${activeTab === 'playlists' ? 'text-accent border-b-2 border-accent' : 'text-text-secondary hover:text-text-primary'}`}
            >
                Playlists
            </button>
        </div>
    )
}
