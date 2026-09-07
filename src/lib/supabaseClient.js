import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The app runs in demo mode (local mock data, no setup needed) until both
// of these are set in a .env file. See README.md and supabase/schema.sql
// to connect a real Supabase project — none of the rest of the app needs
// to change, because every screen talks to dataService.js, not Supabase
// directly.
export const SUPABASE_CONFIGURED = Boolean(url && anonKey && !url.includes('YOUR_PROJECT'))

export const supabase = SUPABASE_CONFIGURED ? createClient(url, anonKey) : null
