import React, { useEffect, useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import AppLayout from '../components/layout/AppLayout.jsx'
import { listRuns, listDepots, listStaff, summarize } from '../data/dataService.js'
import { rangeFor, todayISO } from '../lib/dates.js'

const RANGE_LABEL = { day: 'Daily', week: 'Weekly', month: 'Monthly' }
const PIE_COLORS = ['#2E6FF2', '#DC4C4C', '#16A34A', '#F5A524', '#8593A6']

function toCSV(rows, depots, staff) {
  const depotName = (id) => depots.find((d) => d.id === id)?.name || ''
  const staffName = (id) => staff.find((s) => s.id === id)?.full_name || 'Unassigned'
  const header = ['Run', 'Date', 'Collection Depot', 'Delivery', 'Collection Time', 'Delivery Time', 'Driver', 'Status']
  const lines = rows.map((r) => [r.run_number, r.run_date, depotName(r.depot_id), r.delivery, r.start_time, r.delivery_time || '', staffName(r.staff_id), r.status])
  return [header, ...lines].map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
}

export default function Reports() {
  const [range, setRange] = useState('week')
  const [anchor, setAnchor] = useState(todayISO())
  const [depotId, setDepotId] = useState('all')
  const [staffId, setStaffId] = useState('all')
  const [runs, setRuns] = useState([])
  const [depots, setDepots] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)

  const { from, to } = rangeFor(anchor, range)

  useEffect(() => {
    setLoading(true)
    Promise.all([listRuns({ from, to, depotId, staffId }), listDepots(), listStaff()]).then(([r, d, s]) => {
      setRuns(r); setDepots(d); setStaff(s); setLoading(false)
    })
  }, [from, to, depotId, staffId])

  const stats = useMemo(() => summarize(runs), [runs])

  const byDepot = useMemo(() => depots.map((d) => ({
    name: d.name,
    runs: runs.filter((r) => r.depot_id === d.id).length,
  })), [runs, depots])

  const byStatus = useMemo(() => {
    const order = ['completed', 'scheduled', 'unassigned', 'in_progress', 'cancelled']
    return order
      .map((status) => ({ name: status.replace('_', ' '), value: runs.filter((r) => r.status === status).length }))
      .filter((s) => s.value > 0)
  }, [runs])

  const byDriver = useMemo(() => {
    const active = staff.filter((s) => s.active)
    return active
      .map((s) => ({ name: s.full_name, runs: runs.filter((r) => r.staff_id === s.id).length }))
      .sort((a, b) => b.runs - a.runs)
  }, [runs, staff])

  function exportCSV() {
    const csv = toCSV(runs, depots, staff)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `xenigate-runs-${range}-${from}-to-${to}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AppLayout title="Reports" subtitle={`${RANGE_LABEL[range]} report · ${from} to ${to}`}>
      <div className="panel flex flex-wrap items-end gap-3 p-4 md:p-5">
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-ash-600">Range</label>
          <div className="flex rounded-lg bg-canvas p-1">
            {['day', 'week', 'month'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-md px-3 py-1.5 text-[12.5px] font-medium capitalize transition ${range === r ? 'bg-white text-ink shadow-sm' : 'text-ash-500'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-ash-600">Anchor date</label>
          <input type="date" value={anchor} onChange={(e) => setAnchor(e.target.value)} className="field w-auto" />
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-ash-600">Depot</label>
          <select value={depotId} onChange={(e) => setDepotId(e.target.value)} className="field w-auto">
            <option value="all">All depots</option>
            {depots.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-ash-600">Driver</label>
          <select value={staffId} onChange={(e) => setStaffId(e.target.value)} className="field w-auto">
            <option value="all">All drivers</option>
            {staff.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
          </select>
        </div>
        <button onClick={exportCSV} className="btn-primary ml-auto"><Download size={15} /> Export CSV</button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total runs', value: stats.total },
          { label: 'Completed', value: stats.completed },
          { label: 'Scheduled', value: stats.scheduled },
          { label: 'Unassigned', value: stats.unassigned },
        ].map((s) => (
          <div key={s.label} className="panel p-4">
            <p className="text-[12px] font-medium text-ash-500">{s.label}</p>
            <p className="mt-1.5 font-display text-[24px] font-semibold text-ink">{loading ? '—' : s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-5">
        <div className="panel p-5 lg:col-span-3">
          <h2 className="mb-4 font-display text-[15px] font-semibold text-ink">Runs by depot</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byDepot} margin={{ left: -20 }}>
              <CartesianGrid vertical={false} stroke="#E7ECF3" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#EEF2F7' }} contentStyle={{ borderRadius: 10, border: '1px solid #E7ECF3', fontSize: 12.5 }} />
              <Bar dataKey="runs" fill="#2E6FF2" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-[15px] font-semibold text-ink">Status split</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {byStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E7ECF3', fontSize: 12.5 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
            {byStatus.map((s, i) => (
              <span key={s.name} className="flex items-center gap-1.5 text-[11.5px] capitalize text-ash-600">
                <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} /> {s.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="panel mt-5 p-5">
        <h2 className="mb-4 font-display text-[15px] font-semibold text-ink">Runs per driver</h2>
        <div className="space-y-3">
          {byDriver.map((d) => {
            const max = Math.max(1, ...byDriver.map((x) => x.runs))
            return (
              <div key={d.name} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-[12.5px] font-medium text-ink">{d.name}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-canvas">
                  <div className="h-full rounded-full bg-route-gradient" style={{ width: `${(d.runs / max) * 100}%` }} />
                </div>
                <span className="w-6 text-right text-[12.5px] text-ash-500">{d.runs}</span>
              </div>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}