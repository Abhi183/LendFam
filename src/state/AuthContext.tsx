import React, { createContext, useContext, useMemo, useState } from 'react'
import { demoPasswords, demoUsers } from '../store/demoData'

type AuthUser = {
  uid: string
  displayName?: string
  email?: string
  photoURL?: string
}

type AuthCtx = {
  user: AuthUser | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signOutNow: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)
const SESSION_KEY = 'lendfam-session'

function getUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase()
  return Object.values(demoUsers).find((u) => u.email.toLowerCase() === normalized) ?? null
}

function getUserByUid(uid: string) {
  return demoUsers[uid] ?? null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null
    const uid = window.localStorage.getItem(SESSION_KEY)
    if (!uid) return null
    const existing = getUserByUid(uid)
    return existing
      ? { uid: existing.uid, displayName: existing.displayName, email: existing.email, photoURL: existing.photoURL }
      : null
  })
  const [loading] = useState(false)

  const value = useMemo<AuthCtx>(() => ({
    user,
    loading,
    signInWithEmail: async (email: string, password: string) => {
      const account = getUserByEmail(email)
      if (!account) throw new Error('Account not found.')
      const expected = demoPasswords[account.uid]
      if (expected && expected !== password) throw new Error('Incorrect password.')
      setUser({
        uid: account.uid,
        displayName: account.displayName,
        email: account.email,
        photoURL: account.photoURL,
      })
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(SESSION_KEY, account.uid)
      }
    },
    signOutNow: async () => {
      setUser(null)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(SESSION_KEY)
      }
    },
  }), [user])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth must be used within AuthProvider')
  return v
}
