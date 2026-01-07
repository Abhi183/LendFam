import { ArrowRight, ShieldCheck, Users, Percent, Sparkles } from 'lucide-react'
import { useAuth } from '../state/AuthContext'
import { Container } from '../components/Container'
import { demoAuthUser } from '../store/demoData'

export default function Landing() {
  const { signInGoogle } = useAuth()

  return (
    <div className="min-h-[calc(100vh-64px)] bg-grid">
      <Container>
        <section className="py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="badge border-emerald-200 bg-emerald-50 text-emerald-800">
                <Sparkles size={14} /> A social lending network for students
              </div>
              <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
                Send money like Zelle — <span className="text-emerald-700">but built for lending</span>.
              </h1>
              <p className="mt-4 text-slate-600 leading-relaxed">
                LendFam lets students send/receive money inside a trusted social network.
                Borrow from friends or friends-of-friends with transparent interest rates and terms.
              </p>

              <div id="get-started" className="mt-6 flex flex-wrap gap-3">
                <button
                  className="btn-primary"
                  onClick={() => signInGoogle()}
                >
                  Continue with Google (Demo) <ArrowRight size={16} />
                </button>
                <a className="btn-ghost" href="#how">How it works</a>
              </div>

              <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                <div className="font-semibold">Demo account</div>
                <div className="mt-1">{demoAuthUser.displayName} • {demoAuthUser.email}</div>
              </div>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="card">
                  <div className="badge"><Users size={14} /> Network-first</div>
                  <div className="mt-2 text-sm text-slate-600">Friends + friends-of-friends, not strangers.</div>
                </div>
                <div className="card">
                  <div className="badge"><Percent size={14} /> Clear terms</div>
                  <div className="mt-2 text-sm text-slate-600">Interest + duration shown upfront.</div>
                </div>
                <div className="card">
                  <div className="badge"><ShieldCheck size={14} /> Trust layers</div>
                  <div className="mt-2 text-sm text-slate-600">Profiles, mutuals, and history.</div>
                </div>
              </div>
            </div>

            <div className="card relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />
              <div className="relative">
                <div className="text-sm text-slate-500">Preview</div>
                <div className="mt-2 text-2xl font-semibold">Campus Feed</div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">“Need $80 for books”</div>
                      <span className="badge border-emerald-200 bg-emerald-50 text-emerald-700">Request</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">Pay back in 14 days • 4% interest • Friends-of-friends</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">“I can lend up to $200”</div>
                      <span className="badge border-cyan-200 bg-cyan-50 text-cyan-700">Offer</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">30 days • 6% interest • Friends</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">“Emergency ride share”</div>
                      <span className="badge border-emerald-200 bg-emerald-50 text-emerald-700">Request</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">7 days • 2% interest • Friends</div>
                  </div>
                </div>

                <div className="mt-6 text-xs text-slate-500">
                  MVP demo UI — real payments integration is a next step.
                </div>
              </div>
            </div>
          </div>

          <section id="how" className="mt-16">
            <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <div className="card">
                <div className="font-semibold">1) Join with Google</div>
                <div className="mt-2 text-sm text-slate-600">Create your profile and verify your student identity later.</div>
              </div>
              <div className="card">
                <div className="font-semibold">2) Build your network</div>
                <div className="mt-2 text-sm text-slate-600">Add friends, see mutuals, discover friends-of-friends.</div>
              </div>
              <div className="card">
                <div className="font-semibold">3) Lend with terms</div>
                <div className="mt-2 text-sm text-slate-600">Post requests/offers with amount, interest, and duration.</div>
              </div>
            </div>
          </section>
        </section>
      </Container>
    </div>
  )
}
