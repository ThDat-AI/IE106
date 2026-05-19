"use client"

import React, { useEffect, useState } from 'react'
import { AlertTriangle, X, Trash2, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n-store'

interface DangerAlertModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  type: 'data' | 'account'
}

export function DangerAlertModal({ isOpen, onClose, onConfirm, type }: DangerAlertModalProps) {
  const { t } = useTranslation()
  const [isDeleting, setIsDeleting] = useState(false)

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsDeleting(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleConfirm = async () => {
    setIsDeleting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    onConfirm()
    onClose()
  }

  const title = type === 'data' ? t.confirmDeleteData : t.confirmDeleteAccount
  const description = type === 'data' ? t.deleteDataWarning : t.deleteAccountWarning

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-500 animate-in fade-in"
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Decorative Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[80px] delay-700 animate-pulse" />
      </div>

      {/* Modal Card */}
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-white/15 to-white/10 shadow-2xl animate-in zoom-in-95 fade-in duration-300"
        style={{ backdropFilter: 'blur(16px)' }}
      >
        <div className="p-8 sm:p-10 flex flex-col items-center text-center">
          {/* Warning Icon Container */}
          <div className="relative mb-8">
             <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-pulse" />
             <div className="relative w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <AlertTriangle size={40} className="text-amber-500" strokeWidth={1.5} />
             </div>
          </div>

          <h2 className="text-2xl font-display font-bold text-amber-500 mb-4 tracking-tight">
            {t.dangerAction}
          </h2>

          <h3 className="text-lg font-display font-semibold text-white/90 mb-3 leading-snug">
            {title}
          </h3>

          <p className="text-sm text-white/70 font-light leading-relaxed mb-10">
            {description}
          </p>

          <div className="grid grid-cols-2 gap-4 w-full">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-6 py-4 rounded-2xl text-[15px] font-bold text-white/75 hover:text-white hover:bg-white/10 transition-all border border-white/10 disabled:opacity-50"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="relative group overflow-hidden px-6 py-4 rounded-2xl text-[15px] font-bold text-white transition-all active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: '#7F1D1D' }}
            >
               {/* Button Glow */}
               <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-20 transition-opacity blur-xl" />
               
               <div className="relative flex items-center justify-center gap-2">
                 {isDeleting ? (
                   <Loader2 size={18} className="animate-spin" />
                 ) : (
                   <Trash2 size={18} />
                 )}
                 <span>{t.permanentlyDelete}</span>
               </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
