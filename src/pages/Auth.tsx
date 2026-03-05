import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.7 35.7 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
  </svg>
)

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('signup')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  })

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleGoogleAuth = async () => {
    setGoogleLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/feed` }
    })
    setGoogleLoading(false)
  }

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    if (error) {
      setError(error.message)
    } else {
      navigate('/feed')
    }
    setLoading(false)
  }

  const handleSignup = async () => {
    setLoading(true)
    setError('')

    // Check username not taken
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', form.username.toLowerCase().trim())
      .single()

    if (existing) {
      setError('Username already taken')
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        name: form.name,
        username: form.username.toLowerCase().trim(),
        email: form.email,
        bio: '',
        category: '',
        location: '',
        avatar_url: '',
        available: true,
      })

      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }

      navigate(`/profile/${form.username.toLowerCase().trim()}`)
    }

    setLoading(false)
  }

  const GoogleButton = () => (
    <button
      onClick={handleGoogleAuth}
      disabled={googleLoading}
      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/90 disabled:opacity-50 text-black font-semibold py-3 rounded-xl transition"
    >
      <GoogleIcon />
      {googleLoading ? 'Redirecting...' : 'Continue with Google'}
    </button>
  )

  const Divider = () => (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-xs text-white/30">or</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <a href="/" className="text-xl font-bold tracking-tight">
          creatives<span className="text-orange-400">connect</span>
        </a>
        <button
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
          className="text-sm text-white/50 hover:text-white transition"
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
        </button>
      </nav>

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {/* Login */}
          {mode === 'login' && (
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-3xl font-extrabold mb-2">Welcome back 👋</h1>
                <p className="text-white/40">Log in to your CreativesConnect account</p>
              </div>
              <GoogleButton />
              <Divider />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
              />
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}
              <button
                onClick={handleLogin}
                disabled={loading || !form.email || !form.password}
                className="bg-orange-400 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </div>
          )}

          {/* Signup */}
          {mode === 'signup' && (
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-3xl font-extrabold mb-2">Join CreativesConnect 🎉</h1>
                <p className="text-white/40">Create your account and start connecting</p>
              </div>
              <GoogleButton />
              <Divider />
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
              />
              <input
                type="text"
                placeholder="Username (e.g. johndoe)"
                value={form.username}
                onChange={(e) => update('username', e.target.value.replace(/\s/g, '').toLowerCase())}
                className="bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
              />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
              />
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                className="bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
              />
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}
              <button
                onClick={handleSignup}
                disabled={loading || !form.name || !form.username || !form.email || !form.password}
                className="bg-orange-400 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}