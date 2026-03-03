import { useState } from 'react'
import { Search, MapPin, SlidersHorizontal } from 'lucide-react'

const allCreatives = [
  { name: 'Aisha Kamau', role: 'Photographer', location: 'Nairobi', category: 'Photography', img: 'https://i.pravatar.cc/150?img=47', available: true },
  { name: 'Brian Otieno', role: 'Graphic Designer', location: 'Mombasa', category: 'Design', img: 'https://i.pravatar.cc/150?img=12', available: true },
  { name: 'Ciku Wanjiru', role: 'Filmmaker', location: 'Nairobi', category: 'Film', img: 'https://i.pravatar.cc/150?img=32', available: false },
  { name: 'David Mwangi', role: 'Musician', location: 'Kisumu', category: 'Music', img: 'https://i.pravatar.cc/150?img=68', available: true },
  { name: 'Fatuma Ali', role: 'Illustrator', location: 'Nairobi', category: 'Illustration', img: 'https://i.pravatar.cc/150?img=56', available: true },
  { name: 'George Njoroge', role: 'Writer', location: 'Nakuru', category: 'Writing', img: 'https://i.pravatar.cc/150?img=15', available: false },
  { name: 'Halima Said', role: 'Fashion Designer', location: 'Nairobi', category: 'Fashion', img: 'https://i.pravatar.cc/150?img=44', available: true },
  { name: 'Ian Kariuki', role: 'Photographer', location: 'Eldoret', category: 'Photography', img: 'https://i.pravatar.cc/150?img=59', available: true },
  { name: 'Joyce Auma', role: 'Graphic Designer', location: 'Nairobi', category: 'Design', img: 'https://i.pravatar.cc/150?img=48', available: false },
  { name: 'Kevin Ochieng', role: 'Filmmaker', location: 'Mombasa', category: 'Film', img: 'https://i.pravatar.cc/150?img=70', available: true },
  { name: 'Lena Mutua', role: 'Illustrator', location: 'Nairobi', category: 'Illustration', img: 'https://i.pravatar.cc/150?img=25', available: true },
  { name: 'Moses Kipchoge', role: 'Musician', location: 'Eldoret', category: 'Music', img: 'https://i.pravatar.cc/150?img=67', available: false },
]

const categories = ['All', 'Photography', 'Design', 'Film', 'Music', 'Illustration', 'Writing', 'Fashion']
const locations = ['All', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret']

export default function Discover() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeLocation, setActiveLocation] = useState('All')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = allCreatives.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'All' || c.category === activeCategory
    const matchLocation = activeLocation === 'All' || c.location === activeLocation
    const matchAvailable = !availableOnly || c.available
    return matchSearch && matchCategory && matchLocation && matchAvailable
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <a href="/" className="text-xl font-bold tracking-tight">
          creatives<span className="text-orange-400">connect</span>
        </a>
        <div className="flex gap-3">
          <a href="/auth">
            <button className="text-sm text-white/60 hover:text-white transition">Log in</button>
          </a>
          <a href="/auth">
            <button className="text-sm bg-orange-400 hover:bg-orange-500 text-black font-semibold px-4 py-2 rounded-full transition">
              Join now
            </button>
          </a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">Discover Creatives</h1>
          <p className="text-white/40">Find and connect with Kenya's best creative talent</p>
        </div>

        {/* Search + filter toggle */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-white/30 transition"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 border px-4 py-3 rounded-xl text-sm transition ${showFilters ? 'border-orange-400 text-orange-400' : 'border-white/10 text-white/50 hover:border-white/30'}`}
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 flex flex-col gap-4">
            <div>
              <p className="text-xs text-white/40 mb-2 uppercase tracking-widest">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-xs px-4 py-2 rounded-full border transition ${
                      activeCategory === cat
                        ? 'bg-orange-400 border-orange-400 text-black font-bold'
                        : 'border-white/10 text-white/50 hover:border-orange-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-2 uppercase tracking-widest">Location</p>
              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setActiveLocation(loc)}
                    className={`text-xs px-4 py-2 rounded-full border transition ${
                      activeLocation === loc
                        ? 'bg-orange-400 border-orange-400 text-black font-bold'
                        : 'border-white/10 text-white/50 hover:border-orange-400 hover:text-white'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAvailableOnly(!availableOnly)}
                className={`w-10 h-6 rounded-full transition relative ${availableOnly ? 'bg-orange-400' : 'bg-white/10'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${availableOnly ? 'left-5' : 'left-1'}`} />
              </button>
              <span className="text-sm text-white/60">Available for work only</span>
            </div>
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-white/30 mb-6">{filtered.length} creatives found</p>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((c) => (
            <a href="/profile/aisha" key={c.name}>
              <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-400/30 rounded-2xl p-5 flex flex-col items-center text-center cursor-pointer transition">
                <div className="relative mb-3">
                  <img src={c.img} alt={c.name} className="w-16 h-16 rounded-full object-cover" />
                  {c.available && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-[#0a0a0a] rounded-full" />
                  )}
                </div>
                <p className="font-semibold text-sm">{c.name}</p>
                <p className="text-xs text-orange-400 mt-0.5">{c.role}</p>
                <p className="text-xs text-white/30 mt-1 flex items-center gap-1">
                  <MapPin size={10} /> {c.location}
                </p>
                <button className="mt-4 text-xs border border-white/20 hover:border-orange-400 px-4 py-1.5 rounded-full transition text-white/60 hover:text-white w-full">
                  View Profile
                </button>
              </div>
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <p className="text-lg">No creatives found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}

      </div>
    </div>
  )
}