import React from 'react'
import { Video, Image as ImageIcon } from 'lucide-react'

export const MediaUploadDropzones = ({ formData, errors, handleFileChange }) => {
    return (
        <div className="space-y-6">
            <div className="bg-secondary/40 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-sm font-semibold text-gray-300 mb-3">Video Source File</h2>
                <label className={`group relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 min-h-[160px] ${formData.file
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : errors.file ? 'border-red-500/50 bg-red-500/5' : 'border-gray-700 hover:border-gray-500 bg-tertiary/30'
                    }`}>
                    <input
                        type="file"
                        name="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="sr-only"
                    />
                    <Video className={`w-8 h-8 mb-3 transition-colors ${formData.file ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-400'}`} />

                    {formData.file ? (
                        <div className="space-y-1 px-2 max-w-full">
                            <p className="text-xs font-medium text-emerald-400 truncate">{formData.file.name}</p>
                            <p className="text-[10px] text-gray-400">{(formData.file.size / (1024 * 1024)).toFixed(1)} MB</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-white">Click to choose video file</p>
                            <p className="text-[11px] text-gray-500">MP4, MKV, or MOV formats</p>
                        </div>
                    )}
                </label>
                {errors.file && <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">⚠ {errors.file}</p>}
            </div>

            <div className="bg-secondary/40 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-sm font-semibold text-gray-300 mb-3">Cover Thumbnail <span className="text-gray-500 text-xs font-normal">(Optional)</span></h2>
                <label className={`group relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 min-h-[160px] ${formData.thumbnail
                    ? 'border-blue-500/50 bg-blue-500/5'
                    : 'border-gray-700 hover:border-gray-500 bg-tertiary/30'
                    }`}>
                    <input
                        type="file"
                        name="thumbnail"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                    />
                    <ImageIcon className={`w-8 h-8 mb-3 transition-colors ${formData.thumbnail ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'}`} />

                    {formData.thumbnail ? (
                        <div className="space-y-1 px-2 max-w-full">
                            <p className="text-xs font-medium text-blue-400 truncate">{formData.thumbnail.name}</p>
                            <p className="text-[10px] text-gray-400">Image selected</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-white">Select a cover picture</p>
                            <p className="text-[11px] text-gray-500">PNG, JPG or WebP images</p>
                        </div>
                    )}
                </label>
            </div>
        </div>
    )
}
