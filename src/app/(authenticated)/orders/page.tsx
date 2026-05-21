"use client";

import { OrdersTable } from "@/components/orders/OrdersTable";
import { Button } from "@/components/ui/Button";
import { useOrders } from "@/lib/hooks/useOrders";
import Link from "next/link";

export default function ManageOrdersPage() {
  const { orders, loading, error, refetch } = useOrders();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="mt-1 text-sm text-gray-500 space-y-1">
        <p>View and manage your submitted orders.</p>
        <p>You can only edit orders that are in the pending status.</p>
      </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => refetch()}>
            Refresh
          </Button>
          <Link href="/orders/create">
            <Button>Create Order</Button>
          </Link>
        </div>
      </header>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading orders…</p>
      ) : (
        <OrdersTable orders={orders} />
      )}
    </div>
  );
}
