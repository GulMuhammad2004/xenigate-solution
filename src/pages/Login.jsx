import React, { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Lock, Mail, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { user, login, demoMode } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // if (user) return <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />

  if (user) {
  const destination =
    location.state?.from?.pathname ||
    (user.role === 'admin' ? '/admin' : '/dashboard')

  return <Navigate to={destination} replace />
}


  // async function handleSubmit(e) {
  //   e.preventDefault()
  //   setError('')
  //   setBusy(true)
  //   try {
  //     await login(email, password)
  //     navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
  //   } catch (err) {
  //     setError(err.message || 'Could not sign in.')
  //   } finally {
  //     setBusy(false)
  //   }
  // }

async function handleSubmit(e) {
  e.preventDefault()
  setError('')
  setBusy(true)

  try {
    const loggedInUser = await login(email, password)

    const destination =
      location.state?.from?.pathname ||
      (loggedInUser.role === 'admin' ? '/admin' : '/dashboard')

    navigate(destination, { replace: true })
  } catch (err) {
    console.error(err)
    setError(err.message || 'Could not sign in.')
  } finally {
    setBusy(false)
  }
}

  function fillDemo(role) {
    if (role === 'admin') { setEmail('admin@xenigate.com'); setPassword('admin123') }
    else { setEmail('dispatcher@client.com'); setPassword('dispatch123') }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Brand side */}
     <div className="relative hidden flex-col justify-between overflow-hidden bg-route-700 p-12 text-white md:flex">
        <div className="absolute inset-0 opacity-90 bg-route-gradient" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 55%, 0 100%)' }} />
        <RouteLines />

        <div className="flex flex-col relative z-10 items-center gap-3">
          <img src="/logo.jpg" alt="Xenigate Freight Solutions" className="h-14 w-[20vw] rounded-lg object-cover ring-2 ring-white/30" />
          <span className="font-display text-lg font-semibold">Xenigate Freight Solutions</span>
        </div>

        <div className="relative z-10 max-w-sm">
          <h2 className="font-display text-[34px] font-semibold leading-[1.15]">
            Every collection.<br />Every delivery.<br />One board.
          </h2>
          <p className="mt-4 text-[14.5px] leading-relaxed text-white/70">
            Build the day's runs, assign drivers by depot, and pull the reports your client asks for — without leaving the schedule.
          </p>
        </div>

        <p className="relative z-10 text-[12px] text-white/40">© {new Date().getFullYear()} Xenigate Freight Solutions</p>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <img src="/logo.jpg" alt="Xenigate Freight Solutions" className="h-10 w-10 rounded-lg object-cover" />
            <span className="font-display text-lg font-semibold text-ink">Xenigate</span>
          </div>

          <h1 className="font-display text-2xl font-semibold text-ink">Sign in to the scheduler</h1>
          <p className="mt-1.5 text-[13.5px] text-ash-500">Use your Xenigate or client account to continue.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-[12.5px] font-medium text-ash-600">Email</label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ash-400" />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="field pl-10" placeholder="you@company.com"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[12.5px] font-medium text-ash-600">Password</label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ash-400" />
                <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="field pl-10" placeholder="••••••••"
                />
              </div>
            </div>

            {error && <p className="rounded-lg bg-bad/10 px-3 py-2 text-[13px] text-bad">{error}</p>}

            <button type="submit" disabled={busy} className="btn-primary w-full">
              {busy ? 'Signing in…' : 'Sign in'} <ArrowRight size={16} />
            </button>
          </form>

          {demoMode && (
            <div className="mt-7 rounded-xl border border-route-500/15 bg-route-50 p-4">
              <p className="text-[12px] font-semibold text-route-700">Demo mode — no Supabase connected yet</p>
              <p className="mt-1 text-[12px] leading-relaxed text-route-700/80">
                Try either seeded account:
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <button onClick={() => fillDemo('admin')} className="rounded-lg bg-white px-3 py-1.5 text-[12px] font-medium text-route-700 shadow-sm">
                  admin@xenigate.com
                </button>
                <button onClick={() => fillDemo('dispatcher')} className="rounded-lg bg-white px-3 py-1.5 text-[12px] font-medium text-route-700 shadow-sm">
                  dispatcher@client.com
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RouteLines() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.35]" viewBox="0 0 500 700" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M-20 620 C 120 560, 160 480, 120 380 S 40 220, 160 160 S 380 120, 420 20" stroke="white" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
      <path d="M-40 500 C 80 460, 140 420, 100 320 S 60 180, 220 140" stroke="white" strokeWidth="1.5" strokeDasharray="1 8" strokeLinecap="round" />
      <circle cx="420" cy="20" r="5" fill="white" />
      <circle cx="-20" cy="620" r="5" fill="white" />
    </svg>
  )
}
