import type { SupabaseClient } from "@supabase/supabase-js";
import { hasOrderNumberColumn } from "./order-number-column";

const ORDER_SELECT_CORE = `
  id,
  product_id,
  quantity,
  recipient_name,
  recipient_address,
  recipient_phone,
  postscript,
  status,
  user_id,
  created_at,
  products (
    name
  )
`;

/** Safe select for current DB schema (includes order_number only when the column exists). */
export async function getOrderSelect(
  supabase: SupabaseClient,
): Promise<string> {
  if (!(await hasOrderNumberColumn(supabase))) {
    return ORDER_SELECT_CORE;
  }

  return ORDER_SELECT_CORE.replace(
    "  id,",
    "  id,\n  order_number,",
  );
}
