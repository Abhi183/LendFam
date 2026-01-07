import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/Container'
import { useAuth } from '../state/AuthContext'
import { listFriends } from '../store/friends'
import { fmtUSD } from '../utils/money'
import { Users, ArrowLeftRight, TrendingUp, Bell, Sparkles } from 'lucide-react'
import { getLatestPostsForAuthors } from '../store/posts'
import { LayoutGrid, Newspaper, Users, ArrowLeftRight, TrendingUp, Bell } from 'lucide-react'
import { listNotifications } from '../store/notifications'

export default function Dashboard() {
  const { user } = useAuth()
  const [friendUids, setFriendUids] = useState<string[]>([])
  const [feed, setFeed] = useState<any[]>([])
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
        <div className="py-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-slate-600 text-sm">Welcome back</div>
              <h1 className="text-3xl font-semibold tracking-tight">{user?.displayName ?? 'Student'}</h1>
              <div className="mt-2 text-sm text-slate-700">Your lending network, at a glance.</div>
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
              <div className="mt-2 text-3xl font-semibold">{friendUids.length}</div>
              <div className="text-sm text-slate-600">Your core trust circle.</div>
            </div>
            <div className="card">
              <div className="badge"><TrendingUp size={14} /> Trust score</div>
              <div className="mt-2 text-3xl font-semibold">{stats.trustScore}</div>
              <div className="text-sm text-slate-600">Based on network size and engagement.</div>
            </div>
            <div className="card">
              <div className="badge"><ArrowLeftRight size={14} /> Outstanding</div>
              <div className="mt-2 text-3xl font-semibold">{fmtUSD(stats.outstanding)}</div>
              <div className="text-sm text-slate-600">Tracks what is owed and due back.</div>
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
                {feed.length === 0 ? (
                  <div className="text-sm text-slate-700">No posts yet. Create one in the Feed.</div>
                ) : (
                  feed.map((p) => (
                    <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <img src={p.authorPhoto ?? ''} className="h-7 w-7 rounded-xl object-cover" />
                            <div className="text-sm font-medium truncate">{p.authorName}</div>
                            <span className="badge">{p.type === 'loan_request' ? 'Request' : 'Offer'}</span>
                          </div>
                          <div className="mt-2 font-semibold">
                            {p.type === 'loan_request' ? 'Needs' : 'Offers'} {fmtUSD(Number(p.amount))}
                          </div>
                          <div className="text-sm text-slate-700 mt-1">
                            {Number(p.durationDays)} days • {Number(p.interestRate)}% interest • {p.visibility}
                          </div>
                        </div>
                        <div className="text-xs text-slate-600 whitespace-nowrap">
                          {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleString() : ''}
                        </div>
                      </div>
                      {p.message ? <div className="mt-2 text-sm text-slate-700">{p.message}</div> : null}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="card">
                <div className="font-semibold flex items-center gap-2"><Bell size={18} /> Notifications</div>
                <div className="mt-4 space-y-3">
                  {notifications.length === 0 ? (
                    <div className="text-sm text-slate-700">No new updates yet.</div>
                  ) : notifications.map((n) => (
                    <div key={n.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-slate-600">{n.message}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="font-semibold">Quick actions</div>
                <div className="mt-4 grid gap-3">
                  <Link to="/transfer" className="btn-primary"><ArrowLeftRight size={16} /> Record send/receive</Link>
                  <Link to="/network" className="btn-ghost"><Users size={16} /> Grow network</Link>
                  <Link to="/profile" className="btn-ghost"><span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-glow" /> Polish your profile</Link>
                </div>

                <div className="mt-6 text-sm text-slate-600">
                  Tip: The more mutual connections, the safer lending feels.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
