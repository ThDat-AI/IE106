"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Camera, Check, ChevronRight, Volume2, Type, Globe,
  Palette, Moon, User, Bell, Shield, Music, Zap, Sparkles, Trash2, Mail, AlertTriangle
} from 'lucide-react'
import { useI18nStore, useTranslation } from '@/lib/i18n-store'
import { PageHero, GlassPanel, AmbientOrbs, AiBadge, AccentBar } from '@/components/ui/vibewave'
import { DangerAlertModal } from '@/components/ui/danger-alert-modal'



function SectionHeader({ title, icon: Icon, color = 'purple' }: { title: string, icon?: any, color?: any }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <AccentBar height={7} color={color} />
      <div className="flex items-center gap-2.5">
        {Icon && <Icon size={20} className="opacity-80" style={{ color: 'var(--vw-text-primary)' }} />}
        <h3 className="font-display font-bold text-2xl tracking-tight" style={{ color: 'var(--vw-text-primary)' }}>
          {title}
        </h3>
      </div>
    </div>
  )
}

function SettingRow({
  icon: Icon,
  label,
  description,
  children,
}: {
  icon: React.ElementType
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between py-5 gap-4 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
          style={{ backgroundColor: 'rgba(155,77,224,0.08)', border: '1px solid rgba(155,77,224,0.15)' }}>
          <Icon size={18} style={{ color: '#9B4DE0' }} />
        </div>
        <div>
          <div className="text-[15px] font-semibold text-white/90">{label}</div>
          {description && (
            <div className="text-sm mt-0.5 text-white/40 font-light">{description}</div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end">{children}</div>
    </div>
  )
}

function SelectChips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/5">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap"
          style={{
            backgroundColor: value === opt ? '#9B4DE0' : 'transparent',
            color: value === opt ? 'white' : 'rgba(255,255,255,0.45)',
            boxShadow: value === opt ? '0 4px 12px rgba(155,77,224,0.3)' : 'none',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="relative w-12 h-6.5 rounded-full transition-all duration-300 flex items-center p-1"
      style={{
        backgroundColor: checked ? '#9B4DE0' : 'rgba(255,255,255,0.1)',
        boxShadow: checked ? '0 0 15px rgba(155,77,224,0.2)' : 'none',
        border: checked ? '1px solid rgba(155,77,224,0.3)' : '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <span
        className="block rounded-full bg-white shadow-lg transition-all duration-300 ease-out"
        style={{
          width: 18,
          height: 18,
          transform: checked ? 'translateX(22px)' : 'translateX(0)',
        }}
      />
    </button>
  )
}

export default function ProfileSettingsPage() {
  const { t, language: currentLang } = useTranslation()
  const setGlobalLanguage = useI18nStore((state) => state.setLanguage)

  const TABS = [
    { id: 'profile', label: t.account, icon: User },
    { id: 'playback', label: t.playback, icon: Music },
    { id: 'appearance', label: t.appearance, icon: Palette },
    { id: 'notifications', label: t.notifications, icon: Bell },
  ] as const

  const [activeTab, setActiveTab] = useState<string>('profile')

  // Profile
  const [name, setName] = useState('Alex Johnson')
  const [email, setEmail] = useState('alex@example.com')
  const [bio, setBio] = useState('Music enthusiast. Always looking for the next great track.')
  const [profileSaved, setProfileSaved] = useState(false)

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  function handleSavePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(currentLang === 'vi' ? 'Vui lòng nhập đầy đủ thông tin' : 'Please fill in all fields')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError(currentLang === 'vi' ? 'Mật khẩu mới phải có ít nhất 6 ký tự' : 'New password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(currentLang === 'vi' ? 'Mật khẩu mới và xác nhận không khớp' : 'New password and confirmation do not match')
      return
    }

    setPasswordError('')
    setPasswordSaved(true)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setTimeout(() => setPasswordSaved(false), 2500)
  }

  // Appearance
  const [fontSize, setFontSize] = useState('M')

  // Notifications
  const [notifNewReleases, setNotifNewReleases] = useState(true)
  const [notifRecommendations, setNotifRecommendations] = useState(true)
  const [notifMarketing, setNotifMarketing] = useState(false)

  // Playback
  const [audioQuality, setAudioQuality] = useState('High')
  const [crossfade, setCrossfade] = useState('Off')
  const [normalizeVolume, setNormalizeVolume] = useState(true)
  const [offlineSync, setOfflineSync] = useState(true)

  // Privacy
  const [publicProfile, setPublicProfile] = useState(true)
  const [shareActivity, setShareActivity] = useState(false)

  // Danger Modal
  const [dangerModal, setDangerModal] = useState<{ isOpen: boolean, type: 'data' | 'account' }>({
    isOpen: false,
    type: 'data'
  })

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white/90 placeholder:text-white/20 outline-none transition-all duration-200 focus:border-purple-500/50 focus:bg-purple-500/5 focus:ring-4 focus:ring-purple-500/10"

  return (
    <div className="relative min-h-[calc(100vh-120px)] pb-20 px-4 md:px-8">
      <AmbientOrbs position="absolute" />

      <div className="max-w-6xl mx-auto pt-12">
        <PageHero
          eyebrowIcon={<Zap size={12} />}
          eyebrowLabel="VibeWave Account"
          title={t.profileAndSettings}
          titleColor="white"
          subtitle={t.manageAccount}
          gradientClass="from-white to-white"
          subtitleColor="white"
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 items-start">

          {/* Sidebar Navigation */}
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide sticky top-24">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[15px] font-bold transition-all duration-300 whitespace-nowrap group cursor-pointer border
                    ${isActive 
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 shadow-[0_4px_20px_rgba(155,77,224,0.1)]' 
                      : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/[0.12] hover:border-white/25 hover:text-white'
                    }
                  `}
                >
                  <Icon size={18} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 opacity-80'}`} />
                  {tab.label}
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-450 shadow-[0_0_8px_#C4B5FD]" />}
                </button>
              )
            })}

            <div className="mt-8 pt-8 border-t border-white/5 hidden lg:block">
              <p className="px-5 text-[11px] font-bold uppercase tracking-widest text-white/65 mb-4">{t.support}</p>
              <Link href="/faq" className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold bg-white/5 border border-white/10 text-white/80 hover:bg-white/[0.12] hover:border-white/25 hover:text-white transition-all cursor-pointer mb-2.5">
                <Globe size={16} /> {t.helpCenter}
              </Link>
              <Link href="/legal" className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold bg-white/5 border border-white/10 text-white/80 hover:bg-white/[0.12] hover:border-white/25 hover:text-white transition-all cursor-pointer">
                <Shield size={16} /> {t.legalInfo}
              </Link>
            </div>
          </nav>

          {/* Settings Panel */}
          <GlassPanel className="p-8 md:p-12" variant="dark">
            <div className="max-w-3xl">

              {/* ─── PROFILE TAB ─────────────────────────────── */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <SectionHeader title={t.yourProfile} icon={User} color="purple" />

                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-8 mb-12 p-6 rounded-3xl bg-white/5 border border-white/5">
                    <div className="relative group/avatar">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500/20 group-hover/avatar:border-purple-500/40 transition-all duration-500">
                        <img
                          src="/UserAvatar.jpg"
                          alt="Alex Johnson"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110"
                        />
                      </div>
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-500 text-white shadow-xl hover:scale-110 transition-all duration-300"
                        aria-label="Change profile photo"
                      >
                        <Camera size={14} />
                      </button>
                    </div>
                    <div className="text-center sm:text-left">
                      <h4 className="text-lg font-display font-bold text-white/90 mb-1">{t.profilePhoto}</h4>
                      <p className="text-sm text-white/60 font-light mb-4">{t.photoDesc}</p>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                        <button type="button" className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition-all">{t.uploadNew}</button>
                        <button type="button" className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white/80 hover:bg-white/20 hover:text-white transition-all">{t.remove}</button>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="display-name" className="text-sm font-bold text-white/75 px-1">{t.displayName}</label>
                        <input
                          id="display-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={inputClasses}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="profile-email" className="text-sm font-bold text-white/75 px-1">{t.emailAddress}</label>
                        <div className="relative">
                          <input
                            id="profile-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClasses}
                          />
                          <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="bio" className="text-sm font-bold text-white/75 px-1">{t.bio}</label>
                      <textarea
                        id="bio"
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className={`${inputClasses} resize-none leading-relaxed`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-12">
                    <button
                      type="submit"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-[15px] font-bold transition-all duration-300 hover:opacity-90 active:scale-95 shadow-lg shadow-purple-500/25"
                      style={{ backgroundColor: '#9B4DE0', color: 'white' }}
                    >
                      {profileSaved ? <><Check size={18} /> {t.saved}</> : <><Sparkles size={18} /> {t.saveChanges}</>}
                    </button>
                    <button
                      type="button"
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl text-[15px] font-bold text-white/75 hover:text-white hover:bg-white/10 transition-all border border-white/10"
                    >
                      {t.cancel}
                    </button>
                  </div>

                  {/* Change Password Section */}
                  <div className="mt-16 pt-12 border-t border-white/5 animate-in fade-in duration-300">
                    <SectionHeader title={t.changePassword} icon={Shield} color="pink" />
                    
                    <div className="space-y-6 max-w-md">
                      <div className="space-y-4">
                        {/* Current Password */}
                        <div className="space-y-2">
                          <label htmlFor="current-password" className="text-sm font-bold text-white/75 px-1">{t.currentPassword}</label>
                          <input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className={inputClasses}
                            placeholder="••••••••"
                          />
                        </div>
                        {/* New Password */}
                        <div className="space-y-2">
                          <label htmlFor="new-password" className="text-sm font-bold text-white/75 px-1">{t.newPassword}</label>
                          <input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={inputClasses}
                            placeholder="••••••••"
                          />
                        </div>
                        {/* Confirm New Password */}
                        <div className="space-y-2">
                          <label htmlFor="confirm-new-password" className="text-sm font-bold text-white/75 px-1">{t.confirmNewPassword}</label>
                          <input
                            id="confirm-new-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={inputClasses}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      {passwordError && (
                        <p className="text-sm font-semibold px-1 animate-in fade-in duration-200 text-[#ff7d7d]">
                          {passwordError}
                        </p>
                      )}

                      <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                        <button
                          type="button"
                          onClick={handleSavePassword}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-[15px] font-bold transition-all duration-300 hover:opacity-90 active:scale-95 shadow-lg shadow-purple-500/25"
                          style={{ backgroundColor: '#9B4DE0', color: 'white' }}
                        >
                          {passwordSaved ? <><Check size={18} /> {t.passwordChanged}</> : <><Sparkles size={18} /> {t.changePassword}</>}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Danger zone */}
                  <div className="mt-16 pt-12 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                        <Trash2 size={16} className="text-[#ff7d7d]" />
                      </div>
                      <h4 className="text-lg font-display font-bold text-[#ff7d7d]">{t.dangerZone}</h4>
                    </div>

                    <div className="space-y-4">
                      {/* Delete Personal Data */}
                      <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/[0.08] transition-all duration-300">
                        <div className="text-center md:text-left">
                          <div className="text-base font-bold text-white/80 mb-1">{t.deletePersonalData}</div>
                          <div className="text-sm text-white/50 font-light max-w-md">
                            {t.deletePersonalDataDesc}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDangerModal({ isOpen: true, type: 'data' })}
                          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-white/10 text-white/80 border border-white/20 hover:bg-red-500/20 hover:text-[#ff7d7d] hover:border-[#ff7d7d]/30 transition-all duration-300"
                        >
                          <Trash2 size={15} className="shrink-0 text-[#ff7d7d]" />
                          <span>{t.deletePersonalData}</span>
                        </button>
                      </div>

                      {/* Delete Account */}
                      <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                          <div className="text-base font-bold text-white/80 mb-1">{t.deleteAccount}</div>
                          <div className="text-sm text-white/50 font-light max-w-md">
                            {t.deleteAccountDesc}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDangerModal({ isOpen: true, type: 'account' })}
                          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-red-500/15 text-[#ff7d7d] border border-[#ff7d7d]/30 hover:bg-red-600 hover:text-white transition-all duration-300"
                        >
                          <AlertTriangle size={15} className="shrink-0" />
                          <span>{t.deleteAccount}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* ─── PLAYBACK TAB ─────────────────────────────── */}
              {activeTab === 'playback' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <SectionHeader title={t.playbackSettings} icon={Music} color="blue" />
                  <div className="space-y-2">
                    <SettingRow icon={Volume2} label={t.audioQuality} description={t.audioQualityDesc}>
                      <SelectChips options={['Normal', 'High', 'Very High']} value={audioQuality} onChange={setAudioQuality} />
                    </SettingRow>
                    <SettingRow icon={ChevronRight} label={t.crossfade} description={t.crossfadeDesc}>
                      <SelectChips options={['Off', '2s', '5s', '10s']} value={crossfade} onChange={setCrossfade} />
                    </SettingRow>
                    <SettingRow icon={Zap} label={t.normalizeVolume} description={t.normalizeVolumeDesc}>
                      <Toggle checked={normalizeVolume} onChange={() => setNormalizeVolume((v) => !v)} />
                    </SettingRow>
                    <SettingRow icon={Music} label={t.offlineSync} description={t.offlineSyncDesc}>
                      <Toggle checked={offlineSync} onChange={() => setOfflineSync((v) => !v)} />
                    </SettingRow>
                  </div>
                </div>
              )}

              {/* ─── APPEARANCE TAB ─────────────────────────────── */}
              {activeTab === 'appearance' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <SectionHeader title={t.appearance} icon={Palette} color="pink" />
                  <div className="space-y-2">

                    <SettingRow icon={Type} label={t.fontSize} description={t.fontSizeDesc}>
                      <SelectChips options={['S', 'M', 'L']} value={fontSize} onChange={setFontSize} />
                    </SettingRow>

                    <SettingRow icon={Globe} label={t.language} description={t.languageDesc}>
                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/5">
                        {(['en', 'vi'] as const).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setGlobalLanguage(lang)}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
                            style={{
                              backgroundColor: currentLang === lang ? '#9B4DE0' : 'transparent',
                              color: currentLang === lang ? 'white' : 'rgba(255,255,255,0.45)',
                              boxShadow: currentLang === lang ? '0 4px 12px rgba(155,77,224,0.3)' : 'none',
                            }}
                          >
                            {lang === 'en' ? 'English' : 'Tiếng Việt'}
                          </button>
                        ))}
                      </div>
                    </SettingRow>

                    <SettingRow icon={Moon} label={t.theme} description={t.themeDesc}>
                      <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {t.darkOnly}
                      </span>
                    </SettingRow>
                  </div>
                </div>
              )}

              {/* ─── NOTIFICATIONS TAB ─────────────────────────────── */}
              {activeTab === 'notifications' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <SectionHeader title={t.notificationPreferences} icon={Bell} color="yellow" />
                  <div className="space-y-2">
                    <SettingRow icon={Zap} label={t.newReleases} description={t.newReleasesDesc}>
                      <Toggle checked={notifNewReleases} onChange={() => setNotifNewReleases((v) => !v)} />
                    </SettingRow>
                    <SettingRow icon={Sparkles} label={t.aiRecommendations} description={t.aiRecommendationsDesc}>
                      <Toggle checked={notifRecommendations} onChange={() => setNotifRecommendations((v) => !v)} />
                    </SettingRow>

                    <SettingRow icon={Mail} label={t.marketingEmails} description={t.marketingEmailsDesc}>
                      <Toggle checked={notifMarketing} onChange={() => setNotifMarketing((v) => !v)} />
                    </SettingRow>
                  </div>
                </div>
              )}

            </div>
          </GlassPanel>
        </div>
      </div>
      <DangerAlertModal
        isOpen={dangerModal.isOpen}
        type={dangerModal.type}
        onClose={() => setDangerModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          console.log(`Confirmed deletion of ${dangerModal.type}`)
        }}
      />
    </div>
  )
}
