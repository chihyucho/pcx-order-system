import type { Order } from "@/lib/types";
import type { ProfileJoin, SupabaseOrderRow } from "./supabase-row";

function resolveProductName(
  products: SupabaseOrderRow["products"],
): string {
  if (!products) return "Unknown product";
  if (Array.isArray(products)) return products[0]?.name ?? "Unknown product";
  return products.name ?? "Unknown product";
}

function resolveProfile(
  profiles: SupabaseOrderRow["profiles"],
): ProfileJoin | null {
  if (!profiles) return null;
  if (Array.isArray(profiles)) return profiles[0] ?? null;
  return profiles;
}

export function resolveCompanyName(
  profiles: SupabaseOrderRow["profiles"],
): string {
  const profile = resolveProfile(profiles);
  if (profile?.company_name?.trim()) return profile.company_name.trim();
  if (profile?.email?.trim()) return profile.email.trim();
  return "—";
}

/** Single mapper: Supabase row → app Order model. */
export function mapSupabaseRowToOrder(row: SupabaseOrderRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number ?? row.id.slice(0, 8),
    product: resolveProductName(row.products),
    quantity: row.quantity,
    status: row.status,
    userId: row.user_id,
    companyName: resolveCompanyName(row.profiles),
    recipient: {
      name: row.recipient_name ?? "",
      address: row.recipient_address ?? "",
      phoneNumber: row.recipient_phone ?? "",
    },
    createdAt: row.created_at,
  };
}
