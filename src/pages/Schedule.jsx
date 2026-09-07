// // import React, { useEffect, useMemo, useState } from 'react'
// // import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
// // import AppLayout from '../components/layout/AppLayout.jsx'
// // import RunFormModal from '../components/schedule/RunFormModal.jsx'
// // import Badge from '../components/ui/Badge.jsx'
// // import { useAuth } from '../context/AuthContext.jsx'
// // import { listRuns, listDepots, listStaff, createRun, assignStaffToRun, deleteRun, updateRun } from '../data/dataService.js'
// // import { toLocalISODate } from '../lib/dates.js'

// // const iso = toLocalISODate

// // const fmtDate = (isoStr) => new Date(isoStr + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
// // const money = (n) => (n || n === 0 ? `£${Number(n).toFixed(2)}` : '—')

// // // Order runs sit in the queue — unassigned/scheduled/in-progress are still
// // // "live" work; completed and cancelled are done and drop out of the queue.
// // const STATUS_ORDER = ['unassigned', 'scheduled', 'in_progress', 'completed', 'cancelled']
// // const STATUS_LABEL = {
// //   unassigned: 'Unassigned', scheduled: 'Scheduled', in_progress: 'In progress',
// //   completed: 'Completed', cancelled: 'Cancelled',
// // }
// // const LIVE_STATUSES = ['unassigned', 'scheduled', 'in_progress']

// // export default function Schedule() {
// //   const { isAdmin } = useAuth()
// //   const [date, setDate] = useState(iso(new Date()))
// //   const [depotFilter, setDepotFilter] = useState('all')
// //   const [statusFilter, setStatusFilter] = useState('all')
// //   const [runs, setRuns] = useState([])
// //   const [depots, setDepots] = useState([])
// //   const [staff, setStaff] = useState([])
// //   const [modalOpen, setModalOpen] = useState(false)
// //   const [loading, setLoading] = useState(true)

// //   async function refresh() {
// //     const [r, d, s] = await Promise.all([listRuns({ date, depotId: depotFilter }), listDepots(), listStaff()])
// //     setRuns(r); setDepots(d); setStaff(s); setLoading(false)
// //   }

// //   useEffect(() => { setLoading(true); refresh() }, [date, depotFilter])
// //   useEffect(() => { setStatusFilter('all') }, [date, depotFilter]) // don't carry a filter across days silently

// //   const depotName = (id) => depots.find((d) => d.id === id)?.name || '—'
// //   const staffName = (id) => staff.find((s) => s.id === id)?.full_name
// //   const availableStaff = staff.filter((s) => s.active) // drivers aren't tied to a depot
// //   const columnCount = isAdmin ? 9 : 8

// //   const statusCounts = useMemo(() => {
// //     const counts = { all: runs.length }
// //     STATUS_ORDER.forEach((s) => { counts[s] = runs.filter((r) => r.status === s).length })
// //     return counts
// //   }, [runs])

// //   // The next run still waiting to happen, soonest collection time first —
// //   // this is what makes the schedule read as an actual queue.
// //   const nextRun = useMemo(() => {
// //     return [...runs]
// //       .filter((r) => LIVE_STATUSES.includes(r.status))
// //       .sort((a, b) => a.start_time.localeCompare(b.start_time))[0]
// //   }, [runs])

// //   const visibleRuns = statusFilter === 'all' ? runs : runs.filter((r) => r.status === statusFilter)

// //   function shiftDate(days) {
// //     setDate((prev) => {
// //       const d = new Date(prev + 'T00:00:00')
// //       d.setDate(d.getDate() + days)
// //       return iso(d)
// //     })
// //   }

// //   async function handleAssign(run, staffId) {
// //     setRuns((rs) => rs.map((r) => (r.id === run.id ? { ...r, staff_id: staffId || null, status: staffId ? 'scheduled' : 'unassigned' } : r)))
// //     await assignStaffToRun(run.id, staffId)
// //   }

// //   async function handleStatus(run, status) {
// //     setRuns((rs) => rs.map((r) => (r.id === run.id ? { ...r, status } : r)))
// //     await updateRun(run.id, { status })
// //   }

// //   async function handleDelete(run) {
// //     if (!confirm(`Remove ${run.run_number}?`)) return
// //     setRuns((rs) => rs.filter((r) => r.id !== run.id))
// //     await deleteRun(run.id)
// //   }

// //   async function handleAdd(payloads) {
// //     const created = await Promise.all(payloads.map((p) => createRun(p)))
// //     setModalOpen(false)
// //     const matching = created.filter(
// //       (c) => c.run_date === date && (depotFilter === 'all' || c.depot_id === depotFilter)
// //     )
// //     if (matching.length) {
// //       setRuns((rs) => [...rs, ...matching].sort((a, b) => a.start_time.localeCompare(b.start_time)))
// //     }
// //   }

// //   return (
// //     <AppLayout title="Schedule" subtitle="Build and adjust the day's runs.">
// //       <div className="panel p-4 md:p-5">
// //         <div className="flex flex-wrap items-center gap-3">
// //           <div className="flex items-center gap-1 rounded-lg bg-canvas p-1">
// //             <button type="button" onClick={() => shiftDate(-1)} className="rounded-md p-1.5 text-ash-600 hover:bg-white">
// //               <ChevronLeft size={16} />
// //             </button>
// //             <span className="px-2 text-[13.5px] font-semibold text-ink">{fmtDate(date)}</span>
// //             <button type="button" onClick={() => shiftDate(1)} className="rounded-md p-1.5 text-ash-600 hover:bg-white">
// //               <ChevronRight size={16} />
// //             </button>
// //           </div>
// //           <button type="button" onClick={() => setDate(iso(new Date()))} className="btn-ghost">Today</button>
// //           <input
// //             type="date"
// //             value={date}
// //             onChange={(e) => setDate(e.target.value)}
// //             className="field w-auto"
// //             aria-label="Jump to date"
// //           />

// //           <select value={depotFilter} onChange={(e) => setDepotFilter(e.target.value)} className="field ml-auto w-auto md:w-48">
// //             <option value="all">All depots</option>
// //             {depots.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
// //           </select>

// //           {isAdmin && 
// //           <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
// //             <Plus size={16} /> Add run
// //           </button>
// //           }
// //         </div>
// //       </div>

// //       {/* Queue summary: what's next, and how the day is split by status */}
// //       <div className="mt-5 grid gap-4 md:grid-cols-3">
// //         <div className="panel p-5 md:col-span-2 hidden">
// //           <p className="text-[11px] font-semibold uppercase tracking-wide text-route-600">Next in queue</p>
// //           {nextRun ? (
// //             <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
// //               <div>
// //                 <p className="font-display text-[16.5px] font-semibold text-ink">
// //                   {nextRun.run_number} · {depotName(nextRun.depot_id)} → {nextRun.delivery}
// //                 </p>
// //                 <p className="mt-1 text-[12.5px] text-ash-500">
// //                   {nextRun.start_time} collection · {nextRun.staff_id ? staffName(nextRun.staff_id) : 'No driver assigned yet'}
// //                 </p>
// //               </div>
// //               <Badge status={nextRun.status} />
// //             </div>
// //           ) : (
// //             <p className="mt-2 text-[13px] text-ash-500">Nothing left in the queue — every run today is completed or cancelled.</p>
// //           )}
// //         </div>

// //         <div className="panel p-5 w-full">
// //           <p className="text-[11px] font-semibold uppercase tracking-wide text-good">Completed today</p>
// //           <p className="mt-2 font-display text-[28px] font-semibold text-ink">{statusCounts.completed || 0}</p>
// //           <p className="text-[12px] text-ash-500">of {statusCounts.all} run{statusCounts.all === 1 ? '' : 's'}</p>
// //         </div>
// //       </div>

// //       {/* Status filter chips */}
// //       <div className="mt-5 flex flex-wrap gap-2">
// //         <button
// //           onClick={() => setStatusFilter('all')}
// //           className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition ${
// //             statusFilter === 'all' ? 'bg-route-600 text-white' : 'border border-black/10 bg-white text-ash-600 hover:border-route-400/50'
// //           }`}
// //         >
// //           All ({statusCounts.all})
// //         </button>
// //         {STATUS_ORDER.map((s) => (
// //           <button
// //             key={s}
// //             onClick={() => setStatusFilter(s)}
// //             className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition ${
// //               statusFilter === s ? 'bg-route-600 text-white' : 'border border-black/10 bg-white text-ash-600 hover:border-route-400/50'
// //             }`}
// //           >
// //             {STATUS_LABEL[s]} ({statusCounts[s] || 0})
// //           </button>
// //         ))}
// //       </div>

// //       <div className="panel mt-4 overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="w-full min-w-[860px] border-collapse">
// //             <thead>
// //               <tr className="border-b border-black/5 text-left text-[11.5px] font-semibold uppercase tracking-wide text-ash-500">
// //                 <th className="px-5 py-3">Run</th>
// //                 <th className="px-4 py-3">Collection depot</th>
// //                 <th className="px-4 py-3">Delivery</th>
// //                 <th className="px-4 py-3">Collection</th>
// //                 <th className="px-4 py-3">Delivery time</th>
// //                 <th className="px-4 py-3">Driver</th>
// //                 {isAdmin && <th className="px-4 py-3">Price</th>}
// //                 <th className="px-4 py-3">Status</th>
// //                 <th className="px-4 py-3"></th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {loading && <tr><td colSpan={columnCount} className="px-5 py-10 text-center text-[13px] text-ash-500">Loading runs…</td></tr>}
// //               {!loading && visibleRuns.length === 0 && (
// //                 <tr>
// //                   <td colSpan={columnCount} className="px-5 py-10 text-center text-[13px] text-ash-500">
// //                     {statusFilter === 'all' ? 'No runs for this day. Add the first one.' : `No ${STATUS_LABEL[statusFilter].toLowerCase()} runs for this day.`}
// //                   </td>
// //                 </tr>
// //               )}
// //               {visibleRuns.map((r) => (
// //                 <tr key={r.id} className={`border-b border-black/5 last:border-0 hover:bg-canvas/60 ${nextRun?.id === r.id ? 'bg-route-50/60' : ''}`}>
// //                   <td className="px-5 py-3 text-[13.5px] font-semibold text-ink">
// //                     {r.run_number}
// //                     {nextRun?.id === r.id && (
// //                       <span className="ml-2 rounded-full bg-route-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-route-700">Next</span>
// //                     )}
// //                   </td>
// //                   <td className="px-4 py-3 text-[13px] text-ash-600">{depotName(r.depot_id)}</td>
// //                   <td className="px-4 py-3 text-[13px] text-ink">{r.delivery}</td>
// //                   <td className="px-4 py-3 font-display text-[13px] font-semibold text-ink">{r.start_time}</td>
// //                   <td className="px-4 py-3 font-display text-[13px] font-semibold text-ink">{r.delivery_time || '—'}</td>
                  
// //                   {isAdmin ?                 
// //                   <td className="px-4 py-3">
                   
// //                     <select
// //                       value={r.staff_id || ''}
// //                       onChange={(e) => handleAssign(r, e.target.value)}
// //                       className={`rounded-lg border px-2.5 py-1.5 text-[12.5px] ${r.staff_id ? 'border-black/10 text-ink' : 'border-bad/30 text-bad'}`}
// //                     >
// //                       <option value="">Unassigned</option>
// //                       {availableStaff.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
// //                     </select>
// //                   </td>
// //                   :
// //                   <td className="px-4 py-3">
// //                    <p>
// //     {r.staff_id ? staffName(r.staff_id) : 'Unassigned'}
// //   </p>
// //                   </td>
// //                   }
// //                   {isAdmin && <td className="px-4 py-3 text-[13px] font-medium text-ink">{money(r.price)}</td>}
// //                   <td className="px-4 py-3">
// //                     <select
// //                       value={r.status}
// //                       onChange={(e) => handleStatus(r, e.target.value)}
// //                       className="rounded-lg border-0 bg-transparent text-[12px] font-semibold"
// //                     >
// //                       <option value="unassigned">Unassigned</option>
// //                       <option value="scheduled">Scheduled</option>
// //                       <option value="in_progress">In progress</option>
// //                       <option value="completed">Completed</option>
// //                       <option value="cancelled">Cancelled</option>
// //                     </select>
// //                   </td>
// //                   <td className="px-4 py-3 text-right">
// //                     <button onClick={() => handleDelete(r)} className="rounded-lg p-1.5 text-ash-400 hover:bg-bad/10 hover:text-bad">
// //                       <Trash2 size={15} />
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       <RunFormModal
// //         open={modalOpen}
// //         onClose={() => setModalOpen(false)}
// //         onSave={handleAdd}
// //         depots={depots}
// //         staff={staff}
// //         date={date}
// //         isAdmin={isAdmin}
// //       />
// //     </AppLayout>
// //   )
// // }
// import React, { useEffect, useMemo, useState } from 'react'
// import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
// import AppLayout from '../components/layout/AppLayout.jsx'
// import RunFormModal from '../components/schedule/RunFormModal.jsx'
// import Badge from '../components/ui/Badge.jsx'
// import { useAuth } from '../context/AuthContext.jsx'
// import { listRuns, listDepots, listStaff, createRun, assignStaffToRun, deleteRun, updateRun } from '../data/dataService.js'
// import { toLocalISODate } from '../lib/dates.js'

// import { listRuns, listDepots, listStaff, createRun, assignStaffToRun, deleteRun, updateRun, priceWithVat } from '../data/dataService.js'
// const iso = toLocalISODate

// const fmtDate = (isoStr) => new Date(isoStr + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
// const money = (n) => (n || n === 0 ? `£${Number(n).toFixed(2)}` : '—')

// const STATUS_ORDER = ['unassigned', 'scheduled', 'in_progress', 'completed', 'cancelled']
// const STATUS_LABEL = {
//   unassigned: 'Unassigned', scheduled: 'Scheduled', in_progress: 'In progress',
//   completed: 'Completed', cancelled: 'Cancelled',
// }

// export default function Schedule() {
//   // isAdmin === Xenigate staff (full control). Everyone else (the client's
//   // dispatcher account) is view-only on this page — no add/assign/status
//   // change/delete. This is a UI-level guard only; if you're on Supabase,
//   // also lock the "runs" table write policies to admins (see schema.sql
//   // notes) so a technical client user can't bypass this via the API directly.
//   const { isAdmin } = useAuth()
//   const [date, setDate] = useState(iso(new Date()))
//   const [depotFilter, setDepotFilter] = useState('all')
//   const [statusFilter, setStatusFilter] = useState('all')
//   const [runs, setRuns] = useState([])
//   const [depots, setDepots] = useState([])
//   const [staff, setStaff] = useState([])
//   const [modalOpen, setModalOpen] = useState(false)
//   const [loading, setLoading] = useState(true)

//   async function refresh() {
//     const [r, d, s] = await Promise.all([listRuns({ date, depotId: depotFilter }), listDepots(), listStaff()])
//     setRuns(r); setDepots(d); setStaff(s); setLoading(false)
//   }

//   useEffect(() => { setLoading(true); refresh() }, [date, depotFilter])
//   useEffect(() => { setStatusFilter('all') }, [date, depotFilter]) // don't carry a filter across days silently

//   const depotName = (id) => depots.find((d) => d.id === id)?.name || '—'
//   const staffName = (id) => staff.find((s) => s.id === id)?.full_name
//   const availableStaff = staff.filter((s) => s.active) // drivers aren't tied to a depot

//   // Viewers don't get a Price column or a trailing action column, so their
//   // table has fewer columns than admin's.
//   const columnCount = isAdmin ? 9 : 7

//   const statusCounts = useMemo(() => {
//     const counts = { all: runs.length }
//     STATUS_ORDER.forEach((s) => { counts[s] = runs.filter((r) => r.status === s).length })
//     return counts
//   }, [runs])

//   const visibleRuns = statusFilter === 'all' ? runs : runs.filter((r) => r.status === statusFilter)

//   function shiftDate(days) {
//     setDate((prev) => {
//       const d = new Date(prev + 'T00:00:00')
//       d.setDate(d.getDate() + days)
//       return iso(d)
//     })
//   }

//   async function handleAssign(run, staffId) {
//     if (!isAdmin) return
//     setRuns((rs) => rs.map((r) => (r.id === run.id ? { ...r, staff_id: staffId || null, status: staffId ? 'scheduled' : 'unassigned' } : r)))
//     await assignStaffToRun(run.id, staffId)
//   }

//   async function handleStatus(run, status) {
//     if (!isAdmin) return
//     setRuns((rs) => rs.map((r) => (r.id === run.id ? { ...r, status } : r)))
//     await updateRun(run.id, { status })
//   }

//   async function handleDelete(run) {
//     if (!isAdmin) return
//     if (!confirm(`Remove ${run.run_number}?`)) return
//     setRuns((rs) => rs.filter((r) => r.id !== run.id))
//     await deleteRun(run.id)
//   }

//   async function handleAdd(payloads) {
//     if (!isAdmin) return
//     const created = await Promise.all(payloads.map((p) => createRun(p)))
//     setModalOpen(false)
//     const matching = created.filter(
//       (c) => c.run_date === date && (depotFilter === 'all' || c.depot_id === depotFilter)
//     )
//     if (matching.length) {
//       setRuns((rs) => [...rs, ...matching].sort((a, b) => a.start_time.localeCompare(b.start_time)))
//     }
//   }

//   return (
//     <AppLayout
//       title="Schedule"
//       subtitle={isAdmin ? "Build and adjust the day's runs." : "View-only — contact Xenigate to change a run."}
//     >
//       <div className="panel p-4 md:p-5">
//         <div className="flex flex-wrap items-center gap-3">
//           <div className="flex items-center gap-1 rounded-lg bg-canvas p-1">
//             <button type="button" onClick={() => shiftDate(-1)} className="rounded-md p-1.5 text-ash-600 hover:bg-white">
//               <ChevronLeft size={16} />
//             </button>
//             <span className="px-2 text-[13.5px] font-semibold text-ink">{fmtDate(date)}</span>
//             <button type="button" onClick={() => shiftDate(1)} className="rounded-md p-1.5 text-ash-600 hover:bg-white">
//               <ChevronRight size={16} />
//             </button>
//           </div>
//           <button type="button" onClick={() => setDate(iso(new Date()))} className="btn-ghost">Today</button>
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="field w-auto"
//             aria-label="Jump to date"
//           />

//           <select value={depotFilter} onChange={(e) => setDepotFilter(e.target.value)} className="field ml-auto w-auto md:w-48">
//             <option value="all">All depots</option>
//             {depots.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
//           </select>

//           {isAdmin && (
//             <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
//               <Plus size={16} /> Add run
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Day summary */}
//       <div className="mt-5 panel p-5">
//         <p className="text-[11px] font-semibold uppercase tracking-wide text-good">Completed today</p>
//         <p className="mt-2 font-display text-[28px] font-semibold text-ink">{statusCounts.completed || 0}</p>
//         <p className="text-[12px] text-ash-500">of {statusCounts.all} run{statusCounts.all === 1 ? '' : 's'}</p>
//       </div>

//       {/* Status filter chips */}
//       <div className="mt-5 flex flex-wrap gap-2">
//         <button
//           onClick={() => setStatusFilter('all')}
//           className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition ${
//             statusFilter === 'all' ? 'bg-route-600 text-white' : 'border border-black/10 bg-white text-ash-600 hover:border-route-400/50'
//           }`}
//         >
//           All ({statusCounts.all})
//         </button>
//         {STATUS_ORDER.map((s) => (
//           <button
//             key={s}
//             onClick={() => setStatusFilter(s)}
//             className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition ${
//               statusFilter === s ? 'bg-route-600 text-white' : 'border border-black/10 bg-white text-ash-600 hover:border-route-400/50'
//             }`}
//           >
//             {STATUS_LABEL[s]} ({statusCounts[s] || 0})
//           </button>
//         ))}
//       </div>

//       <div className="panel mt-4 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[860px] border-collapse">
//             <thead>
//               <tr className="border-b border-black/5 text-left text-[11.5px] font-semibold uppercase tracking-wide text-ash-500">
//                 <th className="px-5 py-3">Run</th>
//                 <th className="px-4 py-3">Collection depot</th>
//                 <th className="px-4 py-3">Delivery</th>
//                 <th className="px-4 py-3">Collection</th>
//                 <th className="px-4 py-3">Delivery time</th>
//                 <th className="px-4 py-3">Driver</th>
//                 {isAdmin && <th className="px-4 py-3">Price</th>}
//                 <th className="px-4 py-3">Status</th>
//                 {isAdmin && <th className="px-4 py-3"></th>}
//               </tr>
//             </thead>
//             <tbody>
//               {loading && <tr><td colSpan={columnCount} className="px-5 py-10 text-center text-[13px] text-ash-500">Loading runs…</td></tr>}
//               {!loading && visibleRuns.length === 0 && (
//                 <tr>
//                   <td colSpan={columnCount} className="px-5 py-10 text-center text-[13px] text-ash-500">
//                     {statusFilter === 'all' ? 'No runs for this day.' : `No ${STATUS_LABEL[statusFilter].toLowerCase()} runs for this day.`}
//                   </td>
//                 </tr>
//               )}
//               {visibleRuns.map((r) => (
//                 <tr key={r.id} className="border-b border-black/5 last:border-0 hover:bg-canvas/60">
//                   <td className="px-5 py-3 text-[13.5px] font-semibold text-ink">{r.run_number}</td>
//                   <td className="px-4 py-3 text-[13px] text-ash-600">{depotName(r.depot_id)}</td>
//                   <td className="px-4 py-3 text-[13px] text-ink">{r.delivery}</td>
//                   <td className="px-4 py-3 font-display text-[13px] font-semibold text-ink">{r.start_time}</td>
//                   <td className="px-4 py-3 font-display text-[13px] font-semibold text-ink">{r.delivery_time || '—'}</td>
//                   <td className="px-4 py-3">
//                     {isAdmin ? (
//                       <select
//                         value={r.staff_id || ''}
//                         onChange={(e) => handleAssign(r, e.target.value)}
//                         className={`rounded-lg border px-2.5 py-1.5 text-[12.5px] ${r.staff_id ? 'border-black/10 text-ink' : 'border-bad/30 text-bad'}`}
//                       >
//                         <option value="">Unassigned</option>
//                         {availableStaff.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
//                       </select>
//                     ) : (
//                       <span className={`text-[13px] ${r.staff_id ? 'text-ink' : 'font-medium text-bad'}`}>
//                         {r.staff_id ? staffName(r.staff_id) : 'Unassigned'}
//                       </span>
//                     )}
//                   </td>
//                   {isAdmin && <td className="px-4 py-3 text-[13px] font-medium text-ink">{money(r.price)}</td>}
//                   <td className="px-4 py-3">
//                     {isAdmin ? (
//                       <select
//                         value={r.status}
//                         onChange={(e) => handleStatus(r, e.target.value)}
//                         className="rounded-lg border-0 bg-transparent text-[12px] font-semibold"
//                       >
//                         <option value="unassigned">Unassigned</option>
//                         <option value="scheduled">Scheduled</option>
//                         <option value="in_progress">In progress</option>
//                         <option value="completed">Completed</option>
//                         <option value="cancelled">Cancelled</option>
//                       </select>
//                     ) : (
//                       <Badge status={r.status} />
//                     )}
//                   </td>
//                   {isAdmin && (
//                     <td className="px-4 py-3 text-right">
//                       <button onClick={() => handleDelete(r)} className="rounded-lg p-1.5 text-ash-400 hover:bg-bad/10 hover:text-bad">
//                         <Trash2 size={15} />
//                       </button>
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {isAdmin && (
//         <RunFormModal
//           open={modalOpen}
//           onClose={() => setModalOpen(false)}
//           onSave={handleAdd}
//           depots={depots}
//           staff={staff}
//           date={date}
//           isAdmin={isAdmin}
//         />
//       )}
//     </AppLayout>
//   )
// }
import React, { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout.jsx'
import RunFormModal from '../components/schedule/RunFormModal.jsx'
import Badge from '../components/ui/Badge.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { listRuns, listDepots, listStaff, createRun, assignStaffToRun, deleteRun, updateRun, priceWithVat } from '../data/dataService.js'
import { toLocalISODate } from '../lib/dates.js'

const iso = toLocalISODate

const fmtDate = (isoStr) => new Date(isoStr + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const money = (n) => (n || n === 0 ? `£${Number(n).toFixed(2)}` : '—')

const STATUS_ORDER = ['unassigned', 'scheduled', 'in_progress', 'completed', 'cancelled']
const STATUS_LABEL = {
  unassigned: 'Unassigned', scheduled: 'Scheduled', in_progress: 'In progress',
  completed: 'Completed', cancelled: 'Cancelled',
}

export default function Schedule() {
  // isAdmin === Xenigate staff (full control). Everyone else (the client's
  // dispatcher account) is view-only on this page — no add/assign/status
  // change/delete. This is a UI-level guard only; if you're on Supabase,
  // also lock the "runs" table write policies to admins (see schema.sql
  // notes) so a technical client user can't bypass this via the API directly.
  const { isAdmin, user } = useAuth()
  const [date, setDate] = useState(iso(new Date()))
  const [depotFilter, setDepotFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [runs, setRuns] = useState([])
  const [depots, setDepots] = useState([])
  const [staff, setStaff] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  async function refresh() {
    const [r, d, s] = await Promise.all([listRuns({ date, depotId: depotFilter }), listDepots(), listStaff()])
    setRuns(r); setDepots(d); setStaff(s); setLoading(false)
  }

  useEffect(() => { setLoading(true); refresh() }, [date, depotFilter])
  useEffect(() => { setStatusFilter('all') }, [date, depotFilter]) // don't carry a filter across days silently

  const depotName = (id) => depots.find((d) => d.id === id)?.name || '—'
  const staffName = (id) => staff.find((s) => s.id === id)?.full_name
  const availableStaff = staff.filter((s) => s.active) // drivers aren't tied to a depot

  // Viewers don't get a Price column or a trailing action column, so their
  // table has fewer columns than admin's.
  const columnCount = isAdmin ? 9 : 7

  const statusCounts = useMemo(() => {
    const counts = { all: runs.length }
    STATUS_ORDER.forEach((s) => { counts[s] = runs.filter((r) => r.status === s).length })
    return counts
  }, [runs])

  const visibleRuns = statusFilter === 'all' ? runs : runs.filter((r) => r.status === statusFilter)

  function shiftDate(days) {
    setDate((prev) => {
      const d = new Date(prev + 'T00:00:00')
      d.setDate(d.getDate() + days)
      return iso(d)
    })
  }

  async function handleAssign(run, staffId) {
    if (!isAdmin) return
    setRuns((rs) => rs.map((r) => (r.id === run.id ? { ...r, staff_id: staffId || null, status: staffId ? 'scheduled' : 'unassigned' } : r)))
    await assignStaffToRun(run.id, staffId)
  }

  async function handleStatus(run, status) {
    if (!isAdmin) return
    setRuns((rs) => rs.map((r) => (r.id === run.id ? { ...r, status } : r)))
    await updateRun(run.id, { status })
  }

  async function handleDelete(run) {
    if (!isAdmin) return
    if (!confirm(`Remove ${run.run_number}? It will still be kept on the Deleted Runs page.`)) return
    setRuns((rs) => rs.filter((r) => r.id !== run.id))
    await deleteRun(run.id, user?.full_name || user?.email || null)
  }

  async function handleAdd(payloads) {
    if (!isAdmin) return
    const created = await Promise.all(payloads.map((p) => createRun(p)))
    setModalOpen(false)
    const matching = created.filter(
      (c) => c.run_date === date && (depotFilter === 'all' || c.depot_id === depotFilter)
    )
    if (matching.length) {
      setRuns((rs) => [...rs, ...matching].sort((a, b) => a.start_time.localeCompare(b.start_time)))
    }
  }

  return (
    <AppLayout
      title="Schedule"
      subtitle={isAdmin ? "Build and adjust the day's runs." : "View-only — contact Xenigate to change a run."}
    >
      <div className="panel p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg bg-canvas p-1">
            <button type="button" onClick={() => shiftDate(-1)} className="rounded-md p-1.5 text-ash-600 hover:bg-white">
              <ChevronLeft size={16} />
            </button>
            <span className="px-2 text-[13.5px] font-semibold text-ink">{fmtDate(date)}</span>
            <button type="button" onClick={() => shiftDate(1)} className="rounded-md p-1.5 text-ash-600 hover:bg-white">
              <ChevronRight size={16} />
            </button>
          </div>
          <button type="button" onClick={() => setDate(iso(new Date()))} className="btn-ghost">Today</button>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="field w-auto"
            aria-label="Jump to date"
          />

          <select value={depotFilter} onChange={(e) => setDepotFilter(e.target.value)} className="field ml-auto w-auto md:w-48">
            <option value="all">All depots</option>
            {depots.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>

          {isAdmin && (
            <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
              <Plus size={16} /> Add run
            </button>
          )}
        </div>
      </div>

      {/* Day summary */}
      <div className="mt-5 panel p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-good">Completed today</p>
        <p className="mt-2 font-display text-[28px] font-semibold text-ink">{statusCounts.completed || 0}</p>
        <p className="text-[12px] text-ash-500">of {statusCounts.all} run{statusCounts.all === 1 ? '' : 's'}</p>
      </div>

      {/* Status filter chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition ${
            statusFilter === 'all' ? 'bg-route-600 text-white' : 'border border-black/10 bg-white text-ash-600 hover:border-route-400/50'
          }`}
        >
          All ({statusCounts.all})
        </button>
        {STATUS_ORDER.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition ${
              statusFilter === s ? 'bg-route-600 text-white' : 'border border-black/10 bg-white text-ash-600 hover:border-route-400/50'
            }`}
          >
            {STATUS_LABEL[s]} ({statusCounts[s] || 0})
          </button>
        ))}
      </div>

      <div className="panel mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse">
            <thead>
              <tr className="border-b border-black/5 text-left text-[11.5px] font-semibold uppercase tracking-wide text-ash-500">
                <th className="px-5 py-3">Run</th>
                <th className="px-4 py-3">Collection depot</th>
                <th className="px-4 py-3">Delivery</th>
                <th className="px-4 py-3">Collection</th>
                <th className="px-4 py-3">Delivery time</th>
                <th className="px-4 py-3">Driver</th>
                {isAdmin && <th className="px-4 py-3">Price (inc. VAT)</th>}
                <th className="px-4 py-3">Status</th>
                {isAdmin && <th className="px-4 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={columnCount} className="px-5 py-10 text-center text-[13px] text-ash-500">Loading runs…</td></tr>}
              {!loading && visibleRuns.length === 0 && (
                <tr>
                  <td colSpan={columnCount} className="px-5 py-10 text-center text-[13px] text-ash-500">
                    {statusFilter === 'all' ? 'No runs for this day.' : `No ${STATUS_LABEL[statusFilter].toLowerCase()} runs for this day.`}
                  </td>
                </tr>
              )}
              {visibleRuns.map((r) => (
                <tr key={r.id} className="border-b border-black/5 last:border-0 hover:bg-canvas/60">
                  <td className="px-5 py-3 text-[13.5px] font-semibold text-ink">{r.run_number}</td>
                  <td className="px-4 py-3 text-[13px] text-ash-600">{depotName(r.depot_id)}</td>
                  <td className="px-4 py-3 text-[13px] text-ink">{r.delivery}</td>
                  <td className="px-4 py-3 font-display text-[13px] font-semibold text-ink">{r.start_time}</td>
                  <td className="px-4 py-3 font-display text-[13px] font-semibold text-ink">{r.delivery_time || '—'}</td>
                  <td className="px-4 py-3">
                    {isAdmin ? (
                      <select
                        value={r.staff_id || ''}
                        onChange={(e) => handleAssign(r, e.target.value)}
                        className={`rounded-lg border px-2.5 py-1.5 text-[12.5px] ${r.staff_id ? 'border-black/10 text-ink' : 'border-bad/30 text-bad'}`}
                      >
                        <option value="">Unassigned</option>
                        {availableStaff.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                      </select>
                    ) : (
                      <span className={`text-[13px] ${r.staff_id ? 'text-ink' : 'font-medium text-bad'}`}>
                        {r.staff_id ? staffName(r.staff_id) : 'Unassigned'}
                      </span>
                    )}
                  </td>
                  {isAdmin && <td className="px-4 py-3 text-[13px] font-medium text-ink">{money(priceWithVat(r.price))}</td>}
                  <td className="px-4 py-3">
                    {isAdmin ? (
                      <select
                        value={r.status}
                        onChange={(e) => handleStatus(r, e.target.value)}
                        className="rounded-lg border-0 bg-transparent text-[12px] font-semibold"
                      >
                        <option value="unassigned">Unassigned</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="in_progress">In progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <Badge status={r.status} />
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(r)} className="rounded-lg p-1.5 text-ash-400 hover:bg-bad/10 hover:text-bad">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAdmin && (
        <RunFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleAdd}
          depots={depots}
          staff={staff}
          date={date}
          isAdmin={isAdmin}
        />
      )}
    </AppLayout>
  )
}