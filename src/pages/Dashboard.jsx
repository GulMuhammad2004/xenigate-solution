import React, { useEffect, useMemo, useState } from 'react'
import { Route, UserX, CheckCircle2, Users, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout.jsx'
import StatTile from '../components/ui/StatTile.jsx'
import Badge from '../components/ui/Badge.jsx'
import { listRuns, listDepots, listStaff, summarize } from '../data/dataService.js'
import { todayISO } from '../lib/dates.js'

export default function Dashboard() {
  const [runs, setRuns] = useState([])
  const [depots, setDepots] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const date = todayISO()

  useEffect(() => {
    Promise.all([listRuns({ date }), listDepots(), listStaff()]).then(([r, d, s]) => {
      setRuns(r); setDepots(d); setStaff(s); setLoading(false)
    })
  }, [])

  const stats = useMemo(() => summarize(runs), [runs])
  const activeStaff = staff.filter((s) => s.active).length
  const depotName = (id) => depots.find((d) => d.id === id)?.name || '—'
  const staffName = (id) => staff.find((s) => s.id === id)?.full_name

  const nextUp = [...runs]
    .filter((r) => r.status !== 'completed')
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
    .slice(0, 6)

  return (
    <AppLayout title="Dashboard" subtitle={new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Total runs today" value={loading ? '—' : stats.total} icon={Route} tone="ink" />
        <StatTile label="Unassigned" value={loading ? '—' : stats.unassigned} icon={UserX} tone={stats.unassigned ? 'bad' : 'ink'} hint={stats.unassigned ? 'Needs a driver' : 'All covered'} />
        <StatTile label="Completed" value={loading ? '—' : stats.completed} icon={CheckCircle2} tone="good" />
        <StatTile label="Active staff" value={loading ? '—' : activeStaff} icon={Users} tone="route" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[16px] font-semibold text-ink">Next up today</h2>
            <Link to="/schedule" className="flex items-center gap-1 text-[12.5px] font-medium text-route-600 hover:text-route-700">
              Open schedule <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="space-y-1">
            {nextUp.length === 0 && <p className="py-6 text-center text-[13px] text-ash-500">No runs scheduled for today yet.</p>}
            {nextUp.map((r) => (
              <div key={r.id} className="flex items-center gap-4 rounded-xl px-2 py-2.5 hover:bg-canvas">
                <span className="w-14 shrink-0 font-display text-[13px] font-semibold text-ink">{r.start_time}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-ink">{r.run_number} · {depotName(r.depot_id)} → {r.delivery}</p>
                  <p className="text-[12px] text-ash-500">{r.staff_id ? staffName(r.staff_id) : 'No driver assigned'}</p>
                </div>
                <Badge status={r.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="mb-4 font-display text-[16px] font-semibold text-ink">Runs by depot</h2>
          <div className="space-y-4">
            {depots.map((d) => {
              const depotRuns = runs.filter((r) => r.depot_id === d.id)
              const pct = stats.total ? Math.round((depotRuns.length / stats.total) * 100) : 0
              return (
                <div key={d.id}>
                  <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                    <span className="font-medium text-ink">{d.name}</span>
                    <span className="text-ash-500">{depotRuns.length} runs</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-canvas">
                    <div className="h-full rounded-full bg-route-gradient" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}