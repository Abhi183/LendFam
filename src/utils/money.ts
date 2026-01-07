export function fmtUSD(n: number) {
  if (!Number.isFinite(n)) return '$0'
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}
export function clampNum(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function calcTotalWithInterest(amount: number, interestRate: number) {
  if (!Number.isFinite(amount) || !Number.isFinite(interestRate)) return 0
  return amount + amount * (interestRate / 100)
}
