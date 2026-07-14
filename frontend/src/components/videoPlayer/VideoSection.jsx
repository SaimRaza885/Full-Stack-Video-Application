import { useRef, useState, useEffect } from 'react'

const PLAYBACK_RATES = [0.25, 0.5, 1, 1.25, 1.5, 2]

export const VideoSection = ({ video, adVideo, onNextVideo, onPrevVideo }) => {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const progressRef = useRef(null)
  const controlsTimer = useRef(null)
  const speedMenuRef = useRef(null)

  const hasAd = !!adVideo
  const adSkipAfter = adVideo?.skipAfter ?? 5
  const adImageUrl = adVideo?.image || ''
  const adTitle = adVideo?.title || 'Discover Premium'
  const adDescription = adVideo?.description || 'Exclusive features await you'

  const [phase, setPhase] = useState(hasAd ? 'ad' : 'main')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)
  const [showRemaining, setShowRemaining] = useState(false)
  const [hoverTime, setHoverTime] = useState(null)
  const [adElapsed, setAdElapsed] = useState(0)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)

  const adSkippable = phase === 'ad' && adElapsed >= adSkipAfter
  const adProgressPct = Math.min(100, (adElapsed / adSkipAfter) * 100)
  const progressPct = duration ? (currentTime / duration) * 100 : 0
  const remainingTime = duration - currentTime
  const actualVolume = Math.pow(volume, 2)

  const formatTime = (t) => {
    if (isNaN(t) || t < 0) return '00:00'
    const h = Math.floor(t / 3600)
    const m = Math.floor((t % 3600) / 60)
    const s = Math.floor(t % 60)
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const switchToMain = () => {
    setPhase('main')
    setAdElapsed(0)
    setShowControls(true)
  }

  const resetControlsTimeout = () => {
    setShowControls(true)
    clearTimeout(controlsTimer.current)
    if (isPlaying) {
      controlsTimer.current = setTimeout(() => setShowControls(false), 3000)
    }
  }

  // Auto-play/pause based on phase
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (phase === 'main') {
      v.play().catch(() => { })
    } else {
      v.pause()
    }
  }, [phase])

  // Ad elapsed timer
  useEffect(() => {
    if (phase !== 'ad') return
    const start = Date.now()
    setAdElapsed(0)
    const interval = setInterval(() => {
      setAdElapsed((Date.now() - start) / 1000)
    }, 100)
    return () => clearInterval(interval)
  }, [phase])

  // Keyboard Navigation
  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || phase === 'ad') return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (onNextVideo) onNextVideo();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (onPrevVideo) onPrevVideo();
      } else if (e.code === 'KeyF') { // Added 'F' key support here
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, onNextVideo, onPrevVideo]);
  // Close speed popup on outside click
  useEffect(() => {
    const clickOutside = (e) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(e.target)) {
        setShowSpeedMenu(false)
      }
    }
    document.addEventListener('mousedown', clickOutside)
    return () => document.removeEventListener('mousedown', clickOutside)
  }, [])

  // Controls auto-hide
  useEffect(() => {
    resetControlsTimeout()
    return () => clearTimeout(controlsTimer.current)
  }, [isPlaying])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const evts = ['mousemove', 'mouseenter', 'touchstart']
    evts.forEach(evt => el.addEventListener(evt, resetControlsTimeout))
    return () => {
      evts.forEach(evt => el.removeEventListener(evt, resetControlsTimeout))
      clearTimeout(controlsTimer.current)
    }
  }, [isPlaying])

  // Fullscreen listener
  useEffect(() => {
    const onChange = (e) => {
      if (e.code === 'f') {
        e.preventDefault();
        setIsFullscreen(!!document.fullscreenElement)
      }
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  // Sync calculated volume to native element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = actualVolume
      videoRef.current.muted = isMuted
    }
  }, [actualVolume, isMuted])

  const togglePlay = () => {
    if (phase !== 'main') return
    const v = videoRef.current
    if (!v) return
    v.paused ? v.play().catch(() => { }) : v.pause()
  }

  const handleSeek = (e) => {
    const v = videoRef.current
    const bar = progressRef.current
    if (!v || !bar) return
    const rect = bar.getBoundingClientRect()
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration
  }

  const handleProgressHover = (e) => {
    if (!progressRef.current || !duration) return
    const rect = progressRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setHoverTime(pct * duration)
  }

  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (!v) return
    setCurrentTime(v.currentTime)
  }

  const toggleFullscreen = () => {
    document.fullscreenElement ? document.exitFullscreen() : containerRef.current?.requestFullscreen()
  }

  const selectSpeed = (rate) => {
    setPlaybackRate(rate)
    if (videoRef.current) videoRef.current.playbackRate = rate
    setShowSpeedMenu(false)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 outline-none select-none"
      onDoubleClick={toggleFullscreen}
    >
      {/* ---- Video Element ---- */}
      <video
        ref={videoRef}
        src={video?.videoFile?.url}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onEnded={() => setIsPlaying(false)}
        playsInline
      />

      {/* ---- Buffering Spinner ---- */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 border-2 border-white/20 border-t-indigo-400 rounded-full animate-spin" />
        </div>
      )}

      {/* ---- Ad Image Overlay ---- */}
      {phase === 'ad' && (
        <div className="absolute inset-0 z-30 flex flex-col">
          {/* Ad background image */}
          {adImageUrl ? (
            <img src={adImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-950" />
          )}

          {/* Dark gradient overlays for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />



          {/* Center content */}
          <div className="relative z-10 flex-1 flex items-center px-4 sm:px-8">
            {/* <div className="max-w-lg">
              <h2 className="text-white text-xl sm:text-2xl font-bold drop-shadow-lg mb-2">
                {adTitle}
              </h2>
              <p className="text-white/80 text-sm sm:text-base drop-shadow-md line-clamp-2">
                {adDescription}
              </p>
              <button className="mt-4 bg-white text-gray-900 font-semibold px-5 py-2 rounded-lg text-sm hover:bg-white/90 transition-colors shadow-xl">
                Learn More
              </button>
            </div> */}
          </div>

          {/* Ad progress line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
            <div
              className="h-full bg-amber-400 transition-all duration-150 ease-linear"
              style={{ width: `${adProgressPct}%` }}
            />
          </div>

          {/* Bottom bar with skip */}
          <div className="relative z-10 flex items-center justify-end p-4">
            {adSkippable ? (
              <button
                onClick={switchToMain}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded transition-all shadow-xl"
              >
                Skip Ad
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            ) : (
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
                <span className="text-white/60 text-xs font-medium">Skip in</span>
                <span className="text-white text-sm font-bold tabular-nums">{Math.ceil(Math.max(0, adSkipAfter - adElapsed))}s</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---- Static Center Play Overlay ---- */}
      {phase === 'main' && !isPlaying && !isBuffering && showControls && (
        <div onClick={togglePlay} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button

            className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-indigo-500/20 hover:scale-105 border border-white/20 transition-all pointer-events-auto"
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      )}

      {/* ---- Controls UI Wrapper ---- */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-300 flex flex-col justify-end ${phase === 'ad' ? 'opacity-0 pointer-events-none' : showControls ? 'opacity-100' : 'opacity-0'}`}
        style={{ pointerEvents: phase === 'ad' ? 'none' : (showControls ? 'auto' : 'none') }}
      >
        {/* Bottom Control Actions */}
        <div className="p-4 pt-10 flex flex-col gap-3">
          {/* Custom Progress/Scrub Bar */}
          <div
            ref={progressRef}
            className="relative w-full h-3 flex items-center cursor-pointer group"
            onClick={handleSeek}
            onMouseMove={handleProgressHover}
            onMouseLeave={() => setHoverTime(null)}
          >
            <div className="absolute left-0 right-0 h-1 bg-white/20 rounded-full group-hover:h-1.5 transition-all duration-150">
              <div
                className="h-full bg-indigo-500 rounded-full relative"
                style={{ width: `${progressPct}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            {hoverTime !== null && (
              <div
                className="absolute -top-7 -translate-x-1/2 bg-gray-900 border border-white/10 text-white text-[11px] font-mono px-2 py-0.5 rounded pointer-events-none shadow-xl z-20"
                style={{ left: `${(hoverTime / duration) * 100}%` }}
              >
                {formatTime(hoverTime)}
              </div>
            )}
          </div>

          {/* Control Buttons Row */}
          <div className="flex items-center justify-between text-white">
            {/* Left Control Group */}
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="hover:text-indigo-400 transition-colors" title="Play / Pause">
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2 group/vol">
                <button onClick={() => setIsMuted(!isMuted)} className="hover:text-indigo-400 transition-colors">
                  {isMuted || volume === 0 ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false) }}
                  className="w-0 opacity-0 group-hover/vol:w-20 group-hover/vol:opacity-100 transition-all duration-300 h-1 accent-indigo-400 bg-white/30 cursor-pointer rounded-lg"
                />
              </div>

              {/* Time */}
              <span
                onClick={() => setShowRemaining(!showRemaining)}
                className="text-xs font-mono select-none cursor-pointer hover:text-indigo-400 transition-colors"
              >
                {showRemaining ? `-${formatTime(remainingTime)}` : formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Control Group */}
            <div className="flex items-center gap-4">
              {/* Speed selector */}
              <div className="relative" ref={speedMenuRef}>
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/10 px-2.5 py-1 rounded transition-all min-w-[2.8rem]"
                >
                  {playbackRate}x
                </button>
                {showSpeedMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-950/95 border border-white/10 backdrop-blur-md rounded-lg py-1 shadow-2xl flex flex-col min-w-[70px] z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
                    {PLAYBACK_RATES.map((rate) => (
                      <button
                        key={rate}
                        onClick={() => selectSpeed(rate)}
                        className={`text-xs px-3 py-1.5 text-left transition-colors font-medium ${playbackRate === rate ? 'text-indigo-400 bg-white/5' : 'text-gray-300 hover:bg-white/10'}`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="hover:text-indigo-400 transition-colors">
                {isFullscreen ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
