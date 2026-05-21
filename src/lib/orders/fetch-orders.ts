import type { Order } from "@/lib/types";
import { mapSupabaseRowToOrder } from "./map-order";
import type { SupabaseOrderRow } from "./supabase-row";

/** List orders (scoped by /api/orders: user sees own, admin sees all). */
export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch("/api/orders", { cache: "no-store" });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      typeof json.error === "string" ? json.error : "Failed to load orders",
    );
  }

  const rows = (json.orders ?? []) as SupabaseOrderRow[];
  return rows.map(mapSupabaseRowToOrder);
}

/** Fetch one order by id (via API; includes owner company for admin views). */
export async function fetchOrderById(id: string): Promise<Order | null> {
  const res = await fetch(`/api/orders/${id}`, { cache: "no-store" });
  const json = await res.json();

  if (!res.ok) {
    return null;
  }

  const row = json.order as SupabaseOrderRow | undefined;
  if (!row) return null;

  return mapSupabaseRowToOrder(row);
}
