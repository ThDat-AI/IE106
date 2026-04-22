"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Search, Settings, User, LogOut, Bell, ChevronDown } from 'lucide-react'

const SEARCH_SUGGESTIONS = [
  { type: 'track', label: 'Blinding Lights', sub: 'The Weeknd' },
  { type: 'artist', label: 'Dua Lipa', sub: 'Artist' },
  { type: 'playlist', label: 'Deep Focus', sub: 'VibeWave Playlist' },
  { type: 'album', label: 'After Hours', sub: 'The Weeknd' },
  { type: 'track', label: 'Levitating', sub: 'Dua Lipa' },
]

export default function Header() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

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
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16"
      style={{
        backgroundColor: '#170F23',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 shrink-0"
        aria-label="VibeWave Home"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#9B4DE0' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 9 Q5 4 7 9 Q9 14 11 9 Q13 4 15 9" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        <span
          className="font-display font-700 text-[18px] tracking-tight"
          style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 700 }}
        >
          VibeWave
        </span>
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
              placeholder="Search songs, artists, playlists..."
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
              aria-label="Search VibeWave"
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
                  Suggestions
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
                No results for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: User */}
      <div ref={profileRef} className="relative flex items-center gap-3">
        <button
          className="relative p-2 rounded-lg transition-vw hover:bg-white/5"
          aria-label="Notifications"
        >
          <Bell size={18} style={{ color: 'rgba(255,255,255,0.65)' }} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#9B4DE0' }}
            aria-hidden="true"
          />
        </button>

        <button
          onClick={() => setShowProfile(!showProfile)}
          className="flex items-center gap-2 p-1.5 rounded-lg transition-vw hover:bg-white/5"
          aria-label="User profile menu"
          aria-expanded={showProfile}
          aria-haspopup="true"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #9B4DE0, #7b3db0)',
              border: '2px solid rgba(255,255,255,0.1)',
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.95)' }}>AJ</span>
          </div>
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
              { icon: User, label: 'Profile', href: '/profile' },
              { icon: Settings, label: 'Settings', href: '/profile#settings' },
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
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>Sign Out</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
