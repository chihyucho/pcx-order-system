"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/context/AuthContext";
import { fetchProductsFromApi, type Product } from "@/lib/orders-api";
import {
  getRecipientTemplates,
  saveRecipientTemplate,
} from "@/lib/recipients";
import type { RecipientTemplate } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateOrderPage() {
  const router = useRouter();
  const { user } = useAuth();

  // ---------------------------
  // state
  // ---------------------------
  const [templates] = useState<RecipientTemplate[]>(() =>
    typeof window !== "undefined" ? getRecipientTemplates() : [],
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const [recipientName, setRecipientName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");

  const [postscript, setPostscript] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---------------------------
  // load products
  // ---------------------------
  useEffect(() => {
    fetchProductsFromApi()
      .then(setProducts)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load products"),
      );
  }, []);

  // ---------------------------
  // template apply
  // ---------------------------
  const applyTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);

    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    setRecipientName(template.name);
    setRecipientAddress(template.address);
    setRecipientPhone(template.phoneNumber);
  };

  // ---------------------------
  // submit order
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Please login first");
      return;
    }

    if (!productId) {
      setError("Product is required.");
      return;
    }

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

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantityNum,
          recipient_name: recipientName.trim(),
          recipient_address: recipientAddress.trim(),
          recipient_phone: recipientPhone.trim(),
          postscript: postscript?.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // save template for reuse
      saveRecipientTemplate({
        name: recipientName.trim(),
        address: recipientAddress.trim(),
        phoneNumber: recipientPhone.trim(),
      });

      // redirect
      router.push("/orders");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">
          Create Order
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Submit a new order for production
        </p>
      </header>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* product */}
          <Select
            label="Product"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>

          {/* quantity */}
          <Input
            label="Quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 100"
            required
          />

          {/* recipient */}
          <fieldset className="space-y-4 rounded-lg border p-4">
            <legend className="px-1 text-sm font-semibold">
              Recipient
            </legend>

            {templates.length > 0 && (
              <Select
                label="Saved template"
                value={selectedTemplateId}
                onChange={(e) => applyTemplate(e.target.value)}
              >
                <option value="">Select a template…</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </Select>
            )}

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

          {/* postscript */}
          <Input
            label="Postscript (optional)"
            value={postscript}
            onChange={(e) => setPostscript(e.target.value)}
            placeholder="Additional notes"
          />

          {/* error */}
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {/* buttons */}
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Order"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/orders")}
            >
              Cancel
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
}