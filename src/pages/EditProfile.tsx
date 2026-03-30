import { useState, useEffect } from 'react'
import { Camera } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/useAuth'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const categories = ['Photography', 'Design', 'Music', 'Film', 'Writing', 'Illustration', 'Fashion', 'Other']
const counties = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu',
  'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
  'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
  'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
  'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
]
export default function EditProfile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    username: '',
    bio: '',
    category: '',
    location: '',
    website: '',
    instagram: '',
    twitter: '',
    available: true,
  })

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  useEffect(() => {
    if (!user) return
    setLoading(true)
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            name: data.name ?? '',
            username: data.username ?? '',
            bio: data.bio ?? '',
            category: data.category ?? '',
            location: data.location ?? '',
            website: data.website ?? '',
            instagram: data.instagram ?? '',
            twitter: data.twitter ?? '',
            available: data.available ?? true,
          })
          setAvatarPreview(data.avatar_url ?? null)
        }
        setLoading(false)
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
    setSaving(true)
    setError('')
    setSuccess('')

    let avatar_url = avatarPreview

    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, avatarFile, { upsert: true })

      if (uploadError) {
        setError('Failed to upload avatar')
        setSaving(false)
        return
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      avatar_url = data.publicUrl
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        name: form.name,
        username: form.username,
        bio: form.bio,
        category: form.category,
        location: form.location,
        website: form.website,
        instagram: form.instagram,
        twitter: form.twitter,
        available: form.available,
        avatar_url,
      })
      .eq('id', user.id)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess('We will review your profile and get back to you')
      setTimeout(() => navigate(`/profile/${form.username}`), 1000)
    }

    setSaving(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <p className="text-white/30">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold mb-2">Edit Profile</h1>
        <p className="text-white/40 mb-10">Update your creative profile</p>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-10">
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
          <p className="text-xs text-white/30 mt-2">Click to change photo</p>
        </div>

        <div className="flex flex-col gap-4">

          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/40 mb-1.5 uppercase tracking-widest">Full Name</p>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
              />
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1.5 uppercase tracking-widest">Username</p>
              <input
                type="text"
                value={form.username}
                onChange={(e) => update('username', e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="text-xs text-white/40 mb-1.5 uppercase tracking-widest">Bio</p>
            <textarea
              value={form.bio}
              onChange={(e) => update('bio', e.target.value)}
              rows={3}
              placeholder="Tell people what you do..."
              className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <p className="text-xs text-white/40 mb-2 uppercase tracking-widest">Category</p>
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

          {/* Location */}
          <div>
  <p className="text-xs text-white/40 mb-1.5 uppercase tracking-widest">County</p>
  <select
    value={form.location}
    onChange={(e) => update('location', e.target.value)}
    className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm text-white transition"
  >
    <option value="" disabled className="bg-[#0a0a0a]">Select your county</option>
    {counties.map((county) => (
      <option key={county} value={county} className="bg-[#0a0a0a]">{county}</option>
    ))}
  </select>
</div>

          {/* Social links */}
          <div>
            <p className="text-xs text-white/40 mb-1.5 uppercase tracking-widest">Website</p>
            <input
              type="text"
              value={form.website}
              onChange={(e) => update('website', e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/40 mb-1.5 uppercase tracking-widest">Instagram</p>
              <input
                type="text"
                value={form.instagram}
                onChange={(e) => update('instagram', e.target.value)}
                placeholder="username"
                className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
              />
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1.5 uppercase tracking-widest">Twitter / X</p>
              <input
                type="text"
                value={form.twitter}
                onChange={(e) => update('twitter', e.target.value)}
                placeholder="username"
                className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
              />
            </div>
          </div>

  
          {/* Error / success */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl">
              {success}
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-orange-400 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition mt-2"
          >
            {saving ? 'Submitiing...' : 'Submit'}
          </button>
<p className="text-xs text-white/40 text-center">
  We'll review your profile and get back to you shortly.
</p>
        </div>
      </div>
    </div>
  )
}