"use client"

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const CATEGORIES = [
  {
    name: 'Account',
    questions: [
      { q: 'How do I create a VibeWave account?', a: 'Visit vibewave.fm and click "Register." Enter your name, email, and a password. No credit card is required to get started with the free tier.' },
      { q: 'How do I reset my password?', a: 'On the Login page, click "Forgot password?" and enter your email. You will receive a reset link within a few minutes. Check your spam folder if it does not arrive.' },
      { q: 'Can I change my username?', a: 'Yes. Go to Profile > Settings > Profile and update your Display Name. Changes take effect immediately.' },
      { q: 'How do I delete my account?', a: 'Navigate to Profile > Settings > Profile > Danger Zone and click "Delete Account." This action is irreversible and will erase all your data within 30 days.' },
      { q: 'Can I have multiple accounts?', a: 'Each email address supports one VibeWave account. You may switch between accounts on the same device using the sign-out option in the profile menu.' },
      { q: 'What happens to my data when I delete my account?', a: 'We will permanently delete your personal data, listening history, and playlists within 30 days of account deletion, in compliance with applicable privacy laws.' },
    ],
  },
  {
    name: 'Playback',
    questions: [
      { q: 'Why is my music buffering?', a: 'Buffering is usually caused by a slow or unstable internet connection. Try switching to a lower audio quality in Settings > Playback > Audio Quality or connect to a stronger network.' },
      { q: 'How does crossfade work?', a: 'Crossfade smoothly transitions between tracks by overlapping their endings and beginnings. Enable it in Settings > Playback > Crossfade and choose a duration between 2 and 10 seconds.' },
      { q: 'Can I play music in the background?', a: 'Yes. VibeWave is designed for background listening. Audio continues playing when you switch apps or lock your screen on mobile.' },
      { q: 'What is volume normalization?', a: 'Volume normalization keeps the perceived loudness consistent across all tracks so you do not have to constantly adjust your volume. Enable it in Settings > Playback.' },
      { q: 'How do I control playback with keyboard shortcuts?', a: 'Press Space to play or pause, arrow keys to skip, and M to mute. A full list of keyboard shortcuts is available in Settings > Shortcuts.' },
      { q: 'Why does audio quality change automatically?', a: 'VibeWave adjusts audio quality based on your connection speed by default. You can lock quality to a specific setting in Settings > Playback > Audio Quality.' },
    ],
  },
  {
    name: 'Subscription',
    questions: [
      { q: 'What is included in the free plan?', a: 'The free plan includes standard audio quality, limited skips, and access to curated playlists. Ads are served occasionally between tracks.' },
      { q: 'How much does VibeWave Premium cost?', a: 'Premium is $9.99 per month or $89.99 per year. A family plan for up to 6 accounts is available at $14.99 per month.' },
      { q: 'How do I cancel my subscription?', a: 'Go to Profile > Settings > Subscription and click "Cancel Plan." You keep Premium access until the end of the current billing period.' },
      { q: 'Will I be charged after a free trial?', a: 'Yes. If you do not cancel before the trial ends, your payment method will be charged automatically. You can cancel at any time during the trial at no cost.' },
      { q: 'Do you offer student discounts?', a: 'Yes. Students with a valid .edu email address qualify for 50% off the monthly plan. Verify your status at vibewave.fm/student.' },
      { q: 'How do refunds work?', a: 'We offer a full refund within 7 days of a charge if you have not streamed more than 2 hours during that period. Contact support@vibewave.fm to request one.' },
    ],
  },
  {
    name: 'Technical',
    questions: [
      { q: 'Which browsers does VibeWave support?', a: 'VibeWave works best on the latest versions of Chrome, Safari, Firefox, and Edge. Internet Explorer is not supported.' },
      { q: 'Is there a desktop app?', a: 'A native desktop app for macOS and Windows is currently in development. Sign up for early access at vibewave.fm/desktop.' },
      { q: 'How do I report a bug?', a: 'Use the Contact Us form, select "Report a Bug," and describe what happened. Screenshots or screen recordings help us resolve issues faster.' },
      { q: 'Why is the player not showing on some pages?', a: 'The bottom player requires JavaScript to be enabled. Make sure your browser has JavaScript enabled and that no extensions are blocking scripts on vibewave.fm.' },
      { q: 'How do I clear my cache?', a: 'Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac) in your browser, select cached images and files, and click Clear Data. Then reload VibeWave.' },
      { q: 'Does VibeWave work offline?', a: 'Offline listening is available for Premium subscribers. Enable Offline Sync in Settings > Playback to automatically download your playlists on Wi-Fi.' },
    ],
  },
]

export default function FaqPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const [activeCategory, setActiveCategory] = useState('Account')

  function toggle(key: string) {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const currentCategory = CATEGORIES.find((c) => c.name === activeCategory)!

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1
          className="font-display font-bold leading-display mb-4"
          style={{ fontSize: 56, color: 'rgba(255,255,255,0.95)', letterSpacing: '-1.2px', lineHeight: 0.96 }}
        >
          FAQ
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
          Quick answers to the most common questions.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-10">

        {/* Category nav */}
        <div className="col-span-1">
          <nav className="sticky top-24 space-y-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  backgroundColor: activeCategory === cat.name ? 'rgba(155,77,224,0.1)' : 'transparent',
                  color: activeCategory === cat.name ? '#9B4DE0' : 'rgba(255,255,255,0.5)',
                  borderLeft: activeCategory === cat.name ? '3px solid #9B4DE0' : '3px solid transparent',
                  paddingLeft: activeCategory === cat.name ? 'calc(1rem - 3px)' : '1rem',
                }}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Questions */}
        <div className="col-span-3">
          <h2
            className="font-display font-semibold mb-6"
            style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}
          >
            {currentCategory.name}
          </h2>
          <div className="space-y-2">
            {currentCategory.questions.map((item, i) => {
              const key = `${activeCategory}-${i}`
              const isOpen = !!openItems[key]
              return (
                <div
                  key={key}
                  className="rounded-2xl overflow-hidden"
                  style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <button
                    onClick={() => toggle(key)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left transition-all duration-150 hover:bg-white/[0.02]"
                    aria-expanded={isOpen}
                  >
                    <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.9)', fontWeight: 500, lineHeight: 1.4 }}>
                      {item.q}
                    </span>
                    <ChevronDown
                      size={16}
                      style={{
                        color: isOpen ? '#9B4DE0' : 'rgba(255,255,255,0.3)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s ease, color 0.15s ease',
                        flexShrink: 0,
                        marginLeft: 16,
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div
                      className="px-6 pb-5"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, paddingTop: 14 }}>
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Still need help */}
          <div
            className="mt-8 rounded-2xl p-6 flex items-center justify-between"
            style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>Still need help?</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Our support team replies within one business day.</div>
            </div>
            <a
              href="/contact"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 hover:opacity-85"
              style={{ backgroundColor: '#9B4DE0', color: 'rgba(255,255,255,0.95)' }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
