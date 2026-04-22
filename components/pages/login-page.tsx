"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n-store'

export default function LoginPage() {
  const { t, language } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e: typeof errors = {}
    if (!email) e.email = t.emailRequired
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = t.validEmail
    if (!password) e.password = t.passwordRequired
    else if (password.length < 6) e.password = t.passwordMin
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    setTimeout(() => { setLoading(false) }, 1500)
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

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: '#170F23' }}
    >
      {/* Left panel — decorative */}
      <div
        className="hidden lg:flex flex-1 flex-col justify-between p-16 relative overflow-hidden"
        style={{ backgroundColor: '#1F162E', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 30% 70%, rgba(155,77,224,0.5), transparent 70%)', pointerEvents: 'none' }}
          aria-hidden="true"
        />
        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#9B4DE0' }}>
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3 9 Q5 4 7 9 Q9 14 11 9 Q13 4 15 9" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <div className="flex flex-col -space-y-0.5">
            <span className="font-display font-bold text-lg leading-tight" style={{ color: 'rgba(255,255,255,0.95)' }}>VibeWave</span>
            <span className="text-[10px] font-medium leading-tight" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {t.musicThatWorks}
            </span>
          </div>
        </div>

        {/* Quote */}
        <div className="relative">
          <p
            className="font-display font-bold leading-display mb-6"
            style={{ fontSize: 40, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.8px', lineHeight: 1.1 }}
          >
            {t.musicThatWorks.split('.').map((part, i) => (
              <span key={i}>
                {part}
                {i === 0 && <br />}
              </span>
            ))}
          </p>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
            {t.loginHeroSub}
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto w-full">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#9B4DE0' }}>
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M3 9 Q5 4 7 9 Q9 14 11 9 Q13 4 15 9" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <div className="flex flex-col -space-y-0.5">
              <span className="font-display font-bold text-lg leading-tight" style={{ color: 'rgba(255,255,255,0.95)' }}>VibeWave</span>
              <span className="text-[10px] font-medium leading-tight" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {t.musicThatWorks}
              </span>
            </div>
          </div>

          <h1 className="font-display font-bold mb-2" style={{ fontSize: 32, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px' }}>
            {t.welcomeBack}
          </h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {t.signInSub}
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {t.email}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle(!!errors.email)}
                onFocus={(e) => { if (!errors.email) e.currentTarget.style.borderColor = '#9B4DE0' }}
                onBlur={(e) => { if (!errors.email) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" role="alert" className="text-xs mt-1.5" style={{ color: '#f87171' }}>{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {t.password}
                </label>
                <Link href="#" className="text-xs transition-vw hover:opacity-80" style={{ color: '#9B4DE0' }}>
                  {t.forgotPassword}
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.enterPassword}
                  style={{ ...inputStyle(!!errors.password), paddingRight: 44 }}
                  onFocus={(e) => { if (!errors.password) e.currentTarget.style.borderColor = '#9B4DE0' }}
                  onBlur={(e) => { if (!errors.password) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-vw"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" role="alert" className="text-xs mt-1.5" style={{ color: '#f87171' }}>{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-vw hover:opacity-85 active:scale-95 mt-2"
              style={{
                backgroundColor: '#9B4DE0',
                color: 'rgba(255,255,255,0.95)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>{t.signIn} <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {t.noAccount}{' '}
            <Link href="/register" className="font-medium transition-vw hover:opacity-80" style={{ color: '#9B4DE0' }}>
              {t.createOne}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
