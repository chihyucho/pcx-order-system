export interface UpdateOrderPayload {
  id: string;
  quantity: number;
  recipient_name: string;
  recipient_address: string;
  recipient_phone: string;
}

export function toUpdateOrderPayload(input: {
  id: string;
  quantity: number;
  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;
}): UpdateOrderPayload {
  return {
    id: input.id,
    quantity: input.quantity,
    recipient_name: input.recipientName.trim(),
    recipient_address: input.recipientAddress.trim(),
    recipient_phone: input.recipientPhone.trim(),
  };
}

export async function updateOrderViaApi(
  payload: UpdateOrderPayload,
): Promise<void> {
  const res = await fetch("/api/orders", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Failed to update order",
    );
  }
}
