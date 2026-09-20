"use client";

import { useState } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import {
  useUsersQuery,
  useAssignUserRoleMutation,
  useRevokeUserRoleMutation,
} from "@/hooks/queries/use-users-queries";
import { useRolesQuery } from "@/hooks/queries/use-rbac-queries";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, Search, Loader2 } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { UserRow } from "./user-row";
import { SimpleRole } from "@/types/rbac.types";

function getRoleName(role: string | SimpleRole): string {
  return typeof role === "string" ? role : role.name;
}

export function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users = [], isLoading: isUsersLoading } = useUsersQuery();
  const { data: allRoles = [], isLoading: isRolesLoading } = useRolesQuery();

  const assignRoleMutation = useAssignUserRoleMutation();
  const revokeRoleMutation = useRevokeUserRoleMutation();

  const isRolePending =
    assignRoleMutation.isPending || revokeRoleMutation.isPending;

  const handleAssignRole = (userId: string, roleId: string) =>
    assignRoleMutation.mutateAsync({ userId, roleId });

  const handleRevokeRole = (userId: string, roleId: string) =>
    revokeRoleMutation.mutateAsync({ userId, roleId });

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.email.toLowerCase().includes(term) ||
      u.firstName.toLowerCase().includes(term) ||
      (u.lastName?.toLowerCase().includes(term) ?? false) ||
      u.roles.some((r) => getRoleName(r).toLowerCase().includes(term))
    );
  });

  const loading = isUsersLoading || isRolesLoading;

  return (
    <PermissionGuard requiredPermission="users:read">
      <div className="space-y-6 animate-in fade-in-0 duration-300">
        {/* Page Header */}
        <DashboardPageHeader
          title="User Accounts & Role Management"
          description="Manage RBAC roles inline. Click View to open a user's full detail page."
          icon={Users}
          actions={
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, role…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 text-xs sm:text-sm"
              />
            </div>
          }
        />

        {/* Full-width users table */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">
              All Registered Accounts
              <span className="ml-2 text-muted-foreground font-normal text-sm">
                ({filteredUsers.length})
              </span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Use the <strong>Roles</strong> dropdown to assign or revoke roles instantly.
              Click <strong>View</strong> to open the full user profile.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex h-48 w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No accounts match your search.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-y border-border text-xs uppercase text-muted-foreground font-semibold">
                    <tr>
                      <th className="px-5 py-3">User</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Roles</th>
                      <th className="px-5 py-3 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <UserRow
                        key={user.id}
                        user={user}
                        allRoles={allRoles}
                        isRolePending={isRolePending}
                        onAssignRole={handleAssignRole}
                        onRevokeRole={handleRevokeRole}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
}
