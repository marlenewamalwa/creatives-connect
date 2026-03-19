import { useState, useEffect } from 'react'
import { Home, Compass, Briefcase, Bell, MessageCircle, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/useAuth'

type Profile = {
  username: string
  avatar_url: string
  name: string
}

export default function Navbar({ onPost }: { onPost?: () => void }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('username, avatar_url, name')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setProfile(data))
  }, [user])

  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-sm z-10">

      {/* Logo */}
      <a href="/" className="text-xl font-bold tracking-tight">
        creatives<span className="text-orange-400">connect</span>
      </a>

      {/* Nav icons — only show when logged in */}
      {user && (
        <div className="flex items-center gap-6 text-white/40">
          <a href="/feed" className="hover:text-white transition"><Home size={20} /></a>
          <a href="/discover" className="hover:text-white transition"><Compass size={20} /></a>
          <a href="/gigs" className="hover:text-white transition"><Briefcase size={20} /></a>
          <a href="/messages" className="hover:text-white transition"><MessageCircle size={20} /></a>
          <a href="/notifications" className="hover:text-white transition relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full" />
          </a>
        </div>
      )}

      {/* Right side */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            {onPost && (
              <button
                onClick={onPost}
                className="flex items-center gap-2 text-sm bg-orange-400 hover:bg-orange-500 text-black font-semibold px-4 py-2 rounded-full transition"
              >
                <Plus size={16} /> Post
              </button>
            )}

            <div className="relative">
              {/* Avatar or initial */}
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="me"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-8 h-8 rounded-full object-cover cursor-pointer ring-2 ring-transparent hover:ring-orange-400 transition"
                />
              ) : (
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-8 h-8 rounded-full bg-orange-400/20 cursor-pointer flex items-center justify-center text-orange-400 text-xs font-bold"
                >
                  {profile?.name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}

              {/* Dropdown */}
              {dropdownOpen && (
                <>
                  {/* Backdrop to close on outside click */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-10 bg-[#111] border border-white/10 rounded-xl p-2 w-44 z-20">
                    <a href={`/profile/${profile?.username ?? ''}`} onClick={() => setDropdownOpen(false)}>
                      <button className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition">
                        My Profile
                      </button>
                    </a>
                    <a href="/edit-profile" onClick={() => setDropdownOpen(false)}>
                      <button className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition">
                        Edit Profile
                      </button>
                    </a>
                    <div className="border-t border-white/10 my-1" />
                    <button
                      onClick={async () => {
                        await supabase.auth.signOut()
                        window.location.href = '/'
                      }}
                      className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 transition"
                    >
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <a href="/auth">
              <button className="text-sm text-white/60 hover:text-white transition">Log in</button>
            </a>
            <a href="/auth">
              <button className="text-sm bg-orange-400 hover:bg-orange-500 text-black font-semibold px-4 py-2 rounded-full transition">
                Join now
              </button>
            </a>
          </>
        )}
      </div>
    </nav>
  )
}
