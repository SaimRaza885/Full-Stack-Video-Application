import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { videoAPI } from '../services/endpoints'

export const useEditVideo = (videoId) => {
    const navigate = useNavigate()
    const { isAuthenticated, user, loading: authLoading } = useAuth()
    const { addNotification } = useUI()

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [initialPublishStatus, setInitialPublishStatus] = useState(true)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnail: null,
        isPublished: true,
    })
    const [thumbnailPreview, setThumbnailPreview] = useState('')
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login', { replace: true })
        }
    }, [isAuthenticated, authLoading, navigate])

    useEffect(() => {
        const fetchVideoDetails = async () => {
            try {
                setLoading(true)
                const response = await videoAPI.getVideoById(videoId)
                const videoData = response.data.data

                if (user && videoData.owner?._id !== user._id) {
                    addNotification('You do not have permission to edit this video', 'error')
                    navigate(`/video/${videoId}`)
                    return
                }

                setFormData({
                    title: videoData.title || '',
                    description: videoData.description || '',
                    thumbnail: null,
                    isPublished: videoData.isPublished !== undefined ? videoData.isPublished : true,
                })
                setInitialPublishStatus(videoData.isPublished !== undefined ? videoData.isPublished : true)
                if (videoData.thumbnail?.url) {
                    setThumbnailPreview(videoData.thumbnail.url)
                }
            } catch (err) {
                addNotification('Failed to load video details', 'error')
                navigate('/')
            } finally {
                setLoading(false)
            }
        }

        if (isAuthenticated && user) {
            fetchVideoDetails()
        }
    }, [videoId, isAuthenticated, user, navigate, addNotification])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({ ...prev, thumbnail: file }))
            setThumbnailPreview(URL.createObjectURL(file))
        }
    }

    const togglePublish = () => {
        setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = {}

        if (!formData.title.trim()) newErrors.title = 'Title is required'
        if (!formData.description.trim()) newErrors.description = 'Description is required'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            setSubmitting(true)
            const form = new FormData()
            form.append('title', formData.title)
            form.append('description', formData.description)
            if (formData.thumbnail) {
                form.append('thumbnail', formData.thumbnail)
            }

            const updatePromises = [videoAPI.updateVideo(videoId, form)]

            if (formData.isPublished !== initialPublishStatus) {
                updatePromises.push(
                    videoAPI.togglePublishStatus(videoId, { isPublished: formData.isPublished })
                )
            }

            await Promise.all(updatePromises)
            addNotification('Video updated successfully!', 'success')
            navigate(`/video/${videoId}`)
        } catch (err) {
            addNotification(err.response?.data?.message || 'Failed to update video', 'error')
        } finally {
            setSubmitting(false)
        }
    }

    return {
        authLoading,
        loading,
        submitting,
        formData,
        thumbnailPreview,
        errors,
        handleChange,
        handleFileChange,
        togglePublish,
        handleSubmit,
        navigate
    }
}
