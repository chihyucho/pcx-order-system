import type { CreateOrderPayload } from "@/lib/orders-api";
import { attachProfilesToOrderRows } from "@/lib/orders/enrich-order-profiles";
import {
  generateOrderNumber,
  isOrderNumberConflict,
} from "@/lib/orders/generate-order-number";
import { hasOrderNumberColumn } from "@/lib/orders/order-number-column";
import { getOrderSelect } from "@/lib/orders/order-select";
import type { SupabaseOrderRow } from "@/lib/orders/supabase-row";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      return NextResponse.json({ orders: [] });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", auth.user.id)
      .single();

    const orderSelect = await getOrderSelect(supabase);

    let query = supabase
      .from("orders")
      .select(orderSelect)
      .order("created_at", { ascending: false });

    if (profile?.role !== "admin") {
      query = query.eq("user_id", auth.user.id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = await attachProfilesToOrderRows(
      supabase,
      (data ?? []) as unknown as SupabaseOrderRow[],
    );

    return NextResponse.json({ orders: rows });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch orders";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<CreateOrderPayload>;

    const {
      product_id,
      quantity,
      recipient_name,
      recipient_address,
      recipient_phone,
      postscript,
    } = body;

    if (!product_id) {
      return NextResponse.json(
        { error: "product_id is required" },
        { status: 400 },
      );
    }

    if (quantity == null || Number(quantity) <= 0) {
      return NextResponse.json(
        { error: "quantity must be a positive number" },
        { status: 400 },
      );
    }

    if (
      !recipient_name?.trim() ||
      !recipient_address?.trim() ||
      !recipient_phone?.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "recipient_name, recipient_address, and recipient_phone are required",
        },
        { status: 400 },
      );
    }

    const supabase = await createServerSupabaseClient();

    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderSelect = await getOrderSelect(supabase);
    const useOrderNumber = await hasOrderNumberColumn(supabase);

    const insertRow: Record<string, unknown> = {
      product_id,
      quantity: Number(quantity),
      recipient_name: recipient_name.trim(),
      recipient_address: recipient_address.trim(),
      recipient_phone: recipient_phone.trim(),
      postscript: postscript?.trim() || null,
      user_id: auth.user.id,
    };

    const maxAttempts = useOrderNumber ? 5 : 1;
    let data: SupabaseOrderRow | null = null;
    let lastError: { message: string } | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (useOrderNumber) {
        insertRow.order_number = await generateOrderNumber(supabase);
      }

      const result = await supabase
        .from("orders")
        .insert(insertRow)
        .select(orderSelect)
        .single();

      if (!result.error && result.data) {
        data = result.data as unknown as SupabaseOrderRow;
        lastError = null;
        break;
      }

      lastError = result.error;
      if (
        !useOrderNumber ||
        !isOrderNumberConflict(result.error.message) ||
        attempt === maxAttempts - 1
      ) {
        break;
      }
    }

    if (lastError || !data) {
      return NextResponse.json(
        { error: lastError?.message ?? "Failed to create order" },
        { status: 500 },
      );
    }

    const [order] = await attachProfilesToOrderRows(supabase, [data]);

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const body = await req.json();

    const { id } = body as { id?: string };

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", auth.user.id)
      .single();

    const { data: existing, error: fetchError } = await supabase
      .from("orders")
      .select("id, user_id, status")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isAdmin = profile?.role === "admin";
    const isOwner = existing.user_id === auth.user.id;

    const hasStatus = body.status !== undefined;
    const hasContent =
      body.quantity !== undefined ||
      body.recipient_name !== undefined ||
      body.recipient_address !== undefined ||
      body.recipient_phone !== undefined;

    if (hasStatus && hasContent) {
      return NextResponse.json(
        { error: "Send status or order fields, not both" },
        { status: 400 },
      );
    }

    const orderSelect = await getOrderSelect(supabase);

    if (hasStatus) {
      if (!isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const { status } = body;
      if (!status) {
        return NextResponse.json(
          { error: "status is required" },
          { status: 400 },
        );
      }

      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id)
        .select(orderSelect)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const [order] = await attachProfilesToOrderRows(supabase, [
        data as unknown as SupabaseOrderRow,
      ]);

      return NextResponse.json({ order });
    }

    if (hasContent) {
      if (!isOwner) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      if (existing.status !== "pending") {
        return NextResponse.json(
          { error: "Only pending orders can be edited" },
          { status: 400 },
        );
      }

      const {
        quantity,
        recipient_name,
        recipient_address,
        recipient_phone,
      } = body;

      if (quantity == null || Number(quantity) <= 0) {
        return NextResponse.json(
          { error: "quantity must be a positive number" },
          { status: 400 },
        );
      }

      if (
        !recipient_name?.trim() ||
        !recipient_address?.trim() ||
        !recipient_phone?.trim()
      ) {
        return NextResponse.json(
          {
            error:
              "recipient_name, recipient_address, and recipient_phone are required",
          },
          { status: 400 },
        );
      }

      const { data, error } = await supabase
        .from("orders")
        .update({
          quantity: Number(quantity),
          recipient_name: recipient_name.trim(),
          recipient_address: recipient_address.trim(),
          recipient_phone: recipient_phone.trim(),
          created_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", auth.user.id)
        .eq("status", "pending")
        .select(orderSelect)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (!data) {
        return NextResponse.json(
          { error: "Order could not be updated" },
          { status: 404 },
        );
      }

      const [order] = await attachProfilesToOrderRows(supabase, [
        data as unknown as SupabaseOrderRow,
      ]);

      return NextResponse.json({ order });
    }

    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
