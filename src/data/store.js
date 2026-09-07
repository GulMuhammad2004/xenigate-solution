// Tiny localStorage-backed persistence for demo mode, so edits made in the
// browser survive a refresh. Swapped out entirely once SUPABASE_CONFIGURED
// is true — see dataService.js.
import { seedDepots, seedStaff, seedRuns } from './mockData.js'

const KEY = 'xenigate_scheduler_v2'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) { /* ignore corrupt storage */ }
  const initial = { depots: seedDepots, staff: seedStaff, runs: seedRuns }
  localStorage.setItem(KEY, JSON.stringify(initial))
  return initial
}

let db = load()

function persist() {
  localStorage.setItem(KEY, JSON.stringify(db))
}

export function getDB() {
  return db
}

export function setTable(table, rows) {
  db[table] = rows
  persist()
}

export function resetDemoData() {
  db = { depots: seedDepots, staff: seedStaff, runs: seedRuns }
  persist()
}

export function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}
