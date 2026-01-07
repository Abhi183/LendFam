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
  const { isDemo } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      {isDemo && (
        <div className="border-b border-emerald-200 bg-emerald-50 text-emerald-900">
          <div className="mx-auto max-w-6xl px-4 md:px-6 py-3 text-sm">
            <div className="font-semibold">Demo mode is on.</div>
            <div className="text-emerald-800/80">
              Sign in with the dummy Google button to explore sample data.
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
