-- Run in Supabase SQL Editor if dashboards report missing columns.

-- Human-readable order numbers
alter table public.orders
  add column if not exists order_number text;

create unique index if not exists orders_order_number_unique
  on public.orders (order_number)
  where order_number is not null;

-- Company label on profiles (admin filters)
alter table public.profiles
  add column if not exists company_name text;

-- Optional FK for PostgREST embeds (app works without it)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_user_id_profiles_fkey'
  ) then
    alter table public.orders
      add constraint orders_user_id_profiles_fkey
      foreign key (user_id) references public.profiles (id)
      on delete restrict;
  end if;
exception
  when others then null;
end $$;
