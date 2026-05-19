"use client"

import { usePlayerStore, Track } from '@/lib/player-store'
import { useI18nStore } from '@/lib/i18n-store'
import { X, Play, Pause, Trash2, ListMusic, Music, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function QueuePanel() {
  const { language } = useI18nStore()
  const isVi = language === 'vi'

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const {
    currentTrack,
    isPlaying,
    queue,
    isQueueOpen,
    toggleQueue,
    setTrack,
    setQueue,
    togglePlay,
  } = usePlayerStore()

  if (!currentTrack) return null

  const handleImageError = (trackId: string) => {
    setImageErrors((prev) => ({ ...prev, [trackId]: true }))
  }

  // Find index of the currently playing track in the queue
  const currentIndex = queue.findIndex((t) => t.id === currentTrack.id)
  
  // Slice tracks
  const nextUpTracks = currentIndex > -1 ? queue.slice(currentIndex + 1) : []
  const previousTracks = currentIndex > 0 ? queue.slice(0, currentIndex) : []

  const handleClearQueue = () => {
    // Standard behavior: clear the queue list except the currently playing track
    setQueue([currentTrack])
  }

  const handleRemoveTrack = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation()
    const newQueue = queue.filter((t) => t.id !== trackId)
    setQueue(newQueue)
  }

  const handlePlayTrack = (track: Track) => {
    setTrack(track)
  }

  return (
    <div
      className={cn(
        "fixed top-16 bottom-0 right-0 z-40 w-[380px] border-l border-white/10 bg-[#0C0816]/95 backdrop-blur-2xl transition-all duration-300 ease-in-out flex flex-col shadow-2xl overflow-hidden select-none",
        isQueueOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
      )}
      role="complementary"
      aria-label={isVi ? "Hàng đợi phát nhạc" : "Play Queue"}
    >
      {/* Background radial highlight */}
      <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-[#9B4DE0]/10 blur-[60px] pointer-events-none" />

      {/* Header section */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <ListMusic size={18} className="text-[#9B4DE0]" />
          <h2 className="font-display font-bold text-base text-white tracking-wide">
            {isVi ? 'Hàng đợi phát nhạc' : 'Play Queue'}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {nextUpTracks.length > 0 && (
            <button
              onClick={handleClearQueue}
              className="text-[11px] font-semibold text-white/60 hover:text-red-400 transition-colors uppercase tracking-wider px-2 py-1 rounded hover:bg-white/5"
            >
              {isVi ? 'Xóa danh sách' : 'Clear Queue'}
            </button>
          )}
          <button
            onClick={toggleQueue}
            className="p-1.5 hover:bg-white/5 rounded-full transition-colors active:scale-90"
            aria-label={isVi ? "Đóng hàng đợi" : "Close queue"}
          >
            <X size={18} className="text-white/60 hover:text-white" />
          </button>
        </div>
      </div>

      {/* Main content scrollable container */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-5 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 scrollbar-track-transparent">
        
        {/* Section: Currently Playing */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-white/60 px-1 uppercase tracking-wider">
            {isVi ? 'Đang phát' : 'Now Playing'}
          </h3>
          
          <div className="group relative flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.03] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300">
            {/* Glow effect behind the image */}
            <div className="absolute inset-0 rounded-xl bg-[#9B4DE0]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[8px] pointer-events-none" />

            <div 
              onClick={togglePlay}
              className="w-12 h-12 rounded-lg overflow-hidden relative group/art shrink-0 shadow-md cursor-pointer bg-[#2A1E3D]"
            >
              {!imageErrors[currentTrack.id] && currentTrack.albumArt ? (
                <img 
                  src={currentTrack.albumArt} 
                  alt={currentTrack.title} 
                  className="w-full h-full object-cover" 
                  onError={() => handleImageError(currentTrack.id)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music size={20} className="text-white/40" />
                </div>
              )}
              
              {/* Play/Pause overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/art:opacity-100 transition-all duration-200 flex items-center justify-center">
                {isPlaying ? (
                  <Pause size={16} fill="white" className="text-white" />
                ) : (
                  <Play size={16} fill="white" className="text-white ml-0.5" />
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0 z-10">
              <h4 className="font-sans font-semibold text-sm text-white truncate leading-snug">
                {currentTrack.title}
              </h4>
              <p className="font-sans text-[12px] text-white/60 truncate mt-0.5">
                {currentTrack.artist}
              </p>
            </div>

            {/* EQ Animation or Status */}
            <div className="flex items-center justify-end w-8 shrink-0 z-10">
              {isPlaying ? (
                <div className="flex items-end gap-[2px] h-3.5 pr-1">
                  <span className="w-[2px] h-2 bg-[#9B4DE0] rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
                  <span className="w-[2px] h-3 bg-[#9B4DE0] rounded-full animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.15s' }} />
                  <span className="w-[2px] h-1.5 bg-[#9B4DE0] rounded-full animate-bounce" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }} />
                </div>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              )}
            </div>
          </div>
        </div>

        {/* Section: Next Up */}
        <div className="space-y-2 flex-1 flex flex-col">
          <h3 className="text-xs font-semibold text-white/60 px-1 uppercase tracking-wider">
            {isVi ? `Tiếp theo (${nextUpTracks.length})` : `Next Up (${nextUpTracks.length})`}
          </h3>

          {nextUpTracks.length > 0 ? (
            <div className="space-y-1">
              {nextUpTracks.map((track, idx) => (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => handlePlayTrack(track)}
                  className="group flex items-center gap-3.5 p-2 rounded-lg hover:bg-white/[0.04] transition-all duration-200 cursor-pointer animate-in fade-in duration-300"
                >
                  {/* Track Index / Play Toggle */}
                  <div className="w-10 h-10 rounded-md overflow-hidden relative shrink-0 bg-[#1A1326]">
                    {!imageErrors[track.id] && track.albumArt ? (
                      <img 
                        src={track.albumArt} 
                        alt={track.title} 
                        className="w-full h-full object-cover" 
                        onError={() => handleImageError(track.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music size={16} className="text-white/30" />
                      </div>
                    )}
                    
                    {/* Hover Play Button */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
                      <Play size={14} fill="white" className="text-white ml-0.5" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-sans font-medium text-sm text-white/90 truncate leading-snug group-hover:text-white transition-colors">
                      {track.title}
                    </h4>
                    <p className="font-sans text-[11px] text-white/60 truncate mt-0.5 group-hover:text-white/80 transition-colors">
                      {track.artist}
                    </p>
                  </div>

                  {/* Right Action / Duration */}
                  <div className="flex items-center justify-end w-12 shrink-0">
                    {/* Duration by default */}
                    <span className="text-[11px] text-white/60 font-medium tabular-nums group-hover:hidden transition-all">
                      {formatDuration(track.duration)}
                    </span>
                    {/* Delete button on hover */}
                    <button
                      onClick={(e) => handleRemoveTrack(e, track.id)}
                      className="hidden group-hover:flex p-1.5 hover:bg-red-500/10 rounded text-white/30 hover:text-red-400 transition-all duration-150"
                      title={isVi ? "Xóa khỏi hàng đợi" : "Remove from queue"}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Queue Empty State */
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl bg-white/[0.01] border border-dashed border-white/5">
              <div className="w-10 h-10 rounded-full bg-[#9B4DE0]/10 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(155,77,224,0.15)]">
                <Sparkles size={18} className="text-[#9B4DE0]" />
              </div>
              <h4 className="font-sans font-semibold text-xs text-white/80">
                {isVi ? 'Hàng đợi trống' : 'Queue is empty'}
              </h4>
              <p className="font-sans text-[10px] text-white/60 mt-1 max-w-[200px] leading-relaxed">
                {isVi 
                  ? 'Thêm bài hát từ danh sách phát hoặc album để tiếp tục phát.'
                  : 'Add songs from playlists or albums to keep playing.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
