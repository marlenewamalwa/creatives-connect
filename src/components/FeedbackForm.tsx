import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/useAuth'

const types = ['Bug', 'Suggestion', 'Compliment', 'Other']

export default function FeedbackForm() {
  const { user } = useAuth()
  const [form, setForm] = useState({ type: 'Suggestion', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.message.trim()) return
    setLoading(true)
    setError('')

    const { error } = await supabase.from('feedback').insert({
      user_id: user?.id ?? null,
      type: form.type,
      message: form.message,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setForm({ type: 'Suggestion', message: '' })
    }

    setLoading(false)
  }

  if (success) return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
      <p className="text-2xl mb-2">🙏</p>
      <p className="font-semibold">Thanks for the feedback!</p>
      <p className="text-sm text-white/40 mt-1">We read every single one.</p>
      <button
        onClick={() => setSuccess(false)}
        className="mt-4 text-xs text-orange-400 hover:underline"
      >
        Submit another
      </button>
    </div>
  )

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
      <h3 className="text-lg font-bold mb-1">Share your feedback</h3>
      <p className="text-sm text-white/40 mb-6">Help us make CreativesConnect better for everyone.</p>

      <div className="flex flex-col gap-4">
        {/* Type selector */}
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setForm((prev) => ({ ...prev, type: t }))}
              className={`text-xs px-4 py-2 rounded-full border transition ${
                form.type === t
                  ? 'bg-orange-400 border-orange-400 text-black font-bold'
                  : 'border-white/10 text-white/50 hover:border-orange-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Message */}
        <textarea
          value={form.message}
          onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
          rows={4}
          placeholder="What's on your mind?"
          className="w-full bg-white/5 border border-white/10 focus:border-orange-400 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 transition resize-none"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !form.message.trim()}
          className="bg-orange-400 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition"
        >
          {loading ? 'Sending...' : 'Send Feedback'}
        </button>
      </div>
    </div>
  )
}