import { useState } from 'react'
import { MapPin, Clock, Briefcase, ChevronRight, Plus, Home, Compass, Bell } from 'lucide-react'

const allGigs = [
  {
    id: 1,
    title: 'Product Photographer Needed',
    company: 'Zuri Fashion',
    location: 'Nairobi',
    type: 'Freelance',
    category: 'Photography',
    budget: 'KES 15,000',
    deadline: '3 days left',
    description: 'Looking for a product photographer for our new clothing line launch. Must have experience with fashion photography and studio lighting.',
    tags: ['Fashion', 'Studio', 'Product'],
    logo: 'https://i.pravatar.cc/150?img=20',
    urgent: true,
  },
  {
    id: 2,
    title: 'Brand Identity Designer',
    company: 'Savanna Tech',
    location: 'Remote',
    type: 'Contract',
    category: 'Design',
    budget: 'KES 80,000',
    deadline: '1 week left',
    description: 'We need a talented brand identity designer to create a full visual identity for our fintech startup. Includes logo, colors, typography and brand guidelines.',
    tags: ['Branding', 'Logo', 'Fintech'],
    logo: 'https://i.pravatar.cc/150?img=30',
    urgent: false,
  },
  {
    id: 3,
    title: 'Music Producer for Short Film',
    company: 'Nairobi Film Collective',
    location: 'Nairobi',
    type: 'Freelance',
    category: 'Music',
    budget: 'KES 40,000',
    deadline: '5 days left',
    description: 'We are looking for a music producer to create an original score for our 20-minute short film. Experience with cinematic composition preferred.',
    tags: ['Film Score', 'Composition', 'Cinematic'],
    logo: 'https://i.pravatar.cc/150?img=40',
    urgent: true,
  },
  {
    id: 4,
    title: 'Social Media Content Creator',
    company: 'Java House Kenya',
    location: 'Nairobi',
    type: 'Part-time',
    category: 'Photography',
    budget: 'KES 30,000/mo',
    deadline: '2 weeks left',
    description: 'Java House is looking for a creative content creator to produce engaging photo and video content for our social media platforms.',
    tags: ['Social Media', 'Video', 'Food'],
    logo: 'https://i.pravatar.cc/150?img=50',
    urgent: false,
  },
  {
    id: 5,
    title: 'Illustrator for Children\'s Book',
    company: 'Elimu Publishers',
    location: 'Remote',
    type: 'Freelance',
    category: 'Illustration',
    budget: 'KES 60,000',
    deadline: '3 weeks left',
    description: 'We need a talented illustrator to bring our new children\'s book to life. The story is set in rural Kenya and celebrates African culture.',
    tags: ['Illustration', 'Children', 'Culture'],
    logo: 'https://i.pravatar.cc/150?img=60',
    urgent: false,
  },
  {
    id: 6,
    title: 'Videographer for Corporate Event',
    company: 'KCB Bank',
    location: 'Nairobi',
    type: 'One-off',
    category: 'Film',
    budget: 'KES 25,000',
    deadline: '4 days left',
    description: 'KCB Bank requires a professional videographer to cover our annual gala dinner. Must have experience with event videography and quick turnaround.',
    tags: ['Events', 'Corporate', 'Video'],
    logo: 'https://i.pravatar.cc/150?img=10',
    urgent: true,
  },
]

const categories = ['All', 'Photography', 'Design', 'Film', 'Music', 'Illustration', 'Writing', 'Fashion']
const types = ['All', 'Freelance', 'Contract', 'Part-time', 'One-off']

export default function Gigs() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeType, setActiveType] = useState('All')
  const [selected, setSelected] = useState(allGigs[0])

  const filtered = allGigs.filter((g) => {
    const matchCategory = activeCategory === 'All' || g.category === activeCategory
    const matchType = activeType === 'All' || g.type === activeType
    return matchCategory && matchType
  })

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
          <a href="/gigs" className="text-orange-400"><Briefcase size={20} /></a>
          <button className="hover:text-white transition relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full" />
          </button>
        </div>
        <button className="flex items-center gap-2 text-sm bg-orange-400 hover:bg-orange-500 text-black font-semibold px-4 py-2 rounded-full transition">
          <Plus size={16} /> Post a Gig
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2">Gigs Board</h1>
          <p className="text-white/40">Find creative opportunities across Kenya</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-6 mb-8">
          <div>
            <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Category</p>
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
            <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Type</p>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`text-xs px-4 py-2 rounded-full border transition ${
                    activeType === type
                      ? 'bg-orange-400 border-orange-400 text-black font-bold'
                      : 'border-white/10 text-white/50 hover:border-orange-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Split layout */}
        <div className="flex gap-6">

          {/* Gig list */}
          <div className="flex flex-col gap-3 w-full lg:w-2/5">
            {filtered.map((gig) => (
              <div
                key={gig.id}
                onClick={() => setSelected(gig)}
                className={`border rounded-2xl p-4 cursor-pointer transition ${
                  selected.id === gig.id
                    ? 'border-orange-400 bg-orange-400/5'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img src={gig.logo} alt={gig.company} className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate">{gig.title}</p>
                      {gig.urgent && (
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full shrink-0">Urgent</span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">{gig.company}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-white/30">
                      <span className="flex items-center gap-1"><MapPin size={10} />{gig.location}</span>
                      <span className="flex items-center gap-1"><Clock size={10} />{gig.deadline}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-white/20 shrink-0 mt-1" />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs border border-white/10 px-3 py-1 rounded-full text-white/40">{gig.type}</span>
                  <span className="text-sm font-bold text-orange-400">{gig.budget}</span>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-white/30">
                <p>No gigs found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Gig detail */}
          <div className="hidden lg:block flex-1 sticky top-28 self-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-6">
                <img src={selected.logo} alt={selected.company} className="w-14 h-14 rounded-2xl object-cover" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{selected.title}</h2>
                    {selected.urgent && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Urgent</span>
                    )}
                  </div>
                  <p className="text-orange-400 mt-1">{selected.company}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                    <span className="flex items-center gap-1"><MapPin size={12} />{selected.location}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{selected.deadline}</span>
                    <span className="flex items-center gap-1"><Briefcase size={12} />{selected.type}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mb-6">
                <p className="text-sm text-white/60 leading-relaxed">{selected.description}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {selected.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-white/50">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <div>
                  <p className="text-xs text-white/30">Budget</p>
                  <p className="text-2xl font-extrabold text-orange-400">{selected.budget}</p>
                </div>
                <button className="bg-orange-400 hover:bg-orange-500 text-black font-bold px-6 py-3 rounded-xl transition">
                  Apply Now
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}