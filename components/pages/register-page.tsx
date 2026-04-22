"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react'

const PERKS = [
  'AI-powered personalized mixes daily',
  'Unlimited skips and offline listening',
  'High-fidelity audio quality',
  'Synced lyrics and full player',
]

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e: typeof errors = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'At least 8 characters'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  const inputStyle = (hasError: boolean) => ({
    backgroundColor: '#2A1F3D',
    border: `1px solid ${hasError ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
    color: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    outline: 'none',
    width: '100%',
    padding: '12px 16px',
    fontSize: 15,
    transition: 'border-color 0.15s ease',
  })

  const pwStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#170F23' }}>

      {/* Left decorative */}
      <div
        className="hidden lg:flex flex-1 flex-col justify-between p-16 relative overflow-hidden"
        style={{ backgroundColor: '#1F162E', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse 70% 60% at 70% 30%, rgba(155,77,224,0.5), transparent 70%)', pointerEvents: 'none' }} aria-hidden="true" />
        <div className="relative flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#9B4DE0' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3 9 Q5 4 7 9 Q9 14 11 9 Q13 4 15 9" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <span className="font-display font-bold text-lg" style={{ color: 'rgba(255,255,255,0.95)' }}>VibeWave</span>
        </div>
        <div className="relative">
          <p className="font-display font-bold mb-8" style={{ fontSize: 36, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.8px', lineHeight: 1.1 }}>
            Everything you need
            <br />to enjoy music.
          </p>
          <div className="space-y-4">
            {PERKS.map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(155,77,224,0.2)' }}>
                  <Check size={11} style={{ color: '#9B4DE0' }} />
                </div>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{perk}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="font-display font-bold mb-2" style={{ fontSize: 32, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px' }}>
            Create your account
          </h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Free forever. No credit card needed.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>Full Name</label>
              <input
                id="name" type="text" autoComplete="name"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Alex Johnson"
                style={inputStyle(!!errors.name)}
                onFocus={(e) => { if (!errors.name) e.currentTarget.style.borderColor = '#9B4DE0' }}
                onBlur={(e) => { if (!errors.name) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p role="alert" className="text-xs mt-1.5" style={{ color: '#f87171' }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>Email</label>
              <input
                id="reg-email" type="email" autoComplete="email"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                style={inputStyle(!!errors.email)}
                onFocus={(e) => { if (!errors.email) e.currentTarget.style.borderColor = '#9B4DE0' }}
                onBlur={(e) => { if (!errors.email) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p role="alert" className="text-xs mt-1.5" style={{ color: '#f87171' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  style={{ ...inputStyle(!!errors.password), paddingRight: 44 }}
                  onFocus={(e) => { if (!errors.password) e.currentTarget.style.borderColor = '#9B4DE0' }}
                  onBlur={(e) => { if (!errors.password) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                  aria-invalid={!!errors.password}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-vw" style={{ color: 'rgba(255,255,255,0.35)' }} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{ backgroundColor: pwStrength >= i ? (pwStrength === 1 ? '#ef4444' : pwStrength === 2 ? '#f59e0b' : '#4ade80') : 'rgba(255,255,255,0.1)' }}
                    />
                  ))}
                  <span className="text-[11px] ml-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {pwStrength === 1 ? 'Weak' : pwStrength === 2 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}
              {errors.password && <p role="alert" className="text-xs mt-1.5" style={{ color: '#f87171' }}>{errors.password}</p>}
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-vw hover:opacity-85 active:scale-95"
              style={{ backgroundColor: '#9B4DE0', color: 'rgba(255,255,255,0.95)', opacity: loading ? 0.7 : 1, marginTop: 8 }}
            >
              {loading ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <>Create Account <ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium transition-vw hover:opacity-80" style={{ color: '#9B4DE0' }}>Sign in</Link>
          </p>
          <p className="text-xs text-center mt-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="underline hover:opacity-80 transition-vw" style={{ color: 'rgba(255,255,255,0.35)' }}>Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:opacity-80 transition-vw" style={{ color: 'rgba(255,255,255,0.35)' }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
