"use client"

import React, { useEffect, useState } from 'react'
import { Trash2, X, AlertTriangle, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n-store'
import { Portal } from './portal'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
  itemType: 'album' | 'playlist'
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
}: ConfirmDeleteModalProps) {
  const { t } = useTranslation()
  const [isDeleting, setIsDeleting] = useState(false)

  // Reset deleting state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsDeleting(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleConfirm = async () => {
    setIsDeleting(true)
    // Simulate brief network delay for premium feel
    await new Promise((resolve) => setTimeout(resolve, 800))
    onConfirm()
    onClose()
  }

  const typeText = itemType === 'album' ? 'album' : (t.playlists?.toLowerCase() || 'danh sách phát')

  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#070509]/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Ambient glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-red-500/10 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-purple-500/10 rounded-full blur-[70px] delay-500 animate-pulse" />
      </div>

      {/* Modal Card */}
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.7)] animate-in zoom-in-95 fade-in duration-300 z-10"
        style={{
          background: 'linear-gradient(180deg, rgba(30,22,43,0.92) 0%, rgba(16,12,23,0.96) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 64px -16px rgba(239,68,68,0.15), inset 0 1px 0 rgba(255,255,255,0.08)'
        }}
      >
        {/* Close Button */}
        {!isDeleting && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
            aria-label={t.close || "Đóng"}
          >
            <X size={16} />
          </button>
        )}

        <div className="p-8 sm:p-10 flex flex-col items-center text-center">
          {/* Warn/Trash Icon Container */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Trash2 size={28} className="text-red-400" strokeWidth={1.5} />
            </div>
          </div>

          <h3 className="text-xl font-display font-bold text-white mb-3 tracking-tight">
            Xác nhận xóa {typeText}
          </h3>

          <p className="text-[13px] text-white/60 font-light leading-relaxed mb-8 px-2">
            Bạn có chắc chắn muốn xóa {typeText} <span className="text-purple-300 font-medium">&ldquo;{itemName}&rdquo;</span> khỏi thư viện không? Hành động này sẽ không thể hoàn tác.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-6 py-3.5 rounded-xl text-sm font-bold text-white/50 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {t.cancel || 'Hủy'}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="relative group overflow-hidden px-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              style={{
                backgroundColor: '#EF4444',
                boxShadow: '0 4px 20px rgba(239,68,68,0.3)',
                border: '1px solid rgba(239,68,68,0.4)'
              }}
            >
              {/* Button Glow */}
              <div className="absolute inset-0 bg-red-600 opacity-0 transition-opacity blur-xl group-hover:opacity-20" />

              <div className="relative flex items-center justify-center gap-2">
                {isDeleting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                <span>{t.delete || 'Xóa'}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
    </Portal>
  )
}
