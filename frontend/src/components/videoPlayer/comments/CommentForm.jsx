import { Button } from '../../ui/Button'

export const CommentForm = ({ value, onChange, onSubmit, loading }) => (
  <form onSubmit={onSubmit} className="flex gap-3 mb-6">
    <input
      type="text" value={value} onChange={(e) => onChange(e.target.value)}
      placeholder="Add a comment..." disabled={loading}
      className="flex-1 bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder-text-tertiary/60 focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
    />
    <Button loading={loading} type="submit" size="sm" disabled={!value.trim()}>Post</Button>
  </form>
)
