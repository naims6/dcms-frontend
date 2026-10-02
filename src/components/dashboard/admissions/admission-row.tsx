"use client";

import { AdminAdmissionApplication, ApplicationStatus } from "@/types/admission";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Can } from "@/components/auth/can";
import { Link } from "@/i18n/navigation";
import {
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  MapPin,
} from "lucide-react";
import Image from "next/image";

// ── Status badge styles & labels ───────────────────────────────────────────
export const ADMISSION_STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  SUBMITTED_FOR_REVIEW: {
    label: "Under Review",
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  ADMITTED: {
    label: "Admitted",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  REJECTED: {
    label: "Rejected",
    className:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  PAYMENT_PENDING: {
    label: "Payment Pending",
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  EMAIL_VERIFIED: {
    label: "Email Verified",
    className:
      "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  PENDING_EMAIL_VERIFICATION: {
    label: "Email Unverified",
    className:
      "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────
function getInitials(app: AdminAdmissionApplication): string {
  const first = app.firstName?.[0] ?? "";
  const last = app.lastName?.[0] ?? "";
  return (first + last).toUpperCase() || "AP";
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── Types ──────────────────────────────────────────────────────────────────
interface AdmissionRowProps {
  application: AdminAdmissionApplication;
  classNameTitle?: string | null;
  onAccept: (application: AdminAdmissionApplication) => void;
  onReject: (application: AdminAdmissionApplication) => void;
}

export function AdmissionRow({
  application,
  classNameTitle,
  onAccept,
  onReject,
}: AdmissionRowProps) {
  const photoUrl = application.photoUrl;
  const statusConfig = ADMISSION_STATUS_CONFIG[application.status] ?? {
    label: application.status,
    className: "bg-muted text-muted-foreground border-border",
  };

  const isAdmitted = application.status === "ADMITTED";
  const isRejected = application.status === "REJECTED";

  return (
    <tr className="transition-colors border-b border-border/60 last:border-0 hover:bg-muted/30">
      {/* ── Applicant Identity ──────────────────────────────────── */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={`${application.firstName} ${application.lastName}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full object-cover border border-border"
              width={36}
              height={36}
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase border border-primary/20">
              {getInitials(application)}
            </div>
          )}
          <div className="min-w-0 max-w-[200px]">
            <Link
              href={`/dashboard/admissions/${application.id}`}
              className="font-semibold text-sm text-foreground hover:text-primary transition-colors truncate block"
            >
              {application.firstName} {application.lastName}
            </Link>
            <p className="text-xs text-muted-foreground truncate">
              {application.email}
            </p>
          </div>
        </div>
      </td>

      {/* ── Application No & Date ────────────────────────────────── */}
      <td className="px-5 py-3.5 whitespace-nowrap">
        <p className="font-mono text-xs font-medium text-foreground">
          {application.applicationNo}
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
          <Clock className="h-3 w-3 inline text-muted-foreground/70" />
          {formatDate(application.createdAt)}
        </p>
      </td>

      {/* ── Target Class ────────────────────────────────────────── */}
      <td className="px-5 py-3.5 whitespace-nowrap">
        <Badge variant="outline" className="text-xs font-medium">
          {classNameTitle ?? "Class ID: " + application.targetClassId.slice(0, 8)}
        </Badge>
        {application.previousSchoolName && (
          <p className="text-[11px] text-muted-foreground truncate max-w-[150px] mt-0.5">
            Prev: {application.previousSchoolName}
          </p>
        )}
      </td>

      {/* ── Contact & Location ──────────────────────────────────── */}
      <td className="px-5 py-3.5 whitespace-nowrap">
        <p className="text-xs text-foreground flex items-center gap-1">
          <Phone className="h-3 w-3 text-muted-foreground" />
          {application.phone}
        </p>
        {(application.presentDistrict || application.presentUpazila) && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            {[application.presentUpazila, application.presentDistrict]
              .filter(Boolean)
              .join(", ")}
          </p>
        )}
      </td>

      {/* ── Status Badge ────────────────────────────────────────── */}
      <td className="px-5 py-3.5 whitespace-nowrap">
        <Badge
          variant="outline"
          className={`border font-medium text-xs px-2.5 py-0.5 rounded-full ${statusConfig.className}`}
        >
          {statusConfig.label}
        </Badge>
        {isAdmitted && application.createdStudentId && (
          <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
            {application.createdStudentId}
          </p>
        )}
        {isRejected && application.rejectionReason && (
          <p
            className="text-[11px] text-rose-500/80 truncate max-w-[140px] mt-0.5"
            title={application.rejectionReason}
          >
            {application.rejectionReason}
          </p>
        )}
      </td>

      {/* ── Actions ─────────────────────────────────────────────── */}
      <td className="px-5 py-3.5 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5">
          <Link href={`/dashboard/admissions/${application.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              title="View Application Details"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>

          <Can perform="admissions:update">
            {!isAdmitted && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                title="Accept Application & Enroll"
                onClick={() => onAccept(application)}
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            )}

            {!isRejected && !isAdmitted && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                title="Reject Application"
                onClick={() => onReject(application)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </Can>
        </div>
      </td>
    </tr>
  );
}
