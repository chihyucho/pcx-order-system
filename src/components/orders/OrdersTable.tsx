"use client";

import { ModificationRequestModal } from "@/components/orders/ModificationRequestModal";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { formatDateTime } from "@/lib/helpers";
import type { Order } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";

interface OrdersTableProps {
  orders: Order[];
  showCompany?: boolean;
}

export function OrdersTable({ orders, showCompany = false }: OrdersTableProps) {
  const [modOrder, setModOrder] = useState<Order | null>(null);

  if (orders.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">No orders found.</p>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Order #</TableHeaderCell>
              {showCompany && <TableHeaderCell>Company</TableHeaderCell>}
              <TableHeaderCell>Product</TableHeaderCell>
              <TableHeaderCell>Qty</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Created</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link
                    href={`/orders/${order.id}`}
                    className="font-mono text-sm font-medium text-blue-600 hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                </TableCell>
                {showCompany && (
                  <TableCell>{order.companyName}</TableCell>
                )}
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="secondary" size="sm">
                        View
                      </Button>
                    </Link>
                    {order.status === "pending" && (
                      <Link href={`/orders/${order.id}?edit=1`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setModOrder(order)}
                    >
                      Request Help
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {modOrder && (
        <ModificationRequestModal
          order={modOrder}
          open={Boolean(modOrder)}
          onClose={() => setModOrder(null)}
        />
      )}
    </>
  );
}
