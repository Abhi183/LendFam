import { Routes, Route } from 'react-router-dom'
import { TopNav } from './components/TopNav'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Network from './pages/Network'
import Feed from './pages/Feed'
import Transfer from './pages/Transfer'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './state/AuthContext'

export default function App() {
  const { configReady, missingConfig } = useAuth()

  return (
    <div className="min-h-screen">
      <TopNav />
      {!configReady && (
        <div className="border-b border-amber-400/40 bg-amber-500/10 text-amber-100">
          <div className="mx-auto max-w-6xl px-4 md:px-6 py-3 text-sm">
            <div className="font-semibold">Firebase is not configured.</div>
            <div className="text-amber-100/80">
              Add the following environment variables in Cloudflare Pages to render auth-backed screens:{' '}
              <span className="font-medium">{missingConfig.join(', ') || 'VITE_FIREBASE_*'}</span>.
            </div>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/network"
          element={
            <ProtectedRoute>
              <Network />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfer"
          element={
            <ProtectedRoute>
              <Transfer />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Landing />} />
      </Routes>
    </div>
  )
}
