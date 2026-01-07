import { User } from 'firebase/auth'
import { Timestamp, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

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
      updatedAt: now
    }
    await setDoc(ref, profile)
  } else {
    await updateDoc(ref, {
      displayName: u.displayName ?? snap.data().displayName,
      photoURL: u.photoURL ?? snap.data().photoURL,
      email: u.email ?? snap.data().email,
      updatedAt: now
    })
  }
}

export async function updateMyProfile(uid: string, patch: Partial<UserProfile>) {
  const ref = doc(db, 'users', uid)
  await updateDoc(ref, { ...patch, updatedAt: Timestamp.now() })
}
