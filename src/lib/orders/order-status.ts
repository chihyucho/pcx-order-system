export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "completed",
  "cancelled",
] as const;

export type OrderStatusValue = (typeof ORDER_STATUSES)[number];

export type OrderStatusTab = "all" | OrderStatusValue;

export const ORDER_STATUS_TABS: { id: OrderStatusTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "processing", label: "Processing" },
  { id: "shipped", label: "Shipped" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

export function countByStatus(
  orders: { status: string }[],
): Record<OrderStatusTab, number> {
  const counts: Record<OrderStatusTab, number> = {
    all: orders.length,
    pending: 0,
    processing: 0,
    shipped: 0,
    completed: 0,
    cancelled: 0,
  };

  for (const order of orders) {
    const key = order.status as OrderStatusValue;
    if (ORDER_STATUSES.includes(key)) {
      counts[key]++;
    }
  }

  return counts;
}
