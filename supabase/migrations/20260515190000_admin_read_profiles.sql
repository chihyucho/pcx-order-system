-- Profile RLS: users read own row (required for login), admins read all rows.
-- Run this entire file in Supabase → SQL Editor if login shows an RLS error.

grant usage on schema public to authenticated;
grant select on table public.profiles to authenticated;

alter table public.profiles enable row level security;

-- Avoid RLS recursion when checking admin (policy must not query profiles directly).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists profiles_select_admin on public.profiles;
create policy profiles_select_admin
  on public.profiles
  for select
  to authenticated
  using (public.is_admin());

-- Optional: let users create their own profile row once (if missing after signup).
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

grant insert on table public.profiles to authenticated;
