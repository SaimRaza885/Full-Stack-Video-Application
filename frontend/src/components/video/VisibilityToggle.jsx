import React from 'react'
import { Eye, EyeOff } from 'lucide-react'

export const VisibilityToggle = ({ isPublished, onToggle }) => {
    return (
        <div className="bg-tertiary p-4 rounded-xl border border-border-subtle flex items-center justify-between">
            <div className="space-y-0.5">
                <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                    {isPublished ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-amber-400" />}
                    Video Visibility
                </label>
                <p className="text-xs text-text-tertiary">
                    {isPublished ? 'Public: Anyone can search for and view this video.' : 'Private: Only you can view this video.'}
                </p>
            </div>
            <button
                type="button"
                onClick={onToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isPublished ? 'bg-accent' : 'bg-text-secondary'}`}
            >
                <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isPublished ? 'translate-x-5' : 'translate-x-0'}`}
                />
            </button>
        </div>
    )
}
