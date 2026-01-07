import { useEffect, useMemo, useState } from 'react'
import { Container } from '../components/Container'
import { useAuth } from '../state/AuthContext'
import { createPost, getLatestPostsForAuthors } from '../store/posts'
import { listFriends } from '../store/friends'
import { Toast, ToastState } from '../components/Toast'
import { calcTotalWithInterest, fmtUSD } from '../utils/money'
import { Newspaper, PlusCircle } from 'lucide-react'
import { addNotification } from '../store/notifications'

export default function Feed() {
  const { user } = useAuth()
  const [toast, setToast] = useState<ToastState>({ open: false, title: '' })

  const [type, setType] = useState<'loan_request' | 'loan_offer'>('loan_request')
  const [amount, setAmount] = useState('100')
  const [interestRate, setInterestRate] = useState('5')
  const [durationDays, setDurationDays] = useState('14')
  const [visibility, setVisibility] = useState<'friends' | 'fof' | 'public'>('friends')
  const [message, setMessage] = useState('')

  const [friendUids, setFriendUids] = useState<string[]>([])
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const f = await listFriends(user.uid)
      setFriendUids(f)
    })()
  }, [user])

  const authors = useMemo(() => {
    return user ? [user.uid, ...friendUids] : []
  }, [user, friendUids])

  async function refresh() {
    if (!user) return
    const p = await getLatestPostsForAuthors(authors, 50)
    setPosts(p)
  }

  useEffect(() => { refresh() }, [authors.join('|')])

  async function publish() {
    if (!user) return
    const a = Number(amount)
    const r = Number(interestRate)
    const d = Number(durationDays)
    if (!(a > 0) || !(r >= 0) || !(d > 0)) {
      setToast({ open: true, title: 'Check your numbers', message: 'Amount and days must be positive.', kind: 'err' })
      return
    }
    try {
      await createPost({
        authorUid: user.uid,
        authorName: user.displayName ?? 'Student',
        authorPhoto: user.photoURL ?? '',
        type,
        amount: a,
        interestRate: r,
        durationDays: d,
        message: message.trim(),
        visibility,
      })
      const friends = await listFriends(user.uid)
      await Promise.all(friends.map((uid) => addNotification({
        toUid: uid,
        title: type === 'loan_request' ? 'New loan request' : 'New loan offer',
        message: `${user.displayName ?? 'A friend'} posted ${type === 'loan_request' ? 'a request' : 'an offer'} for ${fmtUSD(a)}.`,
        kind: 'post',
      })))
      setMessage('')
      setToast({ open: true, title: 'Posted', message: 'Your network can now respond.', kind: 'ok' })
      await refresh()
    } catch (e: any) {
      setToast({ open: true, title: 'Could not post', message: e?.message, kind: 'err' })
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-grid">
      <Container>
        <div className="py-10">
          <div className="flex items-center gap-3">
            <div className="badge"><Newspaper size={14} /> Feed</div>
            <div className="text-sm text-slate-700">Post a request or offer — include interest and duration.</div>
          </div>

          <div className="mt-6 grid lg:grid-cols-3 gap-4">
            <div className="card lg:col-span-1">
              <div className="font-semibold flex items-center gap-2"><PlusCircle size={18} /> Create post</div>

              <div className="mt-4 grid gap-3">
                <div>
                  <label className="text-xs text-slate-600">Type</label>
                  <select className="input mt-1" value={type} onChange={(e) => setType(e.target.value as any)}>
                    <option value="loan_request">Loan request</option>
                    <option value="loan_offer">Loan offer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-600">Amount (USD)</label>
                  <input className="input mt-1" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-600">Interest %</label>
                    <input className="input mt-1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600">Days</label>
                    <input className="input mt-1" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600">Visibility</label>
                  <select className="input mt-1" value={visibility} onChange={(e) => setVisibility(e.target.value as any)}>
                    <option value="friends">Friends</option>
                    <option value="fof">Friends-of-friends</option>
                    <option value="public">Public</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-600">Message</label>
                  <textarea className="input mt-1 min-h-[120px]" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Why do you need it / terms you prefer / repayment date…" />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                  Estimated total repayment: <span className="font-semibold">{fmtUSD(calcTotalWithInterest(Number(amount), Number(interestRate)))}</span>
                </div>

                <button className="btn-primary" onClick={publish}>Publish</button>
              </div>
            </div>

            <div className="card lg:col-span-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Your circle</div>
                <button className="btn-ghost" onClick={refresh}>Refresh</button>
              </div>

              <div className="mt-4 space-y-3">
                {posts.length === 0 ? (
                  <div className="text-sm text-slate-700">No posts. Create the first one.</div>
                ) : posts.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <img src={p.authorPhoto ?? ''} className="h-7 w-7 rounded-xl object-cover" />
                          <div className="text-sm font-medium truncate">{p.authorName}</div>
                          <span className="badge">{p.type === 'loan_request' ? 'Request' : 'Offer'}</span>
                          <span className="badge">{p.visibility}</span>
                        </div>
                        <div className="mt-2 text-lg font-semibold">
                          {p.type === 'loan_request' ? 'Needs' : 'Offers'} {fmtUSD(Number(p.amount))}
                        </div>
                        <div className="text-sm text-slate-700 mt-1">
                          {Number(p.durationDays)} days • {Number(p.interestRate)}% interest • Total payback {fmtUSD(calcTotalWithInterest(Number(p.amount), Number(p.interestRate)))}
                        </div>
                      </div>
                      <div className="text-xs text-slate-600 whitespace-nowrap">
                        {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleString() : ''}
                      </div>
                    </div>
                    {p.message ? <div className="mt-2 text-sm text-slate-700">{p.message}</div> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Toast state={toast} onClose={() => setToast((s) => ({ ...s, open: false }))} />
    </div>
  )
}
