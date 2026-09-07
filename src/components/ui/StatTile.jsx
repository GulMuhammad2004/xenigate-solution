import React from 'react'

export default function StatTile({ label, value, tone = 'ink', icon: Icon, hint }) {
  const toneClasses = {
    ink: 'text-ink',
    route: 'text-route-600',
    bad: 'text-bad',
    good: 'text-good',
  }
  return (
    <div className="panel flex items-start justify-between p-5">
      <div>
        <p className="text-[12.5px] font-medium text-ash-500">{label}</p>
        <p className={`mt-2 font-display text-[30px] font-semibold leading-none ${toneClasses[tone]}`}>{value}</p>
        {hint && <p className="mt-1.5 text-[11.5px] text-ash-400">{hint}</p>}
      </div>
      {Icon && (
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-canvas ${toneClasses[tone]}`}>
          <Icon size={18} strokeWidth={2} />
        </span>
      )}
    </div>
  )
}
