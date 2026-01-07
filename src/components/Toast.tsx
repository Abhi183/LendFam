import React from 'react'
import { X } from 'lucide-react'

export type ToastState = { open: boolean; title: string; message?: string; kind?: 'ok' | 'err' }

export function Toast({ state, onClose }: { state: ToastState; onClose: () => void }) {
  if (!state.open) return null
  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(420px,calc(100vw-2rem))]">
      <div className="card flex items-start gap-3">
        <div className={state.kind === 'err' ? 'badge border-rose-400/25 bg-rose-500/10 text-rose-200' : 'badge border-emerald-400/25 bg-emerald-500/10 text-emerald-200'}>
          {state.kind === 'err' ? 'Issue' : 'Done'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium">{state.title}</div>
          {state.message ? <div className="text-sm text-slate-300 mt-0.5">{state.message}</div> : null}
        </div>
        <button className="btn-ghost px-2 py-2" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
