"use client";

import { StatusBadge } from "@/components/orders/StatusBadge";
import { KpiCard } from "@/components/admin/KpiCard";
import { filterOrders } from "@/lib/orders/filter-orders";
import {
  countByStatus,
  ORDER_STATUS_TABS,
  type OrderStatusTab,
} from "@/lib/orders/order-status";
import { formatDateTime } from "@/lib/helpers";
import { useOrders } from "@/lib/hooks/useOrders";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function DashboardPage() {
  const { orders, loading, error } = useOrders();
  const [statusTab, setStatusTab] = useState<OrderStatusTab>("all");
  const [productFilter, setProductFilter] = useState("all");

  const counts = useMemo(() => countByStatus(orders), [orders]);

  const productList = useMemo(() => {
    return Array.from(new Set(orders.map((o) => o.product).filter(Boolean)));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const byStatus = filterOrders(orders, {
      statusTab,
      companyUserId: "all",
      startDate: "",
      endDate: "",
    });
    if (productFilter === "all") return byStatus;
    return byStatus.filter((o) => o.product === productFilter);
  }, [orders, statusTab, productFilter]);

  if (loading) return <p className="text-sm text-gray-500">Loading dashboard…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Your orders and activity</p>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          label="Total"
          value={counts.all}
          active={statusTab === "all"}
          onClick={() => setStatusTab("all")}
        />
        <KpiCard
          label="Pending"
          value={counts.pending}
          accent="amber"
          active={statusTab === "pending"}
          onClick={() => setStatusTab("pending")}
        />
        <KpiCard
          label="Processing"
          value={counts.processing}
          accent="blue"
          active={statusTab === "processing"}
          onClick={() => setStatusTab("processing")}
        />
        <KpiCard
          label="Shipped"
          value={counts.shipped}
          accent="orange"
          active={statusTab === "shipped"}
          onClick={() => setStatusTab("shipped")}
        />
        <KpiCard
          label="Completed"
          value={counts.completed}
          accent="green"
          active={statusTab === "completed"}
          onClick={() => setStatusTab("completed")}
        />
        <KpiCard
          label="Cancelled"
          value={counts.cancelled}
          accent="red"
          active={statusTab === "cancelled"}
          onClick={() => setStatusTab("cancelled")}
        />
      </section>

      <section className="flex flex-wrap gap-2 border-b border-gray-200 pb-1">
        {ORDER_STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusTab(tab.id)}
            className={`rounded-t-md px-3 py-2 text-sm font-medium ${
              statusTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-700"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </section>

      <div className="flex flex-wrap gap-3">
        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="all">All Products</option>
          {productList.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">
          Recent Orders ({filteredOrders.length})
        </h2>

        {filteredOrders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          filteredOrders.slice(0, 10).map((o) => (
            <Link
              key={o.id}
              href={`/orders/${o.id}`}
              className="block rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/30"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-mono text-sm font-semibold text-blue-700">
                    {o.orderNumber}
                  </p>
                  <p className="mt-1 font-medium text-gray-900">{o.product}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Qty {o.quantity} · {o.recipient.name} ·{" "}
                {formatDateTime(o.createdAt)}
              </p>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
