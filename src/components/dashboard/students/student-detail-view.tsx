"use client";

import { useRef } from "react";
import {
  useStudentDetailQuery,
  useUploadStudentAvatarMutation,
  useDeleteStudentMutation,
} from "@/hooks/queries/use-student-queries";
import { useClassesQuery } from "@/hooks/queries/use-class-queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Can } from "@/components/auth/can";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { Link, useRouter } from "@/i18n/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/shared/Toast";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { STUDENT_STATUS_STYLES } from "./student-row";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Fingerprint,
  UserRound,
  BookOpen,
  Loader2,
  UserCheck,
  Users,
  Pencil,
  Trash2,
  Camera,
  MapPin,
  Briefcase,
} from "lucide-react";
import Image from "next/image";

// ── types ─────────────────────────────────────────────────────────────────
interface StudentDetailViewProps {
  studentId: string;
}

// ── helpers ────────────────────────────────────────────────────────────────
function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-1.5">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

export function StudentDetailView({ studentId }: StudentDetailViewProps) {
  const router = useRouter();
  const { toast, toastState, dismiss } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: student, isLoading } = useStudentDetailQuery(studentId);
  const { data: classes = [] } = useClassesQuery();

  const className = student?.classId
    ? (classes.find((c) => c.id === student.classId)?.name ?? null)
    : null;

  const uploadAvatarMutation = useUploadStudentAvatarMutation();
  const deleteMutation = useDeleteStudentMutation();

  const [deleteOpen, setDeleteOpen] = useState(false);

  // ── loading ────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-muted-foreground">
        <Users className="h-12 w-12 opacity-20" />
        <p className="text-sm">Student not found.</p>
        <Link href="/dashboard/students">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Students
          </Button>
        </Link>
      </div>
    );
  }

  const initials =
    (student.user.firstName[0] ?? "") + (student.user.lastName?.[0] ?? "");
  const imageUrl = student.user.imageUrl;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadAvatarMutation.mutateAsync({ id: student.id, image: file });
      toast("success", "Avatar uploaded successfully.");
    } catch (err: unknown) {
      toast(
        "error",
        err instanceof Error ? err.message : "Failed to upload avatar.",
      );
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(student.id);
      toast("success", "Student deleted successfully.");
      setDeleteOpen(false);
      router.push("/dashboard/students");
    } catch (err: unknown) {
      toast(
        "error",
        err instanceof Error ? err.message : "Failed to delete student.",
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {toastState && <Toast state={toastState} onDismiss={dismiss} />}

      {/* ── Page header ──────────────────────────────────────────────── */}
      <DashboardPageHeader
        title={`${student.user.firstName} ${student.user.lastName ?? ""}`}
        description={`${student.user.email} · ${student.studentId}`}
        icon={GraduationCap}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/dashboard/students">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Students
              </Button>
            </Link>
            <Can perform="students:update">
              <Link href={`/dashboard/students/${student.id}/edit`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
            </Can>
            <Can perform="students:delete">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-destructive hover:text-destructive border-destructive/20"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </Can>
          </div>
        }
      />

      {/* ── Avatar + identity ─────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/80 shadow-xs md:col-span-1">
          <CardContent className="flex flex-col items-center gap-4 pt-8 pb-6">
            <div className="relative">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={student.user.firstName}
                  className="h-24 w-24 rounded-full object-cover shadow-inner ring-2 ring-primary/20"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary font-extrabold text-3xl uppercase shadow-inner">
                  {initials}
                </div>
              )}
              <Can perform="students:update">
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full border-border bg-card shadow-sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadAvatarMutation.isPending}
                  title="Upload avatar"
                >
                  {uploadAvatarMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </Button>
              </Can>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="text-center space-y-1">
              <p className="text-lg font-bold text-foreground">
                {student.user.firstName} {student.user.lastName ?? ""}
              </p>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Mail className="h-3.5 w-3.5" /> {student.user.email}
              </p>
              {student.user.phone && (
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> {student.user.phone}
                </p>
              )}
            </div>

            <Badge
              variant="outline"
              className={cn(
                "gap-1.5 text-xs font-semibold",
                STUDENT_STATUS_STYLES[student.status],
              )}
            >
              <UserCheck className="h-3.5 w-3.5" />
              {student.status}
            </Badge>
          </CardContent>
        </Card>

        {/* ── Account info ───────────────────────────────────────────── */}
        <Card className="border-border/80 shadow-xs md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                icon={Fingerprint}
                label="Account ID"
                value={
                  <span className="font-mono text-xs select-all break-all">
                    {student.id}
                  </span>
                }
              />
              <Field
                icon={Calendar}
                label="Created At"
                value={formatDate(student.createdAt)}
              />
              <Field icon={BookOpen} label="Class" value={className ?? "—"} />
              <Field
                icon={UserCheck}
                label="Roll Number"
                value={student.rollNumber ?? "—"}
              />
            </div>

            <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-3">
                <GraduationCap className="h-3.5 w-3.5 text-primary" /> Personal
                Details
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Date of Birth
                  </p>
                  <p className="text-xs font-semibold">
                    {formatDate(student.dateOfBirth)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Gender</p>
                  <p className="text-xs font-semibold">
                    {student.gender ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Blood Group
                  </p>
                  <p className="text-xs font-semibold">
                    {student.bloodGroup
                      ? student.bloodGroup.replace("_", " ")
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Religion</p>
                  <p className="text-xs font-semibold">
                    {student.religion ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Admission Date
                  </p>
                  <p className="text-xs font-semibold">
                    {formatDate(student.admissionDate)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Emergency Contact
                  </p>
                  <p className="text-xs font-semibold">
                    {student.emergencyContact ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Guardians ─────────────────────────────────────────────────── */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-bold">
            <UserRound className="h-4 w-4 text-primary" />
            Guardians
            <span className="text-muted-foreground font-normal text-xs">
              ({student.guardians.length})
            </span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Parents or guardians responsible for the student.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {student.guardians.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              No guardians recorded.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {student.guardians.map((guardian) => (
                <div
                  key={guardian.id}
                  className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-foreground">
                      {guardian.name}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-semibold"
                    >
                      {guardian.relationship}
                    </Badge>
                  </div>
                  {guardian.phone && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Phone className="h-3 w-3" /> {guardian.phone}
                    </p>
                  )}
                  {guardian.email && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3 w-3" /> {guardian.email}
                    </p>
                  )}
                  {guardian.occupation && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Briefcase className="h-3 w-3" /> {guardian.occupation}
                    </p>
                  )}
                  {guardian.address && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" /> {guardian.address}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Delete confirm dialog ─────────────────────────────────────── */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Student"
        description={
          <>
            Are you sure you want to delete this student? This action cannot be
            undone.
            <span className="mt-2 block font-medium text-foreground">
              &ldquo;{student.user.firstName} {student.user.lastName ?? ""}
              &rdquo; ({student.studentId})
            </span>
          </>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isPending={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
