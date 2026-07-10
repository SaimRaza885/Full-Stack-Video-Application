import { Link } from "react-router-dom"
import { fmt, ago } from "../utils"
import { DurationBadge } from "./video/DurationBadge"

export const NewVideoCard = ({ video, ch = "", horizontal = false }) => {
    if (!video) return null

    const {
        _id,
        title,
        thumbnail,
        duration,
        views,
        createdAt,
        owner,
        ownerDetails,
    } = video

    // Use ownerDetails if available, otherwise fallback to owner
    if (ch) {
        video.ownerDetails = ch
    }
    const channel = ownerDetails || owner || {}

    const {
        username,
        fullName = "Unknown Channel",
        avatar,
    } = channel

    const thumbnailUrl =
        thumbnail?.url ||
        "https://placehold.co/640x360/1C1C2E/6B6B80?text=No+Thumbnail"

    const avatarUrl =
        avatar?.url ||
        avatar ||
        "https://placehold.co/40x40/2A2A3D/FFFFFF?text=U"

    if (horizontal) {
        return (
            <Link
                to={`/video/${_id}`}
                className="group flex gap-3"
            >
                {/* Thumbnail */}
                <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-xl bg-tertiary lg:w-48">
                    <img
                        src={thumbnailUrl}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <DurationBadge seconds={duration} />
                </div>


                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col">
                    <h4 className="line-clamp-2 text-sm font-semibold leading-5 text-text-primary transition-colors group-hover:text-accent">
                        {title || "Untitled Video"}
                    </h4>

                    <div className="flex ">


                        <Link
                            to={`/channel/${username}`}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1 w-fit text-xs text-text-secondary transition-colors hover:text-text-primary"
                        >
                            {username}
                        </Link>
                    </div>

                    <p className="mt-1 text-xs text-text-tertiary">
                        {fmt(views)} views • {ago(createdAt)}
                    </p>
                </div>
            </Link>
        )
    }

    return (
        <div className="group">
            {/* Thumbnail */}
            <Link to={`/video/${_id}`} className="block">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-tertiary">
                    <img
                        src={thumbnailUrl}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <DurationBadge seconds={duration} />
                </div>
            </Link>


            {/* Video Info */}
            <div className="mt-3 flex gap-3">
                {/* Channel Avatar */}
                <Link
                    to={`/channel/${username}`}
                    className="shrink-0"
                >
                    <img
                        src={avatarUrl}
                        alt={fullName}
                        className="h-9 w-9 rounded-full object-cover border border-secondary"
                    />
                </Link>

                {/* Text */}
                <div className="min-w-0 flex-1">
                    <Link to={`/video/${_id}`}>
                        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-text-primary transition-colors duration-200 group-hover:text-accent">
                            {title}
                        </h3>
                    </Link>

                    <Link
                        to={`/channel/${username}`}
                        className="mt-1 block truncate text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                        {username}
                    </Link>

                    <p className="mt-0.5 text-xs text-text-tertiary">
                        {fmt(views)} views • {ago(createdAt)}
                    </p>
                </div>
            </div>
        </div>
    )
}