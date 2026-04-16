import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ onClose, defaultTab = 'login' }) {
  const { signup, login, loading } = useAuth()
  const [tab, setTab] = useState(defaultTab)
  const [fields, setFields] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = e => setFields(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      if (tab === 'signup') {
        if (!fields.name || !fields.email || !fields.password)
          return setError('All fields are required.')
        if (fields.password.length < 6)
          return setError('Password must be at least 6 characters.')
        await signup(fields.name, fields.email, fields.password)
        setSuccess('Account created! Welcome to NextGenShe 💜')
        setTimeout(onClose, 1200)
      } else {
        if (!fields.email || !fields.password)
          return setError('Email and password are required.')
        await login(fields.email, fields.password)
        setSuccess('Welcome back! 💜')
        setTimeout(onClose, 800)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="card-glass border border-white/10 rounded-3xl p-8 w-full max-w-md relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/40 hover:text-white text-xl leading-none"
        >✕</button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
            <span className="font-display font-bold text-sm text-white">NG</span>
          </div>
          <span className="font-display font-bold text-xl text-white">
            Next<span className="gradient-text">Gen</span>She
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-full mb-6">
          {['login', 'signup'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); setSuccess('') }}
              className={`flex-1 py-2 rounded-full text-sm font-body font-medium transition-all ${
                tab === t ? 'bg-brand-600 text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-white font-body">{success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="block text-sm text-white/60 font-body mb-1.5">Your Name</label>
                <input
                  type="text" name="name" value={fields.name} onChange={handleChange}
                  placeholder="Jane Doe"
                  className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 font-body text-sm outline-none focus:border-brand-500/50 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-white/60 font-body mb-1.5">Email Address</label>
              <input
                type="email" name="email" value={fields.email} onChange={handleChange}
                placeholder="jane@example.com"
                className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 font-body text-sm outline-none focus:border-brand-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 font-body mb-1.5">Password</label>
              <input
                type="password" name="password" value={fields.password} onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 font-body text-sm outline-none focus:border-brand-500/50 transition-all"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm font-body bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg> Loading...</>
              ) : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <p className="text-center text-white/30 text-xs font-body pt-1">
              {tab === 'login'
                ? "Don't have an account? "
                : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
                className="text-brand-400 hover:text-brand-300 underline"
              >
                {tab === 'login' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
