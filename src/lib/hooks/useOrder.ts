"use client";

import { fetchOrderById } from "@/lib/orders/fetch-orders";
import type { Order } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export function useOrder(id: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrderById(id);
      setOrder(data);
      if (!data) {
        setError("Order not found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      void refetch();
    }
  }, [id, refetch]);

  return { order, loading, error, refetch };
}
