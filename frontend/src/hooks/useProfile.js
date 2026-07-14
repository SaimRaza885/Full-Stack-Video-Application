import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { dashboardAPI, userAPI } from '../services/endpoints'

export const useProfile = () => {
    const { user, updateProfile, setUser, loading: authLoading } = useAuth()
    const { addNotification, removeNotification } = useUI()

    const [activeTab, setActiveTab] = useState('analytics')
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [stats, setStats] = useState(null)
    const [statsLoading, setStatsLoading] = useState(true)
    const [timeframe, setTimeframe] = useState('28d')
    const [formData, setFormData] = useState({ fullName: '' })

    const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || null)
    const [coverPreview, setCoverPreview] = useState(user?.coverImage?.url || null)

    useEffect(() => {
        if (user) {
            setFormData({ fullName: user.fullName || '' })
            setCoverPreview(user.coverImage?.url || null)
            setAvatarPreview(user.avatar?.url || null)
            fetchStats()
        }
    }, [user?._id])

    const fetchStats = async () => {
        try {
            setStatsLoading(true)
            const response = await dashboardAPI.getStats()
            setStats(response.data?.data || null)
        } catch (error) {
            console.error("Failed fetching creator analytics:", error)
            setStats(null)
        } finally {
            setStatsLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.fullName.trim()) return addNotification("Name cannot be empty", "error")

        try {
            setLoading(true)
            const result = await updateProfile(formData)
            if (result.success) {
                addNotification('Profile updated successfully!', 'success')
                setIsEditing(false)
                setActiveTab('analytics')
            }
        } catch {
            addNotification('Failed to update profile', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleAvatarUpdate = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        let newurl = URL.createObjectURL(file)
        setAvatarPreview(newurl)

        let loadingNotificationId = null
        try {
            loadingNotificationId = addNotification("Uploading your avatar... please wait.", 'info', 0)
            const uploadPayload = new FormData()
            uploadPayload.append('avatar', file)

            const response = await userAPI.changeAvatar(uploadPayload)
            const updatedUser = response.data?.data

            if (loadingNotificationId) removeNotification(loadingNotificationId)

            if (updatedUser) {
                addNotification("Avatar updated successfully!", 'success')
                setAvatarPreview(updatedUser.avatar?.url)
                setUser((prev) => ({ ...prev, avatar: updatedUser.avatar }))
            }
        } catch (error) {
            console.error(error)
            if (loadingNotificationId) removeNotification(loadingNotificationId)
            addNotification("Failed to update avatar", 'error')
            setAvatarPreview(user?.avatar?.url || null)
        }
    }

    const handleCoverImageUpdate = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        let newurl = URL.createObjectURL(file)
        setCoverPreview(newurl)

        let loadingNotificationId = null
        try {
            loadingNotificationId = addNotification("Uploading your Banner... please wait.", 'info', 0)

            const uploadPayload = new FormData()
            uploadPayload.append('coverImage', file)

            const response = await userAPI.changeCoverImage(uploadPayload)
            const updatedUser = response.data?.data

            if (loadingNotificationId) removeNotification(loadingNotificationId)

            if (updatedUser) {
                addNotification("Banner updated successfully!", 'success')
                setCoverPreview(updatedUser.coverImage?.url || null)
                setUser((prev) => ({ ...prev, coverImage: updatedUser.coverImage }))
            }
        } catch (error) {
            console.error(error)
            if (loadingNotificationId) removeNotification(loadingNotificationId)
            addNotification("Failed to update CoverImage", 'error')
            setCoverPreview(user?.coverImage?.url || null)
        }
    }

    return {
        user,
        authLoading,
        activeTab,
        setActiveTab,
        isEditing,
        setIsEditing,
        loading,
        stats,
        statsLoading,
        timeframe,
        setTimeframe,
        formData,
        avatarPreview,
        coverPreview,
        handleChange,
        handleSubmit,
        handleAvatarUpdate,
        handleCoverImageUpdate
    }
}
