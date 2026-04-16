import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/courses', label: 'Courses' },
  { to: '/ai-mentor', label: '🤖 AI Mentor' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authTab, setAuthTab] = useState('login')

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const openAuth = (tab) => { setAuthTab(tab); setShowAuth(true) }

  return (
    <>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultTab={authTab} />}

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-midnight/90 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:shadow-brand-500/50 transition-shadow">
                <span className="font-display font-bold text-sm text-white">NG</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                Next<span className="gradient-text">Gen</span>She
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to} to={to} end={to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                      isActive ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`
                  }
                >{label}</NavLink>
              ))}
            </div>

            {/* Auth CTA */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-body transition-all">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    {user.name.split(' ')[0]}
                  </Link>
                  <button onClick={logout} className="text-white/40 hover:text-white text-sm font-body transition-colors px-2">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => openAuth('login')} className="text-white/70 hover:text-white text-sm font-body transition-colors px-3 py-2">
                    Sign In
                  </button>
                  <button onClick={() => openAuth('signup')} className="btn-primary text-sm px-6 py-2.5">
                    Get Started
                  </button>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-surface/95 backdrop-blur-md border-t border-white/5 px-6 py-4 space-y-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'bg-brand-600/20 text-brand-300' : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`
                }
              >{label}</NavLink>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-outline w-full justify-center text-sm">
                    My Dashboard
                  </Link>
                  <button onClick={() => { logout(); setOpen(false) }} className="text-white/40 text-sm font-body py-2">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { openAuth('login'); setOpen(false) }} className="btn-outline w-full justify-center text-sm">
                    Sign In
                  </button>
                  <button onClick={() => { openAuth('signup'); setOpen(false) }} className="btn-primary w-full justify-center text-sm">
                    Get Started Free
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
