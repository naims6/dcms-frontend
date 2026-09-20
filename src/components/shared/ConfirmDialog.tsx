"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, Loader2 } from "lucide-react";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Title of the confirmation dialog */
  title: React.ReactNode;
  /** Optional body text shown under the title */
  description?: React.ReactNode;
  /** Label for the confirm button */
  confirmLabel?: string;
  /** Label for the cancel button */
  cancelLabel?: string;
  /** While true, the confirm button is disabled and shows a spinner */
  isPending?: boolean;
  /** Style the confirm button as destructive (defaults to true) */
  destructive?: boolean;
  /** Called when the user confirms */
  onConfirm: () => void;
}

/**
 * Reusable confirmation dialog. Replaces `window.confirm()` / `window.alert()`
 * with a styled modal that matches the design system.
 *
 * @example
 * <ConfirmDialog
 *   open={!!target}
 *   onOpenChange={(open) => !open && setTarget(null)}
 *   title="Delete notice"
 *   description="This action cannot be undone."
 *   confirmLabel="Delete"
 *   isPending={mutation.isPending}
 *   onConfirm={handleDelete}
 * />
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isPending = false,
  destructive = true,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3.5">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                destructive
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary",
              )}
            >
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-base font-bold leading-tight">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
          <Button
            size="sm"
            variant={destructive ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isPending}
            className="min-w-[90px] gap-1.5"
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}