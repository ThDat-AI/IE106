"use client"

import * as React from "react"
import { Heart, Play, Trash2, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface CardHoverOverlayProps {
  isLiked: boolean
  onLike: (e: React.MouseEvent) => void
  isCurrentlyPlaying: boolean
  onPlay: (e: React.MouseEvent) => void
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
  menuContent?: React.ReactNode
  onDelete?: (e: React.MouseEvent) => void
  deleteLabel?: string
  playButtonBgColor?: string
  playButtonIconColor?: string
  playButtonGlowColor?: string
  likeTitle?: string
  className?: string
}

export function CardHoverOverlay({
  isLiked,
  onLike,
  isCurrentlyPlaying,
  onPlay,
  isMenuOpen,
  setIsMenuOpen,
  menuContent,
  onDelete,
  deleteLabel = "Xóa",
  playButtonBgColor = "#9B4DE0",
  playButtonIconColor = "white",
  playButtonGlowColor,
  likeTitle,
  className,
}: CardHoverOverlayProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center gap-5 transition-opacity duration-200 z-10 bg-black/50 opacity-0",
        isMenuOpen ? "opacity-100" : "",
        className
      )}
    >
      {/* 1. Heart (Like) button on the LEFT */}
      <button
        onClick={onLike}
        className="relative w-10 h-10 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer after:absolute after:inset-[-6px] after:rounded-full"
        style={{
          backgroundColor: 'rgba(23,15,35,0.85)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: isLiked ? '#EF4444' : 'rgba(255,255,255,0.75)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
        title={likeTitle || (isLiked ? "Unlike" : "Like")}
        aria-label={likeTitle || (isLiked ? "Unlike" : "Like")}
        aria-pressed={isLiked}
      >
        <Heart size={15} fill={isLiked ? '#EF4444' : 'none'} />
        {isLiked && (
          <span className="w-1 h-1 rounded-full bg-[#EF4444] shadow-[0_0_6px_rgba(239,68,68,0.6)] animate-in scale-in duration-300" />
        )}
      </button>

      {/* 2. Play button in the MIDDLE */}
      <button
        onClick={onPlay}
        className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer after:absolute after:inset-[-6px] after:rounded-full"
        style={{
          backgroundColor: playButtonBgColor,
          boxShadow: playButtonGlowColor
            ? `0 4px 16px ${playButtonGlowColor}`
            : playButtonBgColor === '#9B4DE0' 
              ? '0 4px 16px rgba(155,77,224,0.4)' 
              : `0 4px 20px ${playButtonBgColor}66`,
        }}
        aria-label={isCurrentlyPlaying ? "Pause" : "Play"}
      >
        {isCurrentlyPlaying ? (
          <svg width="18" height="18" viewBox="0 0 16 16" fill={playButtonIconColor}>
            <rect x="3" y="2" width="3" height="12" rx="1" fill={playButtonIconColor} />
            <rect x="10" y="2" width="3" height="12" rx="1" fill={playButtonIconColor} />
          </svg>
        ) : (
          <Play size={18} fill={playButtonIconColor} className="ml-0.5" style={{ color: playButtonIconColor }} />
        )}
      </button>

      {/* 3. Three dots / Delete button on the RIGHT */}
      {onDelete ? (
        <button
          onClick={onDelete}
          className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-red-500 hover:text-white cursor-pointer after:absolute after:inset-[-6px] after:rounded-full"
          style={{
            backgroundColor: 'rgba(23,15,35,0.85)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.75)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
          title={deleteLabel}
          aria-label={deleteLabel}
        >
          <Trash2 size={15} />
        </button>
      ) : (
        <DropdownMenu onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer after:absolute after:inset-[-6px] after:rounded-full"
              style={{
                backgroundColor: 'rgba(23,15,35,0.85)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.75)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
              aria-label="More options"
            >
              <MoreHorizontal size={15} />
            </button>
          </DropdownMenuTrigger>
          {menuContent}
        </DropdownMenu>
      )}
    </div>
  )
}
