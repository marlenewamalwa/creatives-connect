import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)

      // Auto-create profile for Google users
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single()

        if (!existing) {
          const meta = session.user.user_metadata
          const name = meta.full_name ?? meta.name ?? 'Creative'
          const username = (meta.email ?? session.user.email ?? '')
            .split('@')[0]
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')

          await supabase.from('profiles').insert({
            id: session.user.id,
            name,
            username,
            avatar_url: meta.avatar_url ?? meta.picture ?? '',
            category: '',
            bio: '',
            location: '',
            available: true,
          })
        }
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return { user, loading }
}