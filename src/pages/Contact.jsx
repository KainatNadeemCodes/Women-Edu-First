import { useState } from 'react'
import { useContact } from '../hooks/useApi'

const socialLinks = [
  { name: 'LinkedIn', handle: '@NextGenShe', href: 'https://linkedin.com', color: 'hover:border-blue-500/50 hover:bg-blue-500/10',
    icon: <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { name: 'Instagram', handle: '@nextgenshe', href: 'https://instagram.com', color: 'hover:border-pink-500/50 hover:bg-pink-500/10',
    icon: <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg> },
]

function validate(fields) {
  const errors = {}
  if (!fields.name.trim()) errors.name = 'Name is required.'
  if (!fields.email.trim()) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = 'Please enter a valid email.'
  if (!fields.message.trim()) errors.message = 'Message is required.'
  else if (fields.message.trim().length < 10) errors.message = 'Message must be at least 10 characters.'
  return errors
}

export default function Contact() {
  const { submit, loading, success, error: apiError, reset } = useContact()
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})

  const handleChange = e => {
    const { name, value } = e.target
    setFields(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate(fields)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    await submit(fields)
    if (!apiError) setFields({ name: '', email: '', message: '' })
  }

  const inputClass = (field) =>
    `w-full bg-card border rounded-xl px-4 py-3 text-white placeholder-white/25 font-body text-sm outline-none transition-all duration-200 ${
      errors[field] ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-brand-500/50'
    }`

  return (
    <div className="pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16">
        <p className="text-brand-400 text-sm font-mono uppercase tracking-widest mb-3">Get In Touch</p>
        <h1 className="section-title mb-4">Let's <span className="gradient-text">Connect</span></h1>
        <p className="text-white/50 max-w-xl mx-auto font-body text-lg">
          Have questions about our programs? Want to partner with us? We'd love to hear from you.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: '📧', label: 'Email', value: 'hello@nextgenshe.io' },
              { icon: '💬', label: 'Discord', value: 'discord.gg/nextgenshe' },
              { icon: '📍', label: 'Location', value: 'Global — Remote First' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="card-glass p-5 flex items-center gap-4 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-brand-600/15 border border-brand-500/20 flex items-center justify-center text-lg flex-shrink-0">{icon}</div>
                <div>
                  <p className="text-white/35 text-xs font-mono uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-white text-sm font-body">{value}</p>
                </div>
              </div>
            ))}
            <div>
              <p className="text-white/35 text-xs font-mono uppercase tracking-wider mb-3">Follow Us</p>
              <div className="space-y-3">
                {socialLinks.map(({ name, handle, href, color, icon }) => (
                  <a key={name} href={href} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all ${color}`}>
                    {icon}
                    <div>
                      <p className="text-sm font-body leading-none">{name}</p>
                      <p className="text-xs text-white/30 font-mono mt-0.5">{handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="card-glass p-8 md:p-10 border border-white/5">
              {success ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="font-display text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-white/50 font-body mb-6">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                  <button onClick={reset} className="btn-outline text-sm">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h2 className="font-display text-2xl font-bold text-white mb-6">Send a Message</h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm text-white/60 font-body mb-1.5">Full Name <span className="text-brand-400">*</span></label>
                      <input type="text" name="name" value={fields.name} onChange={handleChange} placeholder="Jane Doe" className={inputClass('name')} />
                      {errors.name && <p className="mt-1.5 text-red-400 text-xs font-body">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 font-body mb-1.5">Email Address <span className="text-brand-400">*</span></label>
                      <input type="email" name="email" value={fields.email} onChange={handleChange} placeholder="jane@example.com" className={inputClass('email')} />
                      {errors.email && <p className="mt-1.5 text-red-400 text-xs font-body">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 font-body mb-1.5">Message <span className="text-brand-400">*</span></label>
                      <textarea name="message" value={fields.message} onChange={handleChange} rows={5}
                        placeholder="Tell us about yourself, your goals, or any questions..."
                        className={`${inputClass('message')} resize-none`} />
                      {errors.message && <p className="mt-1.5 text-red-400 text-xs font-body">{errors.message}</p>}
                    </div>
                    {apiError && <p className="text-red-400 text-sm font-body bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{apiError}</p>}
                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                      {loading ? (
                        <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg> Sending...</>
                      ) : <>Send Message <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg></>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
