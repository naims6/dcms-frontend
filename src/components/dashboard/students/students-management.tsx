"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  useStudentsQuery,
  useDeleteStudentMutation,
} from "@/hooks/queries/use-student-queries";
import { useClassesQuery } from "@/hooks/queries/use-class-queries";
import { Student } from "@/types/student.types";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/shared/Toast";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  Plus,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { StudentRow } from "./student-row";

// ── Constants ─────────────────────────────────────────────────────────────
const LIMIT = 20;

export function StudentsManagement() {
  const { toast, toastState, dismiss } = useToast();

  // ── Filters & pagination ───────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  // ── Academic classes (for class-name display in the table) ─────────
  const { data: classes = [] } = useClassesQuery();
  const classNames = new Map<string, string>(
    classes.map((c) => [c.id, c.name]),
  );

  const { data, isLoading, isError } = useStudentsQuery({
    page,
    limit: LIMIT,
  });

  const students = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, limit: LIMIT, total: 0, totalPages: 1 };
  const totalPages = meta.totalPages || 1;

  // ── Delete confirm & mutation ───────────────────────────────────────
  const deleteMutation = useDeleteStudentMutation();
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast("success", "Student deleted successfully.");
      setDeleteTarget(null);
    } catch (err: unknown) {
      toast(
        "error",
        err instanceof Error ? err.message : "Failed to delete student.",
      );
    }
  };

  // ── Client-side search within the current page ─────────────────────
  const term = searchInput.trim().toLowerCase();
  const filtered = term
    ? students.filter((s) =>
        [s.user.firstName, s.user.lastName, s.studentId, s.user.email]
          .filter(Boolean)
          .some((v) => (v as string).toLowerCase().includes(term)),
      )
    : students;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | "...")[]>((acc, p, idx, arr) => {
      if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1)
        acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  return (
    <PermissionGuard requiredPermission="students:read">
      <div className="space-y-6 animate-in fade-in-0 duration-300">
        {toastState && <Toast state={toastState} onDismiss={dismiss} />}

        {/* ── Header ─────────────────────────────────────────────── */}
        <DashboardPageHeader
          title="Student Management"
          description="Register, manage, and track all enrolled students."
          icon={GraduationCap}
          actions={
            <Button className="gap-2 w-full sm:w-auto" asChild>
              <Link href="/dashboard/students/create">
                <Plus className="h-4 w-4" />
                Add Student
              </Link>
            </Button>
          }
        />

        {/* ── Filters row ────────────────────────────────────────── */}
        <Card className="border border-border/70 shadow-xs">
          <CardContent className="p-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by name, student ID, or email…"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-9 w-full sm:max-w-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Students table ─────────────────────────────────────── */}
        <Card className="border border-border/70 shadow-xs overflow-hidden">
          <CardHeader className="px-6 py-4 border-b border-border/50">
            <CardTitle className="text-base font-semibold">
              All Students
              {!isLoading && (
                <span className="text-muted-foreground font-normal text-sm ml-1">
                  ({meta.total} total)
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-xs">
              View, edit, or remove student records. Click View to open the full
              profile.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading students...</span>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-16 text-destructive gap-2">
                <Users className="h-8 w-8 opacity-40" />
                <p className="text-sm">
                  Failed to load students. Please refresh.
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                <GraduationCap className="h-10 w-10 opacity-20" />
                <p className="text-sm">No students found.</p>
                <Button variant="outline" size="sm" className="gap-1.5" asChild>
                  <Link href="/dashboard/students/create">
                    <Plus className="h-4 w-4" />
                    Add Student
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-y border-border text-xs uppercase text-muted-foreground font-semibold">
                    <tr>
                      <th className="px-5 py-3">Student</th>
                      <th className="px-5 py-3">Student ID / Class</th>
                      <th className="px-5 py-3">Roll / Admission</th>
                      <th className="px-5 py-3">Gender</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((student) => (
                      <StudentRow
                        key={student.id}
                        student={student}
                        className={
                          student.classId
                            ? (classNames.get(student.classId) ?? null)
                            : null
                        }
                        isDeleting={
                          deleteMutation.isPending &&
                          deleteTarget?.id === student.id
                        }
                        onDelete={setDeleteTarget}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && !isError && meta.total > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border/50 gap-3">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * LIMIT + 1}–
                  {Math.min(page * LIMIT, meta.total)} of {meta.total} students
                </p>
                <div className="flex gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {pageNumbers.map((p, idx) =>
                    p === "..." ? (
                      <span
                        key={`e-${idx}`}
                        className="h-8 w-8 flex items-center justify-center text-muted-foreground text-sm"
                      >
                        …
                      </span>
                    ) : (
                      <Button
                        key={p}
                        variant={page === p ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0 text-xs"
                        onClick={() => setPage(p as number)}
                      >
                        {p}
                      </Button>
                    ),
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Delete confirm dialog ───────────────────────────────── */}
        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title="Delete Student"
          description={
            <>
              Are you sure you want to delete this student? This action cannot
              be undone.
              {deleteTarget && (
                <span className="mt-2 block font-medium text-foreground">
                  &ldquo;{deleteTarget.user.firstName}{" "}
                  {deleteTarget.user.lastName ?? ""}&rdquo; (
                  {deleteTarget.studentId})
                </span>
              )}
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
