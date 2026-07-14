import React from 'react'
import { User, Upload } from 'lucide-react'

export const ImageUploaders = ({
    coverImageRef,
    coverImagePreview,
    handleCoverImageSelect,
    fileInputRef,
    avatarPreview,
    handleAvatarSelect
}) => {
    return (
        <>
            {/* coverImage Selection Panel */}
            <div className="relative">
                <div
                    onClick={() => coverImageRef.current?.click()}
                    className="h-20 bg-tertiary border-2 border-dashed border-border-subtle hover:border-accent/50 flex items-center justify-center cursor-pointer transition-colors overflow-hidden rounded-xl"
                >
                    {coverImagePreview ? (
                        <img src={coverImagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className='flex items-center gap-1'>
                            <User className="w-6 h-6 text-text-tertiary" />
                            <span className='text-sm text-gray-500 italic'>Upload Cover Image</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Upload className="w-5 h-5 text-white" />
                    </div>
                </div>
                <input ref={coverImageRef} type="file" accept="image/*" className="hidden" onChange={handleCoverImageSelect} />
            </div>

            {/* Avatar Selection Circle */}
            <div className="flex justify-center">
                <div className="relative">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 rounded-full bg-tertiary border-2 border-dashed border-border-subtle hover:border-accent/50 flex items-center justify-center cursor-pointer transition-colors overflow-hidden"
                    >
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className='flex flex-col items-center'>
                                <User className="w-6 h-6 text-text-tertiary" />
                                <span className='text-[10px] text-gray-500 italic'>Avatar</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                            <Upload className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarSelect} />
                </div>
            </div>
        </>
    )
}
