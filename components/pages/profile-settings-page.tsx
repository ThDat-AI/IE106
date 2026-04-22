"use client"

import { useState } from 'react'
import { Camera, Check, ChevronRight, Volume2, Type, LayoutGrid, Globe, PanelLeft, Palette, Moon } from 'lucide-react'

const TABS = ['Profile', 'Playback', 'Appearance', 'Notifications', 'Privacy'] as const
type Tab = typeof TABS[number]

const ACCENT_OPTIONS = [
  { label: 'VibeWave Purple', value: '#9B4DE0' },
  { label: 'Slate', value: '#64748b' },
  { label: 'Rose', value: '#e11d48' },
]

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="font-display font-semibold mb-6"
      style={{ fontSize: 18, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}
    >
      {children}
    </h3>
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
    <div
      className="flex items-center justify-between py-4"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'rgba(155,77,224,0.1)' }}
        >
          <Icon size={16} style={{ color: '#9B4DE0' }} />
        </div>
        <div>
          <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>{label}</div>
          {description && (
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{description}</div>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}

function SelectChips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
          style={{
            backgroundColor: value === opt ? '#9B4DE0' : 'rgba(255,255,255,0.07)',
            color: value === opt ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
            border: value === opt ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)',
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
      className="relative w-10 h-5.5 rounded-full transition-all duration-200 flex items-center"
      style={{
        backgroundColor: checked ? '#9B4DE0' : 'rgba(255,255,255,0.12)',
        width: 40,
        height: 22,
      }}
    >
      <span
        className="absolute rounded-full bg-white transition-all duration-200"
        style={{
          width: 16,
          height: 16,
          left: checked ? 22 : 3,
        }}
      />
    </button>
  )
}

export default function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Profile')

  // Profile
  const [name, setName] = useState('Alex Johnson')
  const [email, setEmail] = useState('alex@example.com')
  const [bio, setBio] = useState('Music enthusiast. Always looking for the next great track.')
  const [profileSaved, setProfileSaved] = useState(false)

  // Appearance
  const [motion, setMotion] = useState('On')
  const [fontSize, setFontSize] = useState('M')
  const [density, setDensity] = useState('Comfortable')
  const [language, setLanguage] = useState('System')
  const [sidebar, setSidebar] = useState('Auto')
  const [accent, setAccent] = useState('#9B4DE0')

  // Notifications
  const [notifNewReleases, setNotifNewReleases] = useState(true)
  const [notifRecommendations, setNotifRecommendations] = useState(true)
  const [notifActivity, setNotifActivity] = useState(false)
  const [notifMarketing, setNotifMarketing] = useState(false)

  // Playback
  const [audioQuality, setAudioQuality] = useState('High')
  const [crossfade, setCrossfade] = useState('Off')
  const [normalizeVolume, setNormalizeVolume] = useState(true)
  const [offlineSync, setOfflineSync] = useState(true)

  // Privacy
  const [publicProfile, setPublicProfile] = useState(true)
  const [shareActivity, setShareActivity] = useState(false)

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  const inputStyle = {
    backgroundColor: '#2A1F3D',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    outline: 'none',
    width: '100%',
    padding: '11px 14px',
    fontSize: 14,
    transition: 'border-color 0.15s ease',
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page header */}
      <div className="mb-10">
        <h1
          className="font-display font-bold leading-display mb-2"
          style={{ fontSize: 40, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.8px', lineHeight: 1.05 }}
        >
          Profile &amp; Settings
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, lineHeight: 1.5 }}>
          Manage your account and personalize VibeWave.
        </p>
      </div>

      {/* Tab bar */}
      <div
        className="flex items-center gap-1 mb-10 p-1 rounded-xl w-fit"
        style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
            style={{
              backgroundColor: activeTab === tab ? '#2A1F3D' : 'transparent',
              color: activeTab === tab ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div
        className="rounded-2xl p-8"
        style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
      >

        {/* ─── PROFILE TAB ─────────────────────────────── */}
        {activeTab === 'Profile' && (
          <form onSubmit={handleSaveProfile}>
            <SectionTitle>Your Profile</SectionTitle>

            {/* Avatar */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #9B4DE0, #7b3db0)',
                    border: '2px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.95)',
                  }}
                >
                  AJ
                </div>
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center transition-vw hover:opacity-80"
                  style={{ backgroundColor: '#9B4DE0' }}
                  aria-label="Change profile photo"
                >
                  <Camera size={13} style={{ color: 'rgba(255,255,255,0.95)' }} />
                </button>
              </div>
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>Profile Photo</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>JPG, PNG or GIF. Max 5MB.</div>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-5">
              <div>
                <label htmlFor="display-name" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Display Name
                </label>
                <input
                  id="display-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#9B4DE0' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                />
              </div>
              <div>
                <label htmlFor="profile-email" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Email Address
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#9B4DE0' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#9B4DE0' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-vw hover:opacity-85 active:scale-95"
                style={{ backgroundColor: '#9B4DE0', color: 'rgba(255,255,255,0.95)' }}
              >
                {profileSaved ? <><Check size={14} /> Saved</> : 'Save Changes'}
              </button>
              <button
                type="button"
                className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-vw hover:opacity-80"
                style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Cancel
              </button>
            </div>

            {/* Danger zone */}
            <div
              className="mt-10 pt-8"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <h4 className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>Danger Zone</h4>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Delete Account</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Permanently remove your account and all data. This cannot be undone.
                  </div>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-vw hover:opacity-85"
                  style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ─── PLAYBACK TAB ─────────────────────────────── */}
        {activeTab === 'Playback' && (
          <div>
            <SectionTitle>Playback Settings</SectionTitle>
            <div>
              <SettingRow icon={Volume2} label="Audio Quality" description="Higher quality uses more data">
                <SelectChips options={['Normal', 'High', 'Very High']} value={audioQuality} onChange={setAudioQuality} />
              </SettingRow>
              <SettingRow icon={ChevronRight} label="Crossfade" description="Fade between tracks">
                <SelectChips options={['Off', '2s', '5s', '10s']} value={crossfade} onChange={setCrossfade} />
              </SettingRow>
              <SettingRow icon={Volume2} label="Normalize Volume" description="Keep volume consistent across tracks">
                <Toggle checked={normalizeVolume} onChange={() => setNormalizeVolume((v) => !v)} />
              </SettingRow>
              <SettingRow icon={Volume2} label="Offline Sync" description="Auto-download your playlists for offline use">
                <Toggle checked={offlineSync} onChange={() => setOfflineSync((v) => !v)} />
              </SettingRow>
            </div>
          </div>
        )}

        {/* ─── APPEARANCE TAB ─────────────────────────────── */}
        {activeTab === 'Appearance' && (
          <div>
            <SectionTitle>Appearance</SectionTitle>
            <div>
              <SettingRow icon={Volume2} label="Motion" description="Control animation playback">
                <SelectChips options={['On', 'Reduced', 'Off']} value={motion} onChange={setMotion} />
              </SettingRow>
              <SettingRow icon={Type} label="Font Size" description="Adjust reading size throughout the app">
                <SelectChips options={['S', 'M', 'L']} value={fontSize} onChange={setFontSize} />
              </SettingRow>
              <SettingRow icon={LayoutGrid} label="UI Density" description="How compact the interface appears">
                <SelectChips options={['Comfortable', 'Compact']} value={density} onChange={setDensity} />
              </SettingRow>
              <SettingRow icon={Globe} label="Language" description="App display language">
                <SelectChips options={['System', 'English', 'Spanish', 'French']} value={language} onChange={setLanguage} />
              </SettingRow>
              <SettingRow icon={PanelLeft} label="Sidebar" description="Default sidebar state">
                <SelectChips options={['Expanded', 'Collapsed', 'Auto']} value={sidebar} onChange={setSidebar} />
              </SettingRow>
              <SettingRow icon={Palette} label="Accent Color" description="Single accent used throughout VibeWave">
                <div className="flex items-center gap-2">
                  {ACCENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setAccent(opt.value)}
                      className="relative w-7 h-7 rounded-full transition-vw hover:scale-110"
                      style={{
                        backgroundColor: opt.value,
                        border: accent === opt.value ? '2px solid rgba(255,255,255,0.8)' : '2px solid transparent',
                        outline: accent === opt.value ? '2px solid rgba(255,255,255,0.3)' : 'none',
                        outlineOffset: 2,
                      }}
                      aria-label={`Set accent to ${opt.label}`}
                      title={opt.label}
                    >
                      {accent === opt.value && (
                        <Check size={12} className="absolute inset-0 m-auto" style={{ color: 'rgba(255,255,255,0.95)' }} />
                      )}
                    </button>
                  ))}
                </div>
              </SettingRow>
              <SettingRow icon={Moon} label="Theme" description="VibeWave is always dark — by design">
                <span className="text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}>
                  Dark only
                </span>
              </SettingRow>
            </div>
          </div>
        )}

        {/* ─── NOTIFICATIONS TAB ─────────────────────────────── */}
        {activeTab === 'Notifications' && (
          <div>
            <SectionTitle>Notification Preferences</SectionTitle>
            <div>
              <SettingRow icon={Volume2} label="New Releases" description="When artists you follow drop new music">
                <Toggle checked={notifNewReleases} onChange={() => setNotifNewReleases((v) => !v)} />
              </SettingRow>
              <SettingRow icon={Volume2} label="AI Recommendations" description="Weekly Vibe report and personalized picks">
                <Toggle checked={notifRecommendations} onChange={() => setNotifRecommendations((v) => !v)} />
              </SettingRow>
              <SettingRow icon={Volume2} label="Social Activity" description="When friends like or share tracks">
                <Toggle checked={notifActivity} onChange={() => setNotifActivity((v) => !v)} />
              </SettingRow>
              <SettingRow icon={Volume2} label="Marketing Emails" description="Promotions and news from VibeWave">
                <Toggle checked={notifMarketing} onChange={() => setNotifMarketing((v) => !v)} />
              </SettingRow>
            </div>
          </div>
        )}

        {/* ─── PRIVACY TAB ─────────────────────────────── */}
        {activeTab === 'Privacy' && (
          <div>
            <SectionTitle>Privacy</SectionTitle>
            <div>
              <SettingRow icon={Volume2} label="Public Profile" description="Anyone can see your profile and playlists">
                <Toggle checked={publicProfile} onChange={() => setPublicProfile((v) => !v)} />
              </SettingRow>
              <SettingRow icon={Volume2} label="Share Listening Activity" description="Show what you are playing to friends">
                <Toggle checked={shareActivity} onChange={() => setShareActivity((v) => !v)} />
              </SettingRow>
            </div>

            <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Data & Downloads
              </p>
              {[
                { label: 'Download your data', desc: 'Get a copy of your VibeWave data' },
                { label: 'Request data deletion', desc: 'Ask us to erase your personal data' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-4"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>{item.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.desc}</div>
                  </div>
                  <button
                    className="flex items-center gap-1 text-sm transition-vw hover:opacity-80"
                    style={{ color: '#9B4DE0' }}
                  >
                    Request <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
