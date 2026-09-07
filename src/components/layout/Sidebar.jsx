// import React from 'react'
// import { NavLink } from 'react-router-dom'
// import {
//   LayoutGrid, CalendarClock, Route, Users, Warehouse, BarChart3, ShieldCheck, Wallet,
// } from 'lucide-react'
// import { useAuth } from '../../context/AuthContext.jsx'

// const NAV = [
//   { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
//   { to: '/schedule', label: 'Schedule', icon: CalendarClock },
//   { to: '/runs', label: 'Runs', icon: Route },
//   { to: '/staff', label: 'Staff', icon: Users },
//   { to: '/depots', label: 'Depots', icon: Warehouse },
//   { to: '/reports', label: 'Reports', icon: BarChart3 },
// ]

// export default function Sidebar() {
//   const { isAdmin } = useAuth()
//   return (
//    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col bg-ink md:flex">
//       <div className="flex flex-col items-center gap-3 px-6 pb-5 pt-7">
//         <img src="/logo.jpg" alt="Xenigate Freight Solutions" className="h-11 w-full rounded-md object-cover" />
//         <div className="leading-tight">
//           <p className="font-display text-[15px] font-semibold text-white">Xenigate</p>
//           <p className="text-[11px] tracking-wide text-route-400">Run Scheduler</p>
//         </div>
//       </div>

//       <nav className="mt-2 flex-1 space-y-1 px-3">
//         {NAV.map(({ to, label, icon: Icon }) => (
//           <NavLink
//             key={to}
//             to={to}
//             className={({ isActive }) =>
//               `group relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[13.5px] font-medium transition ${
//                 isActive ? 'bg-white/[0.08] text-white' : 'text-white/60 hover:bg-white/[0.05] hover:text-white/90'
//               }`
//             }
//           >
//             {({ isActive }) => (
//               <>
//                 <span
//                   className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-route-400 transition-opacity ${
//                     isActive ? 'opacity-100' : 'opacity-0'
//                   }`}
//                 />
//                 <Icon size={17} strokeWidth={2} />
//                 {label}
//               </>
//             )}
//           </NavLink>
//         ))}

//         {isAdmin && (
//           <>
//             <NavLink
//               to="/earnings"
//               className={({ isActive }) =>
//                 `group relative mt-4 flex items-center gap-3 rounded-lg border border-route-400/25 px-3.5 py-2.5 text-[13.5px] font-medium transition ${
//                   isActive ? 'bg-route-500/15 text-white' : 'text-route-100/80 hover:bg-route-500/10 hover:text-white'
//                 }`
//               }
//             >
//               <Wallet size={17} strokeWidth={2} />
//               Earnings
//             </NavLink>
//             <NavLink
//               to="/admin"
//               className={({ isActive }) =>
//                 `group relative flex items-center gap-3 rounded-lg border border-route-400/25 px-3.5 py-2.5 text-[13.5px] font-medium transition ${
//                   isActive ? 'bg-route-500/15 text-white' : 'text-route-100/80 hover:bg-route-500/10 hover:text-white'
//                 }`
//               }
//             >
//               <ShieldCheck size={17} strokeWidth={2} />
//               Admin Portal
//             </NavLink>
//           </>
//         )}
//       </nav>

//       <div className="mx-4 mb-6 rounded-xl bg-white/[0.04] p-3.5">
//         <p className="text-[11px] leading-relaxed text-white/45">
//           Every run, tracked from collection to delivery — across every depot, every shift.
//         </p>
//       </div>
//     </aside>
//   )
// }
import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutGrid, CalendarClock, Route, Users, Warehouse, BarChart3, ShieldCheck, Wallet, Trash2,
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

export default function Sidebar() {
  const { isAdmin } = useAuth()
  return (
   <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col bg-ink md:flex">
      <div className="flex flex-col items-center gap-3 px-6 pb-5 pt-7">
        <img src="/logo.jpg" alt="Xenigate Freight Solutions" className="h-11 w-full rounded-md object-cover" />
        <div className="leading-tight">
          <p className="font-display text-[15px] font-semibold text-white">Xenigate</p>
          <p className="text-[11px] tracking-wide text-route-400">Run Scheduler</p>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[13.5px] font-medium transition ${
                isActive ? 'bg-white/[0.08] text-white' : 'text-white/60 hover:bg-white/[0.05] hover:text-white/90'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-route-400 transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <Icon size={17} strokeWidth={2} />
                {label}
              </>
            )}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <NavLink
              to="/earnings"
              className={({ isActive }) =>
                `group relative mt-4 flex items-center gap-3 rounded-lg border border-route-400/25 px-3.5 py-2.5 text-[13.5px] font-medium transition ${
                  isActive ? 'bg-route-500/15 text-white' : 'text-route-100/80 hover:bg-route-500/10 hover:text-white'
                }`
              }
            >
              <Wallet size={17} strokeWidth={2} />
              Earnings
            </NavLink>
            <NavLink
              to="/deleted-runs"
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg border border-route-400/25 px-3.5 py-2.5 text-[13.5px] font-medium transition ${
                  isActive ? 'bg-route-500/15 text-white' : 'text-route-100/80 hover:bg-route-500/10 hover:text-white'
                }`
              }
            >
              <Trash2 size={17} strokeWidth={2} />
              Deleted Runs
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg border border-route-400/25 px-3.5 py-2.5 text-[13.5px] font-medium transition ${
                  isActive ? 'bg-route-500/15 text-white' : 'text-route-100/80 hover:bg-route-500/10 hover:text-white'
                }`
              }
            >
              <ShieldCheck size={17} strokeWidth={2} />
              Admin Portal
            </NavLink>
          </>
        )}
      </nav>

      <div className="mx-4 mb-6 rounded-xl bg-white/[0.04] p-3.5">
        <p className="text-[11px] leading-relaxed text-white/45">
          Every run, tracked from collection to delivery — across every depot, every shift.
        </p>
      </div>
    </aside>
  )
}