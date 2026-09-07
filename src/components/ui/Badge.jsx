import React from 'react'

const STYLES = {
  scheduled: 'bg-route-100 text-route-700',
  unassigned: 'bg-bad/10 text-bad',
  completed: 'bg-good/10 text-good',
  in_progress: 'bg-signal/15 text-signal',
  cancelled: 'bg-ash-500/10 text-ash-600',
}

const LABELS = {
  scheduled: 'Scheduled',
  unassigned: 'Unassigned',
  completed: 'Completed',
  in_progress: 'In progress',
  cancelled: 'Cancelled',
}

export default function Badge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${STYLES[status] || STYLES.scheduled}`}>
      {LABELS[status] || status}
    </span>
  )
}
