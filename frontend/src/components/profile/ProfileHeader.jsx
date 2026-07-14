import React, { useRef } from 'react'
import { Avatar, Button } from '../../components'

export const ProfileHeader = ({
    user,
    coverPreview,
    avatarPreview,
    activeTab,
    setActiveTab,
    setIsEditing,
    handleCoverImageUpdate,
    handleAvatarUpdate
}) => {
    const fileInputRef = useRef(null)
    const coverImageRef = useRef(null)

    return (
        <div
            className="relative bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-10 overflow-hidden shadow-2xl ring-1 ring-white/10 bg-cover bg-center min-h-[240px] flex items-end"
            style={{ backgroundImage: coverPreview ? `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url(${coverPreview})` : 'none' }}
        >
            {!coverPreview && (
                <>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10 animate-pulse" />
                    <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500/5 rounded-full blur-[100px] -z-10" />
                </>
            )}

            <div className="absolute top-4 right-4 z-20">
                <button
                    type="button"
                    onClick={() => coverImageRef.current?.click()}
                    className="flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white border border-white/10 px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-sm transition-colors cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                    Change Banner
                </button>
                <input
                    type="file"
                    ref={coverImageRef}
                    accept="image/*"
                    onChange={handleCoverImageUpdate}
                    className="hidden"
                />
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 w-full">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                    <div
                        className="relative group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Avatar src={avatarPreview || user.avatar?.url} size="xl" className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background/80 shadow-2xl ring-2 ring-accent/30 object-cover rounded-full" />
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleAvatarUpdate}
                            className="hidden"
                        />
                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 border-4 border-transparent">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">{user.fullName}</h1>
                            <span className="px-2.5 py-0.5 bg-accent text-white border border-accent/20 rounded-full text-[11px] font-semibold text-accent tracking-wider uppercase">Partner</span>
                        </div>
                        <p className="text-accent font-medium text-base">@{user.username}</p>
                        <p className="text-text-tertiary text-xs flex items-center justify-center sm:justify-start gap-1.5">
                            Studio creator since {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <Button variant={activeTab === 'analytics' ? 'primary' : 'secondary'} onClick={() => { setActiveTab('analytics'); setIsEditing(false); }} className="flex-1 md:flex-none text-xs font-semibold px-4 py-2.5 rounded-xl transition-all">
                        Dashboard
                    </Button>
                    <Button variant={activeTab === 'edit' ? 'primary' : 'secondary'} onClick={() => { setActiveTab('edit'); setIsEditing(true); }} className="flex-1 md:flex-none text-xs font-semibold px-4 py-2.5 rounded-xl transition-all">
                        Settings
                    </Button>
                </div>
            </div>
        </div>
    )
}
