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
import { demoFriendRequests, demoFriendsByUser, demoUsers, makeDemoTimestamp } from './demoData'
import { addNotification } from './notifications'

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
  if (!db) {
    const id = `demo-request-${Date.now()}`
    const now = makeDemoTimestamp()
    const recipient = Object.values(demoUsers).find(
      (u) => u.email.trim().toLowerCase() === toEmail.trim().toLowerCase(),
    )
    if (!recipient) {
      throw new Error('No user found with that email.')
    }
    demoFriendRequests.push({
      id,
      fromUid: from.uid,
      fromEmail: from.email,
      fromName: from.name,
      toEmail: toEmail.trim().toLowerCase(),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    })
    const recipientUid = recipient?.uid
    if (recipientUid) {
      await addNotification({
        toUid: recipientUid,
        title: 'New friend request',
        message: `${from.name} sent you a friend request.`,
        kind: 'friend_request',
      })
    }
    return
  }

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
  if (!db) {
    return demoFriendRequests.filter((req) => req.toEmail === myEmail.trim().toLowerCase() && req.status === 'pending')
  }

  const q = query(
    collection(db, 'friendRequests'),
    where('toEmail', '==', myEmail.trim().toLowerCase()),
    where('status', '==', 'pending'),
  )
  const snaps = await getDocs(q)
  return snaps.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function acceptRequest(requestId: string, myUid: string) {
  if (!db) {
    const req = demoFriendRequests.find((item) => item.id === requestId)
    if (!req) return
    req.status = 'accepted'
    req.updatedAt = makeDemoTimestamp()
    if (!demoFriendsByUser[myUid]) demoFriendsByUser[myUid] = new Set()
    if (!demoFriendsByUser[req.fromUid]) demoFriendsByUser[req.fromUid] = new Set()
    demoFriendsByUser[myUid].add(req.fromUid)
    demoFriendsByUser[req.fromUid].add(myUid)
    const myName = demoUsers[myUid]?.displayName ?? 'A friend'
    await addNotification({
      toUid: req.fromUid,
      title: 'Friend request accepted',
      message: `${myName} accepted your request.`,
      kind: 'friend_accept',
    })
    return
  }

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
  if (!db) {
    const req = demoFriendRequests.find((item) => item.id === requestId)
    if (!req) return
    req.status = 'rejected'
    req.updatedAt = makeDemoTimestamp()
    return
  }

  const ref = doc(db, 'friendRequests', requestId)
  await updateDoc(ref, { status: 'rejected', updatedAt: Timestamp.now() })
}

export async function listFriends(uid: string) {
  if (!db) {
    return Array.from(demoFriendsByUser[uid] ?? [])
  }

  const snaps = await getDocs(collection(db, 'users', uid, 'friends'))
  return snaps.docs.map((d) => d.id)
}

export async function removeFriend(uid: string, friendUid: string) {
  if (!db) {
    demoFriendsByUser[uid]?.delete(friendUid)
    demoFriendsByUser[friendUid]?.delete(uid)
    return
  }

  await deleteDoc(doc(db, 'users', uid, 'friends', friendUid))
  await deleteDoc(doc(db, 'users', friendUid, 'friends', uid))
}
