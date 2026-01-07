import { Coins } from 'lucide-react'

export function Logo({ size = 22 }: { size?: number }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 border border-emerald-200 shadow-glow">
        <Coins size={size} className="text-emerald-600" />
      </span>
      <div className="leading-tight">
        <div className="font-semibold tracking-tight">LendFam</div>
        <div className="text-xs text-slate-500 -mt-0.5">Social lending for students</div>
      </div>
    </div>
  )
}
