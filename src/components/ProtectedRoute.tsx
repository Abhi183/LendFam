import { Navigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-8 text-slate-600">Loading…</div>
  if (!user) return <Navigate to="/" replace />
  return children
}
