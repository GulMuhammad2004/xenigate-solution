import React, { useEffect, useState } from 'react'
import { ShieldCheck, Database, RefreshCcw, Users, Warehouse, Route } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { demoUsers } from '../data/mockData.js'
import { resetDemoData } from '../data/store.js'
import { listRuns, listDepots, listStaff } from '../data/dataService.js'
import { SUPABASE_CONFIGURED } from '../lib/supabaseClient.js'

export default function Admin() {
  const { demoMode } = useAuth()
  const [counts, setCounts] = useState({ runs: 0, depots: 0, staff: 0 })

  async function refresh() {
    const [r, d, s] = await Promise.all([listRuns({}), listDepots(), listStaff()])
    setCounts({ runs: r.length, depots: d.length, staff: s.length })
  }
  useEffect(() => { refresh() }, [])

  function handleReset() {
    if (!confirm('Reset all demo data back to the seeded example schedule?')) return
    resetDemoData()
    refresh()
  }

  return (
    <AppLayout title="Admin Portal" subtitle="System status, accounts and data controls — visible to admins only.">
      <div className="panel flex items-center gap-4 p-5">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${SUPABASE_CONFIGURED ? 'bg-good/10 text-good' : 'bg-signal/15 text-signal'}`}>
          <Database size={19} />
        </span>
        <div>
          <p className="text-[13.5px] font-semibold text-ink">
            {SUPABASE_CONFIGURED ? 'Connected to Supabase' : 'Running in demo mode'}
          </p>
          <p className="text-[12.5px] text-ash-500">
            {SUPABASE_CONFIGURED
              ? 'Reads and writes are going to your live Supabase project.'
              : 'Data lives in this browser only. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to go live — see README.md.'}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        {[
          { label: 'Total runs on file', value: counts.runs, icon: Route },
          { label: 'Depots', value: counts.depots, icon: Warehouse },
          { label: 'Staff', value: counts.staff, icon: Users },
        ].map((c) => (
          <div key={c.label} className="panel p-4">
            <c.icon size={17} className="text-route-600" />
            <p className="mt-2.5 font-display text-[22px] font-semibold text-ink">{c.value}</p>
            <p className="text-[12px] text-ash-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="panel mt-5 p-5">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck size={17} className="text-route-600" />
          <h2 className="font-display text-[15px] font-semibold text-ink">Accounts</h2>
        </div>
        {demoMode ? (
          <>
            <p className="mb-4 text-[12.5px] text-ash-500">
              Demo accounts, seeded locally. Once Supabase is connected, invite real users from your Supabase dashboard —
              each new sign-up gets a <code className="rounded bg-canvas px-1 py-0.5">profiles</code> row automatically (see supabase/schema.sql), and you can promote
              anyone to admin from there.
            </p>
            <div className="divide-y divide-black/5">
              {demoUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-[13px] font-medium text-ink">{u.full_name}</p>
                    <p className="text-[12px] text-ash-500">{u.email} · {u.company}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${u.role === 'admin' ? 'bg-route-100 text-route-700' : 'bg-ash-500/10 text-ash-600'}`}>
                    {u.role === 'admin' ? 'Administrator' : 'Dispatcher'}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-[12.5px] text-ash-500">
            Manage users and roles from the Supabase dashboard under Authentication and the <code>profiles</code> table.
          </p>
        )}
      </div>

      {demoMode && (
        <div className="panel mt-5 flex items-center justify-between p-5">
          <div>
            <p className="text-[13.5px] font-semibold text-ink">Reset demo data</p>
            <p className="text-[12.5px] text-ash-500">Restore the original seeded runs, staff and depots.</p>
          </div>
          <button onClick={handleReset} className="btn-secondary"><RefreshCcw size={15} /> Reset</button>
        </div>
      )}
    </AppLayout>
  )
}
