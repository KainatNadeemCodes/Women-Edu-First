import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useEnroll } from '../hooks/useApi'
import AuthModal from './AuthModal'

export default function CourseCard({ course }) {
  const { title, description, image, level, duration, category, id } = course
  const { user } = useAuth()
  const { enroll, loading } = useEnroll()
  const [showAuth, setShowAuth] = useState(false)
  const [enrolled, setEnrolled] = useState(false)
  const [msg, setMsg] = useState('')

  const levelColors = {
    Beginner: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Intermediate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Advanced: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  }

  const handleEnroll = async () => {
    if (!user) { setShowAuth(true); return }
    const result = await enroll(id, title)
    if (result) {
      setEnrolled(true)
      setMsg(result.message || 'Enrolled!')
    }
  }

  return (
    <>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultTab="signup" />}

      <div className="card-glass card-hover group flex flex-col overflow-hidden">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <div
            className="w-full h-full bg-gradient-to-br transition-transform duration-500 group-hover:scale-105"
            style={{ background: image }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full border ${levelColors[level] || levelColors.Beginner}`}>
              {level}
            </span>
            <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-white/10 text-white/70 border border-white/10">
              {category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-display text-lg font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors">
            {title}
          </h3>
          <p className="text-white/55 text-sm leading-relaxed font-body flex-1 mb-5">
            {description}
          </p>
          <div className="flex items-center justify-between mb-4 border-t border-white/5 pt-4">
            <span className="text-xs text-white/40 font-mono flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {duration}
            </span>
            <span className="text-xs text-brand-400 font-mono">Free Enrollment</span>
          </div>

          {enrolled ? (
            <div className="flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-body">
              ✅ {msg || 'Enrolled!'}
            </div>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={loading}
              className="btn-primary justify-center text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg> Enrolling...</>
              ) : (
                <>Enroll Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
