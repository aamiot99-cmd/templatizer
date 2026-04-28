-- Templatizer v2 schema.
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query) once,
-- after the project is created. Safe to re-run: every CREATE/ALTER is guarded.

-- ============================================================
-- profiles: extends auth.users with admin metadata
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- projects: shared workspace, any authenticated admin can read/edit any project.
-- locked_by + locked_at provide a soft per-project edit lock.
-- ============================================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  snapshot jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add lock columns idempotently (so existing installs upgrade cleanly).
alter table public.projects
  add column if not exists locked_by uuid references public.profiles(id)
    on delete set null;
alter table public.projects
  add column if not exists locked_at timestamptz;

create index if not exists projects_updated_at_idx
  on public.projects (updated_at desc);

-- ============================================================
-- Auto-create a profile row whenever a new auth.users row is inserted.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row-level security: shared workspace
-- Any authenticated user can see and modify any row.
-- (Lock RPC functions below provide the per-project edit guard.)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.projects enable row level security;

drop policy if exists "profiles: read all" on public.profiles;
create policy "profiles: read all"
  on public.profiles for select
  using (auth.uid() is not null);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "projects: read all" on public.projects;
create policy "projects: read all"
  on public.projects for select
  using (auth.uid() is not null);

drop policy if exists "projects: insert any" on public.projects;
create policy "projects: insert any"
  on public.projects for insert
  with check (auth.uid() is not null);

drop policy if exists "projects: update any" on public.projects;
create policy "projects: update any"
  on public.projects for update
  using (auth.uid() is not null);

drop policy if exists "projects: delete any" on public.projects;
create policy "projects: delete any"
  on public.projects for delete
  using (auth.uid() is not null);

-- (legacy "own"-scoped policies from earlier schema versions, dropped if present)
drop policy if exists "profiles: read own" on public.profiles;
drop policy if exists "projects: read own" on public.projects;
drop policy if exists "projects: insert own" on public.projects;
drop policy if exists "projects: update own" on public.projects;
drop policy if exists "projects: delete own" on public.projects;

-- ============================================================
-- Lock RPC: try_lock_project
--   Atomically acquires the lock if free, stale (>3 min), or already ours.
--   Returns:
--     acquired      = true  → caller now holds the lock
--     acquired      = false → caller does NOT hold the lock; see locked_by_email
--     locked_by     = current holder (or our id if acquired)
--     locked_by_email = email of current holder
--     locked_at     = lock timestamp
-- ============================================================
create or replace function public.try_lock_project(p_id uuid)
returns table(
  acquired boolean,
  locked_by uuid,
  locked_by_email text,
  locked_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_now timestamptz := now();
  v_stale_threshold timestamptz := v_now - interval '3 minutes';
  v_updated_count int;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  update public.projects
  set locked_by = v_uid, locked_at = v_now
  where id = p_id
    and (
      projects.locked_by is null
      or projects.locked_at < v_stale_threshold
      or projects.locked_by = v_uid
    );

  get diagnostics v_updated_count = row_count;

  if v_updated_count = 1 then
    return query
      select
        true,
        v_uid,
        (select email from public.profiles where id = v_uid),
        v_now;
  else
    return query
      select
        false,
        p.locked_by,
        prof.email,
        p.locked_at
      from public.projects p
      left join public.profiles prof on prof.id = p.locked_by
      where p.id = p_id;
  end if;
end;
$$;

-- ============================================================
-- Lock RPC: heartbeat_project
--   Refreshes locked_at if caller currently holds the lock.
--   Returns true if refreshed, false otherwise.
-- ============================================================
create or replace function public.heartbeat_project(p_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  update public.projects
  set locked_at = now()
  where id = p_id and locked_by = auth.uid();
  get diagnostics v_count = row_count;
  return v_count = 1;
end;
$$;

-- ============================================================
-- Lock RPC: release_project_lock
--   Clears the lock if caller currently holds it. No-op otherwise.
-- ============================================================
create or replace function public.release_project_lock(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.projects
  set locked_by = null, locked_at = null
  where id = p_id and locked_by = auth.uid();
end;
$$;
