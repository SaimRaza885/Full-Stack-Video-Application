import React from 'react'

export const ThumbnailUploader = ({ thumbnailPreview, onFileChange }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Thumbnail Image</label>
            {thumbnailPreview && (
                <div className="mb-4 aspect-video w-48 rounded-lg overflow-hidden border border-border-subtle bg-black">
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                </div>
            )}
            <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={onFileChange}
                className="w-full bg-tertiary border border-text-secondary rounded-lg px-4 py-3 text-text-secondary file:mr-4 file:bg-accent file:border-0 file:text-white file:rounded file:cursor-pointer hover:file:bg-accent-hover"
            />
        </div>
    )
}
