import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabaseClient.js'
import { demoUsers } from '../data/mockData.js'

const AuthContext = createContext(null)
const SESSION_KEY = 'xenigate_demo_session'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (SUPABASE_CONFIGURED) {
      supabase.auth.getSession().then(async ({ data }) => {
        if (data.session) await hydrateFromSupabase(data.session.user)
        setLoading(false)
      })
      const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session) await hydrateFromSupabase(session.user)
        else setUser(null)
      })
      return () => sub.subscription.unsubscribe()
    } else {
      const raw = localStorage.getItem(SESSION_KEY)
      if (raw) setUser(JSON.parse(raw))
      setLoading(false)
    }
  }, [])

  // async function hydrateFromSupabase(authUser) {
  //   const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).single()
  //   setUser({
  //     id: authUser.id,
  //     email: authUser.email,
  //     full_name: profile?.full_name || authUser.email,
  //     role: profile?.role || 'dispatcher',
  //     company: profile?.company || 'Xenigate Freight Solutions',
  //   })
  // }

  async function hydrateFromSupabase(authUser) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (error) {
    console.error('Profile loading error:', error)
    throw new Error('Could not load user profile.')
  }

  if (!profile) {
    throw new Error('User profile not found.')
  }

  const appUser = {
    id: authUser.id,
    email: authUser.email,
    full_name: profile.full_name || authUser.email,
    role: profile.role,
    company: profile.company || 'Xenigate Freight Solutions',
  }

  setUser(appUser)

  return appUser
}

  // async function login(email, password) {
  //   if (SUPABASE_CONFIGURED) {
  //     const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  //     if (error) throw error
  //     await hydrateFromSupabase(data.user)
  //     return
  //   }
  //   const match = demoUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password)
  //   if (!match) throw new Error('Incorrect email or password.')
  //   const session = { id: match.id, email: match.email, full_name: match.full_name, role: match.role, company: match.company }
  //   localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  //   setUser(session)
  // }

  async function login(email, password) {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    const loggedInUser = await hydrateFromSupabase(data.user)
return loggedInUser
  }

  const match = demoUsers.find(
    (u) =>
      u.email.toLowerCase() === email.trim().toLowerCase() &&
      u.password === password
  )

  if (!match) throw new Error('Incorrect email or password.')

  const session = {
    id: match.id,
    email: match.email,
    full_name: match.full_name,
    role: match.role,
    company: match.company
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  setUser(session)

  return session
}

  async function logout() {
    if (SUPABASE_CONFIGURED) {
      await supabase.auth.signOut()
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
    setUser(null)
  }

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    demoMode: !SUPABASE_CONFIGURED,
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
