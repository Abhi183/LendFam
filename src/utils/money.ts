export function fmtUSD(n: number) {
  if (!Number.isFinite(n)) return '$0'
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}
export function clampNum(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}
