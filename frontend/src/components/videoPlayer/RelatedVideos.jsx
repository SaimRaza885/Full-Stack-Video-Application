import { NewVideoCard } from '../NewVideoCard'

const Skeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex gap-3 animate-pulse">
        <div className="aspect-video w-40 shrink-0 rounded-xl bg-tertiary lg:w-48" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-3.5 w-full rounded bg-tertiary" />
          <div className="h-3 w-2/3 rounded bg-tertiary" />
          <div className="h-2.5 w-1/3 rounded bg-tertiary" />
        </div>
      </div>
    ))}
  </div>
)

export const RelatedVideos = ({ videos, loading }) => (
  <div>
    <h2 className="text-lg font-bold text-text-primary mb-4">Related Videos</h2>
    {loading ? (
      <Skeleton />
    ) : videos.length > 0 ? (
      <div className="space-y-4">
        {console.log(videos)}
        {videos.map(v => (
          <NewVideoCard key={v._id} video={v} horizontal />
        ))}
      </div>
    ) : (
      <p className="text-text-tertiary text-sm">No related videos found</p>
    )}
  </div>
)
