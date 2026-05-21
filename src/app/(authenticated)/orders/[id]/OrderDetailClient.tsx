"use client";

import { ModificationRequestModal } from "@/components/orders/ModificationRequestModal";
import { OrderEditForm } from "@/components/orders/OrderEditForm";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { formatDateTime } from "@/lib/helpers";
import { useOrder } from "@/lib/hooks/useOrder";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function OrderDetailClient({ id }: { id: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit") === "1";

  const { order, loading, error, refetch } = useOrder(id);
  const [modOpen, setModOpen] = useState(false);

  const backHref = user?.role === "admin" ? "/admin" : "/orders";
  const canEdit =
    user?.role === "user" &&
    order?.status === "pending" &&
    order.userId === user.id;

  const exitEdit = () => {
    router.replace(`/orders/${id}`);
  };

  if (
    user &&
    order &&
    order.userId !== user.id &&
    user.role !== "admin"
  ) {
    router.replace("/orders");
    return null;
  }

  if (loading) {
    return (
      <Card>
        <p className="text-sm text-gray-500">Loading order…</p>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <p className="text-sm text-gray-500">{error ?? "Order not found."}</p>
        <Link href={backHref} className="mt-4 inline-block text-sm text-blue-600">
          Back
        </Link>
      </Card>
    );
  }

  if (editMode && !canEdit) {
    return (
      <Card>
        <p className="text-sm text-gray-500">
          This order cannot be edited. Only your pending orders can be changed.
        </p>
        <Link
          href={`/orders/${id}`}
          className="mt-4 inline-block text-sm text-blue-600"
        >
          View order
        </Link>
      </Card>
    );
  }

  if (editMode && canEdit) {
    return (
      <section className="mx-auto max-w-3xl space-y-6">
        <header>
          <Link
            href={`/orders/${id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Cancel edit
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">
            Edit order #{order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {order.product} · <StatusBadge status={order.status} />
          </p>
        </header>

        <Card title="Order details">
          <OrderEditForm
            order={order}
            onSaved={() => {
              void refetch();
              router.replace(`/orders/${id}`);
              router.refresh();
            }}
            onCancel={exitEdit}
          />
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href={backHref} className="text-sm text-blue-600 hover:underline">
            ← Back
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">
            Order #{order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Created {formatDateTime(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </header>

      <Card title="Order information">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">
              Order #
            </dt>
            <dd className="mt-1 font-mono text-sm">{order.orderNumber}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">
              Created time
            </dt>
            <dd className="mt-1 text-sm">{formatDateTime(order.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">
              Company
            </dt>
            <dd className="mt-1 text-sm">{order.companyName || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">
              Product
            </dt>
            <dd className="mt-1 text-sm">{order.product}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">
              Quantity
            </dt>
            <dd className="mt-1 text-sm">{order.quantity}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">
              Status
            </dt>
            <dd className="mt-1">
              <StatusBadge status={order.status} />
            </dd>
          </div>
        </dl>
      </Card>

      <Card title="Recipient">
        <dl className="space-y-3">
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Name</dt>
            <dd className="mt-1 text-sm">{order.recipient.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">
              Address
            </dt>
            <dd className="mt-1 text-sm">{order.recipient.address}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">
              Phone #
            </dt>
            <dd className="mt-1 text-sm">{order.recipient.phoneNumber}</dd>
          </div>
        </dl>
      </Card>

      <div className="flex flex-wrap gap-3">
        {canEdit && (
          <Link href={`/orders/${id}?edit=1`}>
            <Button>Edit order</Button>
          </Link>
        )}
        <Button variant="secondary" onClick={() => setModOpen(true)}>
          Request Help
        </Button>
      </div>

      <ModificationRequestModal
        order={order}
        open={modOpen}
        onClose={() => setModOpen(false)}
      />
    </section>
  );
}
