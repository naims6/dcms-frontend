"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import {
  useAdminApplicationDetailQuery,
  useAcceptApplicationMutation,
  useRejectApplicationMutation,
} from "@/hooks/queries/use-admission-queries";
import { useClassesQuery } from "@/hooks/queries/use-class-queries";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/shared/Toast";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Can } from "@/components/auth/can";
import { ADMISSION_STATUS_CONFIG } from "./admission-row";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  CreditCard,
  MapPin,
  ShieldCheck,
  User,
  Users,
  Building,
  School,
  FileText,
  AlertTriangle,
  Loader2,
  Check,
} from "lucide-react";
import Image from "next/image";

interface AdmissionDetailViewProps {
  applicationId: string;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatSimpleDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function DetailItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-1">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground/80" />}
        {label}
      </p>
      <div className="text-sm font-medium text-foreground">{value || "—"}</div>
    </div>
  );
}

export function AdmissionDetailView({
  applicationId,
}: AdmissionDetailViewProps) {
  const router = useRouter();
  const { toast, toastState, dismiss } = useToast();

  const {
    data: detailData,
    isLoading,
    isError,
    refetch,
  } = useAdminApplicationDetailQuery(applicationId);

  const { data: classes = [] } = useClassesQuery();
  const classNames = new Map<string, string>(
    classes.map((c) => [c.id, c.name]),
  );

  const application = detailData?.application;
  const payment = detailData?.payment;

  // Accept mutation
  const acceptMutation = useAcceptApplicationMutation();
  const [acceptOpen, setAcceptOpen] = useState(false);

  // Reject mutation
  const rejectMutation = useRejectApplicationMutation();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  const handleConfirmAccept = async () => {
    if (!application) return;
    try {
      const res = await acceptMutation.mutateAsync(application.id);
      toast(
        "success",
        `Application approved successfully! Student ID: ${res.studentId} assigned.`,
      );
      setAcceptOpen(false);
      refetch();
    } catch (err: unknown) {
      toast(
        "error",
        err instanceof Error ? err.message : "Failed to accept application.",
      );
    }
  };

  const handleConfirmReject = async () => {
    if (!application) return;
    const trimmed = rejectReason.trim();
    if (!trimmed) {
      setReasonError("Please provide a reason for rejection.");
      return;
    }
    try {
      await rejectMutation.mutateAsync({
        id: application.id,
        dto: { reason: trimmed },
      });
      toast("success", "Application rejected successfully.");
      setRejectOpen(false);
      setRejectReason("");
      refetch();
    } catch (err: unknown) {
      toast(
        "error",
        err instanceof Error ? err.message : "Failed to reject application.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading admission application details...
        </p>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <h2 className="text-lg font-bold">Application Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Unable to locate the specified admission application or an error
          occurred while fetching data.
        </p>
        <Link href="/dashboard/admissions">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Admissions
          </Button>
        </Link>
      </div>
    );
  }

  const statusConfig = ADMISSION_STATUS_CONFIG[application.status] ?? {
    label: application.status,
    className: "bg-muted text-muted-foreground border-border",
  };

  const isAdmitted = application.status === "ADMITTED";
  const isRejected = application.status === "REJECTED";
  const targetClassName =
    classNames.get(application.targetClassId) || application.targetClassId;

  return (
    <PermissionGuard requiredPermission="admissions:read">
      <div className="space-y-6 animate-in fade-in-0 duration-300">
        {toastState && <Toast state={toastState} onDismiss={dismiss} />}

        {/* ── Top Header Navigation ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/admissions">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  {application.firstName} {application.lastName}
                </h1>
                <Badge
                  variant="outline"
                  className={`border font-medium text-xs px-2.5 py-0.5 rounded-full ${statusConfig.className}`}
                >
                  {statusConfig.label}
                </Badge>
                {application.isEmailVerified ? (
                  <Badge
                    variant="outline"
                    className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs gap-1"
                  >
                    <Check className="h-3 w-3" /> Email Verified
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs"
                  >
                    Email Unverified
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                Application No: {application.applicationNo} • Submitted{" "}
                {formatDate(application.createdAt)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <Can perform="admissions:update">
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {!isAdmitted && (
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  onClick={() => setAcceptOpen(true)}
                  disabled={acceptMutation.isPending}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Accept & Enroll
                </Button>
              )}

              {!isRejected && !isAdmitted && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="gap-1.5"
                  onClick={() => {
                    setRejectOpen(true);
                    setRejectReason("");
                    setReasonError("");
                  }}
                  disabled={rejectMutation.isPending}
                >
                  <XCircle className="h-4 w-4" />
                  Reject Application
                </Button>
              )}
            </div>
          </Can>
        </div>

        {/* ── Status Alerts (if Admitted or Rejected) ────────────────── */}
        {isAdmitted && (
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">
                Student Enrolled Successfully
              </p>
              <p className="text-xs mt-0.5 opacity-90">
                This applicant has been approved for admission. Student ID:{" "}
                <span className="font-mono font-bold">
                  {application.createdStudentId ?? "STU-ENROLLED"}
                </span>
                . An active student profile and system account have been created.
              </p>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Application Rejected</p>
              <p className="text-xs mt-0.5 opacity-90">
                Reason: {application.rejectionReason || "No specific reason recorded."}
              </p>
              {application.reviewedAt && (
                <p className="text-[11px] mt-1 opacity-75">
                  Reviewed at: {formatDate(application.reviewedAt)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Main Detail Grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Personal Profile & Photo */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Applicant Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                <div className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-xl border border-dashed border-border/80">
                  {application.photoUrl ? (
                    <Image
                      src={application.photoUrl}
                      alt={`${application.firstName} ${application.lastName}`}
                      width={120}
                      height={120}
                      className="h-28 w-28 rounded-xl object-cover border-2 border-primary/20 shadow-sm"
                    />
                  ) : (
                    <div className="h-28 w-28 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold uppercase border-2 border-primary/20">
                      {application.firstName?.[0]}
                      {application.lastName?.[0]}
                    </div>
                  )}
                  <h3 className="text-base font-bold text-foreground mt-3">
                    {application.firstName} {application.lastName}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {application.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {application.phone}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <DetailItem
                    label="Date of Birth"
                    value={formatSimpleDate(application.dateOfBirth)}
                    icon={Calendar}
                  />
                  <DetailItem
                    label="Gender"
                    value={application.gender}
                    icon={User}
                  />
                  <DetailItem
                    label="Blood Group"
                    value={application.bloodGroup?.replace("_", " ")}
                  />
                  <DetailItem
                    label="Religion"
                    value={application.religion}
                  />
                  <DetailItem
                    label="Nationality"
                    value={application.nationality || "Bangladeshi"}
                  />
                  <DetailItem
                    label="National ID / Birth Reg"
                    value={
                      <span className="font-mono text-xs">
                        {application.nationalIdOrBirthReg}
                      </span>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Payment Summary
                </CardTitle>
                <CardDescription className="text-xs">
                  Admission fee transaction details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-2.5">
                {payment ? (
                  <>
                    <DetailItem
                      label="Transaction ID"
                      value={
                        <span className="font-mono text-xs font-semibold text-primary">
                          {payment.tranId}
                        </span>
                      }
                    />
                    <DetailItem
                      label="Amount Paid"
                      value={
                        <span className="font-semibold text-foreground">
                          {payment.amount} {payment.currency}
                        </span>
                      }
                    />
                    <DetailItem
                      label="Gateway Provider"
                      value={payment.provider}
                    />
                    <DetailItem
                      label="Payment Status"
                      value={
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-semibold"
                        >
                          {payment.status}
                        </Badge>
                      }
                    />
                    <DetailItem
                      label="Paid At"
                      value={formatDate(payment.paidAt)}
                      icon={Clock}
                    />
                  </>
                ) : (
                  <div className="p-4 bg-muted/20 rounded-lg text-center text-xs text-muted-foreground">
                    No verified payment record available for this application yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Academic, Parents, Addresses, Review */}
          <div className="space-y-6 lg:col-span-2">
            {/* Academic Information */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Academic History & Target Class
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DetailItem
                    label="Target Class"
                    value={
                      <span className="font-semibold text-primary">
                        {targetClassName}
                      </span>
                    }
                    icon={School}
                  />
                  <DetailItem
                    label="Previous School"
                    value={application.previousSchoolName}
                    icon={Building}
                  />
                  <DetailItem
                    label="Previous Class"
                    value={application.previousClass}
                  />
                  <DetailItem
                    label="Previous GPA"
                    value={
                      application.previousGpa ? (
                        <span className="font-semibold">
                          {application.previousGpa}
                        </span>
                      ) : (
                        "—"
                      )
                    }
                  />
                  <DetailItem
                    label="Previous Board Roll"
                    value={
                      <span className="font-mono">
                        {application.previousBoardRoll}
                      </span>
                    }
                  />
                  <DetailItem
                    label="Passing Year"
                    value={application.previousPassingYear}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Residential Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                <div className="p-3.5 bg-muted/20 rounded-lg border border-border/50">
                  <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                    Present Address
                  </p>
                  <p className="text-sm text-foreground">
                    {application.presentStreetAddress || "—"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upazila: {application.presentUpazila || "—"} • District:{" "}
                    {application.presentDistrict || "—"} • Division:{" "}
                    {application.presentDivision || "—"} • Post Code:{" "}
                    {application.presentPostCode || "—"}
                  </p>
                </div>

                <div className="p-3.5 bg-muted/20 rounded-lg border border-border/50">
                  <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                    Permanent Address
                    {application.sameAsPresentAddress && (
                      <Badge variant="secondary" className="text-[10px] ml-1">
                        Same as Present
                      </Badge>
                    )}
                  </p>
                  <p className="text-sm text-foreground">
                    {application.permanentStreetAddress || "—"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upazila: {application.permanentUpazila || "—"} • District:{" "}
                    {application.permanentDistrict || "—"} • Division:{" "}
                    {application.permanentDivision || "—"} • Post Code:{" "}
                    {application.permanentPostCode || "—"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Parents & Local Guardian */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Parents & Guardian Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                {/* Father */}
                <div className="p-3.5 bg-muted/20 rounded-lg border border-border/50">
                  <p className="text-xs font-bold text-foreground mb-2">
                    Father&apos;s Information
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <span className="text-muted-foreground">Name:</span>{" "}
                      <span className="font-semibold text-foreground">
                        {application.fatherName || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      <span className="font-semibold text-foreground">
                        {application.fatherPhone || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Occupation:</span>{" "}
                      <span className="text-foreground">
                        {application.fatherOccupation || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">NID:</span>{" "}
                      <span className="font-mono text-foreground">
                        {application.fatherNid || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mother */}
                <div className="p-3.5 bg-muted/20 rounded-lg border border-border/50">
                  <p className="text-xs font-bold text-foreground mb-2">
                    Mother&apos;s Information
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <span className="text-muted-foreground">Name:</span>{" "}
                      <span className="font-semibold text-foreground">
                        {application.motherName || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      <span className="font-semibold text-foreground">
                        {application.motherPhone || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Occupation:</span>{" "}
                      <span className="text-foreground">
                        {application.motherOccupation || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">NID:</span>{" "}
                      <span className="font-mono text-foreground">
                        {application.motherNid || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Local Guardian (if provided) */}
                {application.localGuardianName && (
                  <div className="p-3.5 bg-muted/20 rounded-lg border border-border/50">
                    <p className="text-xs font-bold text-foreground mb-2">
                      Local Guardian Information
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div>
                        <span className="text-muted-foreground">Name:</span>{" "}
                        <span className="font-semibold text-foreground">
                          {application.localGuardianName}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Relation:</span>{" "}
                        <span className="text-foreground">
                          {application.localGuardianRelation || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span>{" "}
                        <span className="font-semibold text-foreground">
                          {application.localGuardianPhone || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Address:</span>{" "}
                        <span className="text-foreground">
                          {application.localGuardianAddress || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Audit & Administrative Log */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Audit & Review Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <DetailItem
                    label="Current Status"
                    value={
                      <Badge
                        variant="outline"
                        className={`text-xs ${statusConfig.className}`}
                      >
                        {statusConfig.label}
                      </Badge>
                    }
                  />
                  <DetailItem
                    label="Email Verification"
                    value={
                      application.isEmailVerified
                        ? "Verified"
                        : "Pending Verification"
                    }
                  />
                  <DetailItem
                    label="Application Created"
                    value={formatDate(application.createdAt)}
                    icon={Clock}
                  />
                  <DetailItem
                    label="Last Updated"
                    value={formatDate(application.updatedAt)}
                    icon={Clock}
                  />
                  {application.reviewedAt && (
                    <DetailItem
                      label="Reviewed At"
                      value={formatDate(application.reviewedAt)}
                    />
                  )}
                  {application.reviewedBy && (
                    <DetailItem
                      label="Reviewed By"
                      value={application.reviewedBy}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Accept Confirmation Dialog ────────────────────────────── */}
        <ConfirmDialog
          open={acceptOpen}
          onOpenChange={setAcceptOpen}
          title="Accept Application & Enroll Student"
          description={
            <span>
              Are you sure you want to approve admission for{" "}
              <strong className="text-foreground">
                {application.firstName} {application.lastName}
              </strong>{" "}
              (Application:{" "}
              <code className="font-mono text-primary font-semibold">
                {application.applicationNo}
              </code>
              )? This will automatically enroll the student into{" "}
              <strong className="text-foreground">{targetClassName}</strong> and
              create their user profile.
            </span>
          }
          confirmLabel="Accept & Enroll"
          cancelLabel="Cancel"
          destructive={false}
          isPending={acceptMutation.isPending}
          onConfirm={handleConfirmAccept}
        />

        {/* ── Reject Modal with Reason ──────────────────────────────── */}
        <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <XCircle className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="text-base font-bold leading-tight">
                    Reject Admission Application
                  </DialogTitle>
                  <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
                    State the reason for rejecting application{" "}
                    <code className="font-mono text-foreground font-semibold">
                      {application.applicationNo}
                    </code>
                    .
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <Label htmlFor="detailRejectReason" className="text-xs font-semibold">
                Rejection Reason <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="detailRejectReason"
                rows={3}
                placeholder="e.g. Incomplete academic documents and ineligible age limit..."
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value);
                  if (reasonError) setReasonError("");
                }}
                className={reasonError ? "border-destructive text-sm" : "text-sm"}
              />
              {reasonError && (
                <p className="text-xs text-destructive font-medium">
                  {reasonError}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectOpen(false)}
                disabled={rejectMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleConfirmReject}
                disabled={rejectMutation.isPending}
                className="gap-1.5"
              >
                {rejectMutation.isPending && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
}
