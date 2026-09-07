// // Single data-access layer used by every page. In demo mode it reads and
// // writes the local mock store; once VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
// // are set (see README.md), it talks to the real Supabase tables instead.
// // No page or component imports Supabase directly — they only call these
// // functions, so connecting the real database is a one-file change.
// import { supabase, SUPABASE_CONFIGURED } from '../lib/supabaseClient.js'
// import { getDB, setTable, uid } from './store.js'

// const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms))

// // ---- Depots ---------------------------------------------------------------
// export async function listDepots() {
//   if (SUPABASE_CONFIGURED) {
//     const { data, error } = await supabase.from('depots').select('*').order('name')
//     if (error) throw error
//     return data
//   }
//   await delay()
//   return getDB().depots
// }

// export async function createDepot(payload) {
//   if (SUPABASE_CONFIGURED) {
//     const { data, error } = await supabase.from('depots').insert(payload).select().single()
//     if (error) throw error
//     return data
//   }
//   await delay()
//   const row = { id: uid('dep'), ...payload }
//   setTable('depots', [...getDB().depots, row])
//   return row
// }

// // ---- Staff ------------------------------------------------------------------
// export async function listStaff() {
//   if (SUPABASE_CONFIGURED) {
//     const { data, error } = await supabase.from('staff').select('*').order('full_name')
//     if (error) throw error
//     return data
//   }
//   await delay()
//   return getDB().staff
// }

// export async function createStaff(payload) {
//   if (SUPABASE_CONFIGURED) {
//     const { data, error } = await supabase.from('staff').insert(payload).select().single()
//     if (error) throw error
//     return data
//   }
//   await delay()
//   const row = { id: uid('stf'), active: true, ...payload }
//   setTable('staff', [...getDB().staff, row])
//   return row
// }

// export async function updateStaff(id, patch) {
//   if (SUPABASE_CONFIGURED) {
//     const { data, error } = await supabase.from('staff').update(patch).eq('id', id).select().single()
//     if (error) throw error
//     return data
//   }
//   await delay()
//   const rows = getDB().staff.map((s) => (s.id === id ? { ...s, ...patch } : s))
//   setTable('staff', rows)
//   return rows.find((s) => s.id === id)
// }

// // ---- Runs ---------------------------------------------------------------
// export async function listRuns(filters = {}) {
//   if (SUPABASE_CONFIGURED) {
//     let q = supabase.from('runs').select('*')
//     if (filters.date) q = q.eq('run_date', filters.date)
//     if (filters.from) q = q.gte('run_date', filters.from)
//     if (filters.to) q = q.lte('run_date', filters.to)
//     if (filters.depotId && filters.depotId !== 'all') q = q.eq('depot_id', filters.depotId)
//     if (filters.staffId && filters.staffId !== 'all') q = q.eq('staff_id', filters.staffId)
//     const { data, error } = await q.order('run_date').order('start_time')
//     if (error) throw error
//     return data
//   }
//   await delay()
//   let rows = getDB().runs
//   if (filters.date) rows = rows.filter((r) => r.run_date === filters.date)
//   if (filters.from) rows = rows.filter((r) => r.run_date >= filters.from)
//   if (filters.to) rows = rows.filter((r) => r.run_date <= filters.to)
//   if (filters.depotId && filters.depotId !== 'all') rows = rows.filter((r) => r.depot_id === filters.depotId)
//   if (filters.staffId && filters.staffId !== 'all') rows = rows.filter((r) => r.staff_id === filters.staffId)
//   if (filters.search) {
//     const q = filters.search.trim().toLowerCase()
//     rows = rows.filter((r) =>
//       r.run_number.toLowerCase().includes(q) ||
//       r.delivery.toLowerCase().includes(q)
//     )
//   }
//   return [...rows].sort((a, b) => (a.run_date + a.start_time).localeCompare(b.run_date + b.start_time))
// }

// export async function createRun(payload) {
//   if (SUPABASE_CONFIGURED) {
//     const { data, error } = await supabase.from('runs').insert(payload).select().single()
//     if (error) throw error
//     return data
//   }
//   await delay()
//   const row = {
//     id: uid('run'),
//     status: payload.staff_id ? 'scheduled' : 'unassigned',
//     notes: '',
//     ...payload,
//   }
//   setTable('runs', [...getDB().runs, row])
//   return row
// }

// export async function updateRun(id, patch) {
//   if (SUPABASE_CONFIGURED) {
//     const { data, error } = await supabase.from('runs').update(patch).eq('id', id).select().single()
//     if (error) throw error
//     return data
//   }
//   await delay()
//   const rows = getDB().runs.map((r) => (r.id === id ? { ...r, ...patch } : r))
//   setTable('runs', rows)
//   return rows.find((r) => r.id === id)
// }

// export async function assignStaffToRun(runId, staffId) {
//   return updateRun(runId, { staff_id: staffId || null, status: staffId ? 'scheduled' : 'unassigned' })
// }

// export async function deleteRun(id) {
//   if (SUPABASE_CONFIGURED) {
//     const { error } = await supabase.from('runs').delete().eq('id', id)
//     if (error) throw error
//     return true
//   }
//   await delay()
//   setTable('runs', getDB().runs.filter((r) => r.id !== id))
//   return true
// }

// // ---- Aggregates for dashboard + reports --------------------------------
// export function summarize(runs) {
//   const total = runs.length
//   const unassigned = runs.filter((r) => r.status === 'unassigned').length
//   const completed = runs.filter((r) => r.status === 'completed').length
//   const scheduled = runs.filter((r) => r.status === 'scheduled').length
//   return { total, unassigned, completed, scheduled }
// }

// export function groupByDepot(runs, depots) {
//   return depots.map((d) => ({
//     depot: d,
//     runs: runs.filter((r) => r.depot_id === d.id),
//   }))
// }

// export function groupByStaff(runs, staff) {
//   return staff.map((s) => ({
//     staff: s,
//     runs: runs.filter((r) => r.staff_id === s.id),
//   }))
// }

// export function groupByDate(runs) {
//   const map = new Map()
//   runs.forEach((r) => {
//     if (!map.has(r.run_date)) map.set(r.run_date, [])
//     map.get(r.run_date).push(r)
//   })
//   return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, rows]) => ({ date, runs: rows }))
// }

// // Sums the price field across a set of runs. Admin-only figures — pages
// // visible to dispatchers should never call this or read r.price.
// export function sumPrice(runs) {
//   return runs.reduce((sum, r) => sum + (Number(r.price) || 0), 0)
// }

// // Works out the next XFS-### number for a given date by looking at the
// // highest existing number already used that day — resets naturally every
// // day since it only looks at runs on that specific date.
// export async function nextRunNumberForDate(date) {
//   const dayRuns = await listRuns({ date })
//   const prefix = 'XFS-'
//   let max = 0
//   dayRuns.forEach((r) => {
//     const match = r.run_number && r.run_number.match(new RegExp(`^${prefix}(\\d+)$`))
//     if (match) {
//       const n = parseInt(match[1], 10)
//       if (n > max) max = n
//     }
//   })
//   return `${prefix}${String(max + 1).padStart(3, '0')}`
// }
// Single data-access layer used by every page. In demo mode it reads and
// writes the local mock store; once VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
// are set (see README.md), it talks to the real Supabase tables instead.
// No page or component imports Supabase directly — they only call these
// functions, so connecting the real database is a one-file change.
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabaseClient.js'
import { getDB, setTable, uid } from './store.js'

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms))

// ---- Depots ---------------------------------------------------------------
export async function listDepots() {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('depots').select('*').order('name')
    if (error) throw error
    return data
  }
  await delay()
  return getDB().depots
}

export async function createDepot(payload) {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('depots').insert(payload).select().single()
    if (error) throw error
    return data
  }
  await delay()
  const row = { id: uid('dep'), ...payload }
  setTable('depots', [...getDB().depots, row])
  return row
}

// ---- Staff ------------------------------------------------------------------
export async function listStaff() {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('staff').select('*').order('full_name')
    if (error) throw error
    return data
  }
  await delay()
  return getDB().staff
}

export async function createStaff(payload) {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('staff').insert(payload).select().single()
    if (error) throw error
    return data
  }
  await delay()
  const row = { id: uid('stf'), active: true, ...payload }
  setTable('staff', [...getDB().staff, row])
  return row
}

export async function updateStaff(id, patch) {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('staff').update(patch).eq('id', id).select().single()
    if (error) throw error
    return data
  }
  await delay()
  const rows = getDB().staff.map((s) => (s.id === id ? { ...s, ...patch } : s))
  setTable('staff', rows)
  return rows.find((s) => s.id === id)
}

// ---- Runs ---------------------------------------------------------------
export async function listRuns(filters = {}) {
  if (SUPABASE_CONFIGURED) {
    let q = supabase.from('runs').select('*').is('deleted_at', null)
    if (filters.date) q = q.eq('run_date', filters.date)
    if (filters.from) q = q.gte('run_date', filters.from)
    if (filters.to) q = q.lte('run_date', filters.to)
    if (filters.depotId && filters.depotId !== 'all') q = q.eq('depot_id', filters.depotId)
    if (filters.staffId && filters.staffId !== 'all') q = q.eq('staff_id', filters.staffId)
    const { data, error } = await q.order('run_date').order('start_time')
    if (error) throw error
    return data
  }
  await delay()
  let rows = getDB().runs.filter((r) => !r.deleted_at) // deleted runs never show in normal lists
  if (filters.date) rows = rows.filter((r) => r.run_date === filters.date)
  if (filters.from) rows = rows.filter((r) => r.run_date >= filters.from)
  if (filters.to) rows = rows.filter((r) => r.run_date <= filters.to)
  if (filters.depotId && filters.depotId !== 'all') rows = rows.filter((r) => r.depot_id === filters.depotId)
  if (filters.staffId && filters.staffId !== 'all') rows = rows.filter((r) => r.staff_id === filters.staffId)
  if (filters.search) {
    const q = filters.search.trim().toLowerCase()
    rows = rows.filter((r) =>
      r.run_number.toLowerCase().includes(q) ||
      r.delivery.toLowerCase().includes(q)
    )
  }
  return [...rows].sort((a, b) => (a.run_date + a.start_time).localeCompare(b.run_date + b.start_time))
}

export async function createRun(payload) {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('runs').insert(payload).select().single()
    if (error) throw error
    return data
  }
  await delay()
  const row = {
    id: uid('run'),
    status: payload.staff_id ? 'scheduled' : 'unassigned',
    notes: '',
    ...payload,
  }
  setTable('runs', [...getDB().runs, row])
  return row
}

export async function updateRun(id, patch) {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('runs').update(patch).eq('id', id).select().single()
    if (error) throw error
    return data
  }
  await delay()
  const rows = getDB().runs.map((r) => (r.id === id ? { ...r, ...patch } : r))
  setTable('runs', rows)
  return rows.find((r) => r.id === id)
}

export async function assignStaffToRun(runId, staffId) {
  return updateRun(runId, { staff_id: staffId || null, status: staffId ? 'scheduled' : 'unassigned' })
}

// Soft delete: marks the run as deleted instead of removing it, so it drops
// out of Schedule/Runs/Earnings immediately but still exists as a record on
// the Deleted Runs page. deletedBy is whatever label you want attached
// (e.g. the admin's name) — pass null if you don't have one handy.
export async function deleteRun(id, deletedBy = null) {
  const patch = { deleted_at: new Date().toISOString(), deleted_by: deletedBy }
  if (SUPABASE_CONFIGURED) {
    const { error } = await supabase.from('runs').update(patch).eq('id', id)
    if (error) throw error
    return true
  }
  await delay()
  const rows = getDB().runs.map((r) => (r.id === id ? { ...r, ...patch } : r))
  setTable('runs', rows)
  return true
}

// Admin-only audit trail: every run that's been soft-deleted, most recent
// first. Never called from a page a dispatcher can reach.
export async function listDeletedRuns() {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase
      .from('runs')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false })
    if (error) throw error
    return data
  }
  await delay()
  return [...getDB().runs]
    .filter((r) => r.deleted_at)
    .sort((a, b) => (b.deleted_at || '').localeCompare(a.deleted_at || ''))
}

// ---- Aggregates for dashboard + reports --------------------------------
export function summarize(runs) {
  const total = runs.length
  const unassigned = runs.filter((r) => r.status === 'unassigned').length
  const completed = runs.filter((r) => r.status === 'completed').length
  const scheduled = runs.filter((r) => r.status === 'scheduled').length
  return { total, unassigned, completed, scheduled }
}

export function groupByDepot(runs, depots) {
  return depots.map((d) => ({
    depot: d,
    runs: runs.filter((r) => r.depot_id === d.id),
  }))
}

export function groupByStaff(runs, staff) {
  return staff.map((s) => ({
    staff: s,
    runs: runs.filter((r) => r.staff_id === s.id),
  }))
}

export function groupByDate(runs) {
  const map = new Map()
  runs.forEach((r) => {
    if (!map.has(r.run_date)) map.set(r.run_date, [])
    map.get(r.run_date).push(r)
  })
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, rows]) => ({ date, runs: rows }))
}

// Sums the price field across a set of runs. Admin-only figures — pages
// visible to dispatchers should never call this or read r.price.
//
// Two fixed business rules baked in here (so every page that totals prices
// automatically gets them right, with nothing to remember elsewhere):
//   1. VAT is a flat 20% added on top of the price entered on each run.
//   2. Cancelled runs never count towards a total — they didn't happen.
export const VAT_RATE = 0.2

export function priceWithVat(price) {
  const base = Number(price) || 0
  return base * (1 + VAT_RATE)
}

export function sumPrice(runs) {
  return runs
    .filter((r) => r.status !== 'cancelled')
    .reduce((sum, r) => sum + priceWithVat(r.price), 0)
}

// Works out the next XFS-### number for a given date by looking at the
// highest existing number already used that day — resets naturally every
// day since it only looks at runs on that specific date.
export async function nextRunNumberForDate(date) {
  const dayRuns = await listRuns({ date })
  const prefix = 'XFS-'
  let max = 0
  dayRuns.forEach((r) => {
    const match = r.run_number && r.run_number.match(new RegExp(`^${prefix}(\\d+)$`))
    if (match) {
      const n = parseInt(match[1], 10)
      if (n > max) max = n
    }
  })
  return `${prefix}${String(max + 1).padStart(3, '0')}`
}