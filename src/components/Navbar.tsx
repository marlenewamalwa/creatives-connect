import { useState, useEffect } from 'react'
import {
  Home,
  Compass,
  Briefcase,
  Bell,
  MessageCircle,
  Plus,
  Menu,
  X,
} from 'lucide-react'
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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!user) return

    supabase
      .from('profiles')
      .select('username, avatar_url, name')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data)
      })
  }, [user])

  return (
    <>
      <nav className="flex items-center justify-between px-5 md:px-8 py-5 border-b border-white/10 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-sm z-40">
        
        {/* Logo */}
        <a href="/" className="text-xl font-bold tracking-tight">
          creatives<span className="text-orange-400">connect</span>
        </a>

        {/* Desktop nav icons */}
        {user && (
          <div className="hidden md:flex items-center gap-6 text-white/40">

            <a href="/feed" title="Feed" className="hover:text-white transition flex flex-col items-center text-xs">
              <Home size={20} />
              <span>Feed</span>
            </a>

            <a href="/discover" title="Discover" className="hover:text-white transition flex flex-col items-center text-xs">
              <Compass size={20} />
              <span>Discover</span>
            </a>

            <a href="/gigs" title="Gigs" className="hover:text-white transition flex flex-col items-center text-xs">
              <Briefcase size={20} />
              <span>Gigs</span>
            </a>

            <a href="/messages" title="Messages" className="hover:text-white transition flex flex-col items-center text-xs">
              <MessageCircle size={20} />
              <span>Messages</span>
            </a>

            <a href="/notifications" title="Notifications" className="hover:text-white transition relative flex flex-col items-center text-xs">
              <Bell size={20} />
              <span>Alerts</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full" />
            </a>

          </div>
        )}

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
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

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />

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
                <button className="text-sm text-white/60 hover:text-white transition">
                  Log in
                </button>
              </a>

              <a href="/auth">
                <button className="text-sm bg-orange-400 hover:bg-orange-500 text-black font-semibold px-4 py-2 rounded-full transition">
                  Join now
                </button>
              </a>
            </>
          )}
        </div>

        {/* Mobile right */}
        <div className="flex md:hidden items-center gap-3">
          {user && onPost && (
            <button
              onClick={onPost}
              className="flex items-center gap-1.5 text-xs bg-orange-400 hover:bg-orange-500 text-black font-semibold px-3 py-2 rounded-full transition"
            >
              <Plus size={14} /> Post
            </button>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white/60 hover:text-white transition"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-[#0a0a0a]/98 z-30 flex flex-col pt-24 px-8">
          {user ? (
            <>
              {/* User */}
              <div className="flex items-center gap-3 mb-8 pb-8 border-b border-white/10">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="me" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-orange-400/20 flex items-center justify-center text-orange-400 font-bold">
                    {profile?.name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{profile?.name}</p>
                  <p className="text-sm text-orange-400">@{profile?.username}</p>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-1">
                {[
                  { href: '/feed', icon: <Home size={20} />, label: 'Feed' },
                  { href: '/discover', icon: <Compass size={20} />, label: 'Discover' },
                  { href: '/gigs', icon: <Briefcase size={20} />, label: 'Gigs' },
                  { href: '/messages', icon: <MessageCircle size={20} />, label: 'Messages' },
                  { href: '/notifications', icon: <Bell size={20} />, label: 'Notifications' },
                  { href: `/profile/${profile?.username}`, label: 'My Profile' },
                  { href: '/edit-profile', label: 'Edit Profile' },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition text-lg"
                  >
                    {item.icon && <span className="text-orange-400">{item.icon}</span>}
                    {item.label}
                  </a>
                ))}
              </div>

              {/* Logout */}
              <div className="mt-auto pb-8">
                <button
                  onClick={async () => {
                    await supabase.auth.signOut()
                    window.location.href = '/'
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition text-lg"
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-6 mt-16">
              {[
                { href: '/discover', label: 'Discover' },
                { href: '/gigs', label: 'Gigs' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl text-white/60 hover:text-white transition"
                >
                  {item.label}
                </a>
              ))}

              <div className="flex flex-col items-center gap-4 mt-4 w-full">
                <a href="/auth" onClick={() => setMenuOpen(false)} className="text-white/50 hover:text-white transition text-lg">
                  Log in
                </a>

                <a href="/auth" onClick={() => setMenuOpen(false)} className="w-full">
                  <button className="w-full bg-orange-400 hover:bg-orange-500 text-black font-bold py-4 rounded-full transition text-lg">
                    Join free
                  </button>
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}