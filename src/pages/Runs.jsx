// import React, { useEffect, useState } from 'react'
// import { Search, X } from 'lucide-react'
// import AppLayout from '../components/layout/AppLayout.jsx'
// import Badge from '../components/ui/Badge.jsx'
// import { useAuth } from '../context/AuthContext.jsx'
// import { listRuns, listDepots, listStaff } from '../data/dataService.js'

// const money = (n) => (n || n === 0 ? `£${Number(n).toFixed(2)}` : '—')

// export default function Runs() {
//   const { isAdmin } = useAuth()
//   const [runs, setRuns] = useState([])
//   const [depots, setDepots] = useState([])
//   const [staff, setStaff] = useState([])
//   const [loading, setLoading] = useState(true)

//   const [search, setSearch] = useState('')
//   const [depotId, setDepotId] = useState('all')
//   const [staffId, setStaffId] = useState('all')
//   const [from, setFrom] = useState('')
//   const [to, setTo] = useState('')

//   async function refresh() {
//     setLoading(true)
//     const [r, d, s] = await Promise.all([
//       listRuns({ search, depotId, staffId, from: from || undefined, to: to || undefined }),
//       listDepots(),
//       listStaff(),
//     ])
//     setRuns(r); setDepots(d); setStaff(s); setLoading(false)
//   }

//   useEffect(() => { refresh() }, [depotId, staffId, from, to])
//   useEffect(() => {
//     const t = setTimeout(refresh, 250)
//     return () => clearTimeout(t)
//   }, [search])

//   const depotName = (id) => depots.find((d) => d.id === id)?.name || '—'
//   const staffName = (id) => staff.find((s) => s.id === id)?.full_name || 'Unassigned'
//   const columnCount = isAdmin ? 9 : 8

//   function clearFilters() {
//     setSearch(''); setDepotId('all'); setStaffId('all'); setFrom(''); setTo('')
//   }

//   const anyFilter = search || depotId !== 'all' || staffId !== 'all' || from || to

//   return (
//     <AppLayout title="Runs" subtitle="Search the full run history and see exactly who worked each one.">
//       <div className="panel p-4 md:p-5">
//         <div className="flex flex-wrap items-end gap-3">
//           <div className="min-w-[220px] flex-1">
//             <label className="mb-1.5 block text-[12px] font-medium text-ash-600">Search</label>
//             <div className="relative">
//               <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ash-400" />
//               <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Run number or delivery location" className="field pl-9" />
//             </div>
//           </div>
//           <div>
//             <label className="mb-1.5 block text-[12px] font-medium text-ash-600">Collection depot</label>
//             <select value={depotId} onChange={(e) => setDepotId(e.target.value)} className="field w-auto">
//               <option value="all">All depots</option>
//               {depots.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
//             </select>
//           </div>
//           <div>
//             <label className="mb-1.5 block text-[12px] font-medium text-ash-600">Driver</label>
//             <select value={staffId} onChange={(e) => setStaffId(e.target.value)} className="field w-auto">
//               <option value="all">All drivers</option>
//               {staff.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
//             </select>
//           </div>
//           <div>
//             <label className="mb-1.5 block text-[12px] font-medium text-ash-600">From</label>
//             <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="field w-auto" />
//           </div>
//           <div>
//             <label className="mb-1.5 block text-[12px] font-medium text-ash-600">To</label>
//             <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="field w-auto" />
//           </div>
//           {anyFilter && (
//             <button onClick={clearFilters} className="btn-ghost">
//               <X size={14} /> Clear
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="panel mt-5 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[860px] border-collapse">
//             <thead>
//               <tr className="border-b border-black/5 text-left text-[11.5px] font-semibold uppercase tracking-wide text-ash-500">
//                 <th className="px-5 py-3">Run</th>
//                 <th className="px-4 py-3">Date</th>
//                 <th className="px-4 py-3">Collection depot</th>
//                 <th className="px-4 py-3">Delivery</th>
//                 <th className="px-4 py-3">Collection</th>
//                 <th className="px-4 py-3">Delivery time</th>
//                 <th className="px-4 py-3">Driver</th>
//                 {isAdmin && <th className="px-4 py-3">Price</th>}
//                 <th className="px-4 py-3">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading && <tr><td colSpan={columnCount} className="px-5 py-10 text-center text-[13px] text-ash-500">Searching…</td></tr>}
//               {!loading && runs.length === 0 && (
//                 <tr><td colSpan={columnCount} className="px-5 py-10 text-center text-[13px] text-ash-500">No runs match those filters.</td></tr>
//               )}
//               {runs.map((r) => (
//                 <tr key={r.id} className="border-b border-black/5 last:border-0 hover:bg-canvas/60">
//                   <td className="px-5 py-3 text-[13.5px] font-semibold text-ink">{r.run_number}</td>
//                   <td className="px-4 py-3 text-[13px] text-ash-600">{new Date(r.run_date + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</td>
//                   <td className="px-4 py-3 text-[13px] text-ash-600">{depotName(r.depot_id)}</td>
//                   <td className="px-4 py-3 text-[13px] text-ink">{r.delivery}</td>
//                   <td className="px-4 py-3 font-display text-[13px] font-semibold text-ink">{r.start_time}</td>
//                   <td className="px-4 py-3 font-display text-[13px] font-semibold text-ink">{r.delivery_time || '—'}</td>
//                   <td className="px-4 py-3 text-[13px] text-ink">{staffName(r.staff_id)}</td>
//                   {isAdmin && <td className="px-4 py-3 text-[13px] font-medium text-ink">{money(r.price)}</td>}
//                   <td className="px-4 py-3"><Badge status={r.status} /></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {!loading && (
//           <div className="border-t border-black/5 px-5 py-3 text-[12px] text-ash-500">{runs.length} run{runs.length === 1 ? '' : 's'} found</div>
//         )}
//       </div>
//     </AppLayout>
//   )
// }
import React, { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout.jsx'
import Badge from '../components/ui/Badge.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { listRuns, listDepots, listStaff, priceWithVat } from '../data/dataService.js'

const money = (n) => (n || n === 0 ? `£${Number(n).toFixed(2)}` : '—')

export default function Runs() {
  const { isAdmin } = useAuth()
  const [runs, setRuns] = useState([])
  const [depots, setDepots] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [depotId, setDepotId] = useState('all')
  const [staffId, setStaffId] = useState('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  async function refresh() {
    setLoading(true)
    const [r, d, s] = await Promise.all([
      listRuns({ search, depotId, staffId, from: from || undefined, to: to || undefined }),
      listDepots(),
      listStaff(),
    ])
    setRuns(r); setDepots(d); setStaff(s); setLoading(false)
  }

  useEffect(() => { refresh() }, [depotId, staffId, from, to])
  useEffect(() => {
    const t = setTimeout(refresh, 250)
    return () => clearTimeout(t)
  }, [search])

  const depotName = (id) => depots.find((d) => d.id === id)?.name || '—'
  const staffName = (id) => staff.find((s) => s.id === id)?.full_name || 'Unassigned'
  const columnCount = isAdmin ? 9 : 8

  function clearFilters() {
    setSearch(''); setDepotId('all'); setStaffId('all'); setFrom(''); setTo('')
  }

  const anyFilter = search || depotId !== 'all' || staffId !== 'all' || from || to

  return (
    <AppLayout title="Runs" subtitle="Search the full run history and see exactly who worked each one.">
      <div className="panel p-4 md:p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <label className="mb-1.5 block text-[12px] font-medium text-ash-600">Search</label>
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ash-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Run number or delivery location" className="field pl-9" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-ash-600">Collection depot</label>
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
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-ash-600">From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="field w-auto" />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-ash-600">To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="field w-auto" />
          </div>
          {anyFilter && (
            <button onClick={clearFilters} className="btn-ghost">
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="panel mt-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse">
            <thead>
              <tr className="border-b border-black/5 text-left text-[11.5px] font-semibold uppercase tracking-wide text-ash-500">
                <th className="px-5 py-3">Run</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Collection depot</th>
                <th className="px-4 py-3">Delivery</th>
                <th className="px-4 py-3">Collection</th>
                <th className="px-4 py-3">Delivery time</th>
                <th className="px-4 py-3">Driver</th>
                {isAdmin && <th className="px-4 py-3">Price (inc. VAT)</th>}
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={columnCount} className="px-5 py-10 text-center text-[13px] text-ash-500">Searching…</td></tr>}
              {!loading && runs.length === 0 && (
                <tr><td colSpan={columnCount} className="px-5 py-10 text-center text-[13px] text-ash-500">No runs match those filters.</td></tr>
              )}
              {runs.map((r) => (
                <tr key={r.id} className="border-b border-black/5 last:border-0 hover:bg-canvas/60">
                  <td className="px-5 py-3 text-[13.5px] font-semibold text-ink">{r.run_number}</td>
                  <td className="px-4 py-3 text-[13px] text-ash-600">{new Date(r.run_date + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-4 py-3 text-[13px] text-ash-600">{depotName(r.depot_id)}</td>
                  <td className="px-4 py-3 text-[13px] text-ink">{r.delivery}</td>
                  <td className="px-4 py-3 font-display text-[13px] font-semibold text-ink">{r.start_time}</td>
                  <td className="px-4 py-3 font-display text-[13px] font-semibold text-ink">{r.delivery_time || '—'}</td>
                  <td className="px-4 py-3 text-[13px] text-ink">{staffName(r.staff_id)}</td>
                  {isAdmin && <td className="px-4 py-3 text-[13px] font-medium text-ink">{money(priceWithVat(r.price))}</td>}
                  <td className="px-4 py-3"><Badge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="border-t border-black/5 px-5 py-3 text-[12px] text-ash-500">{runs.length} run{runs.length === 1 ? '' : 's'} found</div>
        )}
      </div>
    </AppLayout>
  )
}