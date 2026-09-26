"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Link, useRouter } from "@/i18n/navigation";
import {
  type Student,
  type UpdateStudentDto,
  type UpdateGuardianDto,
  type CreateStudentDto,
} from "@/types/student.types";
import { useCreateStudentMutation, useUpdateStudentMutation } from "@/hooks/queries/use-student-queries";
import { useClassesQuery } from "@/hooks/queries/use-class-queries";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/shared/Toast";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  ArrowLeft,
  Save,
  Loader2,
  UserPlus,
  ShieldCheck,
  BookOpen,
  HeartPulse,
  UserRound,
} from "lucide-react";
import {
  BLOOD_GROUP_OPTIONS,
  GENDER_OPTIONS,
  MAX_ROLL,
  RELIGION_OPTIONS,
  createStudentResolver,
  emptyGuardian,
  studentToFormDefaults,
  updateStudentResolver,
  type StudentFormValues,
} from "@/schemas/student.schema";
import { TextField, SelectField, toOptions } from "./student-form-fields";
import { GuardianRow } from "./student-guardian-row";

// ── Option lists ──────────────────────────────────────────────────────────
const GENDER_FIELD_OPTIONS = toOptions(GENDER_OPTIONS);
const BLOOD_GROUP_FIELD_OPTIONS = toOptions(BLOOD_GROUP_OPTIONS);
const RELIGION_FIELD_OPTIONS = toOptions(RELIGION_OPTIONS);

// ── Types ─────────────────────────────────────────────────────────────────
interface StudentFormPageProps {
  mode: "create" | "edit";
  student?: Student | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────
function toISODate(value: string): string | undefined {
  if (!value) return undefined;
  return new Date(value).toISOString();
}

// ── Page ──────────────────────────────────────────────────────────────────
export function StudentFormPage({ mode, student }: StudentFormPageProps) {
  const router = useRouter();
  const { toast, toastState, dismiss } = useToast();
  const isEdit = mode === "edit";

  // ── Form state (single source of truth via react-hook-form) ───────
  const form = useForm<StudentFormValues>({
    resolver: isEdit ? updateStudentResolver : createStudentResolver,
    mode: "onTouched",
    defaultValues: studentToFormDefaults(student),
  });
  const { control, handleSubmit, formState } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "guardians",
  });

  // ── Mutations ──────────────────────────────────────────────────────
  const createMutation = useCreateStudentMutation();
  const updateMutation = useUpdateStudentMutation();
  const isPending = formState.isSubmitting || createMutation.isPending || updateMutation.isPending;

  // ── Academic classes (fetched from /api/classes for display lookup) ──
  const { data: classes = [] } = useClassesQuery();
  const classFieldOptions = classes.map((c) => ({ value: c.id, label: c.name }));

  // ── Submission ─────────────────────────────────────────────────────
  const onSubmit = async (values: StudentFormValues) => {
    const base = {
      lastName: values.lastName.trim() || undefined,
      phone: values.phone.trim() || undefined,
      classId: values.classId || undefined,
      rollNumber: values.rollNumber ? Number(values.rollNumber) : undefined,
      dateOfBirth: toISODate(values.dateOfBirth),
      gender: values.gender || undefined,
      bloodGroup: values.bloodGroup || undefined,
      religion: values.religion || undefined,
      admissionDate: toISODate(values.admissionDate),
      emergencyContact: values.emergencyContact.trim() || undefined,
    };

    // Rows without a name are discarded; the rest are the full desired set
    const guardians: UpdateGuardianDto[] = values.guardians
      .filter((g) => g.name.trim())
      .map((g) => ({
        ...(g.id && { id: g.id }),
        name: g.name.trim(),
        relationship: g.relationship,
        phone: g.phone.trim() || undefined,
        email: g.email.trim() || undefined,
        occupation: g.occupation.trim() || undefined,
        address: g.address.trim() || undefined,
      }));

    try {
      if (isEdit && student) {
        const dto: UpdateStudentDto = {
          firstName: values.firstName.trim(),
          email: values.email.trim(),
          ...base,
          guardians,
        };
        await updateMutation.mutateAsync({ id: student.id, dto });
        toast("success", "Student updated successfully.");
      } else {
        const dto: CreateStudentDto = {
          firstName: values.firstName.trim(),
          email: values.email.trim(),
          password: values.password,
          studentId: values.studentId.trim(),
          ...base,
          guardians: guardians.length ? guardians : undefined,
        };
        await createMutation.mutateAsync(dto);
        toast("success", "Student created successfully.");
      }
      router.push("/dashboard/students");
    } catch (err: unknown) {
      toast("error", err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {toastState && <Toast state={toastState} onDismiss={dismiss} />}

      {/* ── Page header ──────────────────────────────────────────── */}
      <DashboardPageHeader
        title={isEdit ? "Edit Student" : "Add New Student"}
        description={
          isEdit
            ? "Update student details and account information."
            : "Register a student with an account, academic, and optional guardian details."
        }
        icon={GraduationCap}
        iconClassName="text-primary"
        actions={
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link href="/dashboard/students">
              <ArrowLeft className="h-4 w-4" />
              Back to Students
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* ── Account section ───────────────────────────────────── */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Account Information
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Login credentials for the student&apos;s portal account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <TextField
              control={control}
              name="firstName"
              label="First name"
              placeholder="e.g. Mariam"
              required
              autoComplete="off"
            />
            <TextField
              control={control}
              name="lastName"
              label="Last name"
              placeholder="e.g. Rahman"
              autoComplete="off"
            />
            <TextField
              control={control}
              name="email"
              label="Email"
              type="email"
              placeholder="e.g. mariam@dcms.edu.bd"
              required
              autoComplete="off"
            />
            <TextField
              control={control}
              name="phone"
              label="Phone"
              type="tel"
              placeholder="e.g. +8801XXXXXXXXX"
              autoComplete="off"
            />
            {!isEdit && (
              <TextField
                control={control}
                name="password"
                label="Password"
                type="password"
                placeholder="Min 6 characters"
                required
                className="sm:col-span-2"
                autoComplete="new-password"
              />
            )}
          </CardContent>
        </Card>

        {/* ── Academic section ───────────────────────────────────── */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <BookOpen className="h-4 w-4 text-primary" />
              Academic Information
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Student ID and class placement details.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <TextField
              control={control}
              name="studentId"
              label="Student ID"
              placeholder="e.g. S-2026-001"
              required
              disabled={isEdit}
              inputClassName="font-mono"
              autoComplete="off"
            />
            <SelectField
              control={control}
              name="classId"
              label="Class"
              options={classFieldOptions}
              placeholder="Select class"
            />
            <TextField
              control={control}
              name="rollNumber"
              label="Roll number"
              type="number"
              placeholder={`1 – ${MAX_ROLL}`}
              inputClassName="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              autoComplete="off"
            />
          </CardContent>
        </Card>

        {/* ── Personal section ───────────────────────────────────── */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <HeartPulse className="h-4 w-4 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Optional bio/demographic and admission details.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextField
              control={control}
              name="dateOfBirth"
              label="Date of birth"
              type="date"
            />
            <SelectField
              control={control}
              name="gender"
              label="Gender"
              options={GENDER_FIELD_OPTIONS}
              placeholder="Select gender"
            />
            <SelectField
              control={control}
              name="bloodGroup"
              label="Blood group"
              options={BLOOD_GROUP_FIELD_OPTIONS}
              placeholder="Select blood group"
            />
            <SelectField
              control={control}
              name="religion"
              label="Religion"
              options={RELIGION_FIELD_OPTIONS}
              placeholder="Select religion"
            />
            <TextField
              control={control}
              name="admissionDate"
              label="Admission date"
              type="date"
            />
            <TextField
              control={control}
              name="emergencyContact"
              label="Emergency contact"
              type="tel"
              placeholder="e.g. +8801XXXXXXXXX"
            />
          </CardContent>
        </Card>

        {/* ── Guardians section ──────────────────────────────────── */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <UserRound className="h-4 w-4 text-primary" />
              Guardians
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {isEdit
                ? "Add, edit or remove the guardians on record. Removed guardians are deleted."
                : "Add parents or guardians responsible for the student."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.length === 0 && (
              <div className="rounded-lg border border-dashed border-border/70 p-6 text-center text-xs text-muted-foreground">
                No guardians added yet.
              </div>
            )}

            {fields.map((field, index) => (
              <GuardianRow
                key={field.id}
                control={control}
                index={index}
                isPending={isPending}
                onRemove={() => remove(index)}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => append(emptyGuardian())}
              disabled={isPending}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Add Guardian
            </Button>
          </CardContent>
        </Card>

        {/* ── Actions ───────────────────────────────────────────── */}
        <Card className="sticky bottom-4 border-border/80 shadow-sm">
          <CardFooter className="flex items-center justify-between gap-2 px-6 py-4">
            <Button type="button" variant="ghost" size="sm" asChild className="text-muted-foreground">
              <Link href="/dashboard/students">Cancel</Link>
            </Button>
            <Button type="submit" size="sm" disabled={isPending} className="min-w-[130px] gap-1.5">
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isEdit ? "Save Changes" : "Create Student"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
