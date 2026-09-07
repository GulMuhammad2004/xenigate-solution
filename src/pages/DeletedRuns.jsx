import React, { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout.jsx'
import { listDeletedRuns, listDepots, listStaff, priceWithVat } from '../data/dataService.js'

const money = (n) => (n || n === 0 ? `£${Number(n).toFixed(2)}` : '—')

function fmtWhen(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString(undefined, {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function DeletedRuns() {
  const [rows, setRows] = useState([])
  const [depots, setDepots] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listDeletedRuns(), listDepots(), listStaff()]).then(([r, d, s]) => {
      setRows(r); setDepots(d); setStaff(s); setLoading(false)
    })
  }, [])

  const depotName = (id) => depots.find((d) => d.id === id)?.name || '—'
  const staffName = (id) => staff.find((s) => s.id === id)?.full_name || 'Unassigned'

  return (
    <AppLayout title="Deleted Runs" subtitle="Admin only — a permanent record of every run that's been removed from the schedule.">
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-black/5 text-left text-[11.5px] font-semibold uppercase tracking-wide text-ash-500">
                <th className="px-5 py-3">Run</th>
                <th className="px-4 py-3">Original date</th>
                <th className="px-4 py-3">Collection depot</th>
                <th className="px-4 py-3">Delivery</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Price (inc. VAT)</th>
                <th className="px-4 py-3">Deleted at</th>
                <th className="px-4 py-3">Deleted by</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-[13px] text-ash-500">Loading…</td></tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center text-[13px] text-ash-500">
                    <Trash2 size={20} className="mx-auto mb-2 text-ash-400" />
                    Nothing's been deleted yet.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-black/5 last:border-0 hover:bg-canvas/60">
                  <td className="px-5 py-3 text-[13.5px] font-semibold text-ink">{r.run_number}</td>
                  <td className="px-4 py-3 text-[13px] text-ash-600">
                    {new Date(r.run_date + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-ash-600">{depotName(r.depot_id)}</td>
                  <td className="px-4 py-3 text-[13px] text-ink">{r.delivery}</td>
                  <td className="px-4 py-3 text-[13px] text-ink">{staffName(r.staff_id)}</td>
                  <td className="px-4 py-3 text-[13px] font-medium text-ink">{money(priceWithVat(r.price))}</td>
                  <td className="px-4 py-3 text-[13px] text-ash-600">{fmtWhen(r.deleted_at)}</td>
                  <td className="px-4 py-3 text-[13px] text-ash-600">{r.deleted_by || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
}