-- Human-readable order numbers
alter table public.orders
  add column if not exists order_number text;

create unique index if not exists orders_order_number_unique
  on public.orders (order_number)
  where order_number is not null;

-- Company identity on profiles
alter table public.profiles
  add column if not exists company_name text;

comment on column public.orders.order_number is 'Display order number format YYMMDD##';
comment on column public.profiles.company_name is 'Visible company label for admin UI';
