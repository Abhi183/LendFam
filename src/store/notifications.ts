import { demoNotifications, makeDemoTimestamp } from './demoData'
import { db } from '../firebase'
import { Timestamp, addDoc, collection, getDocs, orderBy, query, where } from 'firebase/firestore'

export type Notification = {
  id?: string
  toUid: string
  title: string
  message: string
  kind: 'friend_request' | 'friend_accept' | 'post' | 'transaction'
  createdAt: any
}

export async function addNotification(payload: Omit<Notification, 'createdAt'>) {
  if (!db) {
    demoNotifications.unshift({
      id: `demo-note-${Date.now()}`,
      ...payload,
      createdAt: makeDemoTimestamp(),
    })
    return
  }

  await addDoc(collection(db, 'notifications'), { ...payload, createdAt: Timestamp.now() })
}

export async function listNotifications(uid: string, max = 10) {
  if (!db) {
    return demoNotifications
      .filter((n) => n.toUid === uid)
      .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
      .slice(0, max)
  }

  const q = query(
    collection(db, 'notifications'),
    where('toUid', '==', uid),
    orderBy('createdAt', 'desc'),
  )
  const snaps = await getDocs(q)
  return snaps.docs.map((d) => ({ id: d.id, ...(d.data() as any) })).slice(0, max)
}
