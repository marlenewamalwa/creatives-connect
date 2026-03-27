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
import { Link, useNavigate } from 'react-router-dom'

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
    if (!user) return

    supabase
      .from('profiles')
      .select('username, avatar_url, name')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('Profile fetch error:', error)
          return
        }
        if (data) setProfile(data)
      })
  }, [user])

  return (
    <>
      <nav className="flex items-center justify-between px-5 md:px-8 py-5 border-b border-white/10 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-sm z-40">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight">
          creatives<span className="text-orange-400">connect</span>
        </Link>

        {/* Desktop nav */}
        {user && (
          <div className="hidden md:flex items-center gap-6 text-white/40">

            <Link to="/feed" className="hover:text-white transition flex flex-col items-center text-xs">
              <Home size={20} />
              <span>Feed</span>
            </Link>

            <Link to="/discover" className="hover:text-white transition flex flex-col items-center text-xs">
              <Compass size={20} />
              <span>Discover</span>
            </Link>

            <Link to="/gigs" className="hover:text-white transition flex flex-col items-center text-xs">
              <Briefcase size={20} />
              <span>Gigs</span>
            </Link>

            <Link to="/messages" className="hover:text-white transition flex flex-col items-center text-xs">
              <MessageCircle size={20} />
              <span>Messages</span>
            </Link>

            <Link to="/notifications" className="hover:text-white transition relative flex flex-col items-center text-xs">
              <Bell size={20} />
              <span>Alerts</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full" />
            </Link>

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
                    className="w-8 h-8 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-orange-400"
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

                      <Link
                        to={profile ? `/profile/${profile.username}` : '#'}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <button className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-white/5">
                          My Profile
                        </button>
                      </Link>

                      <Link to="/edit-profile" onClick={() => setDropdownOpen(false)}>
                        <button className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-white/5">
                          Edit Profile
                        </button>
                      </Link>

                      <div className="border-t border-white/10 my-1" />

                      <button
                        onClick={async () => {
                          await supabase.auth.signOut()
                          navigate('/')
                        }}
                        className="w-full text-left text-sm px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10"
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
              <Link to="/auth">
                <button className="text-sm text-white/60 hover:text-white">
                  Log in
                </button>
              </Link>

              <Link to="/auth">
                <button className="text-sm bg-orange-400 text-black font-semibold px-4 py-2 rounded-full">
                  Join now
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          {user && onPost && (
            <button
              onClick={onPost}
              className="flex items-center gap-1.5 text-xs bg-orange-400 text-black px-3 py-2 rounded-full"
            >
              <Plus size={14} /> Post
            </button>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)}>
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
                  <img src={profile.avatar_url} className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-orange-400/20 flex items-center justify-center text-orange-400">
                    {profile?.name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
                <div>
                  <p>{profile?.name}</p>
                  <p className="text-sm text-orange-400">@{profile?.username}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link to="/feed" onClick={() => setMenuOpen(false)}>Feed</Link>
                <Link to="/discover" onClick={() => setMenuOpen(false)}>Discover</Link>
                <Link to="/gigs" onClick={() => setMenuOpen(false)}>Gigs</Link>
                <Link to="/messages" onClick={() => setMenuOpen(false)}>Messages</Link>
                <Link to="/notifications" onClick={() => setMenuOpen(false)}>Notifications</Link>
                <Link to={profile ? `/profile/${profile.username}` : '#'} onClick={() => setMenuOpen(false)}>My Profile</Link>
                <Link to="/edit-profile" onClick={() => setMenuOpen(false)}>Edit Profile</Link>
              </div>

              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  navigate('/')
                }}
                className="mt-auto text-red-400"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-6 mt-16">
              <Link to="/discover">Discover</Link>
              <Link to="/gigs">Gigs</Link>
              <Link to="/auth">Log in</Link>
            </div>
          )}
        </div>
      )}
    </>
  )
}