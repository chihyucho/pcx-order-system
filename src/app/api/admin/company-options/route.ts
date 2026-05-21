import { getProfileLabel } from "@/lib/profiles";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const gate = await requireAdmin(supabase);

    if (!gate.ok) {
      return NextResponse.json({ error: gate.message }, { status: gate.status });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, company_name, email")
      .order("company_name", { ascending: true, nullsFirst: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const companies = (data ?? []).map((p) => ({
      userId: p.id,
      label: getProfileLabel(p),
    }));

    return NextResponse.json({ companies });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load companies";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
