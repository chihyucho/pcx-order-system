import { attachProfilesToOrderRows } from "@/lib/orders/enrich-order-profiles";
import { getOrderSelect } from "@/lib/orders/order-select";
import type { SupabaseOrderRow } from "@/lib/orders/supabase-row";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", auth.user.id)
      .single();

    const orderSelect = await getOrderSelect(supabase);

    let query = supabase.from("orders").select(orderSelect).eq("id", id);

    if (profile?.role !== "admin") {
      query = query.eq("user_id", auth.user.id);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const [row] = await attachProfilesToOrderRows(supabase, [
      data as unknown as SupabaseOrderRow,
    ]);

    return NextResponse.json({ order: row });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
