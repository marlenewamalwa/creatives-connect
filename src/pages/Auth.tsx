import { useState } from 'react'
import { ArrowLeft, Camera } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const categories = ['Photography', 'Design', 'Music', 'Film', 'Writing', 'Illustration', 'Fashion', 'Other']

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
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    category: '',
    location: '',
    bio: '',
  })

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setAvatarFile(f)
    setAvatarPreview(URL.createObjectURL(f))
  }

  const handleGoogleAuth = async () => {
    setGoogleLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/feed`
      }
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
      let avatar_url = ''

      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop()
        const path = `${data.user.id}/avatar.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, avatarFile, { upsert: true })

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
          avatar_url = urlData.publicUrl
        }
      }

      const username = form.name.toLowerCase().replace(/\s+/g, '')
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        name: form.name,
        username,
        bio: form.bio,
        category: form.category,
        location: form.location,
        avatar_url,
        available: true,
      })

      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }

      navigate('/feed')
    }

    setLoading(false)
  }

  const GoogleButton = () => (
    <button
      onClick={handleGoogleAuth}
      disabled={googleLoading}
      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/90 disabled:opacity-50 text-black font-semibold py-3 rounded-xl transition mb-4"
    >
      <GoogleIcon />
      {googleLoading ? 'Redirecting...' : 'Continue with Google'}
    </button>
  )

  const Divider = () => (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-xs text-white/30">or</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">

      {/* Navbar */}
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
            <div>
              <h1 className="text-3xl font-extrabold mb-2">Welcome back 👋</h1>
              <p className="text-white/40 mb-8">Log in to your CreativesConnect account</p>
              <div className="flex flex-col gap-4">
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
                  className="bg-orange-400 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition mt-2"
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </div>
            </div>
          )}

          {/* Signup Step 1 */}
          {mode === 'signup' && step === 1 && (
            <div>
              <h1 className="text-3xl font-extrabold mb-2">Create your account</h1>
              <p className="text-white/40 mb-8">Step 1 of 2 — Basic info</p>
              <div className="flex flex-col gap-4">
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
                  className="bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
                />
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}
                <button
                  onClick={() => {
                    setError('')
                    if (form.password.length < 6) {
                      setError('Password must be at least 6 characters')
                      return
                    }
                    setStep(2)
                  }}
                  disabled={!form.name || !form.email || !form.password}
                  className="bg-orange-400 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition mt-2"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Signup Step 2 */}
          {mode === 'signup' && step === 2 && (
            <div>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <h1 className="text-3xl font-extrabold mb-2">Your creative profile</h1>
              <p className="text-white/40 mb-8">Step 2 of 2 — Tell us about yourself</p>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center mb-2">
                  <label className="cursor-pointer relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-white/20 group-hover:border-orange-400 transition">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex flex-col items-center justify-center gap-1">
                          <Camera size={20} className="text-white/30" />
                          <span className="text-xs text-white/30">Photo</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-7 h-7 bg-orange-400 rounded-full flex items-center justify-center">
                      <Camera size={13} className="text-black" />
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                  <p className="text-xs text-white/30 mt-2">Upload a profile photo</p>
                </div>

                <div>
                  <p className="text-sm text-white/50 mb-2">What do you do?</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => update('category', cat)}
                        className={`text-xs px-4 py-2 rounded-full border transition ${
                          form.category === cat
                            ? 'bg-orange-400 border-orange-400 text-black font-bold'
                            : 'border-white/10 text-white/50 hover:border-orange-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Your city (e.g. Nairobi, Mombasa)"
                  value={form.location}
                  onChange={(e) => update('location', e.target.value)}
                  className="bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
                />

                <textarea
                  placeholder="Short bio — what makes you unique?"
                  value={form.bio}
                  onChange={(e) => update('bio', e.target.value)}
                  rows={3}
                  className="bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition resize-none"
                />

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSignup}
                  disabled={loading || !form.category || !form.location}
                  className="bg-orange-400 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition mt-2"
                >
                  {loading ? 'Creating profile...' : 'Create my profile 🎉'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}