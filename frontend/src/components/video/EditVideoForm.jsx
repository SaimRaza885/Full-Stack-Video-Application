import React from 'react'
import { Button, Input, Textarea } from '../../components'
import { ThumbnailUploader } from './ThumbnailUploader'
import { VisibilityToggle } from './VisibilityToggle'

export const EditVideoForm = ({ 
    formData, 
    errors, 
    thumbnailPreview, 
    submitting, 
    handleChange, 
    handleFileChange, 
    togglePublish, 
    handleSubmit,
    onCancel
}) => {
    return (
        <form onSubmit={handleSubmit} className="bg-secondary rounded-lg p-8 space-y-6">
            <Input
                label="Video Title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Update video title"
                error={errors.title}
            />

            <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Update video description"
                rows={5}
                error={errors.description}
            />

            <ThumbnailUploader 
                thumbnailPreview={thumbnailPreview} 
                onFileChange={handleFileChange} 
            />

            <VisibilityToggle 
                isPublished={formData.isPublished} 
                onToggle={togglePublish} 
            />

            <div className="flex items-center gap-4 pt-2">
                <Button
                    type="button"
                    variant="secondary"
                    className="w-1/2 bg-tertiary hover:bg-elevated"
                    onClick={onCancel}
                    disabled={submitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="w-1/2"
                    loading={submitting}
                >
                    Save Changes
                </Button>
            </div>
        </form>
    )
}
