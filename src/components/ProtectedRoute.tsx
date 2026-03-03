import { useAuth } from '../lib/useAuth'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <p className="text-white/30">Loading...</p>
    </div>
  )

  if (!user) return <Navigate to="/auth" replace />

  return <>{children}</>
}