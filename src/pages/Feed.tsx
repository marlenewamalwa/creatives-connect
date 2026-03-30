import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Bookmark, Share2, MapPin, X, Image, Send } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/useAuth'
import Navbar from '../components/Navbar'

type Profile = {
  id: string
  name: string
  username: string
  avatar_url: string
  category?: string
  location?: string
}

type Post = {
  id: string
  user_id: string
  image_url: string
  caption: string
  tags: string[]
  likes_count: number
  comments_count: number
  created_at: string
  profiles: Profile
}

type Comment = {
  id: string
  text: string
  created_at: string
  user_id: string
  profiles: {
    name: string
    avatar_url: string
    username: string
  }
}

function PostCard({ post, currentUserId }: { post: Post; currentUserId: string | null }) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likes, setLikes] = useState(post.likes_count)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentInput, setCommentInput] = useState('')
  const [commentsCount, setCommentsCount] = useState(post.comments_count ?? 0)
  const [loadingComments, setLoadingComments] = useState(false)

  useEffect(() => {
    if (!currentUserId) return
    supabase
      .from('likes')
      .select('*')
      .eq('post_id', post.id)
      .eq('user_id', currentUserId)
      .then(({ data }) => setLiked((data?.length ?? 0) > 0))
  }, [post.id, currentUserId])

  const fetchComments = async () => {
    setLoadingComments(true)
    const { data } = await supabase
      .from('comments')
      .select('id, text, created_at, user_id')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })

    if (!data || data.length === 0) {
      setComments([])
      setLoadingComments(false)
      return
    }

    const userIds = [...new Set(data.map((c) => c.user_id))]
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, username')
      .in('id', userIds)

    const profileMap = Object.fromEntries((profilesData ?? []).map((p) => [p.id, p]))
    const merged = data.map((c) => ({ ...c, profiles: profileMap[c.user_id] ?? null }))
    setComments(merged as Comment[])
    setLoadingComments(false)
  }

  const toggleComments = () => {
    if (!showComments) fetchComments()
    setShowComments(!showComments)
  }

  const toggleLike = async () => {
    if (!currentUserId) return
    if (liked) {
      await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', currentUserId)
      await supabase.from('posts').update({ likes_count: likes - 1 }).eq('id', post.id)
      setLikes(likes - 1)
    } else {
      await supabase.from('likes').insert({ post_id: post.id, user_id: currentUserId })
      await supabase.from('posts').update({ likes_count: likes + 1 }).eq('id', post.id)
      setLikes(likes + 1)
    }
    setLiked(!liked)
  }

  const submitComment = async () => {
    if (!commentInput.trim() || !currentUserId) return
    await supabase.from('comments').insert({
      post_id: post.id,
      user_id: currentUserId,
      text: commentInput.trim(),
    })
    await supabase.from('posts').update({ comments_count: commentsCount + 1 }).eq('id', post.id)
    setCommentsCount(commentsCount + 1)
    setCommentInput('')
    fetchComments()
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">

      {/* Post header */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={post.profiles?.avatar_url}
          alt={post.profiles?.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-sm">{post.profiles?.name}</p>
          <p className="text-xs text-orange-400">{post.profiles?.category}</p>
        </div>
        <span className="text-xs text-white/30 flex items-center gap-1">
          <MapPin size={10} /> {post.profiles?.location} · {timeAgo(post.created_at)}
        </span>
      </div>

      {/* Image */}
      {post.image_url && (
        <img src={post.image_url} alt="post" className="w-full aspect-square object-cover" />
      )}

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={toggleLike} className="flex items-center gap-1.5 text-sm transition">
              <Heart size={20} className={liked ? 'fill-orange-400 text-orange-400' : 'text-white/50 hover:text-white'} />
              <span className={liked ? 'text-orange-400' : 'text-white/50'}>{likes}</span>
            </button>
            <button onClick={toggleComments} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition">
              <MessageCircle size={20} className={showComments ? 'text-orange-400' : ''} />
              <span className={showComments ? 'text-orange-400' : ''}>{commentsCount}</span>
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
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs text-orange-400/70 hover:text-orange-400 cursor-pointer transition">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments section */}
        {showComments && (
          <div className="mt-4 border-t border-white/10 pt-4">
            {loadingComments && <p className="text-xs text-white/30 mb-3">Loading comments...</p>}

            <div className="flex flex-col gap-3 mb-4 max-h-60 overflow-y-auto">
              {comments.length === 0 && !loadingComments && (
                <p className="text-xs text-white/30">No comments yet. Be the first!</p>
              )}
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2">
                  <img
                    src={c.profiles?.avatar_url}
                    alt={c.profiles?.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <div className="bg-white/5 rounded-xl px-3 py-2 flex-1">
                    <p className="text-xs font-semibold text-orange-400">{c.profiles?.name}</p>
                    <p className="text-sm text-white/80 mt-0.5">{c.text}</p>
                  </div>
                  <span className="text-xs text-white/20 mt-1 shrink-0">{timeAgo(c.created_at)}</span>
                </div>
              ))}
            </div>

            {currentUserId && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                  className="flex-1 bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-3 py-2 text-sm placeholder:text-white/30 transition"
                />
                <button
                  onClick={submitComment}
                  disabled={!commentInput.trim()}
                  className="bg-orange-400 hover:bg-orange-500 disabled:opacity-30 text-black p-2 rounded-xl transition"
                >
                  <Send size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function CreatePostModal({ onClose, onPost, userId }: { onClose: () => void; onPost: () => void; userId: string }) {
  const [caption, setCaption] = useState('')
  const [tags, setTags] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async () => {
    if (!caption && !file) return
    setLoading(true)

    let image_url = ''
    if (file) {
      const ext = file.name.split('.').pop()
      const path = `${userId}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('posts').upload(path, file)
      if (uploadError) { setLoading(false); return }
      const { data } = supabase.storage.from('posts').getPublicUrl(path)
      image_url = data.publicUrl
    }

    const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean)

    await supabase.from('posts').insert({
      user_id: userId,
      caption,
      image_url,
      tags: tagArray,
      likes_count: 0,
      comments_count: 0,
    })

    setLoading(false)
    onPost()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg">New Post</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition"><X size={20} /></button>
        </div>

        <label className="block mb-4 cursor-pointer">
          {preview ? (
            <img src={preview} alt="preview" className="w-full aspect-square object-cover rounded-xl" />
          ) : (
            <div className="w-full aspect-square bg-white/5 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-orange-400/50 transition">
              <Image size={32} className="text-white/20" />
              <p className="text-sm text-white/30">Click to upload image</p>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>

        <textarea
          placeholder="Share what you've been working on..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition resize-none mb-3"
        />

        <input
          type="text"
          placeholder="Tags (comma separated e.g. Photography, Nairobi)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={loading || (!caption && !file)}
          className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}

export default function Feed() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  const fetchPosts = async () => {
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (!postsData || postsData.length === 0) {
      setLoading(false)
      return
    }

    const userIds = [...new Set(postsData.map((p) => p.user_id))]
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, name, username, category, location, avatar_url')
      .in('id', userIds)

    const profileMap = Object.fromEntries((profilesData ?? []).map((p) => [p.id, p]))
    const merged = postsData.map((post) => ({
      ...post,
      profiles: profileMap[post.user_id] ?? null,
    }))

    setPosts(merged as Post[])
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
    if (user) {
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        setProfile(data)
      })
    }
  }, [user])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar onPost={() => setShowCreate(true)} />

      <div className="max-w-5xl mx-auto px-6 py-10 flex gap-8">

        {/* Feed */}
        <div className="flex-1 max-w-xl mx-auto flex flex-col gap-6">
          {loading && (
            <div className="text-center py-20 text-white/30">Loading posts...</div>
          )}
          {!loading && posts.length === 0 && (
            <div className="text-center py-20 text-white/30">
              <p className="text-lg">No posts yet</p>
              <p className="text-sm mt-1">Be the first to post something!</p>
            </div>
          )}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={user?.id ?? null} />
          ))}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block w-72 shrink-0">
          {profile && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5 flex items-center gap-3">
              <img
                src={profile.avatar_url}
                alt="me"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-sm">{profile.name}</p>
                <p className="text-xs text-orange-400">{profile.category}</p>
                <p className="text-xs text-white/30 mt-0.5">📍 {profile.location}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreate && user && (
        <CreatePostModal
          userId={user.id}
          onClose={() => setShowCreate(false)}
          onPost={fetchPosts}
        />
      )}
    </div>
  )
}