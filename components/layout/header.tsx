"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Search, Settings, User, LogOut, Bell, ChevronDown } from 'lucide-react'
import { useTranslation } from '@/lib/i18n-store'

const SEARCH_SUGGESTIONS = [
  { type: 'track', label: 'Blinding Lights', sub: 'The Weeknd' },
  { type: 'artist', label: 'Dua Lipa', sub: 'Artist' },
  { type: 'playlist', label: 'VibeWave Hits', sub: 'Featured Playlist' },
  { type: 'album', label: 'After Hours', sub: 'The Weeknd' },
  { type: 'track', label: 'Levitating', sub: 'Dua Lipa' },
]

export default function Header() {
  const { t, language } = useTranslation()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  const filtered = query.length > 0
    ? SEARCH_SUGGESTIONS.filter(s =>
      s.label.toLowerCase().includes(query.toLowerCase())
    )
    : SEARCH_SUGGESTIONS

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setShowSuggestions(false)
    }
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 bg-white/[0.01] backdrop-blur-2xl border-b border-white/5"
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-3 shrink-0"
        aria-label="VibeWave Home"
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-vw"
          style={{ backgroundColor: '#9B4DE0' }}
        >
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 9 Q5 4 7 9 Q9 14 11 9 Q13 4 15 9" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>
        <div className="flex flex-col -space-y-0.5">
          <span
            className="font-display font-700 text-[18px] tracking-tight"
            style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 700 }}
          >
            VibeWave
          </span>
          <span
            className="text-[10px] font-medium"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            {t.musicThatWorks}
          </span>
        </div>
      </Link>

      {/* Search */}
      <div ref={searchRef} className="relative flex-1 max-w-xl mx-8">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg outline-none transition-vw"
              style={{
                backgroundColor: '#2A1F3D',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.95)',
                fontSize: '14px',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#9B4DE0'
                setShowSuggestions(true)
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
              aria-label={t.search}
              aria-expanded={showSuggestions}
              aria-haspopup="listbox"
            />
          </div>
        </form>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div
            className="absolute top-full mt-2 w-full rounded-2xl py-2 z-50"
            style={{
              backgroundColor: '#2A1F3D',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
            role="listbox"
          >
            {filtered.length > 0 ? (
              <>
                <div
                  className="px-4 pb-1 text-[11px] font-semibold tracking-widest uppercase"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  {t.suggestions}
                </div>
                {filtered.map((item, i) => (
                  <button
                    key={i}
                    role="option"
                    aria-selected="false"
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-vw hover:bg-white/5"
                    onClick={() => {
                      setQuery(item.label)
                      setShowSuggestions(false)
                      router.push(`/search?q=${encodeURIComponent(item.label)}`)
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-semibold uppercase"
                      style={{
                        backgroundColor: 'rgba(155,77,224,0.15)',
                        color: '#9B4DE0',
                      }}
                    >
                      {item.type === 'track' ? '♪' : item.type === 'artist' ? 'A' : item.type === 'playlist' ? '≡' : '◉'}
                    </div>
                    <div>
                      <div className="text-sm" style={{ color: 'rgba(255,255,255,0.95)' }}>{item.label}</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.sub}</div>
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <div className="px-4 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {t.noResults} &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: User */}
      <div ref={profileRef} className="relative flex items-center gap-3">
      <div ref={notificationsRef} className="relative flex items-center">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-lg transition-vw hover:bg-white/5"
          aria-label={t.notifications}
          aria-expanded={showNotifications}
          aria-haspopup="true"
        >
          <Bell size={18} style={{ color: 'rgba(255,255,255,0.65)' }} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#9B4DE0' }}
            aria-hidden="true"
          />
        </button>

        {showNotifications && (
          <div
            className="absolute top-full right-0 mt-3 w-80 rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
              backgroundColor: 'rgba(42, 31, 61, 0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-display text-sm tracking-widest text-white/90 uppercase">
                {t.notifications || 'Notifications'}
              </h3>
              <button
                className="text-[10px] font-bold text-vw-purple hover:text-white transition-colors uppercase tracking-wider px-2 py-1 rounded-md hover:bg-white/5"
                onClick={() => setShowNotifications(false)}
              >
                {t.markAllAsRead || 'Mark all as read'}
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {/* Welcome Notification */}
              <div className="p-5 flex gap-4 hover:bg-white/[0.03] transition-vw group cursor-pointer border-b border-white/[0.04] bg-white/[0.02]">
                <div
                  className="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center transition-vw group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: 'linear-gradient(135deg, #9B4DE0 0%, #6D28D9 100%)',
                    boxShadow: '0 8px 20px rgba(155,77,224,0.4)',
                  }}
                >
                  <User size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[15px] font-bold text-white leading-tight">
                      {t.welcomeNotificationTitle || 'Welcome to VibeWave!'}
                    </p>
                    <div className="w-2 h-2 rounded-full bg-vw-purple animate-pulse" />
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {(t.welcomeNotificationDesc || "Hello {name}, we've missed you! Enjoy your personalized music journey today.").replace('{name}', 'Alex Johnson')}
                  </p>
                  <span className="text-[9px] text-vw-purple/60 mt-2.5 block font-bold uppercase tracking-[0.1em]">
                    {t.justNow || 'Just now'} • System
                  </span>
                </div>
              </div>

              {/* Sample notifications */}
              {[
                {
                  icon: <Bell size={18} />,
                  title: t.newAlbumNotificationTitle || 'New Album Release',
                  desc: (t.newAlbumNotificationDesc || '{artist} just dropped "{album}". Check it out!').replace('{artist}', 'The Weeknd').replace('{album}', 'Dawn FM'),
                  time: (t.hoursAgo || '{count} hours ago').replace('{count}', '2'),
                  color: '#4338CA'
                },
                {
                  icon: <Settings size={18} />,
                  title: t.systemUpdateNotificationTitle || 'System Update',
                  desc: (t.systemUpdateNotificationDesc || 'VibeWave is now faster and smoother than ever. Version {version} is live.').replace('{version}', '2.4.0'),
                  time: t.yesterday || 'Yesterday',
                  color: '#22C55E'
                }
              ].map((notif, i) => (
                <div key={i} className="p-4 flex gap-4 hover:bg-white/5 transition-vw group cursor-pointer border-b border-white/[0.03]">
                  <div
                    className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-vw group-hover:scale-110"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: notif.color
                    }}
                  >
                    {notif.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/80 leading-tight">
                      {notif.title}
                    </p>
                    <p className="text-xs text-white/40 mt-1 leading-relaxed line-clamp-2">
                      {notif.desc}
                    </p>
                    <span className="text-[10px] text-white/25 mt-2 block uppercase tracking-tighter">
                      {notif.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/notifications"
              className="w-full py-3 text-xs font-semibold text-white/40 hover:text-white/70 transition-colors uppercase tracking-widest bg-white/[0.02] hover:bg-white/[0.04] text-center block"
              onClick={() => setShowNotifications(false)}
            >
              {t.viewAllNotifications || 'View All Notifications'}
            </Link>
          </div>
        )}
      </div>

        <button
          onClick={() => setShowProfile(!showProfile)}
          className="flex items-center gap-2 p-1.5 rounded-lg transition-vw hover:bg-white/5"
          aria-label="User profile menu"
          aria-expanded={showProfile}
          aria-haspopup="true"
        >
          <img
            src="/UserAvatar.jpg"
            alt="Alex Johnson"
            className="w-8 h-8 rounded-full object-cover"
            style={{ border: '2px solid rgba(255,255,255,0.1)' }}
          />
          <ChevronDown
            size={14}
            style={{
              color: 'rgba(255,255,255,0.45)',
              transform: showProfile ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.15s ease',
            }}
          />
        </button>

        {showProfile && (
          <div
            className="absolute top-full right-0 mt-2 w-52 rounded-2xl py-2 z-50"
            style={{
              backgroundColor: '#2A1F3D',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
            role="menu"
          >
            <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.95)' }}>Alex Johnson</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>alex@example.com</div>
            </div>
            {[
              { icon: User, label: t.profileAndSettings, href: '/profile' },
            ].map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                role="menuitem"
                onClick={() => setShowProfile(false)}
                className="flex items-center gap-3 px-4 py-2.5 transition-vw hover:bg-white/5"
              >
                <Icon size={15} style={{ color: 'rgba(255,255,255,0.65)' }} />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>{label}</span>
              </Link>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 4 }}>
              <Link
                href="/login"
                role="menuitem"
                onClick={() => setShowProfile(false)}
                className="flex items-center gap-3 px-4 py-2.5 transition-vw hover:bg-white/5"
              >
                <LogOut size={15} style={{ color: 'rgba(255,255,255,0.45)' }} />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{t.signOut}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}