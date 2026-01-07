import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../state/AuthContext'
import { Container } from '../components/Container'
import { updateMyProfile } from '../store/users'
import { Toast, ToastState } from '../components/Toast'
import { User2 } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const [bio, setBio] = useState('')
  const [school, setSchool] = useState('')
  const [country, setCountry] = useState('')
  const [toast, setToast] = useState<ToastState>({ open: false, title: '' })

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const snap = await getDoc(doc(db, 'users', user.uid))
      if (!snap.exists()) return
      const d = snap.data() as any
      setBio(d.bio ?? '')
      setSchool(d.school ?? '')
      setCountry(d.country ?? '')
    })()
  }, [user])

  async function save() {
    if (!user) return
    try {
      await updateMyProfile(user.uid, { bio, school, country })
      setToast({ open: true, title: 'Profile updated', kind: 'ok' })
    } catch (e: any) {
      setToast({ open: true, title: 'Could not save', message: e?.message, kind: 'err' })
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-grid">
      <Container>
        <div className="py-10">
          <div className="flex items-center gap-3">
            <div className="badge"><User2 size={14} /> Profile</div>
            <div className="text-sm text-slate-400">Make your profile trustworthy and aesthetic.</div>
          </div>

          <div className="mt-6 grid lg:grid-cols-3 gap-4">
            <div className="card lg:col-span-1">
              <div className="flex items-center gap-3">
                <img src={user?.photoURL ?? ''} className="h-14 w-14 rounded-2xl object-cover" />
                <div>
                  <div className="text-lg font-semibold">{user?.displayName ?? 'Student'}</div>
                  <div className="text-sm text-slate-400">{user?.email}</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-300">
                People lend faster when you look real: add a clear bio and school.
              </div>
            </div>

            <div className="card lg:col-span-2">
              <div className="font-semibold">Edit details</div>
              <div className="mt-4 grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">School / University</label>
                  <input className="input mt-1" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="e.g., Denison University" />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Country</label>
                  <input className="input mt-1" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g., Nepal" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-400">Bio</label>
                  <textarea className="input mt-1 min-h-[110px]" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="What are you studying? Why do you use LendFam?" />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button className="btn-primary" onClick={save}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Toast state={toast} onClose={() => setToast((s) => ({ ...s, open: false }))} />
    </div>
  )
}
