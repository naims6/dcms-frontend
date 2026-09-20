"use client";

import { useEffect, useMemo, useState } from "react";
import { Role, Permission } from "@/types/rbac.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Edit,
  Loader2,
  AlertCircle,
  Search,
  CheckSquare,
  Square,
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

const GROUP_COLORS: Record<string, string> = {
  users:   "text-blue-600   dark:text-blue-400   bg-blue-500/10   border-blue-500/20",
  roles:   "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  notices: "text-amber-600  dark:text-amber-400  bg-amber-500/10  border-amber-500/20",
  rbac:    "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20",
  other:   "text-zinc-600   dark:text-zinc-400   bg-zinc-500/10   border-zinc-500/20",
};

function groupColor(group: string) {
  return GROUP_COLORS[group] ?? GROUP_COLORS.other;
}

// ── types ─────────────────────────────────────────────────────────────────────
interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** If provided → edit mode; undefined → create mode */
  editingRole?: Role | null;
  allPermissions: Permission[];
  isPending: boolean;
  onSubmit: (data: {
    name: string;
    description: string;
    permissionNames: string[];
  }) => Promise<void>;
}

export function RoleFormDialog({
  open,
  onOpenChange,
  editingRole,
  allPermissions,
  isPending,
  onSubmit,
}: RoleFormDialogProps) {
  const isEdit = !!editingRole;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [permSearch, setPermSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Seed form when dialog opens / editing role changes
  useEffect(() => {
    if (open) {
      setName(editingRole?.name ?? "");
      setDescription(editingRole?.description ?? "");
      setSelected(new Set((editingRole?.permissions ?? []).map((p) => p.name)));
      setPermSearch("");
      setError(null);
    }
  }, [open, editingRole]);

  const toggle = (permName: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(permName) ? next.delete(permName) : next.add(permName);
      return next;
    });

  // Filtered + grouped permissions
  const filtered = useMemo(
    () =>
      permSearch.trim()
        ? allPermissions.filter((p) =>
            p.name.toLowerCase().includes(permSearch.toLowerCase()),
          )
        : allPermissions,
    [allPermissions, permSearch],
  );
  const grouped = useMemo(() => groupPermissions(filtered), [filtered]);
  const groups = Object.keys(grouped).sort();

  const selectAll = () => setSelected(new Set(allPermissions.map((p) => p.name)));
  const clearAll = () => setSelected(new Set());

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Role name is required."); return; }
    setError(null);
    try {
      await onSubmit({
        name: name.trim().toUpperCase(),
        description: description.trim(),
        permissionNames: [...selected],
      });
      onOpenChange(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[92vh] flex flex-col gap-0 p-0 overflow-hidden">
        {/* ── Dialog header ──────────────────────────────────── */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            {isEdit ? (
              <><Edit className="h-4 w-4 text-primary" /> Edit Role: <span className="text-primary">{editingRole?.name}</span></>
            ) : (
              <><Plus className="h-4 w-4 text-primary" /> Create New Role</>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEdit
              ? "Update the role description and adjust its permission set."
              : "Define a new system role and assign the permissions it should grant."}
          </DialogDescription>
        </DialogHeader>

        {/* ── Scrollable body ────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Name */}
          {!isEdit && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Role Name <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g. MODERATOR, ACCOUNTANT"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="uppercase font-mono text-sm h-10"
                autoFocus
              />
              <p className="text-[11px] text-muted-foreground">
                Must be unique. Will be stored in UPPERCASE.
              </p>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Description</label>
            <Textarea
              placeholder="Describe what this role can do and who it's for…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-sm resize-none min-h-[72px]"
            />
          </div>

          {/* Permissions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                Permissions
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">
                  {selected.size} / {allPermissions.length}
                </Badge>
              </label>
              <div className="flex gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={selectAll}
                  className="h-6 px-2 text-[11px] gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                >
                  <CheckSquare className="h-3 w-3" /> All
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-6 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
                >
                  <Square className="h-3 w-3" /> None
                </Button>
              </div>
            </div>

            {/* Permission search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search permissions…"
                value={permSearch}
                onChange={(e) => setPermSearch(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>

            {/* Grouped permission list */}
            <div className="rounded-lg border border-border/60 overflow-hidden divide-y divide-border/40">
              {groups.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  No permissions match your search.
                </p>
              ) : (
                groups.map((group) => {
                  const perms = grouped[group];
                  const allChecked = perms.every((p) => selected.has(p.name));
                  const someChecked = perms.some((p) => selected.has(p.name));

                  const toggleGroup = () => {
                    setSelected((prev) => {
                      const next = new Set(prev);
                      if (allChecked) perms.forEach((p) => next.delete(p.name));
                      else perms.forEach((p) => next.add(p.name));
                      return next;
                    });
                  };

                  return (
                    <div key={group}>
                      {/* Group header */}
                      <button
                        type="button"
                        onClick={toggleGroup}
                        className="w-full flex items-center justify-between px-3 py-2 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-3.5 w-3.5 rounded-sm border flex items-center justify-center",
                            allChecked
                              ? "bg-primary border-primary text-primary-foreground"
                              : someChecked
                              ? "bg-primary/30 border-primary/60"
                              : "border-border bg-background",
                          )}>
                            {allChecked && <span className="text-[8px] font-bold leading-none">✓</span>}
                          </div>
                          <Badge
                            variant="outline"
                            className={cn("text-[10px] font-bold uppercase px-1.5 py-0", groupColor(group))}
                          >
                            {group}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {perms.filter((p) => selected.has(p.name)).length}/{perms.length}
                          </span>
                        </div>
                      </button>

                      {/* Permission rows */}
                      <div className="grid grid-cols-2 gap-px bg-border/30 px-0">
                        {perms.map((p) => (
                          <label
                            key={p.id}
                            className="flex items-center gap-2.5 px-3 py-2 bg-background hover:bg-muted/30 cursor-pointer transition-colors"
                          >
                            <Checkbox
                              checked={selected.has(p.name)}
                              onCheckedChange={() => toggle(p.name)}
                              className="shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-mono text-[11px] truncate text-foreground">{p.name}</p>
                              {p.description && (
                                <p className="text-[10px] text-muted-foreground truncate">{p.description}</p>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <DialogFooter className="px-6 py-4 border-t border-border/60 flex items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground">
            {selected.size} permission{selected.size !== 1 ? "s" : ""} selected
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isPending || (!isEdit && !name.trim())}
              className="gap-1.5 min-w-[100px]"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Role"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
