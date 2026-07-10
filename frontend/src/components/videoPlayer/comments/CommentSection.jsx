import { CommentForm } from './CommentForm'
import { CommentItem } from './CommentItem'

export const CommentSection = ({
  comments, newComment, commentLoading,
  editingCommentId, editCommentContent, actionLoadingId,
  currentUserId,
  onAddComment, onNewCommentChange,
  onUpdateComment, onDeleteComment,
  onEditStart, onEditCancel, onEditContentChange,
}) => (
  <div>
    <h2 className="text-lg font-bold text-text-primary mb-4">Comments ({comments.length})</h2>

    <CommentForm
      value={newComment}
      onChange={onNewCommentChange}
      onSubmit={onAddComment}
      loading={commentLoading}
    />

    <div className="space-y-4">
      {comments.length > 0 ? comments.map((comment, idx) => (
        <CommentItem
          key={comment._id || idx}
          comment={comment}
          idx={idx}
          currentUserId={currentUserId}
          editingCommentId={editingCommentId}
          editCommentContent={editCommentContent}
          actionLoadingId={actionLoadingId}
          onEditStart={onEditStart}
          onEditCancel={onEditCancel}
          onEditContentChange={onEditContentChange}
          onUpdate={onUpdateComment}
          onDelete={onDeleteComment}
        />
      )) : (
        <p className="text-center text-text-tertiary/60 text-sm py-8">No comments yet. Be the first!</p>
      )}
    </div>
  </div>
)
