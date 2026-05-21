-- Rename recipient_contact → recipient_phone (skip if already renamed in dashboard).
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'orders'
      and column_name = 'recipient_contact'
  ) then
    alter table public.orders
      rename column recipient_contact to recipient_phone;
  end if;
end $$;

alter table public.orders
  add column if not exists recipient_phone text;

comment on column public.orders.recipient_phone is 'Recipient phone number';
