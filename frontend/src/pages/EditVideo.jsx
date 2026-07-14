
import { Skeleton } from '../components'
import { ArrowLeft } from 'lucide-react'
import { useEditVideo } from '../hooks/useEditVideo'
import { EditVideoForm } from '../components/video/EditVideoForm'
import { useSearchParams } from 'react-router-dom'

const EditVideo = () => {
    const { videoId } = useSearchParams

    const {
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
    } = useEditVideo(videoId)

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

    return (
        <div className="container-custom py-8 max-w-2xl">
            <button
                onClick={() => navigate(`/video/${videoId}`)}
                className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors mb-6 text-sm font-medium"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Video
            </button>

            <h1 className="text-3xl font-bold text-text-primary mb-8">Edit Video Settings</h1>

            <EditVideoForm
                formData={formData}
                errors={errors}
                thumbnailPreview={thumbnailPreview}
                submitting={submitting}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                togglePublish={togglePublish}
                handleSubmit={handleSubmit}
                onCancel={() => navigate(`/video/${videoId}`)}
            />
        </div>
    )
}

export default EditVideo