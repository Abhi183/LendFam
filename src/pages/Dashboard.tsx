import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/Container'
import { useAuth } from '../state/AuthContext'
import { listFriends } from '../store/friends'
import { fmtUSD } from '../utils/money'
import { Users, ArrowLeftRight, TrendingUp, Bell, Sparkles } from 'lucide-react'
import { listNotifications } from '../store/notifications'

export default function Dashboard() {
  const { user } = useAuth()
  const [friendUids, setFriendUids] = useState<string[]>([])
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const f = await listFriends(user.uid)
      setFriendUids(f)
    })()
  }, [user])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const notes = await listNotifications(user.uid, 6)
      setNotifications(notes)
    })()
  }, [user])

  const stats = useMemo(() => {
    const outstanding = 0
    const trustScore = Math.min(92, 65 + friendUids.length * 3)
    return { outstanding, trustScore }
  }, [friendUids.length])

  return (
    <div className="min-h-[calc(100vh-64px)] bg-grid">
      <Container>
        <div className="py-12">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-emerald-700">
                  <Sparkles size={16} /> Welcome back
                </div>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
                  {user?.displayName ?? 'Student'}
                </h1>
                <div className="mt-3 text-sm text-slate-700">
                  Your lending hub is clean and focused. Jump into actions or check your updates.
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/feed" className="btn-primary">Open Feed</Link>
                <Link to="/transfer" className="btn-ghost">Record a transfer</Link>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="card">
              <div className="badge"><Users size={14} /> Friends</div>
              <div className="mt-4 text-3xl font-semibold text-slate-900">{friendUids.length}</div>
              <div className="text-sm text-slate-700">Your trusted circle and mutual connections.</div>
            </div>
            <div className="card">
              <div className="badge"><TrendingUp size={14} /> Trust score</div>
              <div className="mt-4 text-3xl font-semibold text-slate-900">{stats.trustScore}</div>
              <div className="text-sm text-slate-700">Based on network strength and activity.</div>
            </div>
            <div className="card">
              <div className="badge"><ArrowLeftRight size={14} /> Outstanding</div>
              <div className="mt-4 text-3xl font-semibold text-slate-900">{fmtUSD(stats.outstanding)}</div>
              <div className="text-sm text-slate-700">What you are owed or need to repay.</div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 card">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-900">Recent activity</div>
                <Link to="/feed" className="text-sm text-emerald-700 hover:text-emerald-600">View feed</Link>
              </div>
              <div className="mt-4 space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-sm text-slate-700">No new updates yet.</div>
                ) : notifications.map((n) => (
                  <div key={n.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-sm font-medium text-slate-900">{n.title}</div>
                    <div className="text-xs text-slate-700">{n.message}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="font-semibold text-slate-900">Quick actions</div>
              <div className="mt-4 grid gap-3">
                <Link to="/network" className="btn-primary">Add a friend</Link>
                <Link to="/transfer" className="btn-ghost">Record send/receive</Link>
                <Link to="/profile" className="btn-ghost">Update profile</Link>
              </div>

              <div className="mt-6 text-sm text-slate-700">
                Tip: Stronger networks lead to faster approvals.
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
