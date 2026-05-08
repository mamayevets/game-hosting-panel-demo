function generateDailyPlayers(seed: number, days: number): { date: string; players: number }[] {
  const out: { date: string; players: number }[] = []
  let value = 60
  let s = seed
  const today = new Date('2026-05-08')
  for (let i = days - 1; i >= 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const noise = (s / 233280 - 0.5) * 30
    const weekday = (today.getDay() - i + 7) % 7
    const weekendBoost = weekday === 5 || weekday === 6 ? 25 : 0
    value = Math.max(20, Math.min(160, value * 0.85 + 60 * 0.15 + noise + weekendBoost * 0.1))
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    out.push({
      date: d.toISOString().slice(0, 10),
      players: Math.round(value),
    })
  }
  return out
}

export const playerHistory90d = generateDailyPlayers(7, 90)
export const playerHistory30d = playerHistory90d.slice(-30)
export const playerHistory7d = playerHistory90d.slice(-7)

export const trends = {
  serversOnline: { current: 4, total: 6, deltaPercent: 33.3, direction: 'up' as const, hint: 'Up from 3 / 6 last week', sub: 'All critical clusters responding' },
  activePlayers: { current: 98, deltaPercent: -12.4, direction: 'down' as const, hint: 'Down 12.4% vs yesterday', sub: 'Peak hours start at 19:00 UTC' },
  ramProvisioned: { current: 54, deltaPercent: 8.0, direction: 'up' as const, hint: 'Right-sized for current load', sub: 'Across six hosted servers' },
  uptime30d: { current: 99.83, deltaPercent: 0.3, direction: 'up' as const, hint: 'Above 99.5% SLA target', sub: '6m 12s downtime in window' },
}
