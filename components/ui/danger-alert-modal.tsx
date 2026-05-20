"use client"

import React, { useEffect, useState } from 'react'
import { AlertTriangle, X, Trash2, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n-store'
import { Portal } from './portal'

interface DangerAlertModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  type: 'data' | 'account'
}

export function DangerAlertModal({ isOpen, onClose, onConfirm, type }: DangerAlertModalProps) {
  const { t, language } = useTranslation()
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmInput, setConfirmInput] = useState('')

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsDeleting(false)
      setConfirmInput('')
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
  
  const targetWord = language === 'vi' ? 'XÓA' : 'DELETE'
  const isConfirmed = confirmInput.trim().toUpperCase() === targetWord

  return (
    <Portal>
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
          className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-white/15 to-white/10 shadow-2xl animate-in zoom-in-95 fade-in duration-300"
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

            <p className="text-sm text-white/70 font-light leading-relaxed mb-6">
              {description}
            </p>

            {/* Active Defense Input Box */}
            <div className="w-full mb-8 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
              <label htmlFor="confirm-action-input" className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-2 select-none">
                {language === 'vi' 
                  ? 'Vui lòng nhập chữ "XÓA" để xác nhận:' 
                  : 'Please type "DELETE" to confirm:'}
              </label>
              <input
                id="confirm-action-input"
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                disabled={isDeleting}
                placeholder={language === 'vi' ? 'Nhập XÓA...' : 'Type DELETE...'}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-red-500/50 text-white text-sm outline-none transition-all duration-300 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(239,68,68,0.15)] placeholder-white/20"
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="px-6 py-3.5 rounded-xl text-sm font-bold text-white/50 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isDeleting || !isConfirmed}
                className="relative group overflow-hidden px-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                style={{ 
                  backgroundColor: isConfirmed ? '#EF4444' : '#3F1A1A',
                  boxShadow: isConfirmed ? '0 4px 20px rgba(239,68,68,0.3)' : 'none',
                  border: isConfirmed ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(239,68,68,0.05)'
                }}
              >
                 {/* Button Glow */}
                 <div className={`absolute inset-0 bg-red-600 opacity-0 transition-opacity blur-xl ${isConfirmed ? 'group-hover:opacity-20' : ''}`} />
                 
                 <div className="relative flex items-center justify-center gap-2">
                   {isDeleting ? (
                     <Loader2 size={16} className="animate-spin" />
                   ) : (
                     <Trash2 size={16} />
                   )}
                   <span>{t.permanentlyDelete}</span>
                 </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  )
}
