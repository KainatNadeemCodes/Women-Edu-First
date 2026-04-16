import { useState } from 'react'
import { useAuth, API } from '../context/AuthContext'

// ── Enrollment ────────────────────────────────────────────────────────────────
export function useEnroll() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [enrolled, setEnrolled] = useState(false)

  const enroll = async (courseId, courseTitle) => {
    if (!user) return { error: 'Please sign in to enroll' }
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, course_id: courseId, course_title: courseTitle }),
      })
      const data = await res.json()
      setEnrolled(true)
      return data
    } finally {
      setLoading(false)
    }
  }

  return { enroll, loading, enrolled }
}

// ── Contact Form ──────────────────────────────────────────────────────────────
export function useContact() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const submit = async (fields) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to send')
      setSuccess(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, success, error, reset: () => setSuccess(false) }
}

// ── AI Chat ───────────────────────────────────────────────────────────────────
export function useAIChat() {
  const [loading, setLoading] = useState(false)

  const sendMessage = async ({ message, path, level, userName, history }) => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          path: path || 'General Tech',
          level: level || 'Beginner',
          user_name: userName || 'Friend',
          history,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error('AI service error')
      return data.reply
    } catch {
      return "Thodi connection problem hai. Please try again! 💜"
    } finally {
      setLoading(false)
    }
  }

  return { sendMessage, loading }
}
