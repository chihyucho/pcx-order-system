-- Add structured recipient columns to orders (non-destructive).
-- Existing rows keep data; backfill postscript into recipient fields if needed.

alter table public.orders
  add column if not exists recipient_name text,
  add column if not exists recipient_address text,
  add column if not exists recipient_contact text;

-- Optional notes field (separate from recipient identity)
alter table public.orders
  add column if not exists postscript text;

-- Ensure core columns exist (no-op if already present)
alter table public.orders
  add column if not exists product_id uuid references public.products (id),
  add column if not exists quantity integer,
  add column if not exists created_at timestamptz default now();

alter table public.orders
  add column if not exists status text default 'pending';

comment on column public.orders.recipient_name is 'Recipient full name';
comment on column public.orders.recipient_address is 'Recipient delivery address';
comment on column public.orders.recipient_contact is 'Recipient phone or email';
comment on column public.orders.postscript is 'Optional order notes (not recipient data)';

-- One-time backfill: parse legacy "name | address | contact" stored in postscript
update public.orders
set
  recipient_name = coalesce(recipient_name, split_part(postscript, ' | ', 1)),
  recipient_address = coalesce(recipient_address, split_part(postscript, ' | ', 2)),
  recipient_contact = coalesce(recipient_contact, split_part(postscript, ' | ', 3))
where postscript is not null
  and postscript like '% | % | %'
  and (
    recipient_name is null
    or recipient_address is null
    or recipient_contact is null
  );
