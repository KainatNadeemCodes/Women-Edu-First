import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, API } from '../context/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch(`${API}/api/enrollments/${user.id}`)
      .then(r => r.json())
      .then(d => setEnrollments(d.enrollments || []))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) return (
    <div className="pt-32 text-center">
      <p className="text-white/50 font-body">Please sign in to view your dashboard.</p>
      <Link to="/" className="btn-primary mt-4 inline-flex">Go Home</Link>
    </div>
  )

  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-6 lg:px-8">
      {/* Welcome */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-brand-400 text-sm font-mono uppercase tracking-widest mb-1">Welcome back</p>
          <h1 className="font-display text-3xl font-bold text-white">
            {user.name} <span className="gradient-text">✨</span>
          </h1>
          <p className="text-white/40 text-sm font-body mt-1">{user.email}</p>
        </div>
        <button onClick={logout} className="btn-outline text-sm px-5 py-2">
          Sign Out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Courses Enrolled', value: enrollments.length, icon: '📚' },
          { label: 'Lessons Done', value: '—', icon: '✅' },
          { label: 'Days Streak', value: '1', icon: '🔥' },
          { label: 'Level', value: 'Beginner', icon: '🌱' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="card-glass border border-white/5 p-5 text-center">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="font-display text-2xl font-bold gradient-text">{value}</div>
            <div className="text-white/40 text-xs font-body mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Enrolled Courses */}
      <div className="mb-10">
        <h2 className="font-display text-xl font-semibold text-white mb-5">My Courses</h2>
        {loading ? (
          <div className="text-white/40 font-body text-sm">Loading...</div>
        ) : enrollments.length === 0 ? (
          <div className="card-glass border border-white/5 p-10 text-center rounded-2xl">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-white/50 font-body mb-4">You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="btn-primary text-sm">Browse Courses</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {enrollments.map((e, i) => (
              <div key={i} className="card-glass border border-white/5 p-5 rounded-2xl">
                <h3 className="font-display text-base font-semibold text-white mb-1">{e.course_title}</h3>
                <p className="text-white/40 text-xs font-mono mb-3">
                  Enrolled {new Date(e.enrolled_at).toLocaleDateString()}
                </p>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-brand-500 to-purple-500 h-1.5 rounded-full" style={{ width: '5%' }} />
                </div>
                <p className="text-white/30 text-xs font-mono mt-1">5% complete</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="font-display text-xl font-semibold text-white mb-5">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link to="/ai-mentor" className="card-glass border border-white/5 p-5 rounded-2xl hover:border-brand-500/30 transition-all group">
            <div className="text-2xl mb-2">🤖</div>
            <p className="font-body font-medium text-white group-hover:text-brand-300 transition-colors">Chat with Zara</p>
            <p className="text-white/40 text-xs font-body mt-1">Get your AI learning roadmap</p>
          </Link>
          <Link to="/courses" className="card-glass border border-white/5 p-5 rounded-2xl hover:border-brand-500/30 transition-all group">
            <div className="text-2xl mb-2">📚</div>
            <p className="font-body font-medium text-white group-hover:text-brand-300 transition-colors">Browse Courses</p>
            <p className="text-white/40 text-xs font-body mt-1">Find your next skill path</p>
          </Link>
          <Link to="/contact" className="card-glass border border-white/5 p-5 rounded-2xl hover:border-brand-500/30 transition-all group">
            <div className="text-2xl mb-2">💬</div>
            <p className="font-body font-medium text-white group-hover:text-brand-300 transition-colors">Get Support</p>
            <p className="text-white/40 text-xs font-body mt-1">Our team is here to help</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
