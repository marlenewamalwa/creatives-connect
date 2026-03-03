import { ArrowRight, Palette, Camera, Music, Film, Pen, Star } from 'lucide-react'

const categories = [
  { icon: Camera, label: 'Photography' },
  { icon: Palette, label: 'Design' },
  { icon: Music, label: 'Music' },
  { icon: Film, label: 'Film' },
  { icon: Pen, label: 'Writing' },
]

const creatives = [
  { name: 'Aisha Kamau', role: 'Photographer', location: 'Nairobi', img: 'https://i.pravatar.cc/150?img=47' },
  { name: 'Brian Otieno', role: 'Graphic Designer', location: 'Mombasa', img: 'https://i.pravatar.cc/150?img=12' },
  { name: 'Ciku Wanjiru', role: 'Filmmaker', location: 'Nairobi', img: 'https://i.pravatar.cc/150?img=32' },
  { name: 'David Mwangi', role: 'Musician', location: 'Kisumu', img: 'https://i.pravatar.cc/150?img=68' },
  { name: 'Fatuma Ali', role: 'Illustrator', location: 'Nairobi', img: 'https://i.pravatar.cc/150?img=56' },
  { name: 'George Njoroge', role: 'Writer', location: 'Nakuru', img: 'https://i.pravatar.cc/150?img=15' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <span className="text-xl font-bold tracking-tight">
          creatives<span className="text-orange-400">connect</span>
        </span>
        <div className="flex gap-4 items-center">
          <button className="text-sm text-white/60 hover:text-white transition">Log in</button>
          <a href="/auth">
  <button className="text-sm bg-orange-400 hover:bg-orange-500 text-black font-semibold px-4 py-2 rounded-full transition">
    Join now
  </button>
</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-16">
        <span className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-4">
          Built for Kenyan Creatives
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-4xl">
          Where Kenya's <br />
          <span className="text-orange-400">Creative Talent</span> Connects
        </h1>
        <p className="mt-6 text-white/50 text-lg max-w-xl">
          Showcase your work, find collabs, discover gigs, and connect with the most talented creatives across Kenya.
        </p>
        <div className="flex gap-4 mt-10">
          <a href="/auth">
  <button className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-black font-bold px-6 py-3 rounded-full transition">
    Get started <ArrowRight size={18} />
  </button>
</a>
          <button className="flex items-center gap-2 border border-white/20 hover:border-white/50 px-6 py-3 rounded-full text-white/70 hover:text-white transition">
            Explore creatives
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="flex justify-center gap-4 flex-wrap px-6 pb-16">
        {categories.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 border border-white/10 hover:border-orange-400/50 bg-white/5 hover:bg-white/10 px-5 py-3 rounded-full cursor-pointer transition"
          >
            <Icon size={16} className="text-orange-400" />
            <span className="text-sm text-white/70">{label}</span>
          </div>
        ))}
      </section>

      {/* Featured Creatives */}
      <section className="px-8 pb-24 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Creatives</h2>
          <button className="text-sm text-orange-400 hover:underline">View all</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {creatives.map((c) => (
            <div
              key={c.name}
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-400/30 rounded-2xl p-5 flex flex-col items-center text-center cursor-pointer transition"
            >
              <img src={c.img} alt={c.name} className="w-16 h-16 rounded-full object-cover mb-3" />
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-orange-400">{c.role}</p>
              <p className="text-xs text-white/40 mt-1">📍 {c.location}</p>
              <button className="mt-4 text-xs border border-white/20 hover:border-orange-400 px-4 py-1.5 rounded-full transition text-white/60 hover:text-white">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 px-8 py-20 text-center">
        <Star size={32} className="text-orange-400 mx-auto mb-4" />
        <h2 className="text-3xl md:text-5xl font-extrabold max-w-2xl mx-auto">
          Ready to put your work in front of Kenya?
        </h2>
        <p className="text-white/50 mt-4 max-w-md mx-auto">
          Join thousands of creatives already building their brand on Creatives Connect.
        </p>
        <button className="mt-8 bg-orange-400 hover:bg-orange-500 text-black font-bold px-8 py-4 rounded-full transition">
          Create your profile — it's free
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-6 flex items-center justify-between text-white/30 text-xs">
        <span>© 2026 CreativesConnect Kenya</span>
        <span>Made with 🧡 in Nairobi</span>
      </footer>

    </div>
  )
}