import { useEffect, useState } from 'react'
import { Container } from '../components/Container'
import { useAuth } from '../state/AuthContext'
import { listFriends } from '../store/friends'
import { recordTransaction } from '../store/transactions'
import { Toast, ToastState } from '../components/Toast'
import { ArrowLeftRight, ShieldCheck } from 'lucide-react'
import { calcTotalWithInterest, fmtUSD } from '../utils/money'
import { getUserProfile } from '../store/users'

type MiniUser = { uid: string; displayName: string; photoURL?: string; email: string }

async function getUserMini(uid: string): Promise<MiniUser | null> {
  const profile = await getUserProfile(uid)
  if (!profile) return null
  return { uid, displayName: profile.displayName, photoURL: profile.photoURL, email: profile.email }
}

export default function Transfer() {
  const { user } = useAuth()
  const [friends, setFriends] = useState<MiniUser[]>([])
  const [toUid, setToUid] = useState('')
  const [amount, setAmount] = useState('25')
  const [interestRate, setInterestRate] = useState('0')
  const [note, setNote] = useState('')
  const [mode, setMode] = useState<'sent' | 'received' | 'request'>('sent')
  const [toast, setToast] = useState<ToastState>({ open: false, title: '' })

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const ids = await listFriends(user.uid)
      const minis = (await Promise.all(ids.map(getUserMini))).filter(Boolean) as MiniUser[]
      setFriends(minis)
      if (minis[0]) setToUid(minis[0].uid)
    })()
  }, [user])

  async function submit() {
    if (!user) return
    const a = Number(amount)
    const r = Number(interestRate)
    if (!(a > 0) || !(r >= 0)) {
      setToast({ open: true, title: 'Check your values', message: 'Amount must be positive.', kind: 'err' })
      return
    }
    if (!toUid) {
      setToast({ open: true, title: 'Pick a friend', message: 'Add friends first in Network.', kind: 'err' })
      return
    }
    try {
      const isLending = mode === 'sent'
      const isRequesting = mode === 'request'
      const fromUid = isLending ? user.uid : toUid
      const to = isLending ? toUid : user.uid
      await recordTransaction({
        fromUid,
        toUid: to,
        amount: a,
        interestRate: r,
        note: note.trim(),
        status: isRequesting ? 'proposed' : (isLending ? 'sent' : 'received'),
      })
      setNote('')
      const actionLabel = isRequesting ? 'Requested' : (isLending ? 'Sent' : 'Received')
      setToast({ open: true, title: isRequesting ? 'Request sent' : 'Recorded', message: `${actionLabel} ${fmtUSD(a)} at ${r}%`, kind: 'ok' })
    } catch (e: any) {
      setToast({ open: true, title: 'Could not record', message: e?.message, kind: 'err' })
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-grid">
      <Container>
        <div className="py-10">
          <div className="flex items-center gap-3">
            <div className="badge"><ArrowLeftRight size={14} /> Send / Receive</div>
            <div className="text-sm text-slate-700">Record lending activity with clear repayment totals.</div>
          </div>

          <div className="mt-6 grid lg:grid-cols-3 gap-4">
            <div className="card lg:col-span-2">
              <div className="font-semibold">New record</div>

              <div className="mt-4 grid gap-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-600">Mode</label>
                    <select className="input mt-1" value={mode} onChange={(e) => setMode(e.target.value as any)}>
                      <option value="sent">Send money (I lent to a friend)</option>
                      <option value="received">Record received (I borrowed money)</option>
                      <option value="request">Request money from a friend</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-600">Friend</label>
                    <select className="input mt-1" value={toUid} onChange={(e) => setToUid(e.target.value)}>
                      {friends.length === 0 ? <option value="">No friends</option> : friends.map((f) => (
                        <option key={f.uid} value={f.uid}>{f.displayName} ({f.email})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-600">Amount (USD)</label>
                    <input className="input mt-1" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600">Interest %</label>
                    <input className="input mt-1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600">Note</label>
                    <input className="input mt-1" value={note} onChange={(e) => setNote(e.target.value)} placeholder="optional" />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                  {mode === 'sent' ? 'You will receive' : 'You will owe'}{' '}
                  <span className="font-semibold">{fmtUSD(calcTotalWithInterest(Number(amount), Number(interestRate)))}</span>{' '}
                  total with interest.
                </div>

                <button className="btn-primary" onClick={submit} disabled={friends.length === 0}>
                  {mode === 'request' ? 'Send request' : 'Record'}
                </button>
              </div>
            </div>

            <div className="card space-y-4">
              <div>
                <div className="font-semibold">Pay with Zelle</div>
                <p className="mt-2 text-sm text-slate-700">
                  Payments will run through Zelle. This button launches payment rails when connected.
                </p>
                <button className="btn-ghost mt-3 w-full">
                  <ShieldCheck size={16} /> Launch Zelle
                </button>
              </div>

              <div>
                <div className="font-semibold">What this means</div>
                <div className="mt-3 text-sm text-slate-700">
                  LendFam is a <span className="text-emerald-700">social ledger + lending intent feed</span>.
                  The ledger tracks agreements and transparency until payment rails are connected.
                </div>
                <div className="mt-4 text-sm text-slate-700">
                  Recommended next:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Stripe/Dwolla integration</li>
                    <li>Repayment reminders</li>
                    <li>Risk + trust scoring</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Toast state={toast} onClose={() => setToast((s) => ({ ...s, open: false }))} />
    </div>
  )
}
