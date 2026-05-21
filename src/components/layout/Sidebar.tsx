"use client";

import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/helpers";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  match?: (pathname: string) => boolean;
}

const userNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/orders/create", label: "Create Order" },
  {
    href: "/orders",
    label: "Manage Orders",
    match: (p) =>
      p === "/orders" ||
      (p.startsWith("/orders/") && p !== "/orders/create"),
  },
];

const adminNav: NavItem[] = [
  {
    href: "/admin",
    label: "Admin Dashboard",
    match: (p) => p === "/admin" || p.startsWith("/admin/orders"),
  },
  { href: "/admin/users", label: "Users" },
];

function isActive(item: NavItem, pathname: string): boolean {
  if (item.match) return item.match(pathname);
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const items = user?.role === "admin" ? adminNav : userNav;

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-14 items-center gap-2 border-b border-gray-200 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
          PCX
        </div>
        <span className="text-sm font-semibold text-gray-900">OMS</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(item, pathname)
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
