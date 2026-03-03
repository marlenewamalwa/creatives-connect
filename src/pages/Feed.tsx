import { useState } from 'react'
import { Heart, MessageCircle, Bookmark, Share2, MapPin, Compass, Briefcase, Bell, Home } from 'lucide-react'

const posts = [
  {
    id: 1,
    user: { name: 'Aisha Kamau', role: 'Photographer', img: 'https://i.pravatar.cc/150?img=47', location: 'Nairobi' },
    image: 'https://picsum.photos/seed/post1/600/600',
    caption: 'Just wrapped up a brand shoot for a local fashion label in Westlands. Love how these turned out 🔥',
    likes: 142,
    comments: 18,
    time: '2h ago',
    tags: ['Photography', 'Fashion', 'Nairobi'],
  },
  {
    id: 2,
    user: { name: 'Brian Otieno', role: 'Graphic Designer', img: 'https://i.pravatar.cc/150?img=12', location: 'Mombasa' },
    image: 'https://picsum.photos/seed/post2/600/600',
    caption: 'New brand identity project for a Mombasa-based restaurant. Clean, bold, coastal vibes 🌊',
    likes: 89,
    comments: 11,
    time: '4h ago',
    tags: ['Design', 'Branding', 'Mombasa'],
  },
  {
    id: 3,
    user: { name: 'Ciku Wanjiru', role: 'Filmmaker', img: 'https://i.pravatar.cc/150?img=32', location: 'Nairobi' },
    image: 'https://picsum.photos/seed/post3/600/600',
    caption: 'BTS from our short film shoot in Karura Forest last weekend. The light was everything ✨',
    likes: 203,
    comments: 34,
    time: '6h ago',
    tags: ['Film', 'BTS', 'Nairobi'],
  },
  {
    id: 4,
    user: { name: 'Halima Said', role: 'Fashion Designer', img: 'https://i.pravatar.cc/150?img=44', location: 'Nairobi' },
    image: 'https://picsum.photos/seed/post4/600/600',
    caption: 'My latest collection drops next week. Inspired by Lamu architecture and Swahili culture 🏛️',
    likes: 317,
    comments: 42,
    time: '1d ago',
    tags: ['Fashion', 'Culture', 'Kenya'],
  },
]

const suggestions = [
  { name: 'David Mwangi', role: 'Musician', img: 'https://i.pravatar.cc/150?img=68' },
  { name: 'Fatuma Ali', role: 'Illustrator', img: 'https://i.pravatar.cc/150?img=56' },
  { name: 'Moses Kipchoge', role: 'Musician', img: 'https://i.pravatar.cc/150?img=67' },
]

function PostCard({ post }: { post: typeof posts[0] }) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likes, setLikes] = useState(post.likes)

  const toggleLike = () => {
    setLiked(!liked)
    setLikes(liked ? likes - 1 : likes + 1)
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      {/* Post header */}
      <div className="flex items-center gap-3 p-4">
        <img src={post.user.img} alt={post.user.name} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1">
          <p className="font-semibold text-sm">{post.user.name}</p>
          <p className="text-xs text-orange-400">{post.user.role}</p>
        </div>
        <span className="text-xs text-white/30 flex items-center gap-1">
          <MapPin size={10} /> {post.user.location} · {post.time}
        </span>
      </div>

      {/* Image */}
      <img src={post.image} alt="post" className="w-full aspect-square object-cover" />

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={toggleLike} className="flex items-center gap-1.5 text-sm transition">
              <Heart size={20} className={liked ? 'fill-orange-400 text-orange-400' : 'text-white/50 hover:text-white'} />
              <span className={liked ? 'text-orange-400' : 'text-white/50'}>{likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition">
              <MessageCircle size={20} />
              <span>{post.comments}</span>
            </button>
            <button className="text-white/50 hover:text-white transition">
              <Share2 size={20} />
            </button>
          </div>
          <button onClick={() => setSaved(!saved)} className="transition">
            <Bookmark size={20} className={saved ? 'fill-orange-400 text-orange-400' : 'text-white/50 hover:text-white'} />
          </button>
        </div>

        {/* Caption */}
        <p className="text-sm text-white/80 leading-relaxed">{post.caption}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs text-orange-400/70 hover:text-orange-400 cursor-pointer transition">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Feed() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-sm z-10">
        <a href="/" className="text-xl font-bold tracking-tight">
          creatives<span className="text-orange-400">connect</span>
        </a>
        <div className="flex items-center gap-6 text-white/40">
          <a href="/feed" className="hover:text-white transition"><Home size={20} /></a>
          <a href="/discover" className="hover:text-white transition"><Compass size={20} /></a>
          <a href="/gigs" className="hover:text-white transition"><Briefcase size={20} /></a>
          <button className="hover:text-white transition relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full" />
          </button>
        </div>
        <a href="/profile/aisha">
          <img src="https://i.pravatar.cc/150?img=47" alt="me" className="w-8 h-8 rounded-full object-cover cursor-pointer" />
        </a>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10 flex gap-8">

        {/* Feed */}
        <div className="flex-1 max-w-xl mx-auto flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block w-72 shrink-0">

          {/* My profile */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5 flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?img=47" alt="me" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-sm">Aisha Kamau</p>
              <p className="text-xs text-orange-400">Photographer</p>
              <p className="text-xs text-white/30 mt-0.5">📍 Nairobi</p>
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-4">Suggested Creatives</p>
            <div className="flex flex-col gap-4">
              {suggestions.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <img src={s.img} alt={s.name} className="w-9 h-9 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-orange-400">{s.role}</p>
                  </div>
                  <button className="text-xs border border-white/20 hover:border-orange-400 hover:text-white text-white/50 px-3 py-1 rounded-full transition">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}