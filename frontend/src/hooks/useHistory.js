import { useEffect, useState } from 'react'
import { userAPI } from '../services/endpoints'
import { useAuth } from '../context/AuthContext'

export const useHistory = () => {
    const { user } = useAuth()
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!user) { setLoading(false); return }
        const fetchHistory = async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await userAPI.getHistory()
                setVideos(res.data.data || [])
            } catch {
                setError('Failed to load history')
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [user])

    return { user, videos, loading, error }
}
