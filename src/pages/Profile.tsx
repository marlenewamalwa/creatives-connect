import { useEffect, useState } from 'react'
import { MapPin, Link2, Instagram, Twitter, Star, Users, Briefcase, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/useAuth'
import { useParams } from 'react-router-dom'
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center px-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6 max-h-[80vh] flex flex-col shadow-2xl">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
          {users.length === 0 && (
            <p className="text-center text-white/30 py-10 text-sm">
              Nobody here yet
            </p>
          )}

          {users.map((u) => (
            <a href={`/profile/${u.username}`} key={u.id} onClick={onClose}>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition cursor-pointer">
                
                <img
                  src={u.avatar_url || `https://i.pravatar.cc/150?u=${u.id}`}
                  alt={u.name}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{u.name}</p>
                  <p className="text-xs text-orange-400">{u.category}</p>
                </div>

                <span className="text-xs text-white/30">@{u.username}</span>
              </div>
            </a>
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
      .then(({ data }) => {

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

    if (!data || data.length === 0) {
      setFollowerUsers([])
      return
    }

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

    if (!data || data.length === 0) {
      setFollowingUsers([])
      return
    }

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

      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', profile.id)

      setFollowersCount(followersCount - 1)

    } else {

      await supabase
        .from('follows')
        .insert({ follower_id: user.id, following_id: profile.id })

      setFollowersCount(followersCount + 1)

      if (user.id !== profile.id) {

        await supabase
          .from('notifications')
          .insert({
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


  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-white/30">Loading profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-white/30">Profile not found</p>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      <Navbar />

      {/* COVER */}
      <div className="relative h-56 w-full bg-gradient-to-br from-orange-500/30 via-pink-500/20 to-purple-600/20" />

      {/* PROFILE SECTION */}
      <div className="max-w-5xl mx-auto px-6">

        {/* Avatar */}
        <div className="relative -mt-16 mb-6">
          <img
            src={profile.avatar_url || `https://i.pravatar.cc/150?u=${profile.id}`}
            alt={profile.name}
            className="w-32 h-32 rounded-2xl border-4 border-[#0a0a0a] object-cover shadow-xl"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mb-6">

          {isOwner ? (
            <a href="/edit-profile">
              <button className="text-sm border border-white/10 hover:border-orange-400 px-4 py-2 rounded-full text-white/60 hover:text-white transition">
                Edit Profile
              </button>
            </a>
          ) : user ? (
            <>
              <a href={`/messages?user=${profile.username}`}>
                <button className="text-sm border border-white/10 hover:border-orange-400 px-4 py-2 rounded-full text-white/60 hover:text-white transition">
                  💬 Message
                </button>
              </a>

              <button
                onClick={toggleFollow}
                className={`text-sm px-4 py-2 rounded-full font-semibold transition ${
                  isFollowing
                    ? 'border border-white/20 text-white/60 hover:border-red-400 hover:text-red-400'
                    : 'bg-orange-400 hover:bg-orange-500 text-black'
                }`}
              >
                {isFollowing ? 'Unfollow' : '+ Connect'}
              </button>
            </>
          ) : (
            <a href="/auth">
              <button className="text-sm bg-orange-400 hover:bg-orange-500 text-black font-semibold px-4 py-2 rounded-full transition">
                + Connect
              </button>
            </a>
          )}

        </div>


        {/* PROFILE INFO */}
        <div className="flex flex-col md:flex-row md:justify-between gap-8 mb-10">

          <div>

            <h1 className="text-3xl font-extrabold">{profile.name}</h1>

            <p className="text-orange-400 font-medium mt-1">
              {profile.category}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-white/40 text-sm">

              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {profile.location}
                </span>
              )}

              {profile.website && (
                <span className="flex items-center gap-1">
                  <Link2 size={14} /> {profile.website}
                </span>
              )}

              {profile.instagram && (
                <span className="flex items-center gap-1">
                  <Instagram size={14} /> @{profile.instagram}
                </span>
              )}

              {profile.twitter && (
                <span className="flex items-center gap-1">
                  <Twitter size={14} /> @{profile.twitter}
                </span>
              )}
            </div>

            {profile.bio && (
              <p className="mt-4 text-white/60 max-w-lg text-sm leading-relaxed">
                {profile.bio}
              </p>
            )}

          </div>


          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-center">
              <Star size={16} className="text-orange-400 mx-auto mb-1" />
              <p className="text-xl font-bold">{posts.length}</p>
              <p className="text-xs text-white/40">Posts</p>
            </div>

            <button
              onClick={() => {
                fetchFollowers()
                setShowFollowers(true)
              }}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-6 py-5 text-center transition"
            >
              <Users size={16} className="text-orange-400 mx-auto mb-1" />
              <p className="text-xl font-bold">{followersCount}</p>
              <p className="text-xs text-white/40">Followers</p>
            </button>

            <button
              onClick={() => {
                fetchFollowing()
                setShowFollowing(true)
              }}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-6 py-5 text-center transition"
            >
              <Users size={16} className="text-orange-400 mx-auto mb-1" />
              <p className="text-xl font-bold">{followingCount}</p>
              <p className="text-xs text-white/40">Following</p>
            </button>

            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-center">
              <Briefcase size={16} className="text-orange-400 mx-auto mb-1" />
              <p className="text-lg font-bold">
                {profile.available ? 'Open' : 'Busy'}
              </p>
              <p className="text-xs text-white/40">Status</p>
            </div>

          </div>
        </div>


        {/* PORTFOLIO */}
        <div className="flex items-center justify-between mb-6">

          <h2 className="text-lg font-bold">
            Portfolio
          </h2>

          <span className="text-sm text-white/30">
            {posts.length} works
          </span>

        </div>

        {posts.length === 0 ? (

          <div className="text-center py-24 text-white/30">
            No posts yet
          </div>

        ) : (

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-20">

            {posts.map((post) => (
              <div
                key={post.id}
                className="group relative rounded-2xl overflow-hidden aspect-square cursor-pointer"
              >

                <img
                  src={post.image_url}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end p-4">

                  <p className="text-sm font-semibold line-clamp-2">
                    {post.caption}
                  </p>

                </div>

              </div>
            ))}

          </div>

        )}
      </div>


      {showFollowers && (
        <FollowModal
          title={`Followers (${followersCount})`}
          users={followerUsers}
          onClose={() => setShowFollowers(false)}
        />
      )}

      {showFollowing && (
        <FollowModal
          title={`Following (${followingCount})`}
          users={followingUsers}
          onClose={() => setShowFollowing(false)}
        />
      )}

    </div>
  )
}