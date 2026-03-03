import { MapPin, Link2, Instagram, Twitter, Star, Users, Briefcase } from 'lucide-react'

const portfolio = [
  { id: 1, img: 'https://picsum.photos/seed/a1/400/400', title: 'Brand Identity — Tusker' },
  { id: 2, img: 'https://picsum.photos/seed/a2/400/400', title: 'Editorial Shoot — Vogue EA' },
  { id: 3, img: 'https://picsum.photos/seed/a3/400/400', title: 'Campaign — Safaricom' },
  { id: 4, img: 'https://picsum.photos/seed/a4/400/400', title: 'Portrait Series' },
  { id: 5, img: 'https://picsum.photos/seed/a5/400/400', title: 'Nike KE Launch' },
  { id: 6, img: 'https://picsum.photos/seed/a6/400/400', title: 'Nairobi Streets' },
]

const stats = [
  { icon: Star, label: 'Featured', value: '12x' },
  { icon: Users, label: 'Connections', value: '1.4k' },
  { icon: Briefcase, label: 'Gigs Done', value: '38' },
]

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <a href="/" className="text-xl font-bold tracking-tight">
          creatives<span className="text-orange-400">connect</span>
        </a>
        <div className="flex gap-3">
          <button className="text-sm border border-white/10 hover:border-orange-400 px-4 py-2 rounded-full text-white/60 hover:text-white transition">
            Edit Profile
          </button>
          <button className="text-sm bg-orange-400 hover:bg-orange-500 text-black font-semibold px-4 py-2 rounded-full transition">
            + Connect
          </button>
        </div>
      </nav>

      {/* Cover */}
      <div className="relative h-52 bg-gradient-to-br from-orange-500/30 via-pink-500/20 to-purple-600/20">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/cover1/1200/300')] bg-cover bg-center opacity-20" />
      </div>

      {/* Profile header */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative -mt-16 mb-6 flex items-end justify-between">
          <img
            src="https://i.pravatar.cc/150?img=47"
            alt="Aisha Kamau"
            className="w-28 h-28 rounded-2xl border-4 border-[#0a0a0a] object-cover"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold">Aisha Kamau</h1>
            <p className="text-orange-400 font-medium mt-1">Photographer & Visual Storyteller</p>
            <div className="flex items-center gap-4 mt-3 text-white/40 text-sm flex-wrap">
              <span className="flex items-center gap-1"><MapPin size={14} /> Nairobi, Kenya</span>
              <span className="flex items-center gap-1"><Link2 size={14} /> aishakamau.co.ke</span>
              <span className="flex items-center gap-1"><Instagram size={14} /> @aishakamau</span>
              <span className="flex items-center gap-1"><Twitter size={14} /> @aishakamau</span>
            </div>
            <p className="mt-4 text-white/60 max-w-lg text-sm leading-relaxed">
              Visual storyteller based in Nairobi. I shoot brands, people, and places — with a deep love for authentic African narratives. Available for commercial, editorial and portrait work.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4 shrink-0">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center min-w-[80px]">
                <Icon size={16} className="text-orange-400 mx-auto mb-1" />
                <p className="text-lg font-bold">{value}</p>
                <p className="text-xs text-white/40">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {['Portrait', 'Editorial', 'Commercial', 'Street', 'Brand Identity', 'Lightroom', 'Studio Lighting'].map((skill) => (
            <span key={skill} className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-white/60">
              {skill}
            </span>
          ))}
        </div>

        {/* Portfolio grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">Portfolio</h2>
          <span className="text-sm text-white/30">{portfolio.length} works</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pb-20">
          {portfolio.map((item) => (
            <div key={item.id} className="group relative rounded-2xl overflow-hidden aspect-square cursor-pointer">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                <p className="text-sm font-semibold">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}