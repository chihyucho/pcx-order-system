import type { SupabaseClient } from "@supabase/supabase-js";

let cached: boolean | null = null;

function isMissingOrderNumberColumn(message: string): boolean {
  return /orders\.order_number|column.*order_number/i.test(message);
}

/** Whether `public.orders.order_number` exists (cached per process). */
export async function hasOrderNumberColumn(
  supabase: SupabaseClient,
): Promise<boolean> {
  if (cached !== null) return cached;

  const { error } = await supabase
    .from("orders")
    .select("order_number")
    .limit(1);

  cached = !error || !isMissingOrderNumberColumn(error.message);
  return cached;
}
