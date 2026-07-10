import { Link } from 'react-router-dom'
import { User, Pencil, Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { fmt } from '../../utils'

export const ChannelCard = ({
  owner, ownerUsername, ownerAvatar, subscriberCount,
  isSubscribed, isOwner, videoId,
  onSubscribe, onDelete,
}) => (
  <div className="flex items-center justify-between bg-secondary border border-border-subtle rounded-xl p-4">
    <div className="flex items-center gap-3">
      <Link to={`/channel/${ownerUsername}`}>
        {ownerAvatar ? (
          <img src={ownerAvatar} alt={ownerUsername} className="w-10 h-10 rounded-full object-cover ring-2 ring-border-subtle" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center">
            <User className="w-5 h-5 text-text-tertiary" />
          </div>
        )}
      </Link>
      <div>
        <Link to={`/channel/${ownerUsername}`} className="font-semibold text-sm text-text-primary hover:text-accent transition-colors">
          {owner.fullName || ownerUsername}
        </Link>
        <p className="text-xs text-text-tertiary">{fmt(subscriberCount)} subscribers</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      {isOwner && (
        <>
          <Link to={`/video/edit/${videoId}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-tertiary text-text-secondary rounded-lg text-sm font-medium hover:bg-elevated transition-colors">
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
          <button onClick={onDelete} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </>
      )}
      <Button size="sm" onClick={onSubscribe}>
        {isSubscribed ? 'Subscribed' : 'Subscribe'}
      </Button>
    </div>
  </div>
)
