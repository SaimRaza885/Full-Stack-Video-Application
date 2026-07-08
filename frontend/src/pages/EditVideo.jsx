import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { videoAPI } from '../services/endpoints'
import { Button, Input, Textarea, Skeleton } from '../components'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

const EditVideo = () => {
    const { videoId } = useParams()
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

    // Fetch Existing Video Data
    useEffect(() => {
        const fetchVideoDetails = async () => {
            try {
                setLoading(true)
                const response = await videoAPI.getVideoById(videoId)
                const videoData = response.data.data

                // Security check: Only allow the owner to edit the video
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

    if (authLoading || loading) {
        return (
            <div className="container-custom py-8 max-w-2xl">
                <Skeleton className="h-8 w-1/3 mb-8" />
                <div className="space-y-6 bg-secondary rounded-lg p-8">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        )
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({ ...prev, thumbnail: file }))
            setThumbnailPreview(URL.createObjectURL(file)) // Local preview URL
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

            // 1. Core updates (Title, Description, Thumbnail) via FormData
            const form = new FormData()
            form.append('title', formData.title)
            form.append('description', formData.description)
            if (formData.thumbnail) {
                form.append('thumbnail', formData.thumbnail)
            }

            const updatePromises = [videoAPI.updateVideo(videoId, form)]

            // 2. If visibility status changed, update it as well
            if (formData.isPublished !== initialPublishStatus) {
                updatePromises.push(
                    videoAPI.togglePublishStatus(videoId, { isPublished: formData.isPublished })
                )
            }

            // Execute network requests concurrently
            await Promise.all(updatePromises)

            addNotification('Video updated successfully!', 'success')
            navigate(`/video/${videoId}`)
        } catch (err) {
            addNotification(err.response?.data?.message || 'Failed to update video', 'error')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="container-custom py-8 max-w-2xl">
            <button
                onClick={() => navigate(`/video/${videoId}`)}
                className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors mb-6 text-sm font-medium"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Video
            </button>

            <h1 className="text-3xl font-bold text-text-primary mb-8">Edit Video Settings</h1>

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

                {/* Thumbnail Section */}
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
                        onChange={handleFileChange}
                        className="w-full bg-tertiary border border-text-secondary rounded-lg px-4 py-3 text-text-secondary file:mr-4 file:bg-accent file:border-0 file:text-white file:rounded file:cursor-pointer hover:file:bg-accent-hover"
                    />
                </div>

                {/* Visibility Status Toggle */}
                <div className="bg-tertiary p-4 rounded-xl border border-border-subtle flex items-center justify-between">
                    <div className="space-y-0.5">
                        <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                            {formData.isPublished ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-amber-400" />}
                            Video Visibility
                        </label>
                        <p className="text-xs text-text-tertiary">
                            {formData.isPublished ? 'Public: Anyone can search for and view this video.' : 'Private: Only you can view this video.'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={togglePublish}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.isPublished ? 'bg-accent' : 'bg-text-secondary'
                            }`}
                    >
                        <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.isPublished ? 'translate-x-5' : 'translate-x-0'
                                }`}
                        />
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-2">
                    <Button
                        type="button"
                        variant="secondary"
                        className="w-1/2 bg-tertiary hover:bg-elevated"
                        onClick={() => navigate(`/video/${videoId}`)}
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
        </div>
    )
}


export default EditVideo