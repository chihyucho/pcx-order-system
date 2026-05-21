import { cn } from "@/lib/helpers";

interface KpiCardProps {
  label: string;
  value: number;
  active?: boolean;
  onClick?: () => void;
  accent?: "default" | "amber" | "blue" | "orange" | "green" | "red" | "slate";
}

const accentClasses: Record<NonNullable<KpiCardProps["accent"]>, string> = {
  default: "border-gray-200 bg-white",
  slate: "border-slate-200 bg-slate-50",
  amber: "border-amber-200 bg-amber-50",
  blue: "border-blue-200 bg-blue-50",
  orange: "border-orange-200 bg-orange-50",
  green: "border-green-200 bg-green-50",
  red: "border-red-200 bg-red-50",
};

export function KpiCard({
  label,
  value,
  active,
  onClick,
  accent = "default",
}: KpiCardProps) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "rounded-lg border p-4 text-left transition-shadow hover:shadow-md cursor-pointer",
          accentClasses[accent],
          active && "ring-2 ring-blue-500 ring-offset-1",
        )}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </p>
        <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border p-4 text-left",
        accentClasses[accent],
        active && "ring-2 ring-blue-500 ring-offset-1",
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
