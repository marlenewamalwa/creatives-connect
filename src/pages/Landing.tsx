import { useEffect, useState, useRef } from 'react'
import { ArrowRight, MapPin, Zap } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

type Profile = {
  id: string
  name: string
  category: string
  location: string
  avatar_url: string
  username: string
}

type Post = {
  id: string
  image_url: string
  caption: string
  profiles: { name: string; avatar_url: string; username: string }
}

const stats = [
  { value: '2,400+', label: 'Creatives' },
  { value: '840+', label: 'Gigs Posted' },
  { value: '12K+', label: 'Connections' },
  { value: '47', label: 'Cities' },
]

const categories = ['Photography', 'Design', 'Film', 'Music', 'Illustration', 'Fashion', 'Writing']

export default function Landing() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fetch real creatives
    supabase
      .from('profiles')
      .select('id, name, category, location, avatar_url, username')
      .limit(8)
      .then(({ data }) => setProfiles(data ?? []))

    // Fetch real posts
    supabase
      .from('posts')
      .select('id, image_url, caption, user_id')
      .not('image_url', 'is', null)
      .limit(6)
      .then(async ({ data: postsData }) => {
        if (!postsData || postsData.length === 0) return
        const userIds = [...new Set(postsData.map((p) => p.user_id))]
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, name, avatar_url, username')
          .in('id', userIds)
        const profileMap = Object.fromEntries((profilesData ?? []).map((p) => [p.id, p]))
        setPosts(postsData.map((p) => ({ ...p, profiles: profileMap[p.user_id] })))
      })

    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredProfiles = activeCategory === 'All'
    ? profiles
    : profiles.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        .playfair { font-family: 'Playfair Display', serif; }
        .grain { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"); }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .float { animation: float 6s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .ticker-inner { animation: ticker 25s linear infinite; }
        .card-hover { transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(251,146,60,0.15); }
        .mask-fade { mask-image: linear-gradient(to bottom, black 60%, transparent 100%); }
      `}</style>

      {/* Grain overlay */}
      <div className="grain fixed inset-0 pointer-events-none z-50 opacity-30" />
 <Navbar />

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center overflow-hidden">

        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Floating profile avatars */}
        {profiles.slice(0, 5).map((p, i) => {
          const positions = [
            'top-32 left-16', 'top-48 right-20', 'bottom-40 left-24',
            'bottom-32 right-16', 'top-64 left-1/2'
          ]
          const delays = ['0s', '1s', '2s', '1.5s', '0.5s']
          return (
            <div
              key={p.id}
              className={`absolute ${positions[i]} hidden lg:block float opacity-60`}
              style={{ animationDelay: delays[i] }}
            >
              <div className="relative">
                <img
                  src={p.avatar_url || `https://i.pravatar.cc/150?u=${p.id}`}
                  alt={p.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-400/30"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#080808]" />
              </div>
            </div>
          )
        })}

        {/* Badge */}
        <div className="fade-up inline-flex items-center gap-2 bg-orange-400/10 border border-orange-400/20 text-orange-400 text-xs font-semibold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
          <Zap size={12} /> Kenya's Creative Network
        </div>

        {/* Headline */}
        <h1 className="fade-up playfair text-6xl md:text-8xl font-bold leading-none mb-6 max-w-4xl" style={{ animationDelay: '0.1s' }}>
          Where{' '}
          <span className="italic text-orange-400">Kenyan</span>
          <br />
          Creatives{' '}
          <span className="italic">Connect</span>
        </h1>

        <p className="fade-up text-white/40 text-lg max-w-lg leading-relaxed mb-10" style={{ animationDelay: '0.2s' }}>
          Showcase your work. Find your next collab. Land gigs.
          Built for photographers, designers, musicians, filmmakers and more.
        </p>

        <div className="fade-up flex flex-col sm:flex-row gap-3 items-center" style={{ animationDelay: '0.3s' }}>
          <a href="/auth">
            <button className="bg-orange-400 hover:bg-orange-500 text-black font-bold px-8 py-4 rounded-full transition flex items-center gap-2 text-base">
              Start for free <ArrowRight size={18} />
            </button>
          </a>
          <a href="/discover">
            <button className="border border-white/15 hover:border-white/40 text-white/60 hover:text-white px-8 py-4 rounded-full transition text-base">
              Browse creatives
            </button>
          </a>
        </div>

        {/* Stats row */}
        <div className="fade-up flex flex-wrap justify-center gap-8 mt-16" style={{ animationDelay: '0.4s' }}>
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-orange-400">{s.value}</p>
              <p className="text-xs text-white/30 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ticker */}
      <div className="border-y border-white/5 py-4 overflow-hidden bg-white/[0.02]">
        <div className="ticker-inner flex gap-8 whitespace-nowrap">
          {[...categories, ...categories].map((cat, i) => (
            <span key={i} className="text-sm text-white/20 font-medium uppercase tracking-widest px-4">
              {cat} <span className="text-orange-400/40 mx-2">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Portfolio grid */}
      {posts.length > 0 && (
        <section className="px-6 py-24 max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs text-orange-400 uppercase tracking-widest mb-2">Latest Work</p>
              <h2 className="playfair text-4xl md:text-5xl font-bold">Fresh from<br /><span className="italic">the community</span></h2>
            </div>
            <a href="/feed" className="hidden md:flex items-center gap-2 text-sm text-white/40 hover:text-white transition">
              View all <ArrowRight size={16} />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {posts.map((post, i) => (
              <a href="/feed" key={post.id}>
                <div className={`card-hover relative rounded-2xl overflow-hidden cursor-pointer ${i === 0 ? 'row-span-2' : ''}`}
                  style={{ aspectRatio: i === 0 ? '1/2' : '1/1' }}>
                  <img
                    src={post.image_url}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={post.profiles?.avatar_url || `https://i.pravatar.cc/150?u=${post.id}`}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-medium">{post.profiles?.name}</span>
                    </div>
                    <p className="text-xs text-white/70 line-clamp-2">{post.caption}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Creatives section */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs text-orange-400 uppercase tracking-widest mb-2">The Talent</p>
            <h2 className="playfair text-4xl md:text-5xl font-bold">Meet the<br /><span className="italic">creatives</span></h2>
          </div>
          <a href="/discover" className="hidden md:flex items-center gap-2 text-sm text-white/40 hover:text-white transition">
            See all <ArrowRight size={16} />
          </a>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-10">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-4 py-2 rounded-full border transition ${
                activeCategory === cat
                  ? 'bg-orange-400 border-orange-400 text-black font-bold'
                  : 'border-white/10 text-white/40 hover:border-orange-400/50 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProfiles.length === 0 ? (
          <div className="text-center py-20 text-white/20">
            <p>No creatives in this category yet — be the first!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredProfiles.map((p) => (
              <a href={`/profile/${p.username}`} key={p.id}>
                <div className="card-hover bg-white/[0.03] border border-white/8 rounded-2xl p-5 flex flex-col items-center text-center cursor-pointer">
                  <div className="relative mb-3">
                    <img
                      src={p.avatar_url || `https://i.pravatar.cc/150?u=${p.id}`}
                      alt={p.name}
                      className="w-16 h-16 rounded-full object-cover border border-white/10"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-[#080808] rounded-full" />
                  </div>
                  <p className="font-semibold text-sm">{p.name}</p>
                  <p className="text-xs text-orange-400 mt-0.5">{p.category}</p>
                  {p.location && (
                    <p className="text-xs text-white/30 mt-1 flex items-center gap-1 justify-center">
                      <MapPin size={9} /> {p.location}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="px-6 py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-pink-500/5 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <p className="text-xs text-orange-400 uppercase tracking-widest mb-4">Ready?</p>
          <h2 className="playfair text-5xl md:text-7xl font-bold leading-none mb-6">
            Your work deserves<br />
            <span className="italic text-orange-400">to be seen.</span>
          </h2>
          <p className="text-white/40 text-lg max-w-md mx-auto mb-10">
            Join thousands of Kenyan creatives already building their brand on CreativesConnect.
          </p>
          <a href="/auth">
            <button className="bg-orange-400 hover:bg-orange-500 text-black font-bold px-10 py-5 rounded-full transition text-lg flex items-center gap-3 mx-auto">
              Create your profile <ArrowRight size={20} />
            </button>
          </a>
        </div>
      </section>
<Footer />
      
    </div>
  )
}