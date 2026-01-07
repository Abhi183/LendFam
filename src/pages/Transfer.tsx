import { useEffect, useState } from 'react'
import { Container } from '../components/Container'
import { useAuth } from '../state/AuthContext'
import { listFriends } from '../store/friends'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { recordTransaction } from '../store/transactions'
import { Toast, ToastState } from '../components/Toast'
import { ArrowLeftRight } from 'lucide-react'
import { fmtUSD } from '../utils/money'

type MiniUser = { uid: string; displayName: string; photoURL?: string; email: string }

async function getUserMini(uid: string): Promise<MiniUser | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  const d = snap.data() as any
  return { uid, displayName: d.displayName, photoURL: d.photoURL, email: d.email }
}

export default function Transfer() {
  const { user } = useAuth()
  const [friends, setFriends] = useState<MiniUser[]>([])
  const [toUid, setToUid] = useState('')
  const [amount, setAmount] = useState('25')
  const [interestRate, setInterestRate] = useState('0')
  const [note, setNote] = useState('')
  const [mode, setMode] = useState<'sent' | 'received'>('sent')
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
      // If "sent": I lent to them. If "received": they lent to me.
      const fromUid = mode === 'sent' ? user.uid : toUid
      const to = mode === 'sent' ? toUid : user.uid
      await recordTransaction({
        fromUid,
        toUid: to,
        amount: a,
        interestRate: r,
        note: note.trim(),
        status: mode === 'sent' ? 'sent' : 'received',
      })
      setNote('')
      setToast({ open: true, title: 'Recorded', message: `${mode === 'sent' ? 'Sent' : 'Received'} ${fmtUSD(a)} at ${r}%`, kind: 'ok' })
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
            <div className="text-sm text-slate-400">Record lending activity (MVP ledger).</div>
          </div>

          <div className="mt-6 grid lg:grid-cols-3 gap-4">
            <div className="card lg:col-span-2">
              <div className="font-semibold">New record</div>

              <div className="mt-4 grid gap-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400">Mode</label>
                    <select className="input mt-1" value={mode} onChange={(e) => setMode(e.target.value as any)}>
                      <option value="sent">I sent (I lent money)</option>
                      <option value="received">I received (I borrowed money)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Friend</label>
                    <select className="input mt-1" value={toUid} onChange={(e) => setToUid(e.target.value)}>
                      {friends.length === 0 ? <option value="">No friends</option> : friends.map((f) => (
                        <option key={f.uid} value={f.uid}>{f.displayName} ({f.email})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-400">Amount (USD)</label>
                    <input className="input mt-1" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Interest %</label>
                    <input className="input mt-1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Note</label>
                    <input className="input mt-1" value={note} onChange={(e) => setNote(e.target.value)} placeholder="optional" />
                  </div>
                </div>

                <button className="btn-primary" onClick={submit} disabled={friends.length === 0}>
                  Record
                </button>

                <div className="text-xs text-slate-500">
                  Next step: show transaction history + repayment schedule.
                </div>
              </div>
            </div>

            <div className="card">
              <div className="font-semibold">What this means</div>
              <div className="mt-3 text-sm text-slate-300">
                LendFam is a <span className="text-emerald-200">social ledger + lending intent feed</span>.
                The MVP tracks agreements and transparency. Real money movement comes after integrating payment rails.
              </div>
              <div className="mt-4 text-sm text-slate-400">
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
      </Container>

      <Toast state={toast} onClose={() => setToast((s) => ({ ...s, open: false }))} />
    </div>
  )
}
