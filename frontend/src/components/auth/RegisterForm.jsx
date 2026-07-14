import React from 'react'
import { Input, Button } from '../../components'
import { ImageUploaders } from './ImageUploaders'

export const RegisterForm = ({
    formData,
    errors,
    handleChange,
    coverImageRef,
    coverImagePreview,
    handleCoverImageSelect,
    fileInputRef,
    avatarPreview,
    handleAvatarSelect,
    handleSubmit,
    loading
}) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUploaders 
                coverImageRef={coverImageRef}
                coverImagePreview={coverImagePreview}
                handleCoverImageSelect={handleCoverImageSelect}
                fileInputRef={fileInputRef}
                avatarPreview={avatarPreview}
                handleAvatarSelect={handleAvatarSelect}
            />

            <Input label="Full Name" type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" error={errors.fullName} />
            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" error={errors.email} />
            <Input label="Username" type="text" name="username" value={formData.username} onChange={handleChange} placeholder="username" error={errors.username} />
            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" error={errors.password} />
            <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" error={errors.confirmPassword} />

            <Button fullWidth loading={loading} type="submit" className="mt-2">Create Account</Button>
        </form>
    )
}
