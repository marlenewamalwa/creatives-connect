import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

const categories = ['Photography', 'Design', 'Music', 'Film', 'Writing', 'Illustration', 'Fashion', 'Other']

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('signup')
  const [step, setStep] = useState(1)
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <a href="/" className="text-xl font-bold tracking-tight">
          creatives<span className="text-orange-400">connect</span>
        </a>
        <button
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
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
                <button className="bg-orange-400 hover:bg-orange-500 text-black font-bold py-3 rounded-xl transition mt-2">
                  Log in
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
                <button
                  onClick={() => setStep(2)}
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
                {/* Category picker */}
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

                <button
                  disabled={!form.category || !form.location}
                  className="bg-orange-400 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition mt-2"
                >
                  Create my profile 🎉
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}