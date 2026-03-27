import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('signup')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  })

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
  email: form.email,
  password: form.password,
})

if (error) {
  setError(error.message)
} else {
  navigate(`/profile/${data.user?.id}`)
}

    setLoading(false)
  }

  const handleSignup = async () => {
    setLoading(true)
    setError('')

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
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

    // 🚨 handles email confirmation case
    if (!data.session) {
      setError('Check your email to confirm signup')
      setLoading(false)
      return
    }
if (!data.user) {
  setError('Signup failed. Please try again.')
  setLoading(false)
  return
}
   

   const { error: profileError } = await supabase.from('profiles').upsert({
  id: data.user.id,
  name: form.name,
  username: form.username,  
  available: true,
})

    if (profileError) {
  console.log('Profile insert error:', JSON.stringify(profileError, null, 2))
  setError(profileError.message)
  setLoading(false)
  return
}

    navigate(`/profile/${form.username}`)
    setLoading(false)
  }

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

          {mode === 'login' && (
            <div>
              <h1 className="text-3xl font-extrabold mb-2">Welcome back </h1>
              <p className="text-white/40 mb-8">Log in to your CreativesConnect account</p>

              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                />

                {error && <div className="text-red-400 text-sm">{error}</div>}

                <button
                  onClick={handleLogin}
                  disabled={loading || !form.email || !form.password}
                  className="bg-orange-400 text-black font-bold py-3 rounded-xl"
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <h1 className="text-3xl font-extrabold mb-2">Create your account</h1>
              <p className="text-white/40 mb-8">Join CreativesConnect today</p>

              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                />
                <input
  type="text"
  placeholder="Username"
  value={form.username}
  onChange={(e) => update('username', e.target.value)}
  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
/>
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                />

                {error && <div className="text-red-400 text-sm">{error}</div>}

                <button
                  onClick={handleSignup}
                  disabled={loading || !form.name || !form.email || !form.password}
                  className="bg-orange-400 text-black font-bold py-3 rounded-xl"
                >
                  {loading ? 'Creating profile...' : 'Create my profile '}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}