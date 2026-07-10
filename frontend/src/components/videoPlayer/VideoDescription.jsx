export const VideoDescription = ({ description }) => {
  if (!description) return null
  return (
    <div className="bg-secondary border border-border-subtle rounded-xl p-4">
      <p className="text-sm text-text-primary whitespace-pre-wrap">{description}</p>
    </div>
  )
}
