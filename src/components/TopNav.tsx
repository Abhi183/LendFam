import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { Logo } from './Logo'
import { LayoutGrid, User2, Users, ArrowLeftRight, Newspaper, LogOut } from 'lucide-react'

const navLink = ({ isActive }: { isActive: boolean }) =>
  'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm border ' +
  (isActive ? 'bg-emerald-200 border-emerald-300 text-emerald-900' : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-800')

export function TopNav() {
  const { user, signOutNow } = useAuth()

  return (
    <header className="sticky top-0 z-20 border-b border-slate-300 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-3 flex items-center justify-between gap-3">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        {user ? (
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/app" className={navLink}><LayoutGrid size={16} /> Dashboard</NavLink>
            <NavLink to="/feed" className={navLink}><Newspaper size={16} /> Feed</NavLink>
            <NavLink to="/network" className={navLink}><Users size={16} /> Network</NavLink>
            <NavLink to="/transfer" className={navLink}><ArrowLeftRight size={16} /> Send/Receive</NavLink>
            <NavLink to="/profile" className={navLink}><User2 size={16} /> Profile</NavLink>
          </nav>
        ) : (
          <div className="text-sm text-slate-700 hidden md:block">Lend with trust. Borrow with clarity.</div>
        )}

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 bg-white border border-slate-300 rounded-2xl px-3 py-2">
                <img src={user.photoURL ?? ''} className="h-7 w-7 rounded-xl object-cover" />
                <div className="leading-tight">
                  <div className="text-sm font-medium">{user.displayName ?? 'Student'}</div>
                  <div className="text-xs text-slate-600">{user.email}</div>
                </div>
              </div>
              <button className="btn-ghost" onClick={() => signOutNow()}>
                <LogOut size={16} /> <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <a className="btn-primary" href="#get-started">Get started</a>
          )}
        </div>
      </div>
    </header>
  )
}
