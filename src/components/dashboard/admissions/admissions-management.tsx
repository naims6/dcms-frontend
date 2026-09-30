"use client";

import { useState } from "react";
import {
  useAdminApplicationsQuery,
  useAcceptApplicationMutation,
  useRejectApplicationMutation,
} from "@/hooks/queries/use-admission-queries";
import { useClassesQuery } from "@/hooks/queries/use-class-queries";
import {
  AdminAdmissionApplication,
  ApplicationStatus,
} from "@/types/admission";
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
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClipboardList,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Loader2,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { AdmissionRow } from "./admission-row";
import { useDebounce } from "@/hooks/use-debounce";

const LIMIT = 10;

export function AdmissionsManagement() {
  const { toast, toastState, dismiss } = useToast();

  // ── Filters & pagination ───────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput.trim(), 400);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  // ── Academic classes mapping ───────────────────────────────────────
  const { data: classes = [] } = useClassesQuery();
  const classNames = new Map<string, string>(
    classes.map((c) => [c.id, c.name]),
  );

  // ── Query ──────────────────────────────────────────────────────────
  const activeStatus =
    statusFilter !== "ALL" ? (statusFilter as ApplicationStatus) : undefined;

  const { data, isLoading, isError, refetch } = useAdminApplicationsQuery({
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    status: activeStatus,
  });

  const applications = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, limit: LIMIT, total: 0, totalPages: 1 };
  const totalPages = meta.totalPages || 1;

  // ── Accept dialog & mutation ───────────────────────────────────────
  const acceptMutation = useAcceptApplicationMutation();
  const [acceptTarget, setAcceptTarget] =
    useState<AdminAdmissionApplication | null>(null);

  const handleConfirmAccept = async () => {
    if (!acceptTarget) return;
    try {
      const res = await acceptMutation.mutateAsync(acceptTarget.id);
      toast(
        "success",
        `Applicant accepted! Student ID: ${res.studentId} generated.`,
      );
      setAcceptTarget(null);
    } catch (err: unknown) {
      toast(
        "error",
        err instanceof Error
          ? err.message
          : "Failed to accept admission application.",
      );
    }
  };

  // ── Reject dialog & mutation ───────────────────────────────────────
  const rejectMutation = useRejectApplicationMutation();
  const [rejectTarget, setRejectTarget] =
    useState<AdminAdmissionApplication | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  const handleOpenReject = (app: AdminAdmissionApplication) => {
    setRejectTarget(app);
    setRejectReason("");
    setReasonError("");
  };

  const handleConfirmReject = async () => {
    if (!rejectTarget) return;
    const trimmed = rejectReason.trim();
    if (!trimmed) {
      setReasonError("Please provide a rejection reason.");
      return;
    }
    try {
      await rejectMutation.mutateAsync({
        id: rejectTarget.id,
        dto: { reason: trimmed },
      });
      toast("success", "Application rejected successfully.");
      setRejectTarget(null);
      setRejectReason("");
    } catch (err: unknown) {
      toast(
        "error",
        err instanceof Error
          ? err.message
          : "Failed to reject admission application.",
      );
    }
  };

  // ── Reset filters ──────────────────────────────────────────────────
  const handleResetFilters = () => {
    setSearchInput("");
    setStatusFilter("ALL");
    setPage(1);
  };

  // ── Pagination helpers ─────────────────────────────────────────────
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | "...")[]>((acc, p, idx, arr) => {
      if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) {
        acc.push("...");
      }
      acc.push(p);
      return acc;
    }, []);

  // Quick summary counts
  const totalCount = meta.total;
  const underReviewCount = applications.filter(
    (a) => a.status === "SUBMITTED_FOR_REVIEW",
  ).length;
  const admittedCount = applications.filter(
    (a) => a.status === "ADMITTED",
  ).length;
  const rejectedCount = applications.filter(
    (a) => a.status === "REJECTED",
  ).length;

  return (
    <PermissionGuard requiredPermission="ADMISSIONS_READ">
      <div className="space-y-6 animate-in fade-in-0 duration-300">
        {/* Page Toast */}
        {toastState && <Toast state={toastState} onDismiss={dismiss} />}

        {/* ── Page Header ───────────────────────────────────────────── */}
        <DashboardPageHeader
          title="Admission Applications"
          description="Review applicant submissions, verify student credentials, and manage enrollment"
          icon={ClipboardList}
          iconClassName="text-primary"
        />

        {/* ── KPI Stat Cards ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium truncate">
                  Total Applications
                </p>
                <p className="text-xl font-bold text-foreground">
                  {totalCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium truncate">
                  Under Review
                </p>
                <p className="text-xl font-bold text-foreground">
                  {statusFilter === "SUBMITTED_FOR_REVIEW"
                    ? totalCount
                    : underReviewCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium truncate">
                  Admitted
                </p>
                <p className="text-xl font-bold text-foreground">
                  {statusFilter === "ADMITTED" ? totalCount : admittedCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <XCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium truncate">
                  Rejected
                </p>
                <p className="text-xl font-bold text-foreground">
                  {statusFilter === "REJECTED" ? totalCount : rejectedCount}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Filter Toolbar ────────────────────────────────────────── */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm font-semibold">
              Filter & Search Applications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by applicant name, email, or application no..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-9 text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-56">
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="SUBMITTED_FOR_REVIEW">
                    Under Review
                  </SelectItem>
                  <SelectItem value="ADMITTED">Admitted</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="PAYMENT_PENDING">
                    Payment Pending
                  </SelectItem>
                  <SelectItem value="EMAIL_VERIFIED">Email Verified</SelectItem>
                  <SelectItem value="PENDING_EMAIL_VERIFICATION">
                    Email Unverified
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            {(searchInput || statusFilter !== "ALL") && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 gap-1.5 text-xs shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </CardContent>
        </Card>

        {/* ── Applications Table ────────────────────────────────────── */}
        <Card className="border-border/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-semibold">Applicant</th>
                  <th className="px-5 py-3 font-semibold">Application No</th>
                  <th className="px-5 py-3 font-semibold">Target Class</th>
                  <th className="px-5 py-3 font-semibold">Contact & Address</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">
                          Loading applications...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-destructive">
                        <AlertCircle className="h-8 w-8" />
                        <p className="text-sm font-medium">
                          Failed to load applications.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => refetch()}
                          className="mt-2 text-xs"
                        >
                          Try Again
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <ClipboardList className="h-10 w-10 text-muted-foreground/40" />
                        <p className="text-base font-semibold text-foreground">
                          No applications found
                        </p>
                        <p className="text-xs max-w-sm">
                          {searchInput || statusFilter !== "ALL"
                            ? "Try adjusting your search query or status filter."
                            : "There are currently no admission applications registered."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <AdmissionRow
                      key={app.id}
                      application={app}
                      classNameTitle={classNames.get(app.targetClassId)}
                      onAccept={(target) => setAcceptTarget(target)}
                      onReject={(target) => handleOpenReject(target)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Table Footer & Pagination ─────────────────────────────── */}
          {!isLoading && applications.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3.5 border-t border-border/60 bg-muted/10 text-xs text-muted-foreground">
              <p>
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {(page - 1) * LIMIT + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-foreground">
                  {Math.min(page * LIMIT, meta.total)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {meta.total}
                </span>{" "}
                applications
              </p>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {pageNumbers.map((p, idx) =>
                  p === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground">
                      …
                    </span>
                  ) : (
                    <Button
                      key={p}
                      variant={page === p ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(p as number)}
                      className="h-8 w-8 p-0 text-xs font-medium"
                    >
                      {p}
                    </Button>
                  ),
                )}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* ── Accept Confirmation Dialog ────────────────────────────── */}
        <ConfirmDialog
          open={!!acceptTarget}
          onOpenChange={(open) => !open && setAcceptTarget(null)}
          title="Accept Application & Enroll Student"
          description={
            acceptTarget ? (
              <span>
                Are you sure you want to approve the admission for{" "}
                <strong className="text-foreground">
                  {acceptTarget.firstName} {acceptTarget.lastName}
                </strong>{" "}
                (Application:{" "}
                <code className="font-mono text-primary font-semibold">
                  {acceptTarget.applicationNo}
                </code>
                )? This action will enroll the applicant, generate an official Student ID, and create their student account.
              </span>
            ) : undefined
          }
          confirmLabel="Accept & Enroll"
          cancelLabel="Cancel"
          destructive={false}
          isPending={acceptMutation.isPending}
          onConfirm={handleConfirmAccept}
        />

        {/* ── Reject Modal with Reason ──────────────────────────────── */}
        <Dialog
          open={!!rejectTarget}
          onOpenChange={(open) => {
            if (!open) {
              setRejectTarget(null);
              setRejectReason("");
              setReasonError("");
            }
          }}
        >
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
                    Please specify the reason for rejecting application{" "}
                    <code className="font-mono text-foreground font-semibold">
                      {rejectTarget?.applicationNo}
                    </code>{" "}
                    ({rejectTarget?.firstName} {rejectTarget?.lastName}). This reason will be recorded and visible.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <Label htmlFor="rejectReason" className="text-xs font-semibold">
                Rejection Reason <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="rejectReason"
                rows={3}
                placeholder="e.g. Incomplete academic documents or ineligible age limit..."
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
                onClick={() => setRejectTarget(null)}
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
