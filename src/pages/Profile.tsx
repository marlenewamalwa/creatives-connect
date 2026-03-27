import { useEffect, useState } from 'react'
import { MapPin, Link2, Instagram, Twitter, Star, Users, Briefcase, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/useAuth'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

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

        <div className="flex-1 overflow-y-auto flex flex-col gap-3">
          {users.length === 0 && (
            <p className="text-center text-white/30 py-10 text-sm">Nobody here yet</p>
          )}
          {users.map((u) => (
            <Link to={`/profile/${u.username}`} key={u.id} onClick={onClose}>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition cursor-pointer">
                <img
                  src={u.avatar_url || `https://i.pravatar.cc/150?u=${u.id}`}
                  alt={u.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
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

    supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('Profile error:', error)
          setLoading(false)
          return
        }

        setProfile(data)
        setLoading(false)

        if (data) {
          supabase
            .from('posts')
            .select('*')
            .eq('user_id', data.id)
            .order('created_at', { ascending: false })
            .then(({ data: postsData }) => setPosts(postsData ?? []))

          supabase
            .from('follows')
            .select('*', { count: 'exact' })
            .eq('following_id', data.id)
            .then(({ count }) => setFollowersCount(count ?? 0))

          supabase
            .from('follows')
            .select('*', { count: 'exact' })
            .eq('follower_id', data.id)
            .then(({ count }) => setFollowingCount(count ?? 0))

          if (user) {
            supabase
              .from('follows')
              .select('*')
              .eq('follower_id', user.id)
              .eq('following_id', data.id)
              .then(({ data: followData }) =>
                setIsFollowing((followData?.length ?? 0) > 0)
              )
          }
        }
      })
  }, [username, user])

  const fetchFollowers = async () => {
    if (!profile) return
    const { data } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('following_id', profile.id)

    if (!data || data.length === 0) { setFollowerUsers([]); return }

    const ids = data.map((f) => f.follower_id)
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, name, username, avatar_url, category')
      .in('id', ids)

    setFollowerUsers(profilesData ?? [])
  }

  const fetchFollowing = async () => {
    if (!profile) return
    const { data } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', profile.id)

    if (!data || data.length === 0) { setFollowingUsers([]); return }

    const ids = data.map((f) => f.following_id)
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, name, username, avatar_url, category')
      .in('id', ids)

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
        await supabase.from('notifications').insert({
          user_id: profile.id,
          type: 'follow',
          from_user_id: user.id,
          post_id: null,
          read: false,
        })
      }
    }
    setIsFollowing(!isFollowing)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <p className="text-white/30">Loading profile...</p>
    </div>
  )

  if (!profile) return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <p className="text-white/30">Profile not found</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-4 flex justify-end gap-3">
        {isOwner ? (
          <Link to="/edit-profile">
            <button className="text-sm border border-white/10 hover:border-orange-400 px-4 py-2 rounded-full">
              Edit Profile
            </button>
          </Link>
        ) : user ? (
          <button onClick={toggleFollow}>
            {isFollowing ? 'Unfollow' : '+ Connect'}
          </button>
        ) : (
          <Link to="/auth">
            <button>+ Connect</button>
          </Link>
        )}
      </div>

      <div className="relative h-52 bg-gradient-to-br from-orange-500/30 via-pink-500/20 to-purple-600/20" />

      <div className="max-w-4xl mx-auto px-6">
        <div className="relative -mt-16 mb-6">
          <img
            src={profile.avatar_url || `https://i.pravatar.cc/150?u=${profile.id}`}
            alt={profile.name}
            className="w-28 h-28 rounded-2xl border-4 border-[#0a0a0a] object-cover"
          />
        </div>

        <h1 className="text-2xl font-extrabold">{profile.name}</h1>
        <p className="text-orange-400">{profile.category}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pb-20">
          {posts.map((post) => (
            <div key={post.id}>
              <img src={post.image_url} />
            </div>
          ))}
        </div>
      </div>

      {showFollowers && (
        <FollowModal title="Followers" users={followerUsers} onClose={() => setShowFollowers(false)} />
      )}

      {showFollowing && (
        <FollowModal title="Following" users={followingUsers} onClose={() => setShowFollowing(false)} />
      )}
    </div>
  )
}