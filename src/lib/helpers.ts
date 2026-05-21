export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  production: "In Production",
  processing: "Processing",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

export function getStatusBadgeClass(status: string): string {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  switch (status) {
    case "pending":
      return `${base} bg-amber-100 text-amber-800`;
    case "approved":
    case "processing":
      return `${base} bg-blue-100 text-blue-800`;
    case "production":
      return `${base} bg-violet-100 text-violet-800`;
    case "shipped":
      return `${base} bg-orange-100 text-orange-800`;
    case "completed":
      return `${base} bg-emerald-100 text-emerald-800`;
    case "cancelled":
      return `${base} bg-red-100 text-red-800`;
    default:
      return `${base} bg-gray-100 text-gray-800`;
  }
}

export function getRoleBadgeClass(role: "user" | "admin"): string {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize";
  return role === "admin"
    ? `${base} bg-indigo-100 text-indigo-800`
    : `${base} bg-gray-100 text-gray-700`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
