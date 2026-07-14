import React from 'react'
import { Input, Textarea } from '../../components'

export const UploadForm = ({ formData, errors, handleChange }) => {
    return (
        <div className="bg-secondary/40 border border-gray-800 rounded-xl p-6 space-y-5 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-2">Details</h2>
            <Input
                label="Title (required)"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Add a title that describes your video"
                error={errors.title}
                className="bg-tertiary/60 border-gray-700 text-white placeholder-gray-500 focus:border-accent"
            />
            <Textarea
                label="Description (required)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell viewers about your video"
                rows={6}
                error={errors.description}
                className="bg-tertiary/60 border-gray-700 text-white placeholder-gray-500 focus:border-accent"
            />
        </div>
    )
}
