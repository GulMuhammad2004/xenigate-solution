import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutGrid, CalendarClock, Route, Users, Warehouse, BarChart3, ShieldCheck, Wallet, Menu, X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/schedule', label: 'Schedule', icon: CalendarClock },
  { to: '/runs', label: 'Runs', icon: Route },
  { to: '/staff', label: 'Staff', icon: Users },
  { to: '/depots', label: 'Depots', icon: Warehouse },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const { isAdmin } = useAuth()

  return (
    <div className="md:hidden">
     <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-white hover:bg-white/10" aria-label="Open menu">
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div className="relative flex w-72 flex-col bg-route-700 p-5">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src="/logo.jpg" alt="Xenigate" className="h-8 w-8 rounded-md object-cover" />
                <span className="font-display text-sm font-semibold text-white">Xenigate</span>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-white/70 hover:bg-white/10">
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-1">
              {NAV.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium ${
                      isActive ? 'bg-white/10 text-white' : 'text-white/60'
                    }`
                  }
                >
                  <Icon size={17} /> {label}
                </NavLink>
              ))}
              {isAdmin && (
                <>
                  <NavLink
                    to="/earnings"
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `mt-3 flex items-center gap-3 rounded-lg border border-route-400/25 px-3.5 py-2.5 text-sm font-medium ${
                        isActive ? 'bg-route-500/15 text-white' : 'text-route-100/80'
                      }`
                    }
                  >
                    <Wallet size={17} /> Earnings
                  </NavLink>
                  <NavLink
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg border border-route-400/25 px-3.5 py-2.5 text-sm font-medium ${
                        isActive ? 'bg-route-500/15 text-white' : 'text-route-100/80'
                      }`
                    }
                  >
                    <ShieldCheck size={17} /> Admin Portal
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}