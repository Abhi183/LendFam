import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'

export type FriendRequest = {
  fromUid: string
  fromEmail: string
  fromName: string
  toEmail: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: any
  updatedAt: any
}

export async function sendFriendRequest(from: { uid: string; email: string; name: string }, toEmail: string) {
  const now = Timestamp.now()
  const req: FriendRequest = {
    fromUid: from.uid,
    fromEmail: from.email,
    fromName: from.name,
    toEmail: toEmail.trim().toLowerCase(),
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  }
  await addDoc(collection(db, 'friendRequests'), req)
}

export async function listIncomingRequests(myEmail: string) {
  const q = query(
    collection(db, 'friendRequests'),
    where('toEmail', '==', myEmail.trim().toLowerCase()),
    where('status', '==', 'pending'),
  )
  const snaps = await getDocs(q)
  return snaps.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function acceptRequest(requestId: string, myUid: string) {
  const ref = doc(db, 'friendRequests', requestId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return
  const data = snap.data() as any
  const fromUid = data.fromUid as string

  // Add to both users' friends subcollections
  await setDoc(doc(db, 'users', myUid, 'friends', fromUid), { createdAt: Timestamp.now() })
  await setDoc(doc(db, 'users', fromUid, 'friends', myUid), { createdAt: Timestamp.now() })

  await updateDoc(ref, { status: 'accepted', updatedAt: Timestamp.now() })
}

export async function rejectRequest(requestId: string) {
  const ref = doc(db, 'friendRequests', requestId)
  await updateDoc(ref, { status: 'rejected', updatedAt: Timestamp.now() })
}

export async function listFriends(uid: string) {
  const snaps = await getDocs(collection(db, 'users', uid, 'friends'))
  return snaps.docs.map((d) => d.id)
}

export async function removeFriend(uid: string, friendUid: string) {
  await deleteDoc(doc(db, 'users', uid, 'friends', friendUid))
  await deleteDoc(doc(db, 'users', friendUid, 'friends', uid))
}
