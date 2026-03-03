import { useState, useEffect, useRef } from 'react'
import { Send, Search, Home, Compass, Briefcase, Bell, MessageCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/useAuth'
import Navbar from '../components/Navbar'

type Profile = {
  id: string
  name: string
  username: string
  avatar_url: string
  category: string
}

type Message = {
  id: string
  sender_id: string
  receiver_id: string
  text: string
  read: boolean
  created_at: string
}

type Conversation = {
  profile: Profile
  lastMessage: string
  time: string
  unread: number
}

export default function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  // Fetch all conversations
  const fetchConversations = async () => {
    if (!user) return

    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (!data) return

    // Get unique user ids we've chatted with
    const userIds = [...new Set(
      data.map((m) => m.sender_id === user.id ? m.receiver_id : m.sender_id)
    )]

    if (userIds.length === 0) { setLoading(false); return }

    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, name, username, avatar_url, category')
      .in('id', userIds)

    const convos: Conversation[] = (profilesData ?? []).map((p) => {
      const msgs = data.filter(
        (m) => m.sender_id === p.id || m.receiver_id === p.id
      )
      const last = msgs[0]
      const unread = msgs.filter((m) => m.sender_id === p.id && !m.read).length
      return {
        profile: p,
        lastMessage: last?.text ?? '',
        time: last ? timeAgo(last.created_at) : '',
        unread,
      }
    })

    setConversations(convos)
    if (convos.length > 0 && !activeProfile) {
      setActiveProfile(convos[0].profile)
    }
    setLoading(false)
  }

  // Fetch messages for active conversation
  const fetchMessages = async () => {
    if (!user || !activeProfile) return

    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${activeProfile.id}),and(sender_id.eq.${activeProfile.id},receiver_id.eq.${user.id})`
      )
      .order('created_at', { ascending: true })

    setMessages(data ?? [])

    // Mark messages as read
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', activeProfile.id)
      .eq('receiver_id', user.id)
      .eq('read', false)
  }

  useEffect(() => { fetchConversations() }, [user])
  useEffect(() => { fetchMessages() }, [activeProfile])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || !user || !activeProfile) return
    await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: activeProfile.id,
      text: input.trim(),
    })
    setInput('')
    fetchMessages()
    fetchConversations()
  }

  const filtered = conversations.filter((c) =>
    c.profile.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 73px)' }}>

        {/* Sidebar */}
        <div className="w-80 border-r border-white/10 flex flex-col shrink-0">
          <div className="p-4 border-b border-white/10">
            <h2 className="font-bold text-lg mb-3">Messages</h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl pl-8 pr-4 py-2 text-sm placeholder:text-white/30 transition"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && (
              <p className="text-center text-white/30 text-sm py-10">Loading...</p>
            )}
            {!loading && filtered.length === 0 && (
              <p className="text-center text-white/30 text-sm py-10">No conversations yet</p>
            )}
            {filtered.map((convo) => (
              <div
                key={convo.profile.id}
                onClick={() => setActiveProfile(convo.profile)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition border-b border-white/5 ${
                  activeProfile?.id === convo.profile.id
                    ? 'bg-orange-400/10 border-l-2 border-l-orange-400'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={convo.profile.avatar_url || `https://i.pravatar.cc/150?u=${convo.profile.id}`}
                    alt={convo.profile.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  {convo.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-400 text-black text-xs font-bold rounded-full flex items-center justify-center">
                      {convo.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm truncate">{convo.profile.name}</p>
                    <span className="text-xs text-white/30 shrink-0 ml-2">{convo.time}</span>
                  </div>
                  <p className="text-xs text-white/40 truncate mt-0.5">{convo.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        {activeProfile ? (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
              <img
                src={activeProfile.avatar_url || `https://i.pravatar.cc/150?u=${activeProfile.id}`}
                alt={activeProfile.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{activeProfile.name}</p>
                <p className="text-xs text-orange-400">{activeProfile.category}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender_id !== user?.id && (
                    <img
                      src={activeProfile.avatar_url || `https://i.pravatar.cc/150?u=${activeProfile.id}`}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover mr-2 mt-1 shrink-0"
                    />
                  )}
                  <div className={`max-w-xs lg:max-w-md flex flex-col gap-1 ${msg.sender_id === user?.id ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.sender_id === user?.id
                        ? 'bg-orange-400 text-black font-medium rounded-br-sm'
                        : 'bg-white/10 text-white rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-xs text-white/20">{timeAgo(msg.created_at)}</span>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="px-6 py-4 border-t border-white/10 flex items-center gap-3">
              <input
                type="text"
                placeholder={`Message ${activeProfile.name}...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="bg-orange-400 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-black p-3 rounded-xl transition"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/20">
            <div className="text-center">
              <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}