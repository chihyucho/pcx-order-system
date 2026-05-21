"use client";

import { Card } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { cn, getRoleBadgeClass } from "@/lib/helpers";
import {
  fetchUsersWithOrderCounts,
  type UserWithOrderCount,
} from "@/lib/users";
import { useEffect, useMemo, useState } from "react";

type CompanySort = "asc" | "desc";

function SortableCompanyHeader({
  sort,
  onToggle,
}: {
  sort: CompanySort;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-1 uppercase tracking-wide hover:text-gray-800"
    >
      Company
      <span className="text-blue-600" aria-hidden>
        {sort === "asc" ? "↑" : "↓"}
      </span>
    </button>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithOrderCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companySort, setCompanySort] = useState<CompanySort>("asc");

  useEffect(() => {
    fetchUsersWithOrderCounts()
      .then(setUsers)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load users"),
      )
      .finally(() => setLoading(false));
  }, []);

  const sortedUsers = useMemo(() => {
    const list = [...users];
    list.sort((a, b) => {
      const aKey = (a.companyName || a.email).toLowerCase();
      const bKey = (b.companyName || b.email).toLowerCase();
      const cmp = aKey.localeCompare(bKey);
      return companySort === "asc" ? cmp : -cmp;
    });
    return list;
  }, [users, companySort]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <p className="mt-1 text-sm text-gray-500">
          All accounts (users and admins). Click Company to sort.
        </p>
      </header>

      <Card title="All accounts">
        {loading ? (
          <p className="text-sm text-gray-500">Loading users…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : sortedUsers.length === 0 ? (
          <p className="text-sm text-gray-500">No accounts found.</p>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>
                  <SortableCompanyHeader
                    sort={companySort}
                    onToggle={() =>
                      setCompanySort((s) => (s === "asc" ? "desc" : "asc"))
                    }
                  />
                </TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Orders</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-gray-900">
                    {user.companyName || "—"}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={cn(getRoleBadgeClass(user.role))}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{user.orderCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
