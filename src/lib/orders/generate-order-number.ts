import type { SupabaseClient } from "@supabase/supabase-js";

/** Format: YYMMDD## e.g. 26051801 */
export function formatOrderNumber(date: Date, sequence: number): string {
  const yy = String(date.getUTCFullYear()).slice(-2);
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const seq = String(sequence).padStart(2, "0");
  return `${yy}${mm}${dd}${seq}`;
}

function parseSequence(orderNumber: string, prefix: string): number {
  if (!orderNumber.startsWith(prefix) || orderNumber.length < prefix.length + 2) {
    return 0;
  }
  const seq = parseInt(orderNumber.slice(prefix.length), 10);
  return Number.isNaN(seq) ? 0 : seq;
}

function isOrderNumberConflict(message: string): boolean {
  return /orders_order_number_unique|duplicate key.*order_number/i.test(
    message,
  );
}

/** Fallback when DB RPC is not deployed (still subject to RLS). */
async function generateOrderNumberLegacy(
  supabase: SupabaseClient,
): Promise<string> {
  const now = new Date();
  const prefix = formatOrderNumber(now, 0).slice(0, 6);

  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  const { data: latest } = await supabase
    .from("orders")
    .select("order_number")
    .gte("created_at", start.toISOString())
    .lt("created_at", end.toISOString())
    .like("order_number", `${prefix}%`)
    .order("order_number", { ascending: false })
    .limit(1);

  let nextSeq = 1;
  if (latest?.[0]?.order_number) {
    nextSeq = parseSequence(latest[0].order_number, prefix) + 1;
  }

  return formatOrderNumber(now, nextSeq);
}

/**
 * Next global order_number for today (YYMMDD##).
 * Prefer Supabase RPC `next_order_number` so numbering works across users under RLS.
 */
export async function generateOrderNumber(
  supabase: SupabaseClient,
): Promise<string> {
  const { data, error } = await supabase.rpc("next_order_number");

  if (!error && typeof data === "string" && data.length > 0) {
    return data;
  }

  return generateOrderNumberLegacy(supabase);
}

export { isOrderNumberConflict };
