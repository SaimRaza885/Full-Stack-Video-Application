import { Button } from '../components'
import { useUpload } from '../hooks/useUpload'
import { UploadForm } from '../components/upload/UploadForm'
import { VisibilitySettings } from '../components/upload/VisibilitySettings'
import { MediaUploadDropzones } from '../components/upload/MediaUploadDropzones'

export const Upload = () => {
  const {
    authLoading,
    formData,
    errors,
    handleChange,
    handleFileChange,
    togglePublish,
    handleSubmit
  } = useUpload()

  if (authLoading) return null

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
          <UploadForm 
            formData={formData} 
            errors={errors} 
            handleChange={handleChange} 
          />

          <VisibilitySettings 
            formData={formData} 
            togglePublish={togglePublish} 
          />
        </div>

        {/* RIGHT COLUMN: Media Files Upload Fields */}
        <div className="space-y-6">
          <MediaUploadDropzones 
            formData={formData} 
            errors={errors} 
            handleFileChange={handleFileChange} 
          />

          {/* Large Action trigger action */}
          <Button fullWidth type="submit" size="lg" className="shadow-lg font-semibold py-3.5 tracking-wide">
            Publish Video
          </Button>
        </div>
      </form>
    </div>
  )
}