import { useState, useEffect } from 'react'
import { Heart, MessageCircle, UserPlus, Briefcase, Bell } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/useAuth'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

type Notification = {
  id: string
  type: string
  read: boolean
  created_at: string
  from_user_id: string
  post_id: string | null
  from_profile: {
    name: string
    avatar_url: string
    username: string
  } | null
  post: {
    image_url: string
  } | null
}

const filters = ['All', 'Likes', 'Comments', 'Follows', 'Gigs']

const iconMap: Record<string, { icon: React.ElementType; color: string }> = {
  like: { icon: Heart, color: 'text-red-400' },
  comment: { icon: MessageCircle, color: 'text-blue-400' },
  follow: { icon: UserPlus, color: 'text-green-400' },
  gig: { icon: Briefcase, color: 'text-orange-400' },
}

const textMap: Record<string, string> = {
  like: 'liked your post',
  comment: 'commented on your post',
  follow: 'started following you',
  gig: 'applied to your gig',
}

export default function Notifications() {
  const { user } = useAuth()
  const [notifs, setNotifs] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState('All')

  const fetchNotifications = async () => {
    if (!user) return

    const { data: notifsData } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!notifsData || notifsData.length === 0) {
      setLoading(false)
      return
    }

    const fromUserIds = [...new Set(notifsData.map((n) => n.from_user_id).filter(Boolean))]
    const postIds = [...new Set(notifsData.map((n) => n.post_id).filter(Boolean))]

    const [{ data: profilesData }, { data: postsData }] = await Promise.all([
      supabase.from('profiles').select('id, name, avatar_url, username').in('id', fromUserIds),
      postIds.length > 0
        ? supabase.from('posts').select('id, image_url').in('id', postIds)
        : Promise.resolve({ data: [] }),
    ])

    const profileMap = Object.fromEntries((profilesData ?? []).map((p) => [p.id, p]))
    const postMap = Object.fromEntries((postsData ?? []).map((p) => [p.id, p]))

    const merged = notifsData.map((n) => ({
      ...n,
      from_profile: profileMap[n.from_user_id] ?? null,
      post: n.post_id ? postMap[n.post_id] ?? null : null,
    }))

    setNotifs(merged)
    setLoading(false)
  }

  useEffect(() => {
    fetchNotifications()
  }, [user])

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  const markAllRead = async () => {
    await supabase.from('notifications').update({ read: true }).eq('user_id', user?.id)
    setNotifs(notifs.map((n) => ({ ...n, read: true })))
  }

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const filtered = notifs.filter((n) => {
    if (active === 'All') return true
    if (active === 'Likes') return n.type === 'like'
    if (active === 'Comments') return n.type === 'comment'
    if (active === 'Follows') return n.type === 'follow'
    if (active === 'Gigs') return n.type === 'gig'
    return true
  })

  const unreadCount = notifs.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-white/40 mt-1">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-sm text-orange-400 hover:underline transition">
              Mark all read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`text-xs px-4 py-2 rounded-full border transition shrink-0 ${
                active === f
                  ? 'bg-orange-400 border-orange-400 text-black font-bold'
                  : 'border-white/10 text-white/50 hover:border-orange-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading && <p className="text-center text-white/30 py-20">Loading...</p>}

        {/* Notifications */}
        <div className="flex flex-col gap-2">
          {filtered.map((notif) => {
            const { icon: Icon, color } = iconMap[notif.type] ?? iconMap['like']

            return (
             <Link
  key={notif.id}
  to={notif.from_profile ? `/profile/${notif.from_profile.username}` : '#'}
  onClick={() => markRead(notif.id)}
>
                <div
                  className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border cursor-pointer transition ${
                    !notif.read
                      ? 'bg-orange-400/5 border-orange-400/20 hover:bg-orange-400/10'
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  {/* Avatar + icon */}
                  <div className="relative shrink-0">
                    <img
                      src={
                        notif.from_profile?.avatar_url }
                      alt={notif.from_profile?.name}
                      className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center">
                      <Icon size={11} className={color} />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold">
                        {notif.from_profile?.name ?? 'Someone'}
                      </span>{' '}
                      <span className="text-white/60">
                        {textMap[notif.type] ?? 'interacted with you'}
                      </span>
                    </p>
                    <p className="text-xs text-white/30 mt-0.5">
                      {timeAgo(notif.created_at)}
                    </p>
                  </div>

                  {/* Post preview */}
                  {notif.post?.image_url && (
                    <img
                      src={notif.post.image_url}
                      alt=""
                      className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover shrink-0"
                    />
                  )}

                  {/* Unread dot */}
                  {!notif.read && (
                    <div className="w-2 h-2 bg-orange-400 rounded-full shrink-0" />
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <Bell size={32} className="mx-auto mb-3 opacity-30" />
            <p>No notifications yet</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}