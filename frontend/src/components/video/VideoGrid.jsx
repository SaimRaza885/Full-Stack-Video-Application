import { NewVideoCard } from '../NewVideoCard'
import { VideoCard } from './VideoCard'
import { VideoCardSkeleton } from './VideoCardSkeleton'

export const VideoGrid = ({ videos, loading, error, emptyMessage = 'No videos found', emptyIcon, onRetry, horizontal = false }) => {
  if (error && (!videos || videos.length === 0)) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">Something went wrong</p>

        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    )
  }
  if (loading && (!videos || videos.length === 0)) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
        <VideoCardSkeleton count={12} />
      </div>
    )
  }

  if (!videos || videos.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
      {videos.map((v) => (
        <NewVideoCard key={v._id} video={v} horizontal={horizontal} />
      ))}
    </div>
  )
}
