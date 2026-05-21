import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProfileJoin, SupabaseOrderRow } from "./supabase-row";

/** Attach profile fields without a PostgREST embed (no orders→profiles FK required). */
export async function attachProfilesToOrderRows(
  supabase: SupabaseClient,
  rows: SupabaseOrderRow[],
): Promise<SupabaseOrderRow[]> {
  if (rows.length === 0) return rows;

  const userIds = [...new Set(rows.map((r) => r.user_id).filter(Boolean))];
  if (userIds.length === 0) return rows;

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, company_name, email")
    .in("id", userIds);

  if (error || !profiles) return rows;

  const byId = new Map<string, ProfileJoin>(
    profiles.map((p) => [
      p.id,
      { company_name: p.company_name, email: p.email },
    ]),
  );

  return rows.map((row) => ({
    ...row,
    profiles: byId.get(row.user_id) ?? null,
  }));
}
