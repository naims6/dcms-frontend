"use client";

import { useUserDetailQuery, useChangeUserStatusMutation } from "@/hooks/queries/use-users-queries";
import { useAssignUserRoleMutation, useRevokeUserRoleMutation } from "@/hooks/queries/use-users-queries";
import { useRolesQuery } from "@/hooks/queries/use-rbac-queries";
import { SimpleRole } from "@/types/rbac.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Can } from "@/components/auth/can";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { RoleCombobox } from "./role-combobox";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Briefcase,
  Fingerprint,
  ShieldCheck,
  ToggleLeft,
  Loader2,
  UserCheck,
  Users,
} from "lucide-react";

// ── helpers ───────────────────────────────────────────────────────────────────
function getRoleName(role: string | SimpleRole): string {
  return typeof role === "string" ? role : role.name;
}

function getRoleId(role: string | SimpleRole): string {
  return typeof role === "string" ? role : role.id;
}

// ── component ─────────────────────────────────────────────────────────────────
interface UserDetailViewProps {
  userId: string;
}

export function UserDetailView({ userId }: UserDetailViewProps) {
  const { data: user, isLoading } = useUserDetailQuery(userId);
  const { data: allRoles = [] } = useRolesQuery();

  const changeStatusMutation = useChangeUserStatusMutation();
  const assignRoleMutation = useAssignUserRoleMutation();
  const revokeRoleMutation = useRevokeUserRoleMutation();

  const isRolePending =
    assignRoleMutation.isPending || revokeRoleMutation.isPending;

  const handleToggleStatus = async () => {
    if (!user) return;
    const next = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await changeStatusMutation.mutateAsync({ id: user.id, status: next });
  };

  // ── loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-muted-foreground">
        <Users className="h-12 w-12 opacity-20" />
        <p className="text-sm">User not found.</p>
        <Link href="/dashboard/users">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
        </Link>
      </div>
    );
  }

  const initials = (user.firstName[0] ?? "") + (user.lastName?.[0] ?? "");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* ── Page header ──────────────────────────────────────────────── */}
      <DashboardPageHeader
        title={`${user.firstName} ${user.lastName ?? ""}`}
        description={user.email}
        icon={Users}
        actions={
          <Link href="/dashboard/users">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Users
            </Button>
          </Link>
        }
      />

      {/* ── Top row: avatar card + status card ───────────────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Avatar / identity */}
        <Card className="border-border/80 shadow-xs md:col-span-1">
          <CardContent className="flex flex-col items-center gap-4 pt-8 pb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary font-extrabold text-2xl uppercase shadow-inner">
              {initials}
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-bold text-foreground">
                {user.firstName} {user.lastName ?? ""}
              </p>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Mail className="h-3.5 w-3.5" /> {user.email}
              </p>
              {user.phone && (
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> {user.phone}
                </p>
              )}
            </div>

            {/* Status badge + toggle */}
            <div className="flex flex-col items-center gap-2 w-full pt-2 border-t border-border/50">
              <Badge
                variant="outline"
                className={cn(
                  "gap-1.5 text-xs font-semibold",
                  user.status === "ACTIVE"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
                )}
              >
                <UserCheck className="h-3.5 w-3.5" />
                {user.status}
              </Badge>

              <Can perform="users:update">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleStatus}
                  disabled={changeStatusMutation.isPending}
                  className="w-full gap-2 h-8 text-xs"
                >
                  {changeStatusMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ToggleLeft className="h-3.5 w-3.5" />
                  )}
                  Toggle Status
                </Button>
              </Can>
            </div>
          </CardContent>
        </Card>

        {/* Account meta */}
        <Card className="border-border/80 shadow-xs md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-1.5">
                  <Fingerprint className="h-3.5 w-3.5" /> Account ID
                </p>
                <p className="font-mono text-xs select-all break-all text-foreground">{user.id}</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Date Joined
                </p>
                <p className="text-sm text-foreground">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Roles section with inline combobox */}
            <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Assigned Roles
                </p>
                <Can perform="users:assign_role">
                  <RoleCombobox
                    allRoles={allRoles}
                    assignedRoles={user.roles}
                    onAssign={(roleId) =>
                      assignRoleMutation.mutateAsync({ userId: user.id, roleId })
                    }
                    onRevoke={(roleId) =>
                      revokeRoleMutation.mutateAsync({ userId: user.id, roleId })
                    }
                    isPending={isRolePending}
                  />
                </Can>
              </div>

              {user.roles.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No roles assigned yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <Badge
                      key={getRoleId(role)}
                      className="bg-primary/10 text-primary border-primary/20 font-semibold text-xs"
                    >
                      {getRoleName(role)}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Profile cards row ─────────────────────────────────────────── */}
      {(user.studentProfile || user.teacherProfile) && (
        <div className="grid gap-4 md:grid-cols-2">
          {user.studentProfile && (
            <Card className="border-blue-500/20 bg-blue-500/5 shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Student Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs">Student ID</span>
                  <span className="font-mono text-xs">{user.studentProfile.studentId}</span>
                </div>
                {user.studentProfile.rollNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-xs">Roll Number</span>
                    <span className="text-xs font-semibold">{user.studentProfile.rollNumber}</span>
                  </div>
                )}
                {user.studentProfile.gender && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-xs">Gender</span>
                    <span className="text-xs">{user.studentProfile.gender}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs">Status</span>
                  <Badge variant="outline" className="text-[10px] py-0">
                    {user.studentProfile.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {user.teacherProfile && (
            <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Teacher Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs">Employee ID</span>
                  <span className="font-mono text-xs">{user.teacherProfile.employeeId}</span>
                </div>
                {user.teacherProfile.gender && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-xs">Gender</span>
                    <span className="text-xs">{user.teacherProfile.gender}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs">Status</span>
                  <Badge variant="outline" className="text-[10px] py-0">
                    {user.teacherProfile.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
