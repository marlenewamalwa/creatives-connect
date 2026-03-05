import { useState, useEffect } from 'react'
import { Home, Compass, Briefcase, Bell, MessageCircle, Plus, Menu, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/useAuth'
import { useNavigate, Link } from 'react-router-dom'

type Profile = {
  username: string
  avatar_url: string
  name: string
}

export default function Navbar({ onPost }: { onPost?: () => void }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!user) { 
      setProfile(null)
      return 
    }

    supabase
      .from('profiles')
      .select('username, avatar_url, name')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setProfile(data))
  }, [user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    setDropdownOpen(false)
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      <nav className="flex items-center justify-between px-5 md:px-8 py-5 border-b border-white/10 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-sm z-40">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight">
          creatives<span className="text-orange-400">connect</span>
        </Link>

        {/* Desktop nav icons */}
        {user && (
          <div className="hidden md:flex items-center gap-6 text-white/40">
            <Link to="/feed" className="hover:text-white transition"><Home size={20} /></Link>
            <Link to="/discover" className="hover:text-white transition"><Compass size={20} /></Link>
            <Link to="/gigs" className="hover:text-white transition"><Briefcase size={20} /></Link>
            <Link to="/messages" className="hover:text-white transition"><MessageCircle size={20} /></Link>
            <Link to="/notifications" className="hover:text-white transition relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full" />
            </Link>
          </div>
        )}

        {/* Desktop right side */}
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
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-10 bg-[#111] border border-white/10 rounded-xl p-2 w-44 z-20">
                      <Link
                        to={`/profile/${profile?.username}`}
                        onClick={() => setDropdownOpen(false)}
                        className="block text-sm px-3 py-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition"
                      >
                        My Profile
                      </Link>

                      <div className="border-t border-white/10 my-1" />

                      <button
                        onClick={handleLogout}
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
              <Link to="/auth" className="text-sm text-white/60 hover:text-white transition">
                Log in
              </Link>
              <Link
                to="/auth"
                className="text-sm bg-orange-400 hover:bg-orange-500 text-black font-semibold px-4 py-2 rounded-full transition"
              >
                Join now
              </Link>
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

              <div className="flex flex-col gap-1">
                {[
                  { href: '/feed', icon: <Home size={20} />, label: 'Feed' },
                  { href: '/discover', icon: <Compass size={20} />, label: 'Discover' },
                  { href: '/gigs', icon: <Briefcase size={20} />, label: 'Gigs' },
                  { href: '/messages', icon: <MessageCircle size={20} />, label: 'Messages' },
                  { href: '/notifications', icon: <Bell size={20} />, label: 'Notifications' },
                  { href: `/profile/${profile?.username}`, icon: null, label: 'My Profile' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition text-lg"
                  >
                    {item.icon && <span className="text-orange-400">{item.icon}</span>}
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pb-8">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition text-lg"
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-6 mt-16">
              <Link to="/discover" onClick={() => setMenuOpen(false)} className="text-2xl text-white/60 hover:text-white transition">
                Discover
              </Link>
              <Link to="/gigs" onClick={() => setMenuOpen(false)} className="text-2xl text-white/60 hover:text-white transition">
                Gigs
              </Link>

              <div className="flex flex-col items-center gap-4 mt-4 w-full">
                <Link to="/auth" onClick={() => setMenuOpen(false)} className="text-white/50 hover:text-white transition text-lg">
                  Log in
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="w-full bg-orange-400 hover:bg-orange-500 text-black font-bold py-4 rounded-full transition text-lg text-center"
                >
                  Join free
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}