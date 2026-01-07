import React, { createContext, useContext, useMemo, useState } from 'react'
import { demoAuthUser } from '../store/demoData'

type AuthUser = {
  uid: string
  displayName?: string
  email?: string
  photoURL?: string
}

type AuthCtx = {
  user: AuthUser | null
  loading: boolean
  signInGoogle: () => Promise<void>
  signOutNow: () => Promise<void>
  configReady: boolean
  missingConfig: string[]
  isDemo: boolean
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading] = useState(false)

  const value = useMemo<AuthCtx>(() => ({
    user,
    loading,
    signInGoogle: async () => {
      setUser({
        uid: demoAuthUser.uid,
        displayName: demoAuthUser.displayName,
        email: demoAuthUser.email,
        photoURL: demoAuthUser.photoURL,
      })
    },
    signOutNow: async () => {
      setUser(null)
    },
    configReady: true,
    missingConfig: [],
    isDemo: true,
  }), [user])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth must be used within AuthProvider')
  return v
}
