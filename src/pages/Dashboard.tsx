import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/Container'
import { useAuth } from '../state/AuthContext'
import { listFriends } from '../store/friends'
import { fmtUSD } from '../utils/money'
import { getLatestPostsForAuthors } from '../store/posts'
import { LayoutGrid, Newspaper, Users, ArrowLeftRight, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [friendUids, setFriendUids] = useState<string[]>([])
  const [feed, setFeed] = useState<any[]>([])

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
      const authors = [user.uid, ...friendUids]
      const posts = await getLatestPostsForAuthors(authors, 6)
      setFeed(posts)
    })()
  }, [user, friendUids])

  const stats = useMemo(() => {
    // MVP: placeholder totals (you can compute from transactions later)
    const outstanding = 0
    const trustScore = Math.min(92, 65 + friendUids.length * 3)
    return { outstanding, trustScore }
  }, [friendUids.length])

  return (
    <div className="min-h-[calc(100vh-64px)] bg-grid">
      <Container>
        <div className="py-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-slate-400 text-sm">Welcome back</div>
              <h1 className="text-3xl font-semibold tracking-tight">{user?.displayName ?? 'Student'}</h1>
              <div className="mt-2 text-sm text-slate-300">Your lending network, at a glance.</div>
            </div>
            <Link to="/feed" className="btn-primary">
              <Newspaper size={16} /> Open Feed
            </Link>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="card">
              <div className="badge"><Users size={14} /> Friends</div>
              <div className="mt-2 text-3xl font-semibold">{friendUids.length}</div>
              <div className="text-sm text-slate-400">Your core trust circle.</div>
            </div>
            <div className="card">
              <div className="badge"><TrendingUp size={14} /> Trust score</div>
              <div className="mt-2 text-3xl font-semibold">{stats.trustScore}</div>
              <div className="text-sm text-slate-400">Based on network size (MVP).</div>
            </div>
            <div className="card">
              <div className="badge"><ArrowLeftRight size={14} /> Outstanding</div>
              <div className="mt-2 text-3xl font-semibold">{fmtUSD(stats.outstanding)}</div>
              <div className="text-sm text-slate-400">Hook this to real transactions.</div>
            </div>
          </div>

          <div className="mt-8 grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 card">
              <div className="flex items-center justify-between">
                <div className="font-semibold flex items-center gap-2"><LayoutGrid size={18} /> Latest in your circle</div>
                <Link to="/feed" className="text-sm text-emerald-300 hover:text-emerald-200">See all</Link>
              </div>

              <div className="mt-4 space-y-3">
                {feed.length === 0 ? (
                  <div className="text-sm text-slate-400">No posts yet. Create one in the Feed.</div>
                ) : (
                  feed.map((p) => (
                    <div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
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
                          <div className="text-sm text-slate-300 mt-1">
                            {Number(p.durationDays)} days • {Number(p.interestRate)}% interest • {p.visibility}
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 whitespace-nowrap">
                          {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleString() : ''}
                        </div>
                      </div>
                      {p.message ? <div className="mt-2 text-sm text-slate-300">{p.message}</div> : null}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card">
              <div className="font-semibold">Quick actions</div>
              <div className="mt-4 grid gap-3">
                <Link to="/transfer" className="btn-primary"><ArrowLeftRight size={16} /> Record send/receive</Link>
                <Link to="/network" className="btn-ghost"><Users size={16} /> Grow network</Link>
                <Link to="/profile" className="btn-ghost"><span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-glow" /> Polish your profile</Link>
              </div>

              <div className="mt-6 text-sm text-slate-400">
                Tip: The more mutual connections, the safer lending feels.
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
