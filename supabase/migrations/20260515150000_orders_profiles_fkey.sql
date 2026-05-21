-- Let PostgREST embed profiles on orders (optional; app also enriches via separate query).
-- Safe when user_id already references auth.users — profiles.id matches auth user id.

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_user_id_profiles_fkey'
  ) then
    alter table public.orders
      add constraint orders_user_id_profiles_fkey
      foreign key (user_id) references public.profiles (id)
      on delete restrict;
  end if;
end $$;
