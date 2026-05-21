import { OrderDetailClient } from "./OrderDetailClient";
import { Suspense } from "react";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <p className="text-sm text-gray-500">Loading order…</p>
      }
    >
      <OrderDetailClient id={id} />
    </Suspense>
  );
}
