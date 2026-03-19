import { useState, useEffect } from 'react'
import { MapPin, Clock, Briefcase, ChevronRight, Plus, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/useAuth'
import Navbar from '../components/Navbar'

type Gig = {
  id: string
  user_id: string
  title: string
  company: string
  location: string
  type: string
  category: string
  budget: string
  description: string
  tags: string[]
  deadline: string
  urgent: boolean
  created_at: string
  profiles: {
    name: string
    avatar_url: string
    username: string
  }
}

const categories = ['All', 'Photography', 'Design', 'Film', 'Music', 'Illustration', 'Writing', 'Fashion']
const types = ['All', 'Freelance', 'Contract', 'Part-time', 'One-off']

function PostGigModal({ onClose, onPost, userId }: { onClose: () => void; onPost: () => void; userId: string }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Freelance',
    category: '',
    budget: '',
    description: '',
    tags: '',
    deadline: '',
    urgent: false,
  })

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    if (!form.title || !form.category || !form.description) return
    setLoading(true)
    await supabase.from('gigs').insert({
      user_id: userId,
      title: form.title,
      company: form.company,
      location: form.location,
      type: form.type,
      category: form.category,
      budget: form.budget,
      description: form.description,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      deadline: form.deadline,
      urgent: form.urgent,
    })
    setLoading(false)
    onPost()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg">Post a Gig</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition"><X size={20} /></button>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Gig title e.g. Brand Photographer Needed"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Company / Brand name"
              value={form.company}
              onChange={(e) => update('company', e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
            />
            <input
              type="text"
              placeholder="Location e.g. Nairobi / Remote"
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
            />
          </div>

          {/* Category */}
          <div>
            <p className="text-xs text-white/40 mb-2 uppercase tracking-widest">Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.filter((c) => c !== 'All').map((cat) => (
                <button
                  key={cat}
                  onClick={() => update('category', cat)}
                  className={`text-xs px-4 py-2 rounded-full border transition ${
                    form.category === cat
                      ? 'bg-orange-400 border-orange-400 text-black font-bold'
                      : 'border-white/10 text-white/50 hover:border-orange-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <p className="text-xs text-white/40 mb-2 uppercase tracking-widest">Type</p>
            <div className="flex flex-wrap gap-2">
              {types.filter((t) => t !== 'All').map((type) => (
                <button
                  key={type}
                  onClick={() => update('type', type)}
                  className={`text-xs px-4 py-2 rounded-full border transition ${
                    form.type === type
                      ? 'bg-orange-400 border-orange-400 text-black font-bold'
                      : 'border-white/10 text-white/50 hover:border-orange-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Budget e.g. KES 20,000"
              value={form.budget}
              onChange={(e) => update('budget', e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
            />
            <input
              type="text"
              placeholder="Deadline e.g. 3 days left"
              value={form.deadline}
              onChange={(e) => update('deadline', e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
            />
          </div>

          <textarea
            placeholder="Describe the gig in detail..."
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={4}
            className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition resize-none"
          />

          <input
            type="text"
            placeholder="Tags (comma separated e.g. Fashion, Studio, Nairobi)"
            value={form.tags}
            onChange={(e) => update('tags', e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
          />

          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <p className="text-sm text-white/70">Mark as urgent</p>
            <button
              onClick={() => update('urgent', !form.urgent)}
              className={`w-10 h-6 rounded-full transition relative ${form.urgent ? 'bg-orange-400' : 'bg-white/10'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.urgent ? 'left-5' : 'left-1'}`} />
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !form.title || !form.category || !form.description}
            className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition mt-2"
          >
            {loading ? 'Posting...' : 'Post Gig'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ApplyModal({ gig, onClose, userId }: { gig: Gig; onClose: () => void; userId: string }) {
  const [coverNote, setCoverNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleApply = async () => {
    setLoading(true)
    await supabase.from('gig_applications').insert({
      gig_id: gig.id,
      user_id: userId,
      cover_note: coverNote,
    })
    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg">Apply for Gig</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition"><X size={20} /></button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <p className="text-3xl mb-3">🎉</p>
            <p className="font-bold text-lg">Application sent!</p>
            <p className="text-white/40 text-sm mt-2">Good luck with your application for <span className="text-orange-400">{gig.title}</span></p>
            <button onClick={onClose} className="mt-6 bg-orange-400 hover:bg-orange-500 text-black font-bold px-6 py-3 rounded-xl transition">
              Done
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="font-semibold text-sm">{gig.title}</p>
              <p className="text-xs text-orange-400 mt-0.5">{gig.company}</p>
              <p className="text-xs text-white/40 mt-1">{gig.budget} · {gig.type}</p>
            </div>

            <textarea
              placeholder="Write a short cover note — why are you the right fit for this gig?"
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              rows={5}
              className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition resize-none"
            />

            <button
              onClick={handleApply}
              disabled={loading || !coverNote.trim()}
              className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition"
            >
              {loading ? 'Sending...' : 'Send Application'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Gigs() {
  const { user } = useAuth()
  const [gigs, setGigs] = useState<Gig[]>([])
  const [selected, setSelected] = useState<Gig | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeType, setActiveType] = useState('All')
  const [loading, setLoading] = useState(true)
  const [showPostGig, setShowPostGig] = useState(false)
  const [showApply, setShowApply] = useState(false)
  const [appliedGigs, setAppliedGigs] = useState<string[]>([])

  const fetchGigs = async () => {
    const { data: gigsData } = await supabase
      .from('gigs')
      .select('*')
      .order('created_at', { ascending: false })

    if (!gigsData || gigsData.length === 0) {
      setLoading(false)
      return
    }

    const userIds = [...new Set(gigsData.map((g) => g.user_id))]
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, username')
      .in('id', userIds)

    const profileMap = Object.fromEntries((profilesData ?? []).map((p) => [p.id, p]))
    const merged = gigsData.map((g) => ({ ...g, profiles: profileMap[g.user_id] ?? null }))
    setGigs(merged as Gig[])
    if (merged.length > 0) setSelected(merged[0] as Gig)
    setLoading(false)
  }

  const fetchApplications = async () => {
    if (!user) return
    const { data } = await supabase
      .from('gig_applications')
      .select('gig_id')
      .eq('user_id', user.id)
    setAppliedGigs((data ?? []).map((a) => a.gig_id))
  }

  useEffect(() => {
    fetchGigs()
    fetchApplications()
  }, [user])

  const filtered = gigs.filter((g) => {
    const matchCategory = activeCategory === 'All' || g.category === activeCategory
    const matchType = activeType === 'All' || g.type === activeType
    return matchCategory && matchType
  })

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hrs = Math.floor(diff / 3600000)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">Gigs Board</h1>
            <p className="text-white/40">Find creative opportunities across Kenya</p>
          </div>
          {user && (
            <button
              onClick={() => setShowPostGig(true)}
              className="flex items-center gap-2 text-sm bg-orange-400 hover:bg-orange-500 text-black font-bold px-5 py-3 rounded-full transition"
            >
              <Plus size={16} /> Post a Gig
            </button>
          )}
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

        {loading && <p className="text-center py-20 text-white/30">Loading gigs...</p>}

        {!loading && gigs.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <Briefcase size={40} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">No gigs posted yet</p>
            <p className="text-sm mt-1">Be the first to post a gig!</p>
          </div>
        )}

        {/* Split layout */}
        {!loading && gigs.length > 0 && (
          <div className="flex gap-6">

            {/* Gig list */}
            <div className="flex flex-col gap-3 w-full lg:w-2/5">
              {filtered.map((gig) => (
                <div
                  key={gig.id}
                  onClick={() => setSelected(gig)}
                  className={`border rounded-2xl p-4 cursor-pointer transition ${
                    selected?.id === gig.id
                      ? 'border-orange-400 bg-orange-400/5'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={gig.profiles?.avatar_url || `https://i.pravatar.cc/150?u=${gig.user_id}`}
                      alt={gig.company}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">{gig.title}</p>
                        {gig.urgent && (
                          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full shrink-0">Urgent</span>
                        )}
                      </div>
                      <p className="text-xs text-white/40 mt-0.5">{gig.company || gig.profiles?.name}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-white/30">
                        {gig.location && <span className="flex items-center gap-1"><MapPin size={10} />{gig.location}</span>}
                        <span className="flex items-center gap-1"><Clock size={10} />{timeAgo(gig.created_at)}</span>
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
            {selected && (
              <div className="hidden lg:block flex-1 sticky top-28 self-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <img
                      src={selected.profiles?.avatar_url || `https://i.pravatar.cc/150?u=${selected.user_id}`}
                      alt={selected.company}
                      className="w-14 h-14 rounded-2xl object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">{selected.title}</h2>
                        {selected.urgent && (
                          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Urgent</span>
                        )}
                      </div>
                      <p className="text-orange-400 mt-1">{selected.company || selected.profiles?.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                        {selected.location && <span className="flex items-center gap-1"><MapPin size={12} />{selected.location}</span>}
                        <span className="flex items-center gap-1"><Briefcase size={12} />{selected.type}</span>
                        <span className="flex items-center gap-1"><Clock size={12} />{timeAgo(selected.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 mb-6">
                    <p className="text-sm text-white/60 leading-relaxed">{selected.description}</p>
                  </div>

                  {selected.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selected.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-white/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-white/10 pt-6">
                    <div>
                      <p className="text-xs text-white/30">Budget</p>
                      <p className="text-2xl font-extrabold text-orange-400">{selected.budget}</p>
                    </div>
                    {user ? (
                      appliedGigs.includes(selected.id) ? (
                        <button disabled className="bg-white/10 text-white/40 font-bold px-6 py-3 rounded-xl cursor-not-allowed">
                          Applied ✓
                        </button>
                      ) : selected.user_id === user.id ? (
                        <button disabled className="bg-white/10 text-white/40 font-bold px-6 py-3 rounded-xl cursor-not-allowed">
                          Your Gig
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowApply(true)}
                          className="bg-orange-400 hover:bg-orange-500 text-black font-bold px-6 py-3 rounded-xl transition"
                        >
                          Apply Now
                        </button>
                      )
                    ) : (
                      <a href="/auth">
                        <button className="bg-orange-400 hover:bg-orange-500 text-black font-bold px-6 py-3 rounded-xl transition">
                          Log in to Apply
                        </button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showPostGig && user && (
        <PostGigModal
          userId={user.id}
          onClose={() => setShowPostGig(false)}
          onPost={() => { fetchGigs(); setShowPostGig(false) }}
        />
      )}

      {showApply && selected && user && (
        <ApplyModal
          gig={selected}
          userId={user.id}
          onClose={() => setShowApply(false)}
        />
      )}
    </div>
  )
}