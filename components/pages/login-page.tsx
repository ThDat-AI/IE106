"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, Music2, Headphones, Radio, Disc3 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n-store'
import { isUserLoggedIn, signInDemo } from '@/lib/auth'
import { AmbientOrbs, GlassPanel } from '@/components/ui/vibewave'

/* ── SVG brand icons (Simple Icons-accurate paths) ── */
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
    </svg>
  )
}

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
    </svg>
  )
}

function AppleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09ZM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  )
}

function PhoneIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  )
}

/* ── Floating music note particles ── */
function FloatingNotes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float-note"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 1.2}s`,
            animationDuration: `${6 + i * 0.8}s`,
            opacity: 0.06 + i * 0.015,
          }}
        >
          {i % 3 === 0 ? (
            <Headphones size={24 + i * 4} className="text-purple-400" />
          ) : i % 3 === 1 ? (
            <Radio size={20 + i * 3} className="text-blue-400" />
          ) : (
            <Disc3 size={22 + i * 3} className="text-pink-400" />
          )}
        </div>
      ))}
    </div>
  )
}

export default function LoginPage({ initialMode = 'login' }: { initialMode?: 'login' | 'register' | 'forgot' }) {
  const { t } = useTranslation()
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('demo@vibewave.test')
  const [loginPassword, setLoginPassword] = useState('Password123')
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({})

  // Register State
  const [regForm, setRegForm] = useState({ name: 'Demo User', email: 'demo@vibewave.test', password: 'Password123' })
  const [regErrors, setRegErrors] = useState<Partial<typeof regForm>>({})

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState(false)

  useEffect(() => {
    if (isUserLoggedIn()) {
      router.replace('/')
    }
  }, [router])

  function validateLogin() {
    const e: typeof loginErrors = {}
    if (!loginEmail) e.email = t.emailRequired
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) e.email = t.validEmail
    if (!loginPassword) e.password = t.passwordRequired
    return e
  }

  function validateRegister() {
    const e: typeof regErrors = {}
    if (!regForm.name.trim()) e.name = t.nameRequired
    if (!regForm.email) e.email = t.emailRequired
    else if (!/\S+@\S+\.\S+/.test(regForm.email)) e.email = t.validEmail
    if (!regForm.password) e.password = t.passwordRequired
    else if (regForm.password.length < 8) e.password = t.passwordMinRegister
    return e
  }

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateLogin()
    if (Object.keys(errs).length > 0) { setLoginErrors(errs); return }
    setLoginErrors({})
    setLoading(true)
    setTimeout(() => {
      signInDemo()
      router.replace('/')
    }, 700)
  }

  function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateRegister()
    if (Object.keys(errs).length > 0) { setRegErrors(errs); return }
    setRegErrors({})
    setLoading(true)
    setTimeout(() => {
      signInDemo()
      router.replace('/')
    }, 700)
  }

  function handleForgotPasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!forgotEmail) {
      setForgotError(t.emailRequired)
      return
    } else if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      setForgotError(t.validEmail)
      return
    }
    setForgotError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setForgotSuccess(true)
    }, 1000)
  }

  const inputContainerStyle = (fieldName: string, hasError: boolean) => ({
    backgroundColor: focusedField === fieldName ? 'rgba(155, 77, 224, 0.06)' : 'rgba(255, 255, 255, 0.03)',
    border: `1.5px solid ${hasError ? '#ef4444' : focusedField === fieldName ? 'rgba(155, 77, 224, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
    borderRadius: '16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: focusedField === fieldName ? '0 0 20px rgba(155, 77, 224, 0.15)' : 'none',
  })

  const pwStrength = regForm.password.length === 0 ? 0 : regForm.password.length < 6 ? 1 : regForm.password.length < 10 ? 2 : 3

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#0A0712' }}>
      <AmbientOrbs position="fixed" />
      <FloatingNotes />

      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #9B4DE0 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />

      {/* ── UNIFIED AUTH CONTAINER ── */}
      <div className="w-full max-w-[480px] relative z-10 p-6 md:p-0">
        <GlassPanel className="p-8 md:p-10 min-h-[720px] flex flex-col transition-all duration-500 ease-in-out" variant="dark">
          
          {/* Header Section (Shared) */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative group transition-transform duration-500 hover:rotate-12"
              style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #7E22CE 100%)', boxShadow: '0 0 40px rgba(155, 77, 224, 0.5)' }}>
              <Music2 size={32} color="white" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="h-[90px] flex flex-col justify-center">
              <h1 className="font-display font-bold text-2xl md:text-3xl mb-3 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-500 whitespace-nowrap" key={mode === 'login' ? 'title-l' : mode === 'register' ? 'title-r' : 'title-f'} style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                {mode === 'login' ? t.welcomeBack : mode === 'register' ? t.createAccount : forgotSuccess ? t.resetLinkSent : t.forgotPasswordTitle}
              </h1>
              <p className={`text-sm md:text-base font-medium text-white/75 animate-in fade-in duration-700 ${mode === 'forgot' && !forgotSuccess ? 'sm:whitespace-nowrap' : ''}`} key={mode === 'login' ? 'sub-l' : mode === 'register' ? 'sub-r' : 'sub-f'}>
                {mode === 'login' ? t.signInSub : mode === 'register' ? t.createAccountSub : forgotSuccess ? t.resetLinkSentSub : t.forgotPasswordSub}
              </p>
            </div>
          </div>

          {/* Dynamic Forms Area */}
          <div className="relative flex-1">
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} noValidate className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-widest ml-1 text-white/75">{t.email}</label>
                  <div className="relative flex items-center group" style={inputContainerStyle('login-email', !!loginErrors.email)}>
                    <div className="pl-4 text-white/30 group-focus-within:text-purple-400 transition-colors"><Mail size={18} /></div>
                    <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} onFocus={() => setFocusedField('login-email')} onBlur={() => setFocusedField(null)} placeholder="you@example.com" className="w-full bg-transparent border-none outline-none py-4 px-4 text-[15px] text-white/90 placeholder:text-white/20" />
                  </div>
                  {loginErrors.email && <p className="text-xs font-medium mt-2 ml-1 text-red-400 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />{loginErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-white/75">{t.password}</label>
                    <button type="button" onClick={() => { setMode('forgot'); setForgotEmail(loginEmail); setForgotError(''); setForgotSuccess(false); }} className="text-[10px] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300">{t.forgotPassword}</button>
                  </div>
                  <div className="relative flex items-center group" style={inputContainerStyle('login-password', !!loginErrors.password)}>
                    <div className="pl-4 text-white/30 group-focus-within:text-purple-400 transition-colors"><Lock size={18} /></div>
                    <input type={showPassword ? 'text' : 'password'} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onFocus={() => setFocusedField('login-password')} onBlur={() => setFocusedField(null)} placeholder={t.enterPassword} className="w-full bg-transparent border-none outline-none py-4 px-4 text-[15px] text-white/90 placeholder:text-white/20" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-4 text-white/30 hover:text-white/60">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                  {loginErrors.password && <p className="text-xs font-medium mt-2 ml-1 text-red-400 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />{loginErrors.password}</p>}
                </div>

                <button type="submit" disabled={loading} className="group relative w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold transition-all duration-300 mt-4 overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #7E22CE 100%)', boxShadow: '0 8px 25px -5px rgba(155, 77, 224, 0.5)' }}>
                  {loading ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <><span className="relative z-10">{t.signIn}</span><ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" /></>}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                </button>
              </form>
            ) : mode === 'register' ? (
              <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-widest ml-1 text-white/75">{t.fullName}</label>
                  <div className="relative flex items-center group" style={inputContainerStyle('reg-name', !!regErrors.name)}>
                    <div className="pl-4 text-white/30 group-focus-within:text-purple-400 transition-colors"><User size={18} /></div>
                    <input type="text" value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} onFocus={() => setFocusedField('reg-name')} onBlur={() => setFocusedField(null)} placeholder="Alex Johnson" className="w-full bg-transparent border-none outline-none py-3.5 px-4 text-[15px] text-white/90 placeholder:text-white/20" />
                  </div>
                  {regErrors.name && <p className="text-xs font-medium mt-1 ml-1 text-red-400 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />{regErrors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-widest ml-1 text-white/75">{t.email}</label>
                  <div className="relative flex items-center group" style={inputContainerStyle('reg-email', !!regErrors.email)}>
                    <div className="pl-4 text-white/30 group-focus-within:text-purple-400 transition-colors"><Mail size={18} /></div>
                    <input type="email" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} onFocus={() => setFocusedField('reg-email')} onBlur={() => setFocusedField(null)} placeholder="you@example.com" className="w-full bg-transparent border-none outline-none py-3.5 px-4 text-[15px] text-white/90 placeholder:text-white/20" />
                  </div>
                  {regErrors.email && <p className="text-xs font-medium mt-1 ml-1 text-red-400 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />{regErrors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-widest ml-1 text-white/75">{t.password}</label>
                  <div className="relative flex items-center group" style={inputContainerStyle('reg-password', !!regErrors.password)}>
                    <div className="pl-4 text-white/30 group-focus-within:text-purple-400 transition-colors"><Lock size={18} /></div>
                    <input type={showPassword ? 'text' : 'password'} value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} onFocus={() => setFocusedField('reg-password')} onBlur={() => setFocusedField(null)} placeholder={t.passwordMinRegister} className="w-full bg-transparent border-none outline-none py-3.5 px-4 text-[15px] text-white/90 placeholder:text-white/20" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-4 text-white/30 hover:text-white/60">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                  {regForm.password.length > 0 && (
                    <div className="px-1 py-1 flex gap-2 items-center">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-500" style={{ backgroundColor: pwStrength >= i ? (pwStrength === 1 ? '#ef4444' : pwStrength === 2 ? '#9B4DE0' : '#05D69E') : 'rgba(255, 255, 255, 0.1)', boxShadow: pwStrength >= i ? `0 0 10px ${pwStrength === 1 ? '#ef444466' : pwStrength === 2 ? '#9B4DE066' : '#05D69E66'}` : 'none' }} />
                      ))}
                      <span className="text-[10px] font-bold uppercase tracking-widest ml-2 text-white/35">{pwStrength === 1 ? t.weak : pwStrength === 2 ? t.good : t.strong}</span>
                    </div>
                  )}
                  {regErrors.password && <p className="text-xs font-medium mt-1 ml-1 text-red-400 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />{regErrors.password}</p>}
                </div>

                <button type="submit" disabled={loading} className="group relative w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold transition-all duration-300 mt-4 overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #7E22CE 100%)', boxShadow: '0 8px 25px -5px rgba(155, 77, 224, 0.5)' }}>
                  {loading ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <><span className="relative z-10">{t.createAccount}</span><ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" /></>}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                </button>
              </form>
            ) : (
              /* Forgot password mode */
              forgotSuccess ? (
                <div className="space-y-6 text-center py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-[pulse_2s_infinite]" style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-sans leading-relaxed text-white/70">
                      {t.resetLinkSentSub}
                    </p>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => {
                      setForgotSuccess(false)
                      setForgotEmail('')
                      setMode('login')
                    }} 
                    className="group relative w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold transition-all duration-300 mt-4 overflow-hidden text-white" 
                    style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #7E22CE 100%)', boxShadow: '0 8px 25px -5px rgba(155, 77, 224, 0.5)' }}
                  >
                    <span className="relative z-10">{t.backToLogin}</span>
                    <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} noValidate className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-sans font-bold uppercase tracking-widest ml-1 text-white/75">{t.email}</label>
                    <div className="relative flex items-center group" style={inputContainerStyle('forgot-email', !!forgotError)}>
                      <div className="pl-4 text-white/30 group-focus-within:text-purple-400 transition-colors"><Mail size={18} /></div>
                      <input 
                        type="email" 
                        value={forgotEmail} 
                        onChange={(e) => setForgotEmail(e.target.value)} 
                        onFocus={() => setFocusedField('forgot-email')} 
                        onBlur={() => setFocusedField(null)} 
                        placeholder="you@example.com" 
                        className="w-full bg-transparent border-none outline-none py-4 px-4 text-[15px] font-sans text-white/90 placeholder:text-white/20" 
                      />
                    </div>
                    {forgotError && <p className="text-xs font-medium mt-2 ml-1 text-red-400 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />{forgotError}</p>}
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="group relative w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold transition-all duration-300 mt-4 overflow-hidden text-white" 
                    style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #7E22CE 100%)', boxShadow: '0 8px 25px -5px rgba(155, 77, 224, 0.5)' }}
                  >
                    {loading ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <><span className="relative z-10">{t.sendResetLink}</span><ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" /></>}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  </button>

                  <div className="text-center pt-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        setForgotError('')
                        setMode('login')
                      }} 
                      className="text-xs font-sans font-bold uppercase tracking-widest text-purple-300 hover:text-purple-200 transition-colors"
                    >
                      {t.backToLogin}
                    </button>
                  </div>
                </form>
              )
            )}
          </div>

          {/* Divider (Shared) */}
          {mode !== 'forgot' && (
            <div className="flex items-center gap-4 mt-8 mb-6 animate-in fade-in duration-300">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-white/65">
                {mode === 'login' ? t.orSignInWith : t.orSignUpWith}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          )}

          {/* Social Login (Shared) - Minimized at the bottom */}
          {mode !== 'forgot' && (
            <div className="flex items-center justify-center gap-4 mb-2 animate-in fade-in duration-300">
              {[
                { icon: <GoogleIcon size={20} />, label: 'Google', id: 'google-auth' },
                { icon: <FacebookIcon size={20} />, label: 'Facebook', id: 'facebook-auth' },
                { icon: <AppleIcon size={20} />, label: 'Apple', id: 'apple-auth' },
                { icon: <PhoneIcon size={20} />, label: 'Phone', id: 'phone-auth' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={`Sign in with ${p.label}`}
                  className="w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20 hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                  {p.icon}
                </button>
              ))}
            </div>
          )}

          {/* Footer (Shared Toggle) */}
          {mode !== 'forgot' ? (
            <div className="mt-8 pt-6 border-t border-white/5 text-center animate-in fade-in duration-300">
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm text-white/75">
                  {mode === 'login' ? t.noAccount : t.alreadyHaveAccount}{' '}
                  <button 
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    className="font-sans font-bold text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    {mode === 'login' ? t.createOne : t.signInLink}
                  </button>
                </p>
                
                {mode === 'register' && (
                  <p className="text-[10px] leading-relaxed text-white/70">
                    {t.termsAgree} <Link href="/legal?tab=terms" className="underline text-purple-300 hover:text-purple-200 transition-colors whitespace-nowrap">{t.termsLink}</Link> {t.andText} <Link href="/legal?tab=privacy" className="underline text-purple-300 hover:text-purple-200 transition-colors whitespace-nowrap">{t.privacyLink}</Link>.
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Forgot footer option: Link back to register */
            !forgotSuccess && (
              <div className="mt-8 pt-6 border-t border-white/5 text-center animate-in fade-in duration-300 font-sans">
                <p className="text-sm text-white/75">
                  {t.noAccount}{' '}
                  <button 
                    onClick={() => {
                      setForgotError('')
                      setMode('register')
                    }}
                    className="font-bold text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    {t.createOne}
                  </button>
                </p>
              </div>
            )
          )}
        </GlassPanel>


      </div>

      <style jsx>{`
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        @keyframes float-note {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.05; }
          50% { transform: translateY(-30px) rotate(10deg); opacity: 0.12; }
        }
        .animate-float-note { animation: float-note 6s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
