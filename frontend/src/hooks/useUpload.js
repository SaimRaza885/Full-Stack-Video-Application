import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { videoAPI } from '../services/endpoints'

export const useUpload = () => {
    const { isAuthenticated, loading: authLoading } = useAuth()
    const navigate = useNavigate()
    const { addNotification, addUpload, updateUpload } = useUI()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        file: null,
        thumbnail: null,
        isPublished: true,
    })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login', { replace: true })
        }
    }, [isAuthenticated, authLoading, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const handleFileChange = (e) => {
        const { name, files } = e.target
        if (files && files[0]) {
            setFormData(prev => ({ ...prev, [name]: files[0] }))
            if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const togglePublish = (status) => {
        setFormData(prev => ({ ...prev, isPublished: status }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = {}

        if (!formData.title) newErrors.title = 'Title is required'
        if (!formData.description) newErrors.description = 'Description is required'
        if (!formData.file) newErrors.file = 'Video file is required'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        const uploadId = Date.now()
        const fileName = formData.file.name

        addUpload(uploadId, fileName)
        navigate('/')

        try {
            const form = new FormData()
            form.append('title', formData.title)
            form.append('description', formData.description)
            form.append('videoFile', formData.file)
            form.append('isPublished', formData.isPublished)
            if (formData.thumbnail) form.append('thumbnail', formData.thumbnail)

            await videoAPI.uploadVideo(form, (e) => {
                const pct = Math.round((e.loaded / e.total) * 100)
                updateUpload(uploadId, { progress: pct })
            })
            updateUpload(uploadId, { progress: 100, status: 'done' })
            addNotification('Video uploaded successfully!', 'success')
        } catch (err) {
            updateUpload(uploadId, { status: 'error' })
            addNotification(err.response?.data?.message || 'Upload failed', 'error')
        }
    }

    return {
        authLoading,
        formData,
        errors,
        handleChange,
        handleFileChange,
        togglePublish,
        handleSubmit
    }
}
