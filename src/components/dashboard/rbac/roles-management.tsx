"use client";

import { useState } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Can } from "@/components/auth/can";
import { Role } from "@/types/rbac.types";
import {
  useRolesQuery,
  usePermissionsQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "@/hooks/queries/use-rbac-queries";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/shared/Toast";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { RoleRow } from "./role-row";
import { RoleFormDialog } from "./role-form-dialog";
import { RoleDetailDialog } from "./role-detail-dialog";
import {
  ShieldCheck,
  Plus,
  Loader2,
  Key,
  Layers,
} from "lucide-react";

export function RolesManagement() {
  const { toast, toastState, dismiss } = useToast();
  const { data: roles = [], isLoading: isRolesLoading } = useRolesQuery();
  const { data: permissions = [], isLoading: isPermissionsLoading } = usePermissionsQuery();

  const createMutation = useCreateRoleMutation();
  const updateMutation = useUpdateRoleMutation();
  const deleteMutation = useDeleteRoleMutation();

  const loading = isRolesLoading || isPermissionsLoading;

  // Dialog state — null = closed, undefined = create mode, Role = edit mode
  const [dialogRole, setDialogRole] = useState<Role | null | undefined>(undefined);
  const isDialogOpen = dialogRole !== undefined;

  // Detail dialog state
  const [viewRole, setViewRole] = useState<Role | null>(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const openCreate = () => setDialogRole(null);
  const openView = (role: Role) => setViewRole(role);
  const openEdit = (role: Role) => {
    setViewRole(null);
    setDialogRole(role);
  };
  const closeDialog = () => setDialogRole(undefined);
  const closeView = () => setViewRole(null);

  const handleSubmit = async (data: {
    name: string;
    description: string;
    permissionNames: string[];
  }) => {
    try {
      if (dialogRole) {
        // Edit mode
        await updateMutation.mutateAsync({
          id: dialogRole.id,
          dto: { description: data.description, permissionNames: data.permissionNames },
        });
        toast("success", `Role "${dialogRole.name}" updated successfully.`);
      } else {
        // Create mode
        await createMutation.mutateAsync(data);
        toast("success", "Role created successfully.");
      }
    } catch (err: unknown) {
      toast("error", err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast("success", `Role "${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
    } catch (err: unknown) {
      toast("error", err instanceof Error ? err.message : "Failed to delete role.");
    }
  };

  // ── Stats ────────────────────────────────────────────────────────────────
  const stats = [
    {
      label: "Total Roles",
      value: roles.length,
      icon: Layers,
      color: "text-primary bg-primary/10",
    },
    {
      label: "System Permissions",
      value: permissions.length,
      icon: Key,
      color: "text-emerald-500 bg-emerald-500/10",
    },
  ];

  return (
    <PermissionGuard requiredPermission="roles:read">
      <div className="space-y-6 animate-in fade-in-0 duration-300">
        {toastState && <Toast state={toastState} onDismiss={dismiss} />}

        {/* ── Page header ─────────────────────────────────────── */}
        <DashboardPageHeader
          title="Role Management & Permissions"
          description="Define system roles and control exactly which actions each role can perform."
          icon={ShieldCheck}
          iconClassName="text-emerald-500"
          actions={
            <Can perform="roles:create">
              <Button onClick={openCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                New Role
              </Button>
            </Can>
          }
        />

        {/* ── Stats bar ───────────────────────────────────────── */}
        {!loading && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:max-w-md">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.label} className="border-border/70 shadow-xs">
                  <CardContent className="flex items-center gap-4 px-5 py-4">
                    <div className={`p-2.5 rounded-xl shrink-0 ${s.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        {s.label}
                      </p>
                      <p className="text-2xl font-extrabold tracking-tight text-foreground leading-none mt-1">
                        {s.value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* ── Roles table ─────────────────────────────────────── */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">
              Roles
              <span className="ml-2 text-muted-foreground font-normal text-sm">
                ({roles.length})
              </span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Click a role to see exactly which permissions it has — and which it
              doesn&apos;t.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex h-48 w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : roles.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-muted-foreground">
                <ShieldCheck className="h-12 w-12 opacity-20" />
                <p className="text-sm">No roles defined yet.</p>
                <Can perform="roles:create">
                  <Button onClick={openCreate} variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" /> Create your first role
                  </Button>
                </Can>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-y border-border text-xs uppercase text-muted-foreground font-semibold">
                    <tr>
                      <th className="px-5 py-3">Role</th>
                      <th className="px-5 py-3">Members</th>
                      <th className="px-5 py-3">Permissions</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => (
                      <RoleRow
                        key={role.id}
                        role={role}
                        isDeletePending={deleteMutation.isPending}
                        onView={openView}
                        onEdit={openEdit}
                        onDelete={(role) => setDeleteTarget(role)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Unified create / edit dialog ────────────────────── */}
        <RoleFormDialog
          open={isDialogOpen}
          onOpenChange={(open) => !open && closeDialog()}
          editingRole={dialogRole}
          allPermissions={permissions}
          isPending={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleSubmit}
        />

        {/* ── Role detail dialog ──────────────────────────────── */}
        <RoleDetailDialog
          role={viewRole}
          allPermissions={permissions}
          open={viewRole !== null}
          onOpenChange={(open) => !open && closeView()}
          onEdit={openEdit}
        />

        {/* ── Delete confirmation ─────────────────────────────── */}
        <ConfirmDialog
          open={deleteTarget !== null}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title="Delete role"
          description={
            <>
              Are you sure you want to delete{" "}
              <strong className="font-semibold text-foreground">
                {deleteTarget?.name}
              </strong>
              ? This action cannot be undone.
            </>
          }
          confirmLabel="Delete"
          cancelLabel="Cancel"
          isPending={deleteMutation.isPending}
          onConfirm={handleDelete}
        />
      </div>
    </PermissionGuard>
  );
}
