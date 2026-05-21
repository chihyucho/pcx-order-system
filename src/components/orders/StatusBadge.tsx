import { getStatusBadgeClass, getStatusLabel } from "@/lib/helpers";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={getStatusBadgeClass(status)}>{getStatusLabel(status)}</span>
  );
}
