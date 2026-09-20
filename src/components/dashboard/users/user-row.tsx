"use client";

import { UserWithRoles, SimpleRole, Role } from "@/types/rbac.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Can } from "@/components/auth/can";
import { Link } from "@/i18n/navigation";
import { RoleCombobox } from "./role-combobox";
import { useChangeUserStatusMutation } from "@/hooks/queries/use-users-queries";
import { UserCheck, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ── helpers ───────────────────────────────────────────────────────────────────
function getRoleId(role: string | SimpleRole): string {
  return typeof role === "string" ? role : role.id;
}

// ── types ─────────────────────────────────────────────────────────────────────
interface UserRowProps {
  user: UserWithRoles;
  allRoles: Role[];
  isRolePending: boolean;
  onAssignRole: (userId: string, roleId: string) => Promise<unknown>;
  onRevokeRole: (userId: string, roleId: string) => Promise<unknown>;
}

export function UserRow({
  user,
  allRoles,
  isRolePending,
  onAssignRole,
  onRevokeRole,
}: UserRowProps) {
  const initials = (user.firstName[0] ?? "") + (user.lastName?.[0] ?? "");

  const changeStatusMutation = useChangeUserStatusMutation();

  const handleToggleStatus = () => {
    const next = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    changeStatusMutation.mutate({ id: user.id, status: next });
  };

  return (
    <tr className="transition-colors border-b border-border/60 last:border-0 hover:bg-muted/30">
      {/* ── User identity ───────────────────────────────────── */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-foreground truncate">
              {user.firstName} {user.lastName ?? ""}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      </td>

      {/* ── Status + inline toggle ───────────────────────────── */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-medium gap-1 shrink-0",
              user.status === "ACTIVE"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
            )}
          >
            <UserCheck className="h-3 w-3" />
            {user.status}
          </Badge>

          <Can perform="users:update">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleStatus}
              disabled={changeStatusMutation.isPending}
              className={cn(
                "h-6 px-2 text-[11px] gap-1 rounded-full border transition-colors",
                user.status === "ACTIVE"
                  ? "border-zinc-300 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  : "border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-800 dark:hover:bg-emerald-950",
              )}
              title={user.status === "ACTIVE" ? "Deactivate user" : "Activate user"}
            >
              {changeStatusMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : user.status === "ACTIVE" ? (
                "Deactivate"
              ) : (
                "Activate"
              )}
            </Button>
          </Can>
        </div>
      </td>

      {/* ── Role combobox ────────────────────────────────────── */}
      <td className="px-5 py-3.5">
        <Can
          perform="users:assign_role"
          fallback={
            <div className="flex flex-wrap gap-1">
              {user.roles.length === 0 ? (
                <span className="text-xs text-muted-foreground italic">No roles</span>
              ) : (
                user.roles.map((r) => (
                  <Badge key={getRoleId(r)} variant="secondary" className="text-xs">
                    {typeof r === "string" ? r : r.name}
                  </Badge>
                ))
              )}
            </div>
          }
        >
          <RoleCombobox
            allRoles={allRoles}
            assignedRoles={user.roles}
            onAssign={(roleId) => onAssignRole(user.id, roleId)}
            onRevoke={(roleId) => onRevokeRole(user.id, roleId)}
            isPending={isRolePending}
          />
        </Can>
      </td>

      {/* ── Navigate to detail page ──────────────────────────── */}
      <td className="px-5 py-3.5 text-right">
        <Link href={`/dashboard/users/${user.id}`}>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
            View
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </td>
    </tr>
  );
}
