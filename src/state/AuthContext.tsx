import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { ensureUserDoc } from '../store/users'

type AuthCtx = {
  user: User | null
  loading: boolean
  signInGoogle: () => Promise<void>
  signOutNow: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      setLoading(false)
      if (u) await ensureUserDoc(u)
    })
    return () => unsub()
  }, [])

  const value = useMemo<AuthCtx>(() => ({
    user,
    loading,
    signInGoogle: async () => {
      await signInWithPopup(auth, googleProvider)
    },
    signOutNow: async () => {
      await signOut(auth)
    }
  }), [user, loading])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth must be used within AuthProvider')
  return v
}
