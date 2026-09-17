"use client";

import { useState } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Can } from "@/components/auth/can";
import { UserWithRoles, SimpleRole } from "@/types/rbac.types";
import {
  useUsersQuery,
  useUserDetailQuery,
  useAssignUserRoleMutation,
  useRevokeUserRoleMutation,
  useChangeUserStatusMutation,
} from "@/hooks/queries/use-users-queries";
import { useRolesQuery } from "@/hooks/queries/use-rbac-queries";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  UserCheck,
  ShieldPlus,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Briefcase,
  ToggleLeft,
} from "lucide-react";

function getRoleName(role: string | SimpleRole): string {
  return typeof role === "string" ? role : role.name;
}

function getRoleId(role: string | SimpleRole): string {
  return typeof role === "string" ? role : role.id;
}

export default function UsersManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // TanStack Queries & Mutations
  const { data: users = [], isLoading: isUsersLoading } = useUsersQuery();
  const { data: roles = [], isLoading: isRolesLoading } = useRolesQuery();

  const assignRoleMutation = useAssignUserRoleMutation();
  const revokeRoleMutation = useRevokeUserRoleMutation();
  const changeStatusMutation = useChangeUserStatusMutation();

  // Assign Role Modal state
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // User Details Modal state
  const [inspectUserId, setInspectUserId] = useState<string | null>(null);
  const { data: inspectUser = null, isLoading: isInspectLoading } = useUserDetailQuery(inspectUserId);

  const loading = isUsersLoading || isRolesLoading;

  const handleInspectUser = (userId: string) => {
    setInspectUserId(userId);
  };

  const handleToggleStatus = async (user: UserWithRoles) => {
    const nextStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await changeStatusMutation.mutateAsync({ id: user.id, status: nextStatus });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to change user status");
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRoleId) return;
    setFeedbackMsg(null);
    try {
      await assignRoleMutation.mutateAsync({
        userId: selectedUser.id,
        roleId: selectedRoleId,
      });
      setFeedbackMsg({ type: "success", text: "Role assigned successfully!" });
      setTimeout(() => {
        setSelectedUser(null);
        setSelectedRoleId("");
        setFeedbackMsg(null);
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to assign role";
      setFeedbackMsg({ type: "error", text: msg });
    }
  };

  const handleRevokeRole = async (user: UserWithRoles, roleItem: string | SimpleRole) => {
    const rId = getRoleId(roleItem);
    const rName = getRoleName(roleItem);
    if (!confirm(`Are you sure you want to revoke role "${rName}" from ${user.firstName}?`)) return;
    try {
      await revokeRoleMutation.mutateAsync({ userId: user.id, roleId: rId });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to revoke role");
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.email.toLowerCase().includes(term) ||
      u.firstName.toLowerCase().includes(term) ||
      (u.lastName && u.lastName.toLowerCase().includes(term)) ||
      u.roles.some((r) => getRoleName(r).toLowerCase().includes(term))
    );
  });

  return (
    <PermissionGuard requiredPermission="users:read">
      <div className="space-y-6 animate-in fade-in-0 duration-300">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Users className="h-7 w-7 text-primary" />
              User Accounts & Role Management
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Live Backend Connection (TanStack Query Cache): View registered profiles, user details, and assign RBAC roles
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* User Table Card */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <span>All Registered Accounts ({filteredUsers.length})</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              View and manage all registered user accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex h-48 w-full items-center justify-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No user accounts matching search parameters found in database.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-y border-border text-xs uppercase text-muted-foreground font-semibold">
                    <tr>
                      <th className="px-6 py-3.5">User</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">Assigned Roles</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                              {user.firstName[0]}
                              {user.lastName ? user.lastName[0] : ""}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">
                                {user.firstName} {user.lastName || ""}
                              </p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            className={
                              user.status === "ACTIVE"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                            }
                          >
                            <UserCheck className="h-3 w-3 mr-1" />
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {user.roles.map((role) => {
                              const rName = getRoleName(role);
                              return (
                                <Badge key={getRoleId(role)} variant="secondary" className="text-xs py-0.5 px-2 font-medium flex items-center gap-1">
                                  {rName}
                                  <Can perform="users:revoke_role">
                                    <button
                                      onClick={() => handleRevokeRole(user, role)}
                                      disabled={revokeRoleMutation.isPending}
                                      title={`Revoke ${rName}`}
                                      className="ml-1 text-muted-foreground hover:text-destructive"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </Can>
                                </Badge>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleInspectUser(user.id)}
                            className="h-8 gap-1 text-xs"
                            title="View Full Details"
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-500" />
                            Details
                          </Button>

                          <Can perform="users:assign_role">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setSelectedRoleId("");
                                setFeedbackMsg(null);
                              }}
                              className="h-8 gap-1 text-xs"
                            >
                              <ShieldPlus className="h-3.5 w-3.5 text-primary" />
                              Assign Role
                            </Button>
                          </Can>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Details Modal */}
        <Dialog open={!!inspectUserId} onOpenChange={(open) => !open && setInspectUserId(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                User Account Details
              </DialogTitle>
              <DialogDescription className="text-xs">
                Full profile details for this user account.
              </DialogDescription>
            </DialogHeader>

            {isInspectLoading ? (
              <div className="flex h-32 w-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : inspectUser && (
              <div className="space-y-4 py-2 text-xs">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/60">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">
                      {inspectUser.firstName} {inspectUser.lastName || ""}
                    </h3>
                    <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Mail className="h-3 w-3" /> {inspectUser.email}
                    </p>
                    {inspectUser.phone && (
                      <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3" /> {inspectUser.phone}
                      </p>
                    )}
                  </div>

                  <div className="text-right space-y-1">
                    <Badge
                      className={
                        inspectUser.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-zinc-500/10 text-zinc-500"
                      }
                    >
                      {inspectUser.status}
                    </Badge>
                    <Can perform="users:update">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleToggleStatus(inspectUser)}
                        disabled={changeStatusMutation.isPending}
                        className="h-6 text-[10px] mt-1 gap-1 block ml-auto"
                      >
                        {changeStatusMutation.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <ToggleLeft className="h-3 w-3" />
                        )}
                        Toggle Status
                      </Button>
                    </Can>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/20 rounded-md border border-border/40">
                    <span className="font-semibold text-muted-foreground block mb-1">User ID</span>
                    <span className="font-mono text-[11px] select-all">{inspectUser.id}</span>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-md border border-border/40">
                    <span className="font-semibold text-muted-foreground block mb-1">Created At</span>
                    <span className="text-[11px] flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {inspectUser.createdAt ? new Date(inspectUser.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>

                {inspectUser.studentProfile && (
                  <div className="p-3 bg-blue-500/5 rounded-md border border-blue-500/20 space-y-1">
                    <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 text-xs">
                      <GraduationCap className="h-4 w-4" /> Student Profile
                    </span>
                    <p>Student ID: <span className="font-mono">{inspectUser.studentProfile.studentId}</span></p>
                    {inspectUser.studentProfile.rollNumber && <p>Roll Number: {inspectUser.studentProfile.rollNumber}</p>}
                  </div>
                )}

                {inspectUser.teacherProfile && (
                  <div className="p-3 bg-emerald-500/5 rounded-md border border-emerald-500/20 space-y-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-xs">
                      <Briefcase className="h-4 w-4" /> Teacher Profile
                    </span>
                    <p>Employee ID: <span className="font-mono">{inspectUser.teacherProfile.employeeId}</span></p>
                  </div>
                )}

                <div>
                  <span className="font-semibold text-muted-foreground block mb-1.5">Assigned Roles</span>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectUser.roles.map((role) => (
                      <Badge key={getRoleId(role)} className="bg-primary/10 text-primary border-primary/20">
                        {getRoleName(role)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setInspectUserId(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign Role Dialog */}
        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <ShieldPlus className="h-5 w-5 text-primary" />
                Assign Role to User
              </DialogTitle>
              <DialogDescription className="text-xs">
                Select a system role to assign to{" "}
                <span className="font-semibold text-foreground">
                  {selectedUser?.firstName} {selectedUser?.lastName || ""}
                </span>
              </DialogDescription>
            </DialogHeader>

            {feedbackMsg && (
              <div
                className={`p-3 rounded-md text-xs flex items-center gap-2 ${
                  feedbackMsg.type === "success"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                {feedbackMsg.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {feedbackMsg.text}
              </div>
            )}

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Select System Role</label>
                <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue placeholder="Choose role to grant..." />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id} className="text-xs">
                        {r.name} - {r.description || "System Role"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAssignRole}
                disabled={!selectedRoleId || assignRoleMutation.isPending}
                className="gap-1.5"
              >
                {assignRoleMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Confirm Assignment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
}
