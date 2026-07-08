import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { videoAPI } from '../services/endpoints'
import { Button, Input, Textarea } from '../components'
import { Video, Image as ImageIcon, Eye, Globe, Lock } from 'lucide-react'

export const Upload = () => {
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

  if (authLoading) return null

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

  return (
    <div className="container-custom py-8 max-w-5xl mx-auto px-4">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-5 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Upload video</h1>
          <p className="text-sm text-gray-400 mt-1">Add details and publish your video to the platform.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Metadata details */}
        <div className="lg:col-span-2 space-y-6">
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

          {/* YouTube Studio styled Visibility Card selector */}
          <div className="bg-secondary/40 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-white">Visibility Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Public option panel */}
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

              {/* Private option panel */}
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
        </div>

        {/* RIGHT COLUMN: Media Files Upload Fields */}
        <div className="space-y-6">

          {/* Video Asset Dropzone */}
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

          {/* Thumbnail Dropzone */}
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

          {/* Large Action trigger action */}
          <Button fullWidth type="submit" size="lg" className="shadow-lg font-semibold py-3.5 tracking-wide">
            Publish Video
          </Button>
        </div>

      </form>
    </div>
  )
}