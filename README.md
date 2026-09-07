# Xenigate Freight Solutions — Run Scheduler

A React scheduling system for planning daily freight runs, assigning drivers, and generating reports — built for Xenigate Freight Solutions and the client company using it.

## What's included

- **Sign in** for two roles: **Admin** (Xenigate) and **Dispatcher** (client company)
- **Dashboard** — today's run count, unassigned alerts, completion rate, depot breakdown
- **Schedule** — day-by-day board: add runs, assign drivers per depot, change status inline
- **Runs** — full history search with filters by depot, driver, date range and free text
- **Staff** — driver directory grouped by depot, with availability toggle
- **Depots** — depot directory with live staff/run counts
- **Reports** — daily / weekly / monthly views, charts by depot / status / driver, CSV export
- **Admin Portal** — system status, account overview, demo data reset (admin-only route)

Runs demo-ready out of the box with mock data in the browser — no setup needed to open it and click around. Connect Supabase whenever you're ready to go live; nothing else in the app changes.

**Depots are the collection points** — seeded as `NG22 9LD`, `S35 2PW`, and `DE74`. A run doesn't have a separate "collection" field; it just references the depot it's collecting from, plus a delivery location and both a collection time and delivery time. **Drivers aren't tied to any one depot** — any active driver can be assigned to a run at any depot.

## Run it locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

**Demo sign-in:**
- Admin: `admin@xenigate.com` / `admin123`
- Dispatcher: `dispatcher@client.com` / `dispatch123`

Everything you edit (adding a run, assigning a driver, adding staff) is saved to the browser's local storage, so it persists across refreshes. Use **Admin Portal → Reset demo data** to start over.

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run everything in `supabase/schema.sql`. This creates the `depots`, `staff`, `runs` and `profiles` tables, sets up row-level security, and auto-creates a `profiles` row (default role `dispatcher`) whenever someone signs up.
3. Copy `.env.example` to `.env` and fill in your project's URL and anon key from **Project Settings → API**.
4. Restart `npm run dev`. The app now reads and writes real data — the demo-mode banner on the login page and Admin Portal disappears automatically.
5. To create your first admin: sign up a user normally (via Supabase Auth, e.g. through the Supabase dashboard's "Add user" or by wiring up a signup form), then in the SQL editor run:
   ```sql
   update profiles set role = 'admin' where id = '<the user''s auth.users id>';
   ```
6. Invite your client's dispatcher accounts the same way, leaving their role as `dispatcher`.

Every screen talks to `src/data/dataService.js` only — it decides internally whether to use demo data or Supabase based on whether the two env variables above are set. No page or component needs to change when you switch.

## Project structure

```
src/
  lib/supabaseClient.js   Supabase client + demo-mode detection
  data/
    mockData.js           seed data for demo mode
    store.js              localStorage-backed demo persistence
    dataService.js        the only data-access layer every page uses
  context/AuthContext.jsx sign-in / sign-out / current user + role
  components/
    layout/                sidebar, topbar, mobile nav, page shell
    ui/                     badge, modal, stat tile
    schedule/               add-run form
  pages/                    one file per route
supabase/schema.sql        run this in Supabase's SQL editor to go live
```

## Build for production

```bash
npm run build
```

Outputs a static `dist/` folder you can deploy to Vercel, Netlify, or any static host — just remember to set the two `VITE_SUPABASE_*` environment variables on whichever host you use.

## Notes on the logo

Your logo is at `public/logo.jpg` and is already wired into the sidebar, mobile nav, login screen, and browser tab icon. Swap that file (keep the same name) to update it everywhere at once.
