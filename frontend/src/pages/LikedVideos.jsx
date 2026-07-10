import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { likeAPI } from '../services/endpoints'
import { Skeleton } from '../components'
import { useAuth } from '../context/AuthContext'
import { fmt, ago } from '../utils'
import { NewVideoCard } from '../components/NewVideoCard'

export const Liked_Vidoes = () => {
    const { user, isAuthenticated } = useAuth()
    const [vidoes, setVidoes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isAuthenticated || !user) { setLoading(false); return }
        const fetch = async () => {
            try {
                const res = await likeAPI.getLikedVideos()
                const data = res.data.data
                setVidoes(data)

            } catch {
                setVidoes([])
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [user, isAuthenticated])

    if (!isAuthenticated) {
        return <div className="container-custom py-8 text-center text-text-secondary">Please log in to see your Liked Vidoes</div>
    }

    return (
        <div className="container-custom py-7">

            <h1 className="text-2xl font-bold text-text-primary mb-6">Liked Vidoes</h1>
            {/* Main Video Section */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="aspect-video rounded-xl" />
                            <div className="flex gap-3">
                                <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                                <div className="space-y-2 w-full">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : vidoes.length === 0 ? (
                <p className="text-text-tertiary text-center py-12">No Liked video yet. Like  to vidoes to see their  videos here.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                    {vidoes.map((ch, idx) => {
                        const video = ch.likedVideo
                        console.log(video)
                        return (
                            <NewVideoCard key={idx} video={video} />
                        )
                    })}
                </div>
            )}
        </div>
    )
}