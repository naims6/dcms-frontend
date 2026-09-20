"use client";

import { Role } from "@/types/rbac.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Can } from "@/components/auth/can";
import { cn } from "@/lib/utils";
import { Edit, Trash2, Loader2, Users, Key, Eye } from "lucide-react";

// Accent colour per role name initial letter (deterministic)
const ACCENT_PALETTE = [
  "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
];

function accentForRole(name: string) {
  return ACCENT_PALETTE[(name.charCodeAt(0) - 65) % ACCENT_PALETTE.length];
}

// ── types ─────────────────────────────────────────────────────────────────────
interface RoleRowProps {
  role: Role;
  isDeletePending: boolean;
  onView: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export function RoleRow({ role, isDeletePending, onView, onEdit, onDelete }: RoleRowProps) {
  const permissions = role.permissions ?? [];
  const memberCount = role._count?.userRoles ?? 0;

  return (
    <tr
      onClick={() => onView(role)}
      className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-muted/30"
    >
      {/* ── Role identity ───────────────────────────────────── */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ring-1 ring-inset ring-border/40",
              accentForRole(role.name),
            )}
          >
            {role.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{role.name}</p>
            <p className="max-w-[260px] truncate text-xs text-muted-foreground">
              {role.description || "No description provided."}
            </p>
          </div>
        </div>
      </td>

      {/* ── Members ──────────────────────────────────────────── */}
      <td className="px-5 py-3.5">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {memberCount}
        </span>
      </td>

      {/* ── Permission count ─────────────────────────────────── */}
      <td className="px-5 py-3.5">
        <Badge variant="secondary" className="gap-1 px-2 py-0.5 text-xs font-bold">
          <Key className="h-3 w-3" />
          {permissions.length}
        </Badge>
      </td>

      {/* ── Actions ──────────────────────────────────────────── */}
      <td className="px-5 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onView(role);
            }}
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </Button>

          <Can perform="roles:update">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(role);
              }}
            >
              <Edit className="h-3.5 w-3.5" />
              Edit
            </Button>
          </Can>

          <Can perform="roles:delete">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/5"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(role);
              }}
              disabled={isDeletePending}
            >
              {isDeletePending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              Delete
            </Button>
          </Can>
        </div>
      </td>
    </tr>
  );
}