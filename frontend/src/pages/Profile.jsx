import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { Button, Input, Card, Avatar } from '../components'
import { dashboardAPI } from '../services/endpoints'
import { fmt } from '../utils'

export const Profile = () => {
  const { user, updateProfile } = useAuth()
  const { addNotification } = useUI()
  const [activeTab, setActiveTab] = useState('analytics') // 'analytics' | 'edit'
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('28d') // '7d' | '28d' | '90d'
  const [formData, setFormData] = useState({
    fullName: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({ fullName: user.fullName || '' })
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      setStatsLoading(true)
      const response = await dashboardAPI.getStats()
      setStats(response.data.data)
    } catch {
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

  if (!user) {
    return <div className="container-custom py-12 text-text-secondary text-center">Please log in to view your profile</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-background text-text-primary">

      {/* Premium Creator Banner Header */}
      <div className="relative bg-gradient-to-r from-zinc-900 via-stone-900 to-black border border-white/5 rounded-3xl p-6 sm:p-10 overflow-hidden shadow-2xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500/5 rounded-full blur-[100px] -z-10" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative group">
              <Avatar src={user.avatar} size="xl" className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background/80 shadow-2xl ring-2 ring-accent/30 object-cover rounded-full" />
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer border-4 border-transparent">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
            </div>
            <div className="space-y-1.5 pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">{user.fullName}</h1>
                <span className="px-2.5 py-0.5 bg-accent/10 border border-accent/20 rounded-full text-[11px] font-semibold text-accent tracking-wider uppercase">Partner</span>
              </div>
              <p className="text-accent font-medium text-base">@{user.username}</p>
              <p className="text-text-tertiary text-xs flex items-center justify-center sm:justify-start gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Studio creator since {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Button
              variant={activeTab === 'analytics' ? 'primary' : 'secondary'}
              onClick={() => { setActiveTab('analytics'); setIsEditing(false); }}
              className="flex-1 md:flex-none text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'edit' ? 'primary' : 'secondary'}
              onClick={() => { setActiveTab('edit'); setIsEditing(true); }}
              className="flex-1 md:flex-none text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tab Routing */}
      {activeTab === 'analytics' ? (
        <div className="space-y-8 animate-fadeIn">

          {/* Section Controller Headline */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Channel Analytics overview</h2>
              <p className="text-xs text-text-tertiary">Real-time performance data insights metric tracks</p>
            </div>
            <div className="flex items-center gap-1 bg-secondary/60 border border-white/5 p-1 rounded-xl shadow-inner">
              {['7d', '28d', '90d'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${timeframe === t ? 'bg-background text-accent shadow-md border border-white/5' : 'text-text-tertiary hover:text-text-secondary'}`}
                >
                  Last {t === '7d' ? '7 days' : t === '28d' ? '28 days' : '90 days'}
                </button>
              ))}
            </div>
          </div>

          {/* Premium Modular Grid Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="p-6 bg-secondary/40 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-accent/30 transition-all duration-300 group shadow-md backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary text-xs font-bold tracking-wider uppercase">Subscribers</span>
                <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl group-hover:scale-110 transition-transform"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg></div>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-3xl font-extrabold tracking-tight">{statsLoading ? '...' : fmt(stats?.totalSubscribers || 0)}</h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                  <span>▲ +8.2%</span>
                  <span className="text-text-tertiary font-normal">vs last period</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-secondary/40 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-accent/30 transition-all duration-300 group shadow-md backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary text-xs font-bold tracking-wider uppercase">Views Reach</span>
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></div>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-3xl font-extrabold tracking-tight">{statsLoading ? '...' : fmt(stats?.totalViews || 0)}</h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                  <span>▲ +14.6%</span>
                  <span className="text-text-tertiary font-normal">growing fast</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-secondary/40 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-accent/30 transition-all duration-300 group shadow-md backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary text-xs font-bold tracking-wider uppercase">Watch Time</span>
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl group-hover:scale-110 transition-transform"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-3xl font-extrabold tracking-tight">{statsLoading ? '...' : fmt((stats?.totalViews || 0) * 4.2).split('.')[0]} <span className="text-sm font-medium text-text-tertiary">hrs</span></h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-500">
                  <span>▼ -1.2%</span>
                  <span className="text-text-tertiary font-normal">retention drop</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-secondary/40 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-accent/30 transition-all duration-300 group shadow-md backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary text-xs font-bold tracking-wider uppercase">Total Content</span>
                <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 transition-transform"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg></div>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-3xl font-extrabold tracking-tight">{statsLoading ? '...' : fmt(stats?.totalVideos || 0)} <span className="text-sm font-medium text-text-tertiary">items</span></h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                  <span>Steady</span>
                  <span className="text-text-tertiary font-normal">Active status</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Core Advanced Analytics Center Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Charts Panel: Main Audience Growth Graph Visualization */}
            <Card className="lg:col-span-2 p-6 bg-secondary/30 border border-white/5 rounded-2xl space-y-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold">Audience Growth over time</h4>
                  <p className="text-xs text-text-tertiary">Real-time session analysis data benchmarks</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-accent rounded-full" /> Current</span>
                  <span className="flex items-center gap-1.5 text-text-tertiary"><span className="w-2.5 h-2.5 bg-white/10 rounded-full" /> Baseline</span>
                </div>
              </div>

              {/* Dynamic Sparkline Bars Layout */}
              <div className="h-56 flex items-end justify-between gap-3 sm:gap-4 pt-8 px-2 border-b border-white/5 relative">
                {/* Horizontal Guide Rules lines */}
                <div className="absolute inset-x-0 top-1/4 border-b border-white/[0.02] pointer-events-none" />
                <div className="absolute inset-x-0 top-2/4 border-b border-white/[0.02] pointer-events-none" />
                <div className="absolute inset-x-0 top-3/4 border-b border-white/[0.02] pointer-events-none" />

                {[40, 55, 45, 75, 60, 85, 65, 95, 80, 100, 85, 115].map((val, i) => (
                  <div key={i} className="w-full flex flex-col items-center gap-3 group relative h-full justify-end">
                    {/* Floating Tooltip metadata layout inside container */}
                    <div className="absolute bottom-full mb-2 bg-zinc-900 border border-white/10 text-white font-mono text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform scale-95 group-hover:scale-100 pointer-events-none z-30 shadow-2xl whitespace-nowrap">
                      +{val * 12} subs
                    </div>
                    {/* Main Bar Fill container structure */}
                    <div
                      className="w-full bg-gradient-to-t from-accent/40 to-accent rounded-t-lg transition-all duration-500 ease-out group-hover:from-accent group-hover:to-purple-400 group-hover:shadow-[0_0_15px_rgba(var(--color-accent),0.4)] cursor-pointer"
                      style={{ height: `${(val / 125) * 100}%` }}
                    />
                    <span className="text-[10px] text-text-tertiary font-mono tracking-tight uppercase group-hover:text-text-primary transition-colors">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Performance Benchmark Progress Breakdown Gauge items */}
            <Card className="p-6 bg-secondary/30 border border-white/5 rounded-2xl space-y-6 shadow-xl backdrop-blur-md">
              <div>
                <h4 className="text-base font-bold">Content Performance</h4>
                <p className="text-xs text-text-tertiary">Distribution target conversions metrics</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text-secondary">Click-Through Rate (CTR)</span>
                    <span className="text-accent font-mono">12.4%</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full p-0.5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent to-purple-500 rounded-full transition-all duration-1000" style={{ width: '74%' }} />
                  </div>
                  <p className="text-[10px] text-text-tertiary">▲ Upper quartile benchmark (+2.1%)</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text-secondary">Average View Duration</span>
                    <span className="text-purple-400 font-mono">4m 32s</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full p-0.5 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full transition-all duration-1000" style={{ width: '58%' }} />
                  </div>
                  <p className="text-[10px] text-text-tertiary">▼ Steady matching average retention rate</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text-secondary">Profile Engagement Rate</span>
                    <span className="text-emerald-400 font-mono">68.2%</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full p-0.5 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: '88%' }} />
                  </div>
                  <p className="text-[10px] text-emerald-500 font-medium">▲ Excellent profile interactive feedback</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (

        /* Modern Account / Profile Editor Panel Structure Configuration */
        <Card className="max-w-2xl mx-auto p-6 sm:p-8 bg-secondary/40 border border-white/5 shadow-2xl rounded-2xl backdrop-blur-md animate-fadeIn">
          <div className="mb-6 border-b border-white/5 pb-4">
            <h3 className="text-lg font-bold tracking-tight">Profile Information Settings</h3>
            <p className="text-xs text-text-tertiary">Manage and adapt configurations for public display metadata visibility properties.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                label="Full Creator Display Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full bg-background/50 border-white/10 focus:border-accent text-sm rounded-xl px-4 py-3"
              />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <Button type="submit" loading={loading} className="px-6 py-2.5 rounded-xl shadow-lg shadow-accent/20 text-xs font-bold">
                Save Profile Changes
              </Button>
              <Button
                variant="secondary"
                onClick={() => { setIsEditing(false); setActiveTab('analytics'); }}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold"
              >
                Discard
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}   