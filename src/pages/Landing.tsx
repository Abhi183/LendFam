import { ArrowRight, ShieldCheck, Users, Percent, Sparkles, Lock } from 'lucide-react'
import { useAuth } from '../state/AuthContext'
import { Container } from '../components/Container'
import { useState } from 'react'

export default function Landing() {
  const { signInWithEmail } = useAuth()
  const [email, setEmail] = useState('avery@lendfam.app')
  const [password, setPassword] = useState('lendfam2024')
  const [error, setError] = useState('')

  async function handleSignIn() {
    setError('')
    try {
      await signInWithEmail(email, password)
    } catch (err: any) {
      setError(err?.message ?? 'Could not sign in.')
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-grid">
      <Container>
        <section className="py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="badge border-emerald-300 bg-emerald-100 text-emerald-900">
                <Sparkles size={14} /> A social lending network for students
              </div>
              <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
                Send money like Zelle — <span className="text-emerald-700">but built for lending</span>.
              </h1>
              <p className="mt-4 text-slate-700 leading-relaxed">
                LendFam lets students send/receive money inside a trusted social network.
                Borrow from friends or friends-of-friends with transparent interest rates and terms.
              </p>

              <div id="get-started" className="mt-6 flex flex-wrap gap-3">
                <button className="btn-primary" onClick={handleSignIn}>
                  Sign in <ArrowRight size={16} />
                </button>
                <button className="btn-ghost" type="button">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white border border-slate-300">
                    <svg viewBox="0 0 48 48" className="h-3 w-3" aria-hidden>
                      <path fill="#EA4335" d="M24 9.5c3.5 0 6.4 1.2 8.8 3.2l6.6-6.6C35.3 2.4 30 0 24 0 14.6 0 6.4 5.4 2.6 13.3l7.7 6C12.2 13.4 17.6 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.1 24.5c0-1.7-.2-3.4-.6-5H24v9.5h12.3c-.5 2.7-2 5-4.3 6.6l7 5.4c4.1-3.8 6.5-9.4 6.5-16.5z"/>
                      <path fill="#FBBC05" d="M10.3 28.3c-.5-1.4-.8-2.8-.8-4.3s.3-2.9.8-4.3l-7.7-6C.9 16.8 0 20.3 0 24s.9 7.2 2.6 10.3l7.7-6z"/>
                      <path fill="#34A853" d="M24 48c6 0 11.3-2 15.4-5.4l-7-5.4c-2 1.4-4.6 2.2-8.4 2.2-6.4 0-11.8-3.9-13.7-9.4l-7.7 6C6.4 42.6 14.6 48 24 48z"/>
                    </svg>
                  </span>
                  Google sign in (placeholder)
                </button>
                <a className="btn-ghost" href="#how">How it works</a>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 shadow-sm">
                <div className="font-semibold text-slate-900 flex items-center gap-2"><Lock size={14} /> Sign in with email</div>
                <div className="mt-3 grid gap-3">
                  <div>
                    <label className="text-xs text-slate-600">Email</label>
                    <input className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600">Password</label>
                    <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
                {error ? <div className="mt-3 text-xs text-rose-600">{error}</div> : null}
                <div className="mt-3 text-xs text-slate-600">
                  Use one of the starter accounts: avery@lendfam.app or jordan@lendfam.app (password: lendfam2024).
                </div>
              </div>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="card">
                  <div className="badge"><Users size={14} /> Network-first</div>
                  <div className="mt-2 text-sm text-slate-700">Friends + friends-of-friends, not strangers.</div>
                </div>
                <div className="card">
                  <div className="badge"><Percent size={14} /> Clear terms</div>
                  <div className="mt-2 text-sm text-slate-700">Interest + duration shown upfront.</div>
                </div>
                <div className="card">
                  <div className="badge"><ShieldCheck size={14} /> Trust layers</div>
                  <div className="mt-2 text-sm text-slate-700">Profiles, mutuals, and history.</div>
                </div>
              </div>
            </div>

            <div className="card relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />
              <div className="relative">
                <div className="text-sm text-slate-600">Preview</div>
                <div className="mt-2 text-2xl font-semibold">Campus Feed</div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">“Need $80 for books”</div>
                      <span className="badge border-emerald-200 bg-emerald-100 text-emerald-900">Request</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-700">Pay back in 14 days • 4% interest • Friends-of-friends</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">“I can lend up to $200”</div>
                      <span className="badge border-cyan-200 bg-cyan-100 text-cyan-900">Offer</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-700">30 days • 6% interest • Friends</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">“Emergency ride share”</div>
                      <span className="badge border-emerald-200 bg-emerald-100 text-emerald-900">Request</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-700">7 days • 2% interest • Friends</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section id="how" className="mt-16">
            <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <div className="card">
                <div className="font-semibold">1) Sign in with email</div>
                <div className="mt-2 text-sm text-slate-700">Create your profile and verify your student identity later.</div>
              </div>
              <div className="card">
                <div className="font-semibold">2) Build your network</div>
                <div className="mt-2 text-sm text-slate-700">Add friends, see mutuals, discover friends-of-friends.</div>
              </div>
              <div className="card">
                <div className="font-semibold">3) Lend with terms</div>
                <div className="mt-2 text-sm text-slate-700">Post requests/offers with amount, interest, and duration.</div>
              </div>
            </div>
          </section>
        </section>
      </Container>
    </div>
  )
}
