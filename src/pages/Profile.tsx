import { useEffect, useState } from 'react'
import { MapPin, Instagram, Twitter, Star, Users, Briefcase, X, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/useAuth'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

type Profile = {
  id: string
  name: string
  username: string
  bio: string
  category: string
  location: string
  avatar_url: string
  website: string
  instagram: string
  twitter: string
  available: boolean
}

type Post = {
  id: string
  image_url: string
  caption: string
  likes_count: number
}

type FollowUser = {
  id: string
  name: string
  username: string
  avatar_url: string
  category: string
}

function FollowModal({
  title,
  users,
  onClose,
}: {
  title: string
  users: FollowUser[]
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-sm p-6 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-2">
          {users.length === 0 && (
            <p className="text-center text-white/30 py-10 text-sm">Nobody here yet</p>
          )}
          {users.map((u) => (
            <Link to={`/profile/${u.username}`} key={u.id} onClick={onClose}>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition cursor-pointer">
                <img src={u.avatar_url} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{u.name}</p>
                  <p className="text-xs text-orange-400">{u.category}</p>
                </div>
                <span className="text-xs text-white/30">@{u.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Profile() {
  const { username } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [followerUsers, setFollowerUsers] = useState<FollowUser[]>([])
  const [followingUsers, setFollowingUsers] = useState<FollowUser[]>([])
  const isOwner = user?.id === profile?.id

  useEffect(() => {
    if (!username) return
    supabase.from('profiles').select('*').eq('username', username).single().then(({ data }) => {
      setProfile(data)
      setLoading(false)
      if (data) {
        supabase.from('posts').select('*').eq('user_id', data.id).order('created_at', { ascending: false }).then(({ data: postsData }) => setPosts(postsData ?? []))
        supabase.from('follows').select('*', { count: 'exact' }).eq('following_id', data.id).then(({ count }) => setFollowersCount(count ?? 0))
        supabase.from('follows').select('*', { count: 'exact' }).eq('follower_id', data.id).then(({ count }) => setFollowingCount(count ?? 0))
        if (user) {
          supabase.from('follows').select('*').eq('follower_id', user.id).eq('following_id', data.id).then(({ data: followData }) => setIsFollowing((followData?.length ?? 0) > 0))
        }
      }
    })
  }, [username, user])

  const fetchFollowers = async () => {
    if (!profile) return
    const { data } = await supabase.from('follows').select('follower_id').eq('following_id', profile.id)
    if (!data || data.length === 0) { setFollowerUsers([]); return }
    const ids = data.map((f) => f.follower_id)
    const { data: profilesData } = await supabase.from('profiles').select('id, name, username, avatar_url, category').in('id', ids)
    setFollowerUsers(profilesData ?? [])
  }

  const fetchFollowing = async () => {
    if (!profile) return
    const { data } = await supabase.from('follows').select('following_id').eq('follower_id', profile.id)
    if (!data || data.length === 0) { setFollowingUsers([]); return }
    const ids = data.map((f) => f.following_id)
    const { data: profilesData } = await supabase.from('profiles').select('id, name, username, avatar_url, category').in('id', ids)
    setFollowingUsers(profilesData ?? [])
  }

  const toggleFollow = async () => {
    if (!user || !profile) return
    if (isFollowing) {
      await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', profile.id)
      setFollowersCount(followersCount - 1)
    } else {
      await supabase.from('follows').insert({ follower_id: user.id, following_id: profile.id })
      setFollowersCount(followersCount + 1)
      if (user.id !== profile.id) {
        await supabase.from('notifications').insert({ user_id: profile.id, type: 'follow', from_user_id: user.id, post_id: null, read: false })
      }
    }
    setIsFollowing(!isFollowing)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <p className="text-white/30 text-sm">Loading profile...</p>
    </div>
  )

  if (!profile) return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <p className="text-white/30 text-sm">Profile not found</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Cover image */}
      <div
        className="relative h-56 w-full"
        style={{
          backgroundImage: 'radial-gradient(circle, #e45e16 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundColor: '#111',
        }}
      />

      {/* Profile header card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative -mt-14 bg-[#111] border border-white/8 rounded-2xl p-6 mb-6">

          {/* Avatar + action row */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="w-24 h-24 rounded-2xl border-4 border-[#111] object-cover -mt-14 ring-1 ring-white/10"
            />
            <div className="pt-1">
              {isOwner ? (
                <Link to="/edit-profile">
                  <button className="text-sm border border-white/10 hover:border-orange-400 px-4 py-2 rounded-full text-white/60 hover:text-white transition whitespace-nowrap">
                    Complete Profile
                  </button>
                </Link>
              ) : user ? (
                <button
                  onClick={toggleFollow}
                  className={`text-sm px-5 py-2 rounded-full font-semibold transition whitespace-nowrap ${
                    isFollowing
                      ? 'border border-white/20 text-white/60 hover:border-red-400 hover:text-red-400'
                      : 'bg-orange-400 hover:bg-orange-500 text-black'
                  }`}
                >
                  {isFollowing ? 'Unfollow' : '+ Connect'}
                </button>
              ) : (
                <Link to="/auth">
                  <button className="text-sm bg-orange-400 hover:bg-orange-500 text-black font-semibold px-5 py-2 rounded-full transition whitespace-nowrap">
                    + Connect
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Name + category */}
          <div className="mb-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-extrabold tracking-tight">{profile.name}</h1>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${profile.available ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-white/40 border border-white/10'}`}>
                {profile.available ? '● Available' : '● Pending'}
              </span>
            </div>
            <p className="text-orange-400 font-medium text-sm mt-1">{profile.category}</p>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-white/55 text-sm leading-relaxed mb-4 max-w-xl">{profile.bio}</p>
          )}

          {/* Meta links row */}
          {(profile.location || profile.website || profile.instagram || profile.twitter) && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/35 border-t border-white/6 pt-4">
              {profile.location && (
                <span className="flex items-center gap-1.5"><MapPin size={12} /> {profile.location}</span>
              )}
              {profile.website && (
                <span className="flex items-center gap-1.5 text-orange-400/70 hover:text-orange-400 transition cursor-pointer">
                  <ExternalLink size={12} /> {profile.website}
                </span>
              )}
              {profile.instagram && (
                <span className="flex items-center gap-1.5"><Instagram size={12} /> @{profile.instagram}</span>
              )}
              {profile.twitter && (
                <span className="flex items-center gap-1.5"><Twitter size={12} /> @{profile.twitter}</span>
              )}
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-[#111] border border-white/8 rounded-2xl px-4 py-4 text-center">
            <Star size={15} className="text-orange-400 mx-auto mb-1.5" />
            <p className="text-xl font-bold">{posts.length}</p>
            <p className="text-xs text-white/35 mt-0.5">Posts</p>
          </div>
          <button
            onClick={() => { fetchFollowers(); setShowFollowers(true) }}
            className="bg-[#111] hover:bg-white/5 border border-white/8 hover:border-orange-400/25 rounded-2xl px-4 py-4 text-center transition group"
          >
            <Users size={15} className="text-orange-400 mx-auto mb-1.5" />
            <p className="text-xl font-bold">{followersCount}</p>
            <p className="text-xs text-white/35 mt-0.5 group-hover:text-white/50 transition">Followers</p>
          </button>
          <button
            onClick={() => { fetchFollowing(); setShowFollowing(true) }}
            className="bg-[#111] hover:bg-white/5 border border-white/8 hover:border-orange-400/25 rounded-2xl px-4 py-4 text-center transition group"
          >
            <Briefcase size={15} className="text-orange-400 mx-auto mb-1.5" />
            <p className="text-xl font-bold">{followingCount}</p>
            <p className="text-xs text-white/35 mt-0.5 group-hover:text-white/50 transition">Following</p>
          </button>
        </div>

        {/* Portfolio section */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-bold tracking-wide">Posts</h2>
          <span className="text-xs text-white/30 bg-white/5 border border-white/8 px-3 py-1 rounded-full">{posts.length} works</span>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-white/25 mb-20 border border-dashed border-white/8 rounded-2xl">
            <p className="text-sm">No posts yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pb-20">
            {posts.map((post) => (
              <div key={post.id} className="group relative rounded-2xl overflow-hidden aspect-square cursor-pointer ring-1 ring-white/5">
                <img
                  src={post.image_url}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                  <p className="text-sm font-semibold line-clamp-2">{post.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showFollowers && (
        <FollowModal title={`Followers (${followersCount})`} users={followerUsers} onClose={() => setShowFollowers(false)} />
      )}
      {showFollowing && (
        <FollowModal title={`Following (${followingCount})`} users={followingUsers} onClose={() => setShowFollowing(false)} />
      )}
      <Footer />
    </div>
  )
}