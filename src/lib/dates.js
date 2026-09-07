// Shared date helpers. Deliberately avoid toISOString() for local dates —
// it converts to UTC first, which silently shifts the date by a day for
// anyone not in the UTC+0 timezone (e.g. UTC+5 rolls local midnight back
// to 7pm the previous day). Always build YYYY-MM-DD from local fields.

export function toLocalISODate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayISO() {
  return toLocalISODate(new Date())
}

export function datesBetween(startISO, endISO) {
  const dates = []
  const cur = new Date(startISO + 'T00:00:00')
  const last = new Date(endISO + 'T00:00:00')
  while (cur <= last) {
    dates.push(toLocalISODate(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

// Returns the {from, to} ISO bounds for 'day' | 'week' | 'month' containing
// anchorISO. Weeks run Monday to Sunday.
export function rangeFor(anchorISO, range) {
  const anchor = new Date(anchorISO + 'T00:00:00')
  let from = new Date(anchor)
  if (range === 'week') {
    const day = (anchor.getDay() + 6) % 7 // Mon=0
    from.setDate(anchor.getDate() - day)
  } else if (range === 'month') {
    from = new Date(anchor.getFullYear(), anchor.getMonth(), 1)
  }
  let to = new Date(from)
  if (range === 'day') to = new Date(from)
  else if (range === 'week') to.setDate(from.getDate() + 6)
  else to = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0)
  return { from: toLocalISODate(from), to: toLocalISODate(to) }
}