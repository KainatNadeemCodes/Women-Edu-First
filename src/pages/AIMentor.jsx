import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAIChat } from '../hooks/useApi'
import AuthModal from '../components/AuthModal'

const PATHS = [
  { id: 'freelancing', label: 'Freelancing & Earning', icon: '💼' },
  { id: 'web', label: 'Web Development', icon: '💻' },
  { id: 'design', label: 'UI/UX Design', icon: '🎨' },
  { id: 'data', label: 'Data Science', icon: '📊' },
  { id: 'marketing', label: 'Digital Marketing', icon: '📱' },
]

const QUICK_PROMPTS = [
  'Give me a weekly roadmap for my path',
  'How much can I earn from home?',
  "I'm a complete beginner, where do I start?",
  'Motivate me — I feel stuck',
]

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0,1,2].map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-brand-400 inline-block"
          style={{ animation: `bounce 1.2s ${i*0.2}s infinite` }}
        />
      ))}
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-6px);opacity:1}}`}</style>
    </div>
  )
}

export default function AIMentor() {
  const { user } = useAuth()
  const { sendMessage, loading } = useAIChat()
  const [showAuth, setShowAuth] = useState(false)
  const [selectedPath, setSelectedPath] = useState(PATHS[0])
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Assalamu Alaikum! 💜 I'm **Zara**, your personal AI mentor on NextGenShe.\n\nSelect a learning path above and ask me anything — from where to start, to how to earn your first income from home!\n\nMain English aur Urdu dono mein help kar sakti hoon. 🇵🇰`,
    },
  ])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    if (!text.trim() || loading) return
    if (!user) { setShowAuth(true); return }

    const userMsg = { role: 'user', content: text }
    setMessages(m => [...m, userMsg])
    setInput('')

    const history = messages.map(m => ({ role: m.role, content: m.content }))
    const reply = await sendMessage({
      message: text,
      path: selectedPath.label,
      level: 'Beginner',
      userName: user.name,
      history,
    })
    setMessages(m => [...m, { role: 'assistant', content: reply }])
  }

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }
  const formatMsg = (text) => {
  if (!text) return ""; // Add this safety line!
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
 };
  return (
    <div className="pt-20 min-h-screen flex flex-col" style={{ height: '100dvh' }}>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultTab="signup" />}

      {/* Header */}
      <div className="border-b border-white/5 bg-surface/80 backdrop-blur-md px-6 py-4 flex items-center gap-4 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0">
          🤖
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-white text-sm">Zara — AI Mentor</p>
          <p className="text-emerald-400 text-xs font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Online & ready
          </p>
        </div>
        {/* Path selector */}
        <select
          value={selectedPath.id}
          onChange={e => setSelectedPath(PATHS.find(p => p.id === e.target.value))}
          className="bg-card border border-white/10 text-white text-xs font-body rounded-full px-3 py-2 outline-none focus:border-brand-500/50 max-w-[160px]"
        >
          {PATHS.map(p => (
            <option key={p.id} value={p.id}>{p.icon} {p.label}</option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">
                🤖
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed font-body ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-br-sm'
                  : 'bg-card border border-white/10 text-white/90 rounded-bl-sm'
              }`}
              dangerouslySetInnerHTML={{ __html: formatMsg(msg.content) }}
            />
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-sm mr-2 flex-shrink-0">
              🤖
            </div>
            <div className="bg-card border border-white/10 rounded-2xl rounded-bl-sm">
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-4 pb-2 flex gap-2 flex-wrap max-w-3xl mx-auto w-full">
        {QUICK_PROMPTS.map(p => (
          <button
            key={p}
            onClick={() => send(p)}
            className="text-xs px-3 py-1.5 rounded-full bg-card border border-white/10 text-white/50 hover:text-brand-300 hover:border-brand-500/40 font-body transition-all"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-6 pt-2 flex gap-3 items-end max-w-3xl mx-auto w-full flex-shrink-0">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={user ? 'Ask Zara anything... (English ya Urdu)' : 'Sign in to chat with Zara →'}
          rows={1}
          className="flex-1 bg-card border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder-white/30 font-body outline-none focus:border-brand-500/50 transition-all resize-none"
          style={{ maxHeight: '120px' }}
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          className="w-11 h-11 rounded-xl bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </div>

      {!user && (
        <div className="mx-4 mb-6 p-4 bg-brand-600/10 border border-brand-500/20 rounded-2xl text-center max-w-3xl mx-auto w-full">
          <p className="text-white/70 text-sm font-body mb-3">
            💜 Sign in to get your personalized AI roadmap and save your progress
          </p>
          <button onClick={() => setShowAuth(true)} className="btn-primary text-sm px-6 py-2">
            Sign In / Create Free Account
          </button>
        </div>
      )}
    </div>
  )
}
