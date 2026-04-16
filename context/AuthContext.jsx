import { createContext, useContext, useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('ngs_token'))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('ngs_user')
    if (saved && token) setUser(JSON.parse(saved))
  }, [token])

  const signup = async (name, email, password) => {
    setLoading(true)
    const res = await fetch(`${API}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Signup failed')
    _saveSession(data)
    setLoading(false)
    return data
  }

  const login = async (email, password) => {
    setLoading(true)
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Login failed')
    _saveSession(data)
    setLoading(false)
    return data
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('ngs_token')
    localStorage.removeItem('ngs_user')
  }

  const _saveSession = (data) => {
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('ngs_token', data.token)
    localStorage.setItem('ngs_user', JSON.stringify(data.user))
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export { API }
