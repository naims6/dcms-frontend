"use client";

import { Role, Permission } from "@/types/rbac.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Can } from "@/components/auth/can";
import {
  Users,
  Key,
  CheckCircle2,
  MinusCircle,
  ShieldCheck,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── helpers ───────────────────────────────────────────────────────────────────

/** Group permissions by their resource prefix: "users:read" → group "users" */
function groupPermissions(permissions: Permission[]): Record<string, Permission[]> {
  return permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    const group = p.name.includes(":") ? p.name.split(":")[0] : "other";
    (acc[group] ??= []).push(p);
    return acc;
  }, {});
}

const GROUP_ACCENT: Record<string, { label: string; chip: string }> = {
  users: {
    label: "text-blue-600 dark:text-blue-400",
    chip: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  },
  roles: {
    label: "text-emerald-600 dark:text-emerald-400",
    chip: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  },
  notices: {
    label: "text-amber-600 dark:text-amber-400",
    chip: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  },
  rbac: {
    label: "text-violet-600 dark:text-violet-400",
    chip: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20",
  },
  other: {
    label: "text-zinc-600 dark:text-zinc-400",
    chip: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  },
};

function groupAccent(group: string) {
  return GROUP_ACCENT[group] ?? GROUP_ACCENT.other;
}

// ── types ─────────────────────────────────────────────────────────────────────
interface RoleDetailDialogProps {
  role: Role | null;
  allPermissions: Permission[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (role: Role) => void;
}

export function RoleDetailDialog({
  role,
  allPermissions,
  open,
  onOpenChange,
  onEdit,
}: RoleDetailDialogProps) {
  const permissions = role?.permissions ?? [];
  const memberCount = role?._count?.userRoles ?? 0;
  const assigned = new Set(permissions.map((p) => p.name));
  const grouped = groupPermissions(allPermissions);
  const groups = Object.keys(grouped).sort();
  const granted = assigned.size;
  const total = allPermissions.length;
  const progress = total === 0 ? 0 : Math.round((granted / total) * 100);

  return (
    <Dialog open={open && !!role} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[88vh] flex flex-col gap-0 p-0 overflow-hidden">
        {/* ── Header ──────────────────────────────────────────── */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <DialogTitle className="flex items-center gap-2.5 text-base font-bold">
            <ShieldCheck className="h-4.5 w-4.5 text-primary" />
            {role?.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {role?.description || "No description provided for this role."}
          </DialogDescription>
        </DialogHeader>

        {/* ── Scrollable body ────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Meta badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1.5 px-2.5 py-1 text-xs font-medium">
              <Users className="h-3.5 w-3.5" />
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </Badge>
            <Badge variant="secondary" className="gap-1.5 px-2.5 py-1 text-xs font-medium">
              <Key className="h-3.5 w-3.5" />
              {granted} of {total} permissions
            </Badge>
            {progress === 100 && (
              <Badge className="gap-1.5 px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                Full access
              </Badge>
            )}
          </div>

          {/* Coverage bar */}
          <div>
            <div className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className="font-medium text-muted-foreground">Coverage</span>
              <span className="font-bold text-foreground">{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Permission list, grouped by resource */}
          <div className="space-y-4">
            {groups.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No system permissions are defined yet.
              </p>
            ) : (
              groups.map((group) => {
                const style = groupAccent(group);
                const perms = grouped[group];
                const grantedInGroup = perms.filter((p) => assigned.has(p.name)).length;

                return (
                  <div key={group}>
                    <div className="mb-2 flex items-center justify-between px-0.5">
                      <p className={cn("text-[10px] font-bold uppercase tracking-wider", style.label)}>
                        {group}
                      </p>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {grantedInGroup}/{perms.length}
                      </span>
                    </div>
                    <div className="divide-y divide-border/50 rounded-lg border border-border/60 overflow-hidden">
                      {perms.map((p) => {
                        const has = assigned.has(p.name);
                        return (
                          <div
                            key={p.id}
                            className={cn(
                              "flex items-center gap-2.5 px-3 py-2",
                              has ? "bg-background" : "bg-muted/25",
                            )}
                          >
                            {has ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                            ) : (
                              <MinusCircle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p
                                className={cn(
                                  "truncate font-mono text-xs",
                                  has
                                    ? "font-medium text-foreground"
                                    : "text-muted-foreground/70",
                                )}
                              >
                                {p.name}
                              </p>
                              {p.description && (
                                <p className="truncate text-[10px] text-muted-foreground">
                                  {p.description}
                                </p>
                              )}
                            </div>
                            {has && (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "shrink-0 border px-1.5 py-0 text-[9px] font-bold",
                                  style.chip,
                                )}
                              >
                                Granted
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <DialogFooter className="px-6 py-4 border-t border-border/60 flex items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground">
            Showing all {total} system permissions
          </p>
          <div className="flex gap-2">
            <Can perform="roles:update">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => role && onEdit(role)}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Role
              </Button>
            </Can>
            <Button size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}