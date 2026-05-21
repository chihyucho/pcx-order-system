import type { User, UserRole } from "./types";

export interface UserWithOrderCount extends User {
  orderCount: number;
}

interface AdminUserRow {
  id: string;
  email: string;
  role: UserRole;
  companyName: string;
  displayCompany: string;
  orderCount: number;
}

export async function fetchUsersWithOrderCounts(): Promise<UserWithOrderCount[]> {
  const res = await fetch("/api/admin/users", { cache: "no-store" });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      typeof json.error === "string" ? json.error : "Failed to load users",
    );
  }

  const rows = (json.users ?? []) as AdminUserRow[];

  return rows.map((u) => ({
    id: u.id,
    name: u.displayCompany,
    email: u.email,
    companyName: u.displayCompany,
    role: u.role,
    orderCount: u.orderCount,
  }));
}
