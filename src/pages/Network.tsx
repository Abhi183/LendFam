import { useEffect, useMemo, useState } from 'react'
import { Container } from '../components/Container'
import { useAuth } from '../state/AuthContext'
import { acceptRequest, listFriends, listIncomingRequests, rejectRequest, removeFriend, sendFriendRequest } from '../store/friends'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { Toast, ToastState } from '../components/Toast'
import { Users, UserPlus, GitBranch, XCircle, CheckCircle2, Trash2 } from 'lucide-react'

type MiniUser = { uid: string; displayName: string; photoURL?: string; email: string; school?: string }

async function getUserMini(uid: string): Promise<MiniUser | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  const d = snap.data() as any
  return { uid, displayName: d.displayName, photoURL: d.photoURL, email: d.email, school: d.school }
}

export default function Network() {
  const { user } = useAuth()
  const [toEmail, setToEmail] = useState('')
  const [friends, setFriends] = useState<MiniUser[]>([])
  const [incoming, setIncoming] = useState<any[]>([])
  const [fof, setFof] = useState<MiniUser[]>([])
  const [toast, setToast] = useState<ToastState>({ open: false, title: '' })

  async function refresh() {
    if (!user?.email) return
    const friendIds = await listFriends(user.uid)
    const minis = (await Promise.all(friendIds.map(getUserMini))).filter(Boolean) as MiniUser[]
    setFriends(minis)

    const incomingReq = await listIncomingRequests(user.email)
    setIncoming(incomingReq)

    // friends-of-friends (2 hops)
    const fofIds = new Set<string>()
    for (const fid of friendIds) {
      const f2 = await listFriends(fid)
      for (const id of f2) {
        if (id !== user.uid && !friendIds.includes(id)) fofIds.add(id)
      }
    }
    const fofMinis = (await Promise.all([...fofIds].slice(0, 24).map(getUserMini))).filter(Boolean) as MiniUser[]
    setFof(fofMinis)
  }

  useEffect(() => { refresh() }, [user?.uid, user?.email])

  const myMeta = useMemo(() => ({
    uid: user?.uid ?? '',
    email: user?.email ?? '',
    name: user?.displayName ?? 'Student',
  }), [user?.uid, user?.email, user?.displayName])

  async function invite() {
    if (!user?.email) return
    try {
      await sendFriendRequest(myMeta, toEmail)
      setToEmail('')
      setToast({ open: true, title: 'Request sent', message: 'They will see it in their Network page.', kind: 'ok' })
    } catch (e: any) {
      setToast({ open: true, title: 'Could not send request', message: e?.message, kind: 'err' })
    }
  }

  async function accept(id: string) {
    if (!user) return
    await acceptRequest(id, user.uid)
    setToast({ open: true, title: 'Friend added', kind: 'ok' })
    await refresh()
  }

  async function reject(id: string) {
    await rejectRequest(id)
    setToast({ open: true, title: 'Request rejected', kind: 'ok' })
    await refresh()
  }

  async function remove(fid: string) {
    if (!user) return
    await removeFriend(user.uid, fid)
    setToast({ open: true, title: 'Friend removed', kind: 'ok' })
    await refresh()
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-grid">
      <Container>
        <div className="py-10">
          <div className="flex items-center gap-3">
            <div className="badge"><Users size={14} /> Network</div>
            <div className="text-sm text-slate-400">Add friends and discover friends-of-friends.</div>
          </div>

          <div className="mt-6 grid lg:grid-cols-3 gap-4">
            <div className="card">
              <div className="font-semibold flex items-center gap-2"><UserPlus size={18} /> Add a friend</div>
              <div className="mt-3 text-sm text-slate-300">Send a friend request by email.</div>
              <div className="mt-3 flex gap-2">
                <input className="input" value={toEmail} onChange={(e) => setToEmail(e.target.value)} placeholder="friend@university.edu" />
                <button className="btn-primary" onClick={invite} disabled={!toEmail.trim()}>Send</button>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                Tip: Use campus emails to keep lending within trusted circles.
              </div>
            </div>

            <div className="card lg:col-span-2">
              <div className="font-semibold">Incoming requests</div>
              <div className="mt-4 space-y-3">
                {incoming.length === 0 ? (
                  <div className="text-sm text-slate-400">No pending requests.</div>
                ) : (
                  incoming.map((r) => (
                    <div key={r.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{r.fromName}</div>
                        <div className="text-sm text-slate-400 truncate">{r.fromEmail}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="btn-primary" onClick={() => accept(r.id)}><CheckCircle2 size={16} /> Accept</button>
                        <button className="btn-ghost" onClick={() => reject(r.id)}><XCircle size={16} /> Reject</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid lg:grid-cols-2 gap-4">
            <div className="card">
              <div className="font-semibold">Your friends</div>
              <div className="mt-4 space-y-3">
                {friends.length === 0 ? (
                  <div className="text-sm text-slate-400">No friends yet. Add a friend to start lending.</div>
                ) : friends.map((f) => (
                  <div key={f.uid} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={f.photoURL ?? ''} className="h-10 w-10 rounded-2xl object-cover" />
                      <div className="min-w-0">
                        <div className="font-medium truncate">{f.displayName}</div>
                        <div className="text-sm text-slate-400 truncate">{f.email}{f.school ? ` • ${f.school}` : ''}</div>
                      </div>
                    </div>
                    <button className="btn-ghost" onClick={() => remove(f.uid)} title="Remove friend">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="font-semibold flex items-center gap-2"><GitBranch size={18} /> Friends-of-friends</div>
              <div className="mt-2 text-sm text-slate-400">People two hops away — safer than random.</div>

              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {fof.length === 0 ? (
                  <div className="text-sm text-slate-400">No friends-of-friends found yet.</div>
                ) : fof.map((p) => (
                  <div key={p.uid} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
                    <img src={p.photoURL ?? ''} className="h-10 w-10 rounded-2xl object-cover" />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{p.displayName}</div>
                      <div className="text-xs text-slate-400 truncate">{p.email}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-xs text-slate-500">
                MVP note: This discovery performs multiple reads and is limited to a small list.
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Toast state={toast} onClose={() => setToast((s) => ({ ...s, open: false }))} />
    </div>
  )
}
