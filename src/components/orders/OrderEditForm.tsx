"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  toUpdateOrderPayload,
  updateOrderViaApi,
} from "@/lib/orders/update-order";
import { saveRecipientTemplate } from "@/lib/recipients";
import type { Order } from "@/lib/types";
import { useState } from "react";

interface OrderEditFormProps {
  order: Order;
  onSaved: () => void;
  onCancel: () => void;
}

export function OrderEditForm({ order, onSaved, onCancel }: OrderEditFormProps) {
  const [quantity, setQuantity] = useState(String(order.quantity));
  const [recipientName, setRecipientName] = useState(order.recipient.name);
  const [recipientAddress, setRecipientAddress] = useState(
    order.recipient.address,
  );
  const [recipientPhone, setRecipientPhone] = useState(
    order.recipient.phoneNumber,
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const quantityNum = Number(quantity);
    if (!quantity || Number.isNaN(quantityNum) || quantityNum <= 0) {
      setError("Quantity must be a positive number.");
      return;
    }

    if (
      !recipientName.trim() ||
      !recipientAddress.trim() ||
      !recipientPhone.trim()
    ) {
      setError("All recipient fields are required.");
      return;
    }

    setSubmitting(true);
    try {
      await updateOrderViaApi(
        toUpdateOrderPayload({
          id: order.id,
          quantity: quantityNum,
          recipientName,
          recipientAddress,
          recipientPhone,
        }),
      );

      saveRecipientTemplate({
        name: recipientName.trim(),
        address: recipientAddress.trim(),
        phoneNumber: recipientPhone.trim(),
      });

      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-sm text-gray-500">
        Product cannot be changed. Saving updates quantity, recipient details,
        and the order created time.
      </p>

      <Input
        label="Quantity"
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />

      <fieldset className="space-y-4 rounded-lg border border-gray-200 p-4">
        <legend className="px-1 text-sm font-semibold text-gray-900">
          Recipient
        </legend>
        <Input
          label="Name"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          required
        />
        <Input
          label="Address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          required
        />
        <Input
          label="Phone #"
          type="tel"
          value={recipientPhone}
          onChange={(e) => setRecipientPhone(e.target.value)}
          placeholder="e.g. +1 555 0100"
          required
        />
      </fieldset>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
