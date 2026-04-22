"use client"

import { useState } from 'react'
import { ArrowRight, Check, ChevronDown, Mail } from 'lucide-react'

const SUBJECTS = [
  'General Inquiry',
  'Billing & Subscription',
  'Technical Support',
  'Report a Bug',
  'Artist / Label Inquiry',
  'Press & Media',
  'Other',
]

const FAQ_ITEMS = [
  { q: 'How do I cancel my subscription?', a: 'You can cancel anytime from Profile > Settings > Subscription. Your access continues until the end of the billing period.' },
  { q: 'Why is my audio cutting out?', a: 'Check your internet connection and try lowering the audio quality in Settings > Playback > Audio Quality.' },
  { q: 'How does AI personalization work?', a: 'Our AI analyzes your listening history, skip patterns, and time-of-day habits to surface music that fits your workflow without sharing your data externally.' },
  { q: 'Can I download music for offline use?', a: 'Yes. Enable Offline Sync in Settings > Playback. Playlists marked for offline will automatically download on Wi-Fi.' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  function validate() {
    const e: typeof errors = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    setTimeout(() => { setLoading(false); setSubmitted(true) }, 1500)
  }

  const inputStyle = (hasError?: boolean) => ({
    backgroundColor: '#2A1F3D',
    border: `1px solid ${hasError ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
    color: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    outline: 'none',
    width: '100%',
    padding: '11px 14px',
    fontSize: 14,
    transition: 'border-color 0.15s ease',
  })

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-14">
        <h1
          className="font-display font-bold leading-display mb-4"
          style={{ fontSize: 56, color: 'rgba(255,255,255,0.95)', letterSpacing: '-1.2px', lineHeight: 0.96 }}
        >
          Contact Us
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
          We&apos;re here to help. Expect a reply within one business day.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-12">

        {/* Left — contact info */}
        <div className="col-span-2 space-y-8">
          <div>
            <h2
              className="font-display font-semibold mb-6"
              style={{ fontSize: 18, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}
            >
              Get in touch
            </h2>
            <div className="space-y-5">
              <div
                className="flex items-start gap-4 rounded-2xl p-4"
                style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'rgba(155,77,224,0.12)' }}
                >
                  <Mail size={16} style={{ color: '#9B4DE0' }} />
                </div>
                <div>
                  <div className="text-sm font-medium mb-0.5" style={{ color: 'rgba(255,255,255,0.85)' }}>Email</div>
                  <a
                    href="mailto:support@vibewave.fm"
                    className="text-sm transition-all duration-150 hover:opacity-80"
                    style={{ color: '#9B4DE0' }}
                  >
                    support@vibewave.fm
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div
              className="text-[11px] font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              Response Times
            </div>
            {[
              { label: 'General', time: '1 business day' },
              { label: 'Technical', time: '4–8 hours' },
              { label: 'Billing', time: '1 business day' },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between py-2.5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{row.label}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{row.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="col-span-3">
          {submitted ? (
            <div
              className="rounded-2xl p-10 flex flex-col items-center text-center"
              style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: 'rgba(155,77,224,0.15)' }}
              >
                <Check size={24} style={{ color: '#9B4DE0' }} />
              </div>
              <h3
                className="font-display font-semibold mb-3"
                style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}
              >
                Message sent
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: 320 }}>
                Thanks for reaching out. We&apos;ll get back to you at <strong style={{ color: 'rgba(255,255,255,0.75)' }}>{form.email}</strong> within one business day.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' }) }}
                className="mt-6 text-sm transition-all duration-150 hover:opacity-80"
                style={{ color: '#9B4DE0' }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Name + Email row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>Name</label>
                  <input
                    id="contact-name" type="text"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Alex Johnson"
                    style={inputStyle(!!errors.name)}
                    onFocus={(e) => { if (!errors.name) e.currentTarget.style.borderColor = '#9B4DE0' }}
                    onBlur={(e) => { if (!errors.name) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p role="alert" className="text-xs mt-1.5" style={{ color: '#f87171' }}>{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>Email</label>
                  <input
                    id="contact-email" type="email"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    style={inputStyle(!!errors.email)}
                    onFocus={(e) => { if (!errors.email) e.currentTarget.style.borderColor = '#9B4DE0' }}
                    onBlur={(e) => { if (!errors.email) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p role="alert" className="text-xs mt-1.5" style={{ color: '#f87171' }}>{errors.email}</p>}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>Subject</label>
                <div className="relative">
                  <select
                    id="contact-subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    style={{ ...inputStyle(), appearance: 'none', paddingRight: 40, cursor: 'pointer' }}
                  >
                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.35)' }} />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>Message</label>
                <textarea
                  id="contact-message" rows={6}
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us how we can help..."
                  style={{ ...inputStyle(!!errors.message), resize: 'none', lineHeight: 1.6 }}
                  onFocus={(e) => { if (!errors.message) e.currentTarget.style.borderColor = '#9B4DE0' }}
                  onBlur={(e) => { if (!errors.message) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                  aria-invalid={!!errors.message}
                />
                {errors.message && <p role="alert" className="text-xs mt-1.5" style={{ color: '#f87171' }}>{errors.message}</p>}
              </div>

              <button
                type="submit" disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-150 hover:opacity-85 active:scale-95"
                style={{ backgroundColor: '#9B4DE0', color: 'rgba(255,255,255,0.95)', opacity: loading ? 0.7 : 1 }}
              >
                {loading
                  ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  : <><ArrowRight size={15} /> Send Message</>
                }
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ accordion */}
      <div className="mt-20 pt-12" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <h2
          className="font-display font-semibold mb-8"
          style={{ fontSize: 28, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px' }}
        >
          Quick answers
        </h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left transition-all duration-150 hover:bg-white/[0.02]"
                aria-expanded={openFaq === i}
              >
                <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{item.q}</span>
                <ChevronDown
                  size={16}
                  style={{
                    color: 'rgba(255,255,255,0.35)',
                    transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s ease',
                    flexShrink: 0,
                    marginLeft: 16,
                  }}
                />
              </button>
              {openFaq === i && (
                <div
                  className="px-6 pb-5"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, paddingTop: 16 }}>
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
