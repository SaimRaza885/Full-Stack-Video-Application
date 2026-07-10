import { User, Pencil, Trash2 } from 'lucide-react'
import { ago } from '../../../utils'
import { Button } from '../../ui/Button'

const EMPTY = {}

export const CommentItem = ({
  comment, currentUserId, idx,
  editingCommentId, editCommentContent, actionLoadingId,
  onEditStart, onEditCancel, onEditContentChange,
  onUpdate, onDelete,
}) => {
  const cOwner = comment.comment_owner || comment.owner || EMPTY
  const commentOwnerId = cOwner._id || comment.owner?._id || comment.owner
  const isCommentOwner = currentUserId && String(currentUserId) === String(commentOwnerId)
  const cAvatar = cOwner.avatar || null

  return (
    <div className="flex gap-3 items-start bg-secondary/30 p-3 rounded-xl border border-border-subtle/20 transition-all">
      {cAvatar?.url ? (
        <img src={cAvatar.url} alt="" className="w-8 h-8 rounded-full object-cover ring-1 ring-border-subtle shrink-0" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-text-tertiary" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-text-primary">@{cOwner.username || 'unknown'}</span>
          <span className="text-xs text-text-tertiary">{ago(comment.createdAt)}</span>
        </div>

        {editingCommentId === comment._id ? (
          <div className="mt-2 space-y-2">
            <input
              type="text"
              value={editCommentContent}
              onChange={(e) => onEditContentChange(e.target.value)}
              className="w-full bg-tertiary border border-border-subtle rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-accent"
              disabled={actionLoadingId === comment._id}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="xs"
                onClick={() => onUpdate(comment._id)}
                disabled={!editCommentContent.trim() || actionLoadingId === comment._id}
              >
                Save
              </Button>
              <Button
                size="xs"
                variant="secondary"
                onClick={onEditCancel}
                disabled={actionLoadingId === comment._id}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-primary/90 leading-relaxed break-words">{comment.content}</p>
        )}
      </div>

      {isCommentOwner && editingCommentId !== comment._id && (
        <div className="flex items-center gap-2 ml-auto shrink-0 self-center">
          <button
            onClick={() => onEditStart(comment._id, comment.content)}
            disabled={actionLoadingId !== null}
            className="p-2 bg-tertiary/60 hover:bg-accent/20 text-accent rounded-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
            title="Edit comment"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(comment._id)}
            disabled={actionLoadingId !== null}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
            title="Delete comment"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
