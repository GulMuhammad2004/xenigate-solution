// Seed data for demo mode. Shapes mirror the Supabase tables in
// supabase/schema.sql exactly, so switching to a real project later is a
// drop-in change inside dataService.js — no other file needs to know.

// Depots are the collection points themselves — no separate "collection"
// field is needed on a run, it's just the depot.
export const seedDepots = [
  { id: 'dep-1', name: 'NG22 9LD' },
  { id: 'dep-2', name: 'S35 2PW' },
  { id: 'dep-3', name: 'DE74' },
]

// Drivers aren't tied to a single depot — any driver can be assigned to
// collect from any depot.
export const seedStaff = [
  { id: 'stf-1', full_name: 'Ahmed Khan', phone: '07700 900111', active: true },
  { id: 'stf-2', full_name: 'Ali Raza', phone: '07700 900112', active: true },
  { id: 'stf-3', full_name: 'John Smith', phone: '07700 900113', active: true },
  { id: 'stf-4', full_name: 'Fatima Noor', phone: '07700 900114', active: true },
  { id: 'stf-5', full_name: 'David Wren', phone: '07700 900115', active: true },
  { id: 'stf-6', full_name: 'Bilal Sheikh', phone: '07700 900116', active: false },
]

const iso = (d) => d.toISOString().slice(0, 10)
const today = new Date()
const dateOffset = (n) => {
  const d = new Date(today)
  d.setDate(d.getDate() + n)
  return iso(d)
}

// Delivery destinations (customer locations) — collections always happen
// at one of the depots above, so only the delivery end varies.
const deliveries = ['LE3', 'WS10', 'CV1', 'B12', 'WS1', 'CV2', 'CV3', 'DN4', 'NG1', 'LE19']

function addMinutes(time, mins) {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + mins
  const hh = Math.floor((total % (24 * 60)) / 60)
  const mm = total % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

const statuses = ['scheduled', 'scheduled', 'scheduled', 'unassigned', 'completed']

// Rough per-run price for demo data — real prices are entered per run
// through the Add Run form. Admin-only figure, never shown to dispatchers.
function samplePrice(i) {
  const base = 60 + (i % 5) * 15
  return base
}

function buildRuns() {
  const runs = []
  let counter = 1
  for (let dayOffset = -2; dayOffset <= 4; dayOffset++) {
    const date = dateOffset(dayOffset)
    const runCount = 6 + (Math.abs(dayOffset) % 3)
    for (let i = 0; i < runCount; i++) {
      const depot = seedDepots[i % seedDepots.length]
      const delivery = deliveries[(counter + i) % deliveries.length]
      const hour = 4 + Math.floor(i / 2)
      const minute = i % 2 === 0 ? '00' : '30'
      const startTime = `${String(hour).padStart(2, '0')}:${minute}`
      const deliveryTime = addMinutes(startTime, 90 + (i % 3) * 30)
      const status = dayOffset < 0 ? 'completed' : statuses[(counter + i) % statuses.length]
      const activeStaff = seedStaff.filter((s) => s.active)
      const staff = status === 'unassigned' ? null : activeStaff[(counter + i) % activeStaff.length]
      runs.push({
        id: `run-${counter}`,
        run_number: `XFS-${String((i % runCount) + 1).padStart(3, '0')}`,
        run_date: date,
        depot_id: depot.id,
        delivery,
        start_time: startTime,
        delivery_time: deliveryTime,
        staff_id: staff ? staff.id : null,
        status,
        price: samplePrice(counter + i),
        notes: '',
      })
      counter++
    }
  }
  return runs
}

export const seedRuns = buildRuns()

export const demoUsers = [
  {
    id: 'usr-admin',
    email: 'admin@xenigate.com',
    password: 'admin123',
    full_name: 'Umar Farooq',
    role: 'admin',
    company: 'Xenigate Freight Solutions',
  },
  {
    id: 'usr-dispatch',
    email: 'dispatcher@client.com',
    password: 'dispatch123',
    full_name: 'Client Dispatcher',
    role: 'dispatcher',
    company: 'Client Logistics Ltd',
  },
]