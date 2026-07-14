import React from 'react'
import { User } from 'lucide-react'
import { Button } from '../../components'
import { fmt } from '../../utils'

export const ChannelHeader = ({
    channel,
    videos,
    isSubscribed,
    isChannelOwner,
    handleSubscribe,
    navigate
}) => {
    const avatarUrl = channel?.avatar?.url || null

    return (
        <>
            <div className="w-full h-40 bg-gradient-to-r from-accent to-accent-hover rounded-xl mb-6 relative" >
                {channel?.coverImage &&
                    <img src={channel?.coverImage?.url} alt="" className='w-full h-full object-cover ' />
                }
            </div>

            <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
                <div className="flex items-start gap-4">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={channel.username} className="w-20 h-20 rounded-full border-4 border-primary object-cover" />
                    ) : (
                        <div className="w-20 h-20 rounded-full border-4 border-primary bg-tertiary flex items-center justify-center">
                            <User className="w-10 h-10 text-text-tertiary" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">{channel.fullName}</h1>
                        <p className="text-text-secondary text-sm">@{channel.username}</p>
                        <p className="text-text-tertiary text-sm mt-1 flex items-center gap-1.5 flex-wrap">
                            <span>{fmt(channel.subscriberCount || 0)} subscribers</span>
                            <span>&bull;</span>
                            <span>{fmt(channel.channelSubscribeToCount || 0)} subscribed</span>
                            <span>&bull;</span>
                            <span>{videos?.length || 0} videos</span>
                        </p>
                    </div>
                </div>
                {!isChannelOwner ? (
                    <Button onClick={handleSubscribe} variant={isSubscribed ? 'secondary' : 'primary opacity-90'}>
                        {isSubscribed ? 'Subscribed' : 'Subscribe'}
                    </Button>
                ) : (
                    <div className='flex items-center gap-2'>
                        <Button onClick={() => navigate('/upload')} variant='primary'>
                            Upload Video
                        </Button>
                    </div>
                )}
            </div>
        </>
    )
}
