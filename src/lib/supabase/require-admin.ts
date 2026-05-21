import type { SupabaseClient, User } from "@supabase/supabase-js";

type AdminCheck =
  | { ok: true; user: User }
  | { ok: false; status: number; message: string };

/** Ensures the current session belongs to an admin profile. */
export async function requireAdmin(
  supabase: SupabaseClient,
): Promise<AdminCheck> {
  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth.user) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", auth.user.id)
    .single();

  if (profile?.role !== "admin") {
    return { ok: false, status: 403, message: "Forbidden" };
  }

  return { ok: true, user: auth.user };
}
