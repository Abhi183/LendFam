import { User } from 'firebase/auth'
import { Timestamp, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { DemoUserProfile, demoUsers, makeDemoTimestamp } from './demoData'

export type UserProfile = {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  bio?: string
  school?: string
  country?: string
  createdAt: any
  updatedAt: any
}

export async function ensureUserDoc(u: User) {
  if (!db) {
    const existing = demoUsers[u.uid]
    const now = makeDemoTimestamp()
    if (!existing) {
      demoUsers[u.uid] = {
        uid: u.uid,
        displayName: u.displayName ?? 'Student',
        email: u.email ?? '',
        photoURL: u.photoURL ?? '',
        bio: 'New to LendFam ✨',
        school: '',
        country: '',
        createdAt: now,
        updatedAt: now,
      }
    } else {
      demoUsers[u.uid] = {
        ...existing,
        displayName: u.displayName ?? existing.displayName,
        email: u.email ?? existing.email,
        photoURL: u.photoURL ?? existing.photoURL,
        updatedAt: now,
      }
    }
    return
  }

  const ref = doc(db, 'users', u.uid)
  const snap = await getDoc(ref)
  const now = Timestamp.now()
  if (!snap.exists()) {
    const profile: UserProfile = {
      uid: u.uid,
      displayName: u.displayName ?? 'Student',
      email: u.email ?? '',
      photoURL: u.photoURL ?? '',
      bio: 'New to LendFam ✨',
      school: '',
      country: '',
      createdAt: now,
      updatedAt: now,
    }
    await setDoc(ref, profile)
  } else {
    await updateDoc(ref, {
      displayName: u.displayName ?? snap.data().displayName,
      photoURL: u.photoURL ?? snap.data().photoURL,
      email: u.email ?? snap.data().email,
      updatedAt: now,
    })
  }
}

export async function updateMyProfile(uid: string, patch: Partial<UserProfile>) {
  if (!db) {
    const existing = demoUsers[uid]
    if (!existing) return
    demoUsers[uid] = {
      ...existing,
      ...patch,
      updatedAt: makeDemoTimestamp(),
    } as DemoUserProfile
    return
  }

  const ref = doc(db, 'users', uid)
  await updateDoc(ref, { ...patch, updatedAt: Timestamp.now() })
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) {
    return demoUsers[uid] ?? null
  }

  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return snap.data() as UserProfile
}
