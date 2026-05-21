import type { Product } from "./orders/types";

export type { Product };

export interface CreateOrderFormInput {
  productId: string;
  quantity: number;
  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;
  postscript?: string;
}

export interface CreateOrderPayload {
  product_id: string;
  quantity: number;
  recipient_name: string;
  recipient_address: string;
  recipient_phone: string;
  postscript?: string | null;
}

export function toCreateOrderPayload(
  input: CreateOrderFormInput,
): CreateOrderPayload {
  return {
    product_id: input.productId,
    quantity: input.quantity,
    recipient_name: input.recipientName.trim(),
    recipient_address: input.recipientAddress.trim(),
    recipient_phone: input.recipientPhone.trim(),
    postscript: input.postscript?.trim() || null,
  };
}

export async function createOrderViaApi(
  payload: CreateOrderPayload,
): Promise<void> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Failed to create order",
    );
  }
}

export async function fetchProductsFromApi(): Promise<Product[]> {
  const res = await fetch("/api/products");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Failed to load products",
    );
  }

  return data.products as Product[];
}
