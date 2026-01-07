import { HandCoins } from 'lucide-react'

export function Logo({ size = 22 }: { size?: number }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 shadow-glow ring-1 ring-emerald-300/50">
        <HandCoins size={size} className="text-white" />
      </span>
      <div className="leading-tight">
        <div className="font-semibold tracking-tight">LendFam</div>
        <div className="text-xs text-slate-600 -mt-0.5">Social lending for students</div>
      </div>
    </div>
  )
}
