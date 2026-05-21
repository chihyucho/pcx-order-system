"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { copyToClipboard } from "@/lib/helpers";
import { buildModificationEmail } from "@/lib/modification";
import type { Order } from "@/lib/types";
import { useState } from "react";

interface ModificationRequestModalProps {
  order: Order;
  open: boolean;
  onClose: () => void;
}

export function ModificationRequestModal({
  order,
  open,
  onClose,
}: ModificationRequestModalProps) {
  const email = buildModificationEmail(order);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(email.fullText);
    setCopied(success);
    if (success) {
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request Help"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleCopy}>
            {copied ? "Copied!" : "Copy email content"}
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-sm">
        <p className="text-gray-600">
          Copy the template below and send it to the design team via your email
          client.
        </p>
        <label className="block">
          <span className="mb-1 block font-medium text-gray-700">To</span>
          <input
            readOnly
            value={email.to}
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium text-gray-700">Subject</span>
          <input
            readOnly
            value={email.subject}
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium text-gray-700">Body</span>
          <textarea
            readOnly
            rows={12}
            value={email.body}
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-800"
          />
        </label>
      </div>
    </Modal>
  );
}
