import React from 'react'
import { Card } from '../../components'
import { fmt } from '../../utils'

export const ProfileStats = ({
    stats,
    statsLoading,
    timeframe,
    setTimeframe
}) => {
    const calculateSubRatio = () => {
        if (!stats?.totalViews || !stats?.totalSubscribers) return "0.00"
        return ((stats.totalSubscribers / stats.totalViews / 14) * 100).toFixed(2)
    }

    const calculateViewsGrowth = () => {
        if (!stats?.totalSubscribers || !stats?.totalViews) return "0.00"
        return (stats.totalViews / stats.totalSubscribers / 14).toFixed(2)
    }

    const calculateLikesGrowth = () => {
        if (!stats?.totalLikes || !stats?.totalViews) return "0.00"
        return ((stats.totalLikes / stats.totalViews / 14) * 100).toFixed(2)
    }

    return (
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
                    <div className="flex items-center justify-between">
                        <span className="text-text-tertiary text-xs font-bold tracking-wider uppercase">Total Likes</span>
                    </div>
                    <div className="mt-4 space-y-1">
                        <h3 className="text-3xl font-extrabold tracking-tight">{statsLoading ? '...' : fmt(stats?.totalLikes || 0)}</h3>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                            <span>▲ +{calculateLikesGrowth()}%</span>
                            <span className="text-text-tertiary font-normal">growing fast</span>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-secondary/40 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-accent/30 transition-all duration-300 group shadow-md backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-text-tertiary text-xs font-bold tracking-wider uppercase">Total Vidoes</span>
                    </div>
                    <div className="mt-4 space-y-1">
                        <h3 className="text-3xl font-extrabold tracking-tight">{statsLoading ? '...' : fmt(stats?.totalVideos || 0)}</h3>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                            <span>Steady</span>
                            <span className="text-text-tertiary font-normal">Active status</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
