"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
};

export default function OrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [recipientName, setRecipientName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [postscript, setPostscript] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: productId,
        quantity,
        recipient_name: recipientName,
        recipient_address: recipientAddress,
        recipient_phone: recipientPhone,
        postscript: postscript || null,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Order created successfully!");
      setProductId("");
      setQuantity(1);
      setRecipientName("");
      setRecipientAddress("");
      setRecipientPhone("");
      setPostscript("");
    } else {
      const data = await res.json();
      alert(data.error ?? "Failed to create order");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Create Order</h1>

      <div>
        <label>Product</label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          <option value="">Select product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Recipient name</label>
        <input
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
        />
      </div>
      <div>
        <label>Recipient address</label>
        <input
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
        />
      </div>
      <div>
        <label>Phone #</label>
        <input
          type="tel"
          value={recipientPhone}
          onChange={(e) => setRecipientPhone(e.target.value)}
        />
      </div>

      <div>
        <label>Postscript (optional)</label>
        <textarea
          value={postscript}
          onChange={(e) => setPostscript(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit} disabled={loading || !productId}>
        {loading ? "Creating..." : "Create Order"}
      </button>
    </div>
  );
}
