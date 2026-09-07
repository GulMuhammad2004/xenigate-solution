import React, { useEffect, useMemo, useState } from 'react'
import { Wallet, TrendingUp, CalendarDays } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout.jsx'
import { listRuns, listStaff, sumPrice } from '../data/dataService.js'
import { rangeFor, todayISO } from '../lib/dates.js'

const money = (n) => `£${Number(n || 0).toFixed(2)}`

export default function Earnings() {
  const [anchor, setAnchor] = useState(todayISO())
  const [runsMonth, setRunsMonth] = useState([]) // superset covering the whole month, sliced client-side for day/week/month
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)

  const { from: monthFrom, to: monthTo } = rangeFor(anchor, 'month')
  const { from: weekFrom, to: weekTo } = rangeFor(anchor, 'week')

  useEffect(() => {
    setLoading(true)
    Promise.all([listRuns({ from: monthFrom, to: monthTo }), listStaff()]).then(([r, s]) => {
      setRunsMonth(r); setStaff(s); setLoading(false)
    })
  }, [monthFrom, monthTo])

  const dayRuns = useMemo(() => runsMonth.filter((r) => r.run_date === anchor), [runsMonth, anchor])
  const weekRuns = useMemo(() => runsMonth.filter((r) => r.run_date >= weekFrom && r.run_date <= weekTo), [runsMonth, weekFrom, weekTo])
  const monthRuns = runsMonth // already scoped to the month

  const dayTotal = useMemo(() => sumPrice(dayRuns), [dayRuns])
  const weekTotal = useMemo(() => sumPrice(weekRuns), [weekRuns])
  const monthTotal = useMemo(() => sumPrice(monthRuns), [monthRuns])

  const perDriver = useMemo(() => {
    const active = staff.filter((s) => s.active)
    return active
      .map((s) => ({
        staff: s,
        daily: sumPrice(dayRuns.filter((r) => r.staff_id === s.id)),
        weekly: sumPrice(weekRuns.filter((r) => r.staff_id === s.id)),
        monthly: sumPrice(monthRuns.filter((r) => r.staff_id === s.id)),
      }))
      .sort((a, b) => b.monthly - a.monthly)
  }, [staff, dayRuns, weekRuns, monthRuns])

  return (
    <AppLayout title="Earnings" subtitle="Admin only — run prices and totals are never shown to client accounts.">
      <div className="panel flex flex-wrap items-center gap-3 p-4 md:p-5">
        <label className="text-[12.5px] font-medium text-ash-600">Viewing figures for</label>
        <input
          type="date"
          value={anchor}
          onChange={(e) => setAnchor(e.target.value)}
          className="field w-auto"
        />
        <button type="button" onClick={() => setAnchor(todayISO())} className="btn-ghost">Today</button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="panel p-5">
          <div className="flex items-center gap-2 text-ash-500">
            <CalendarDays size={16} />
            <p className="text-[12.5px] font-medium">Daily total</p>
          </div>
          <p className="mt-2.5 font-display text-[28px] font-semibold text-ink">{loading ? '—' : money(dayTotal)}</p>
          <p className="mt-1 text-[11.5px] text-ash-400">{dayRuns.length} run{dayRuns.length === 1 ? '' : 's'} on {anchor}</p>
        </div>
        <div className="panel p-5">
          <div className="flex items-center gap-2 text-ash-500">
            <TrendingUp size={16} />
            <p className="text-[12.5px] font-medium">Weekly total</p>
          </div>
          <p className="mt-2.5 font-display text-[28px] font-semibold text-ink">{loading ? '—' : money(weekTotal)}</p>
          <p className="mt-1 text-[11.5px] text-ash-400">{weekFrom} to {weekTo}</p>
        </div>
        <div className="panel p-5">
          <div className="flex items-center gap-2 text-ash-500">
            <Wallet size={16} />
            <p className="text-[12.5px] font-medium">Monthly total</p>
          </div>
          <p className="mt-2.5 font-display text-[28px] font-semibold text-ink">{loading ? '—' : money(monthTotal)}</p>
          <p className="mt-1 text-[11.5px] text-ash-400">{monthFrom} to {monthTo}</p>
        </div>
      </div>

      <div className="panel mt-5 overflow-hidden">
        <div className="border-b border-black/5 px-5 py-4">
          <h2 className="font-display text-[15px] font-semibold text-ink">Earnings per driver</h2>
          <p className="text-[12px] text-ash-500">Daily figure is for {anchor}; weekly and monthly are the periods shown above.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-black/5 text-left text-[11.5px] font-semibold uppercase tracking-wide text-ash-500">
                <th className="px-5 py-3">Driver</th>
                <th className="px-4 py-3">Daily</th>
                <th className="px-4 py-3">Weekly</th>
                <th className="px-4 py-3">Monthly</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={4} className="px-5 py-10 text-center text-[13px] text-ash-500">Loading…</td></tr>}
              {!loading && perDriver.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-[13px] text-ash-500">No active drivers yet.</td></tr>
              )}
              {perDriver.map((row) => (
                <tr key={row.staff.id} className="border-b border-black/5 last:border-0 hover:bg-canvas/60">
                  <td className="px-5 py-3 text-[13.5px] font-semibold text-ink">{row.staff.full_name}</td>
                  <td className="px-4 py-3 text-[13px] text-ink">{money(row.daily)}</td>
                  <td className="px-4 py-3 text-[13px] text-ink">{money(row.weekly)}</td>
                  <td className="px-4 py-3 text-[13px] font-medium text-ink">{money(row.monthly)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
}