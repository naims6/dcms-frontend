"use client";

import { Student, StudentStatus } from "@/types/student.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Can } from "@/components/auth/can";
import { Link } from "@/i18n/navigation";
import {
  ExternalLink,
  Pencil,
  Trash2,
  Loader2,
  UserCheck,
  UserX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// ── Status badge styles ────────────────────────────────────────────────────
export const STUDENT_STATUS_STYLES: Record<StudentStatus, string> = {
  ACTIVE:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  INACTIVE:
    "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  GRADUATED:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  EXPELLED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

// ── helpers ────────────────────────────────────────────────────────────────
function getInitials(student: Student): string {
  const first = student.user.firstName[0] ?? "";
  const last = student.user.lastName?.[0] ?? "";
  return (first + last).toUpperCase();
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── types ──────────────────────────────────────────────────────────────────
interface StudentRowProps {
  student: Student;
  className?: string | null;
  isDeleting: boolean;
  onDelete: (student: Student) => void;
}

export function StudentRow({
  student,
  className,
  isDeleting,
  onDelete,
}: StudentRowProps) {
  const imageUrl = student.user.imageUrl;

  return (
    <tr className="transition-colors border-b border-border/60 last:border-0 hover:bg-muted/30">
      {/* ── Student identity ──────────────────────────────────── */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={student.user.firstName}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full object-cover"
              width={36}
              height={36}
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase">
              {getInitials(student)}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-sm text-foreground truncate">
              {student.user.firstName} {student.user.lastName ?? ""}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {student.user.email}
            </p>
          </div>
        </div>
      </td>

      {/* ── Student ID / class ────────────────────────────────── */}
      <td className="px-5 py-3.5">
        <p className="font-mono text-xs text-foreground">{student.studentId}</p>
        <p className="text-xs text-muted-foreground">
          {className ?? "No class"}
        </p>
      </td>

      {/* ── Roll number / admission date ──────────────────────── */}
      <td className="px-5 py-3.5">
        <p className="text-sm text-foreground">{student.rollNumber ?? "—"}</p>
        <p className="text-xs text-muted-foreground">
          {formatDate(student.admissionDate)}
        </p>
      </td>

      {/* ── Gender ────────────────────────────────────────────── */}
      <td className="px-5 py-3.5">
        <p className="text-sm text-foreground">{student.gender ?? "—"}</p>
      </td>

      {/* ── Status ────────────────────────────────────────────── */}
      <td className="px-5 py-3.5">
        <Badge
          variant="outline"
          className={cn(
            "gap-1 text-xs font-medium",
            STUDENT_STATUS_STYLES[student.status],
          )}
        >
          {student.status === "ACTIVE" ? (
            <UserCheck className="h-3 w-3" />
          ) : (
            <UserX className="h-3 w-3" />
          )}
          {student.status}
        </Badge>
      </td>

      {/* ── Actions ───────────────────────────────────────────── */}
      <td className="px-5 py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          <Can perform="students:read">
            <Link href={`/dashboard/students/${student.id}`}>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
                View
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </Can>

          <Can perform="students:update">
            <Link href={`/dashboard/students/${student.id}/edit`}>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
            </Link>
          </Can>

          <Can perform="students:delete">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive"
              onClick={() => onDelete(student)}
              disabled={isDeleting}
            >
              {isDeleting ? (
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
