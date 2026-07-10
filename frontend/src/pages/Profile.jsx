import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { Button, Input, Card, Avatar } from '../components'
import { dashboardAPI, userAPI } from '../services/endpoints'
import { fmt } from '../utils'

export const Profile = () => {
  const { user, updateProfile, setUser, loading: authLoding } = useAuth()
  const { addNotification, removeNotification } = useUI()

  // Input DOM References
  const fileInputRef = useRef(null)
  const coverImageRef = useRef(null)

  // Interactive UI Layout States
  const [activeTab, setActiveTab] = useState('analytics')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('28d')
  const [formData, setFormData] = useState({ fullName: '' })

  // Asset Preview States
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || null)
  const [coverPreview, setCoverPreview] = useState(user?.coverImage?.url || null)



  // Sync profile values securely using the primitive user ID key
  useEffect(() => {
    if (user) {
      setFormData({ fullName: user.fullName || '' })
      setCoverPreview(user.coverImage?.url || null)
      console.log(user)
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
    setUser((prev) => ({ ...prev, avatar: { url: newurl } }))

    let loadingNotificationId = null
    try {
      loadingNotificationId = addNotification("Uploading your avatar... please wait.", 'info', 0)
      console.log("user old data:", user.avatar)
      const uploadPayload = new FormData()
      uploadPayload.append('avatar', file)

      const response = await userAPI.changeAvatar(uploadPayload)
      const updatedUser = response.data?.data

      console.log("user old data:", updatedUser.avatar)

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
      setUser((prev) => ({ ...prev, avatar: user.avatar }))
    }
  }

  const handleCoverImageUpdate = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    let newurl = URL.createObjectURL(file);
    setCoverPreview(newurl);

    let loadingNotificationId = null
    try {
      loadingNotificationId = addNotification("Uploading your Banner... please wait.", 'info', 0)

      const uploadPayload = new FormData()
      // Key updated to match backend controller parameters
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

  if (!user) {
    return <div className="container-custom py-12 text-text-secondary text-center">Please log in to view your profile</div>
  }

  if (authLoding) {
    return <div className="container-custom py-12 text-text-secondary text-center">Loading...</div>
  }
  // Safe Calculation Fallbacks to secure UI shell layout metrics
  const calculateSubRatio = () => {
    if (!stats?.totalViews || !stats?.totalSubscribers) return "0.00"
    return ((stats.totalSubscribers / stats.totalViews / 14) * 100).toFixed(2)
  }

  const calculateViewsGrowth = () => {
    if (!stats?.totalSubscribers || !stats?.totalViews) return "0.00"
    return (stats.totalViews / stats.totalSubscribers / 14).toFixed(2)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-background text-text-primary">

      {/* Premium Creator Banner Header (Fixed Stack Layer Z-Index) */}
      <div
        className="relative bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-10 overflow-hidden shadow-2xl ring-1 ring-white/10 bg-cover bg-center min-h-[240px] flex items-end"
        style={{ backgroundImage: coverPreview ? `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url(${coverPreview})` : 'none' }}
      >
        {!coverPreview && (
          <>
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500/5 rounded-full blur-[100px] -z-10" />
          </>
        )}

        {/* Banner Action Floating Controller Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            type="button"
            onClick={() => coverImageRef.current?.click()}
            className="flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white border border-white/10 px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-sm transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
            Change Banner
          </button>
          <input
            type="file"
            ref={coverImageRef}
            accept="image/*"
            onChange={handleCoverImageUpdate}
            className="hidden"
          />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 w-full">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar src={avatarPreview || user.avatar?.url} size="xl" className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background/80 shadow-2xl ring-2 ring-accent/30 object-cover rounded-full" />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleAvatarUpdate}
                className="hidden"
              />
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 border-4 border-transparent">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">{user.fullName}</h1>
                <span className="px-2.5 py-0.5 bg-accent text-white border border-accent/20 rounded-full text-[11px] font-semibold text-accent tracking-wider uppercase">Partner</span>
              </div>
              <p className="text-accent font-medium text-base">@{user.username}</p>
              <p className="text-text-tertiary text-xs flex items-center justify-center sm:justify-start gap-1.5">
                Studio creator since {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Button variant={activeTab === 'analytics' ? 'primary' : 'secondary'} onClick={() => { setActiveTab('analytics'); setIsEditing(false); }} className="flex-1 md:flex-none text-xs font-semibold px-4 py-2.5 rounded-xl transition-all">
              Dashboard
            </Button>
            <Button variant={activeTab === 'edit' ? 'primary' : 'secondary'} onClick={() => { setActiveTab('edit'); setIsEditing(true); }} className="flex-1 md:flex-none text-xs font-semibold px-4 py-2.5 rounded-xl transition-all">
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Container Views System Tab Logic */}
      {activeTab === 'analytics' ? (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Channel Analytics overview</h2>
              <p className="text-xs text-text-tertiary">Real-time performance data insights metric tracks</p>
            </div>
            <div className="flex items-center gap-1 bg-secondary/60 border border-white/5 p-1 rounded-xl shadow-inner">
              {['7d', '28d', '90d'].map((t) => (
                <button key={t} onClick={() => setTimeframe(t)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${timeframe === t ? 'bg-background text-accent shadow-md border border-white/5' : 'text-text-tertiary hover:text-text-secondary'}`}>
                  Last {t === '7d' ? '7 days' : t === '28d' ? '28 days' : '90 days'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            <Card className="p-6 bg-secondary/40 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-accent/30 transition-all duration-300 group shadow-md backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary text-xs font-bold tracking-wider uppercase">Subscribers</span>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-3xl font-extrabold tracking-tight">{statsLoading ? '...' : fmt(stats?.totalSubscribers || 0)}</h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                  <span>▲ {calculateSubRatio()}%</span>
                  <span className="text-text-tertiary font-normal">vs last period</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-secondary/40 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-accent/30 transition-all duration-300 group shadow-md backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary text-xs font-bold tracking-wider uppercase">Views Reach</span>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-3xl font-extrabold tracking-tight">{statsLoading ? '...' : fmt(stats?.totalViews || 0)}</h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                  <span>▲ +{calculateViewsGrowth()}%</span>
                  <span className="text-text-tertiary font-normal">growing fast</span>
                </div>
              </div>
            </Card>


            <Card className="p-6 bg-secondary/40 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-accent/30 transition-all duration-300 group shadow-md backdrop-blur-sm">

              <div className="mt-4 space-y-1">
                <h3 className="text-3xl font-extrabold tracking-tight">{statsLoading ? '...' : fmt((stats?.totalViews * 4.2)).split('.')[0]} <span className="text-sm font-medium text-text-tertiary">hrs</span></h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-500">
                  <span>▼ -1.2%</span>
                  <span className="text-text-tertiary font-normal">retention drop</span>
                </div>
              </div>
            </Card>


            <Card className="p-6 bg-secondary/40 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-accent/30 transition-all duration-300 group shadow-md backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary text-xs font-bold tracking-wider uppercase">Total Content</span>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-3xl font-extrabold tracking-tight">{statsLoading ? '...' : fmt(stats?.totalVideos || 0)} <span className="text-sm font-medium text-text-tertiary">videos</span></h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                  <span>Steady</span>
                  <span className="text-text-tertiary font-normal">Active status</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="max-w-2xl mx-auto p-6 sm:p-8 bg-secondary/40 border border-white/5 shadow-2xl rounded-2xl backdrop-blur-md animate-fadeIn">
          <div className="mb-6 border-b border-white/5 pb-4">
            <h3 className="text-lg font-bold tracking-tight">Profile Information Settings</h3>
            <p className="text-xs text-text-tertiary">Manage configurations for public display metadata visibility properties.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input label="Full Creator Display Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" className="w-full bg-background/50 border-white/10 focus:border-accent text-sm rounded-xl px-4 py-3" />
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <Button type="submit" loading={loading} className="px-6 py-2.5 rounded-xl shadow-lg shadow-accent/20 text-xs font-bold">
                Save Profile Changes
              </Button>
              <Button variant="secondary" type="button" onClick={() => { setIsEditing(false); setActiveTab('analytics'); }} disabled={loading} className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold">
                Discard
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}