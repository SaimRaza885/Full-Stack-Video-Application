export const VideoSection = ({ video }) => (
  <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
    <video src={video.videoFile?.url} controls autoPlay className="w-full h-full" controlsList="nodownload" />
  </div>
)
