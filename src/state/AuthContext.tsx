import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured, missingFirebaseEnv } from '../firebase'
import { ensureUserDoc } from '../store/users'

type AuthCtx = {
  user: User | null
  loading: boolean
  signInGoogle: () => Promise<void>
  signOutNow: () => Promise<void>
  configReady: boolean
  missingConfig: string[]
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const configReady = isFirebaseConfigured && !!auth && !!googleProvider

  useEffect(() => {
    if (!configReady || !auth) {
      setUser(null)
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      setLoading(false)
      if (u) await ensureUserDoc(u)
    })
    return () => unsub()
  }, [configReady])

  const value = useMemo<AuthCtx>(() => ({
    user,
    loading,
    signInGoogle: async () => {
      if (!configReady || !auth || !googleProvider) {
        console.warn('Firebase is not configured. Set VITE_FIREBASE_* environment variables to enable auth.')
        return
      }
      await signInWithPopup(auth, googleProvider)
    },
    signOutNow: async () => {
      if (!configReady || !auth) return
      await signOut(auth)
    },
    configReady,
    missingConfig: missingFirebaseEnv,
  }), [user, loading, configReady])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth must be used within AuthProvider')
  return v
}
