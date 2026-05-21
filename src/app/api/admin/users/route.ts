import { getProfileLabel } from "@/lib/profiles";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const gate = await requireAdmin(supabase);

    if (!gate.ok) {
      return NextResponse.json({ error: gate.message }, { status: gate.status });
    }

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, role, company_name, email")
      .order("company_name", { ascending: true, nullsFirst: false });

    if (profilesError) {
      return NextResponse.json(
        { error: profilesError.message },
        { status: 500 },
      );
    }

    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("user_id");

    if (ordersError) {
      return NextResponse.json({ error: ordersError.message }, { status: 500 });
    }

    const counts = new Map<string, number>();
    for (const row of orders ?? []) {
      counts.set(row.user_id, (counts.get(row.user_id) ?? 0) + 1);
    }

    const users = (profiles ?? []).map((p) => ({
      id: p.id,
      email: p.email ?? "",
      role: p.role as UserRole,
      companyName: p.company_name?.trim() || "",
      displayCompany: getProfileLabel(p),
      orderCount: counts.get(p.id) ?? 0,
    }));

    return NextResponse.json({ users });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load users";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
