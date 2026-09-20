"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { SimpleRole, Role } from "@/types/rbac.types";

// ── helpers ──────────────────────────────────────────────────────────────────
function getRoleName(role: string | SimpleRole): string {
  return typeof role === "string" ? role : role.name;
}

function getRoleId(role: string | SimpleRole): string {
  return typeof role === "string" ? role : role.id;
}

// ── types ─────────────────────────────────────────────────────────────────────
interface RoleComboboxProps {
  /** Full list of all system roles (from useRolesQuery) */
  allRoles: Role[];
  /** Roles already assigned to this user */
  assignedRoles: Array<string | SimpleRole>;
  /** Called when user checks an unassigned role */
  onAssign: (roleId: string) => Promise<unknown>;
  /** Called when user unchecks an assigned role */
  onRevoke: (roleId: string) => Promise<unknown>;
  /** Whether any mutation is currently in-flight */
  isPending?: boolean;
  /** Disable the whole control (e.g. insufficient permission) */
  disabled?: boolean;
}

/**
 * Inline role combobox with checkbox states.
 *
 * - Opens a searchable popover listing every system role.
 * - Roles already assigned to the user show a filled checkbox + check mark.
 * - Clicking an unchecked role → assign; clicking a checked role → revoke.
 * - No dialog, no confirm — instant optimistic-style UX with a spinner on the
 *   pending item.
 */
export function RoleCombobox({
  allRoles,
  assignedRoles,
  onAssign,
  onRevoke,
  isPending = false,
  disabled = false,
}: RoleComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  // Build a Set of assigned role IDs for O(1) lookup
  const assignedIds = React.useMemo(
    () => new Set(assignedRoles.map(getRoleId)),
    [assignedRoles],
  );

  const handleToggle = async (role: Role) => {
    if (isPending || pendingId) return;
    setPendingId(role.id);
    try {
      if (assignedIds.has(role.id)) {
        await onRevoke(role.id);
      } else {
        await onAssign(role.id);
      }
    } finally {
      setPendingId(null);
    }
  };

  const assignedCount = assignedRoles.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-8 min-w-[130px] max-w-[220px] justify-between gap-1.5 px-2.5 text-xs font-normal",
            open && "border-primary ring-1 ring-primary/30",
          )}
        >
          <span className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
            {assignedCount === 0 ? (
              <span className="text-muted-foreground">Assign roles…</span>
            ) : (
              <span className="truncate">
                {assignedCount === 1
                  ? getRoleName(assignedRoles[0])
                  : `${assignedCount} roles`}
              </span>
            )}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-64 p-0"
        align="start"
        sideOffset={6}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandInput placeholder="Search roles…" className="text-xs h-9" />
          <CommandList>
            <CommandEmpty className="py-4 text-xs">No roles found.</CommandEmpty>
            <CommandGroup>
              {allRoles.map((role) => {
                const isAssigned = assignedIds.has(role.id);
                const isThisPending = pendingId === role.id;

                return (
                  <CommandItem
                    key={role.id}
                    value={role.name}
                    onSelect={() => handleToggle(role)}
                    className="flex items-center gap-2.5 px-2 py-2 text-xs cursor-pointer"
                    disabled={!!pendingId && !isThisPending}
                  >
                    {/* Checkbox visual */}
                    <div
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                        isAssigned
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background",
                      )}
                    >
                      {isThisPending ? (
                        <Loader2 className="h-2.5 w-2.5 animate-spin" />
                      ) : isAssigned ? (
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      ) : null}
                    </div>

                    {/* Role info */}
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold truncate">{role.name}</span>
                      {role.description && (
                        <span className="text-[10px] text-muted-foreground truncate">
                          {role.description}
                        </span>
                      )}
                    </div>

                    {/* Assigned badge */}
                    {isAssigned && (
                      <Badge
                        className="ml-auto shrink-0 bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0"
                      >
                        Active
                      </Badge>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
