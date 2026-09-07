import React, { useState } from 'react'
import { LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import MobileNav from './MobileNav.jsx'

export default function Topbar({ title, subtitle }) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const initials = (user?.full_name || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 bg-route-700/95 px-5 py-4 backdrop-blur md:px-8">
  <div className="flex items-center gap-3">
    <MobileNav />
    <div>
      <h1 className="font-display text-xl font-semibold text-white md:text-[26px]">{title}</h1>
      {subtitle && <p className="text-[13px] text-route-100/70">{subtitle}</p>}
    </div>
  </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-xl bg-white px-2.5 py-1.5 pr-3 shadow-panel"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-route-gradient text-[12px] font-semibold text-white">
            {initials}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-[13px] font-semibold leading-tight text-ink">{user?.full_name}</span>
            <span className="block text-[11px] leading-tight text-ash-500">{user?.role === 'admin' ? 'Administrator' : 'Dispatcher'}</span>
          </span>
          <ChevronDown size={15} className="text-ash-500" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-black/5 bg-white shadow-panel">
            <div className="border-b border-black/5 px-4 py-3">
              <p className="text-[12px] font-medium text-ink">{user?.company}</p>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-[13px] font-medium text-bad hover:bg-bad/5"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
