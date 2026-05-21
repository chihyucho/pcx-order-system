import type { Order } from "@/lib/types";
import type { OrderStatusTab } from "./order-status";

export interface OrderFilters {
  statusTab: OrderStatusTab;
  companyUserId: string;
  startDate: string;
  endDate: string;
}

export function filterOrders(orders: Order[], filters: OrderFilters): Order[] {
  return orders.filter((order) => {
    if (filters.statusTab !== "all" && order.status !== filters.statusTab) {
      return false;
    }

    if (filters.companyUserId !== "all" && order.userId !== filters.companyUserId) {
      return false;
    }

    if (filters.startDate) {
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0);
      if (new Date(order.createdAt) < start) return false;
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      if (new Date(order.createdAt) > end) return false;
    }

    return true;
  });
}
