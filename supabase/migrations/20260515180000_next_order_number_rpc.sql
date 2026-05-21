-- Global daily order numbers (visible across all users). Required because RLS hides
-- other users' rows from the client used in generateOrderNumber().

create or replace function public.next_order_number()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  day_key text;
  prefix text;
  last_seq integer;
  next_seq integer;
begin
  day_key := to_char(timezone('utc', now()), 'YYYYMMDD');
  prefix := to_char(timezone('utc', now()), 'YYMMDD');

  perform pg_advisory_xact_lock(hashtext('orders_order_number_' || day_key));

  select coalesce(
    max(
      case
        when order_number ~ ('^' || prefix || '[0-9]{2}$')
        then substring(order_number from 7)::integer
        else 0
      end
    ),
    0
  )
  into last_seq
  from public.orders;

  next_seq := last_seq + 1;

  if next_seq > 99 then
    raise exception 'Daily order number limit (99) exceeded for %', prefix;
  end if;

  return prefix || lpad(next_seq::text, 2, '0');
end;
$$;

revoke all on function public.next_order_number() from public;
grant execute on function public.next_order_number() to authenticated;
grant execute on function public.next_order_number() to service_role;

comment on function public.next_order_number() is
  'Returns next global order_number YYMMDD## for the current UTC day';
