-- Xenigate Freight Solutions — Run Scheduler
-- Run this in the Supabase SQL editor on a fresh project.

create extension if not exists "uuid-ossp";

-- Depots ------------------------------------------------------------------
-- Depots are the collection points themselves (identified by postcode),
-- so runs reference a depot directly instead of storing a separate
-- "collection" field.
create table if not exists depots (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  address text,
  created_at timestamptz default now()
);

-- Staff / drivers -----------------------------------------------------------
-- Drivers are not tied to a single depot — any driver can be assigned to
-- collect from any depot, so there is no depot_id here.
create table if not exists staff (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Profiles: one row per authenticated user, linked to auth.users --------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'dispatcher' check (role in ('admin','dispatcher')),
  company text default 'Xenigate Freight Solutions',
  created_at timestamptz default now()
);

-- Runs --------------------------------------------------------------------
create table if not exists runs (
  id uuid primary key default uuid_generate_v4(),
  run_number text not null,
  run_date date not null default current_date,
  depot_id uuid references depots(id) on delete set null, -- the collection point
  delivery text not null,                                  -- the delivery destination
  start_time time not null,      -- collection time
  delivery_time time,            -- expected/actual delivery time
  staff_id uuid references staff(id) on delete set null,
  status text not null default 'unassigned' check (status in ('unassigned','scheduled','in_progress','completed','cancelled')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists runs_date_idx on runs(run_date);
create index if not exists runs_depot_idx on runs(depot_id);
create index if not exists runs_staff_idx on runs(staff_id);

-- Row Level Security -------------------------------------------------------
alter table depots enable row level security;
alter table staff enable row level security;
alter table runs enable row level security;
alter table profiles enable row level security;

-- Any signed-in user (admin or dispatcher) can read operational data.
create policy "read depots" on depots for select using (auth.role() = 'authenticated');
create policy "read staff" on staff for select using (auth.role() = 'authenticated');
create policy "read runs" on runs for select using (auth.role() = 'authenticated');
create policy "read own profile" on profiles for select using (auth.uid() = id);

-- Any signed-in user can manage runs (schedule day-to-day work).
create policy "manage runs" on runs for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Only admins can manage staff, depots and see all profiles.
create policy "admins manage staff" on staff for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "admins manage depots" on depots for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "admins read all profiles" on profiles for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Auto-create a profile row whenever a new auth user signs up ------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), 'dispatcher');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed reference data ------------------------------------------------------
insert into depots (name) values
  ('NG22 9LD'),
  ('S35 2PW'),
  ('DE74')
on conflict (name) do nothing;
