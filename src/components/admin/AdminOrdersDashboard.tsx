"use client";

import { KpiCard } from "@/components/admin/KpiCard";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { filterOrders } from "@/lib/orders/filter-orders";
import {
  countByStatus,
  ORDER_STATUS_TABS,
  type OrderStatusTab,
} from "@/lib/orders/order-status";
import type { CompanyOption } from "@/lib/profiles";
import { formatDateTime } from "@/lib/helpers";
import { useOrders } from "@/lib/hooks/useOrders";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export function AdminOrdersDashboard() {
  const { orders, loading, error, refetch } = useOrders();
  const [statusTab, setStatusTab] = useState<OrderStatusTab>("all");
  const [companyUserId, setCompanyUserId] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/company-options", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json.companies) setCompanies(json.companies as CompanyOption[]);
      })
      .catch(() => setCompanies([]));
  }, []);

  const counts = useMemo(() => countByStatus(orders), [orders]);

  const filtered = useMemo(
    () =>
      filterOrders(orders, {
        statusTab,
        companyUserId,
        startDate,
        endDate,
      }),
    [orders, statusTab, companyUserId, startDate, endDate],
  );

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      await refetch();
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading dashboard…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analytics and order management across all companies
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          label="Total Orders"
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
            className={`rounded-t-md px-4 py-2 text-sm font-medium transition-colors ${
              statusTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-700"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs text-gray-400">
              ({counts[tab.id]})
            </span>
          </button>
        ))}
      </section>

      <section className="grid gap-4 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-3">
        <Select
          label="Company"
          value={companyUserId}
          onChange={(e) => setCompanyUserId(e.target.value)}
        >
          <option value="all">All companies</option>
          {companies.map((c) => (
            <option key={c.userId} value={c.userId}>
              {c.label}
            </option>
          ))}
        </Select>
        <Input
          label="Start date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          label="End date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="max-h-[calc(100vh-22rem)] overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
              <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created Time</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                    No orders match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-gray-50/80"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-mono font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {order.companyName || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{order.product}</td>
                    <td className="px-4 py-3 text-gray-700">{order.quantity}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={order.status} />
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) =>
                            updateStatus(order.id, e.target.value)
                          }
                          className="rounded border border-gray-300 px-1.5 py-0.5 text-xs"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-xs font-medium text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-500">
          Showing {filtered.length} of {orders.length} orders
        </div>
      </section>
    </div>
  );
}
