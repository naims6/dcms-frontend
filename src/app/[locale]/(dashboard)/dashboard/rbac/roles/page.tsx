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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  Key,
  Users,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function RolesManagementPage() {
  const { data: roles = [], isLoading: isRolesLoading } = useRolesQuery();
  const { data: permissions = [], isLoading: isPermissionsLoading } = usePermissionsQuery();

  const createRoleMutation = useCreateRoleMutation();
  const updateRoleMutation = useUpdateRoleMutation();
  const deleteRoleMutation = useDeleteRoleMutation();

  const loading = isRolesLoading || isPermissionsLoading;

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Edit Modal State
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Feedback State
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const resetCreateForm = () => {
    setNewRoleName("");
    setNewRoleDesc("");
    setSelectedPermissions([]);
    setFeedback(null);
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    setFeedback(null);
    try {
      await createRoleMutation.mutateAsync({
        name: newRoleName.trim().toUpperCase(),
        description: newRoleDesc.trim(),
        permissionNames: selectedPermissions,
      });
      resetCreateForm();
      setIsCreateOpen(false);
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to create role",
      });
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;
    setFeedback(null);
    try {
      await updateRoleMutation.mutateAsync({
        id: editingRole.id,
        dto: {
          description: newRoleDesc,
          permissionNames: selectedPermissions,
        },
      });
      setEditingRole(null);
      setFeedback(null);
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update role",
      });
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (!confirm(`Are you sure you want to delete role "${role.name}"?`))
      return;
    try {
      await deleteRoleMutation.mutateAsync(role.id);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete role");
    }
  };

  const togglePermissionSelection = (permName: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permName)
        ? prev.filter((p) => p !== permName)
        : [...prev, permName],
    );
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setNewRoleDesc(role.description || "");
    const existingPerms = (role.permissions ?? []).map((p) => p.name);
    setSelectedPermissions(existingPerms);
    setFeedback(null);
  };

  return (
    <PermissionGuard requiredPermission="roles:read">
      <div className="space-y-6 animate-in fade-in-0 duration-300">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <ShieldCheck className="h-7 w-7 text-emerald-500" />
              Role Management & Permissions
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Create, configure, and assign access level privileges across
              system roles (TanStack Query Managed)
            </p>
          </div>

          <Can perform="roles:create">
            <Button
              onClick={() => {
                setNewRoleName("");
                setNewRoleDesc("");
                setSelectedPermissions([]);
                setFeedback(null);
                setIsCreateOpen(true);
              }}
              className="gap-2 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              Create New Role
            </Button>
          </Can>
        </div>

        {/* Roles Grid */}
        {loading ? (
          <div className="flex h-48 w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => {
              return (
                <Card
                  key={role.id}
                  className="flex flex-col border border-border/80 shadow-xs hover:border-primary/50 transition-colors"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge
                        variant="outline"
                        className="text-xs font-bold bg-primary/5 border-primary/20 text-primary px-2.5 py-0.5"
                      >
                        {role.name}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>{role._count?.userRoles ?? 0} members</span>
                      </div>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground mt-2">
                      {role.name} Role
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground line-clamp-2">
                      {role.description ||
                        "No description provided for this role."}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-3 pt-0">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                        <span>Assigned Permissions ({(role.permissions ?? []).length})</span>
                        <Key className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 bg-muted/20 rounded-md border border-border/40">
                        {(role.permissions ?? []).length === 0 ? (
                          <span className="text-[11px] text-muted-foreground italic px-1">
                            No permissions attached
                          </span>
                        ) : (
                          (role.permissions ?? []).map((p) => (
                            <Badge
                              key={p.id}
                              variant="secondary"
                              className="text-[10px] py-0 px-1.5"
                            >
                              {p.name}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
                    <Can perform="roles:update">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(role)}
                        className="h-8 text-xs gap-1"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </Can>
                    <Can perform="roles:delete">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRole(role)}
                        disabled={deleteRoleMutation.isPending}
                        className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive gap-1"
                      >
                        {deleteRoleMutation.isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Delete
                      </Button>
                    </Can>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* Create Role Modal */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Plus className="h-5 w-5 text-primary" />
                Create New System Role
              </DialogTitle>
              <DialogDescription className="text-xs">
                Define a new role and assign permissions to it.
              </DialogDescription>
            </DialogHeader>

            {feedback && (
              <div
                className={`p-3 rounded-md text-xs flex items-center gap-2 ${
                  feedback.type === "success"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {feedback.text}
              </div>
            )}

            <div className="space-y-4 py-2 flex-1 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">
                  Role Name (Unique Identifier)
                </label>
                <Input
                  placeholder="e.g. ACCOUNTANT, MODERATOR"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="text-xs uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Description</label>
                <Textarea
                  placeholder="Describe duties and access scope..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="text-xs min-h-20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold flex items-center justify-between">
                  <span>Grant Permissions ({selectedPermissions.length})</span>
                  <span className="text-[10px] text-muted-foreground">
                    Check all that apply
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg border border-border/60 max-h-48 overflow-y-auto">
                  {permissions.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50 cursor-pointer text-xs"
                    >
                      <Checkbox
                        checked={selectedPermissions.includes(p.name)}
                        onCheckedChange={() =>
                          togglePermissionSelection(p.name)
                        }
                      />
                      <span className="font-mono text-[11px] truncate">
                        {p.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreateRole}
                disabled={!newRoleName.trim() || createRoleMutation.isPending}
                className="gap-1.5"
              >
                {createRoleMutation.isPending && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                Create Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Role Modal */}
        <Dialog
          open={!!editingRole}
          onOpenChange={(open) => !open && setEditingRole(null)}
        >
          <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Edit className="h-5 w-5 text-primary" />
                Edit Role: {editingRole?.name}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Update role description and attached permissions.
              </DialogDescription>
            </DialogHeader>

            {feedback && (
              <div
                className={`p-3 rounded-md text-xs flex items-center gap-2 ${
                  feedback.type === "success"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {feedback.text}
              </div>
            )}

            <div className="space-y-4 py-2 flex-1 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Description</label>
                <Textarea
                  placeholder="Update duties and access scope..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="text-xs min-h-20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold flex items-center justify-between">
                  <span>Modify Permissions ({selectedPermissions.length})</span>
                  <span className="text-[10px] text-muted-foreground">
                    Check all that apply
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg border border-border/60 max-h-48 overflow-y-auto">
                  {permissions.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50 cursor-pointer text-xs"
                    >
                      <Checkbox
                        checked={selectedPermissions.includes(p.name)}
                        onCheckedChange={() =>
                          togglePermissionSelection(p.name)
                        }
                      />
                      <span className="font-mono text-[11px] truncate">
                        {p.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingRole(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleUpdateRole}
                disabled={updateRoleMutation.isPending}
                className="gap-1.5"
              >
                {updateRoleMutation.isPending && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
}
