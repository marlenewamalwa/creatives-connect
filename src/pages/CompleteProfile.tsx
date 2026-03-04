import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/useAuth'
import { useNavigate } from 'react-router-dom'
import { Camera } from 'lucide-react'

const categories = ['Photography', 'Design', 'Music', 'Film', 'Writing', 'Illustration', 'Fashion', 'Other']

export default function CompleteProfile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    category: '',
    location: '',
    bio: '',
  })

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('category, location, avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.category && data?.location) navigate('/feed')
        if (data?.avatar_url) setAvatarPreview(data.avatar_url)
      })
  }, [user])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setAvatarFile(f)
    setAvatarPreview(URL.createObjectURL(f))
  }

  const handleSave = async () => {
    if (!user) return
    setLoading(true)
    setError('')

    let avatar_url: string | undefined

    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, avatarFile, { upsert: true })

      if (uploadError) {
        setError('Failed to upload avatar')
        setLoading(false)
        return
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      avatar_url = data.publicUrl
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        category: form.category,
        location: form.location,
        bio: form.bio,
        ...(avatar_url && { avatar_url }),
      })
      .eq('id', user.id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    navigate('/feed')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <nav className="flex items-center px-8 py-5 border-b border-white/10">
        <a href="/" className="text-xl font-bold tracking-tight">
          creatives<span className="text-orange-400">connect</span>
        </a>
      </nav>

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold mb-2">One last step! 🎉</h1>
          <p className="text-white/40 mb-8">Complete your creative profile to get started</p>

          <div className="flex flex-col gap-4">

            {/* Avatar */}
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

            {/* Category */}
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
              onClick={handleSave}
              disabled={loading || !form.category || !form.location}
              className="bg-orange-400 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition mt-2"
            >
              {loading ? 'Saving...' : 'Finish setup 🚀'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}