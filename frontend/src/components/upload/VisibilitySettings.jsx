import React from 'react'
import { Eye, Globe, Lock } from 'lucide-react'

export const VisibilitySettings = ({ formData, togglePublish }) => {
    return (
        <div className="bg-secondary/40 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-white">Visibility Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                    onClick={() => togglePublish(true)}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex gap-4 ${formData.isPublished
                        ? 'border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/5'
                        : 'border-gray-800 bg-tertiary/40 hover:border-gray-700'
                        }`}
                >
                    <div className={`p-2 h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${formData.isPublished ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                        <Globe className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">Public</h3>
                        <p className="text-xs text-gray-400 mt-1">Everyone can watch your video instantly upon processing.</p>
                    </div>
                </div>
                <div
                    onClick={() => togglePublish(false)}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex gap-4 ${!formData.isPublished
                        ? 'border-amber-500 bg-amber-500/10 shadow-md shadow-amber-500/5'
                        : 'border-gray-800 bg-tertiary/40 hover:border-gray-700'
                        }`}
                >
                    <div className={`p-2 h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${!formData.isPublished ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                        <Lock className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">Private</h3>
                        <p className="text-xs text-gray-400 mt-1">Only you can view this video inside your channel manager.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
