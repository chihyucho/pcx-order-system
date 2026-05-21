"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { getRoleBadgeClass } from "@/lib/helpers";

export function Topbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <p className="text-sm text-gray-500">Internal Order Management</p>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{user.email}</p>
          <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
        </div>
        <Button variant="secondary" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
