"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Download, Loader2, RotateCcw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadReceiptAsPdf } from "@/lib/pdf-download";
import { useClassesQuery } from "@/hooks/queries/use-class-queries";
import type { AdmissionReceipt } from "@/types/admission";

interface ReceiptStepProps {
  receipt: AdmissionReceipt;
  onReset: () => void;
}

function formatDate(dateStr?: string) {
  return new Date(dateStr || Date.now()).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-gray-900 text-sm font-medium text-right">{value || "—"}</span>
    </div>
  );
}

export function ReceiptStep({ receipt, onReset }: ReceiptStepProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { data: classesData } = useClassesQuery();

  const { applicant, payment } = receipt;

  // Resolve human-readable class name from targetClassId UUID
  const className =
    classesData?.find((c) => c.id === applicant?.targetClassId)?.name ||
    applicant?.targetClassId ||
    "—";

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await downloadReceiptAsPdf(receipt, { className });
    } finally {
      setIsDownloading(false);
    }
  };

  const paymentMethod = payment?.cardType
    ? `${payment.provider} (${payment.cardType})`
    : payment?.provider;

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">

      {/* Success banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Application submitted successfully!</p>
            <p className="text-xs text-gray-500">Download your official receipt below.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={handleDownload} disabled={isDownloading} size="sm">
            {isDownloading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</>
            ) : (
              <><Download className="h-4 w-4 mr-2" />Download PDF</>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />New
          </Button>
        </div>
      </div>

      {/* Receipt preview card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">

        {/* Header */}
        <div className="bg-blue-700 text-white px-8 py-6">
          <p className="text-[11px] font-medium uppercase tracking-widest text-blue-200 mb-1">Official Receipt</p>
          <h1 className="text-xl font-bold">Dhaka Central Model School</h1>
          <p className="text-xs text-blue-200 mt-1">Mirpur, Dhaka-1216 · admissions@dcms.edu.bd</p>
        </div>

        <div className="px-8 py-6 space-y-6">

          {/* Meta row */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider">Receipt No.</p>
              <p className="text-sm font-semibold font-mono text-gray-900">{receipt.receiptNo}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider">Date Issued</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(receipt.issuedAt)}</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200">
              {payment?.status || "PAID"}
            </span>
          </div>

          <hr className="border-gray-100" />

          {/* Applicant */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Applicant</p>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                {applicant?.photoUrl ? (
                  <Image src={applicant.photoUrl} alt="Applicant" fill className="object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-300">
                    <User className="h-7 w-7" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">{applicant?.fullName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{applicant?.email || receipt.email}</p>
                <p className="text-xs font-mono text-blue-600 font-semibold mt-0.5">{receipt.applicationNo}</p>
              </div>
            </div>
          </div>

          {/* Application details */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Application Details</p>
            <div className="bg-gray-50 rounded-lg px-4 py-1">
              <Row label="Class Applied For" value={className} />
              <Row label="Phone"             value={applicant?.phone} />
              <Row label="Father's Name"     value={applicant?.fatherName} />
              <Row label="Mother's Name"     value={applicant?.motherName} />
              <Row label="Review Status"     value={receipt.reviewStatus} />
            </div>
          </div>

          {/* Payment details */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Payment Details</p>
            <div className="bg-gray-50 rounded-lg px-4 py-1">
              <Row label="Transaction ID"  value={payment?.tranId} />
              <Row label="Payment Method"  value={paymentMethod} />
              <Row label="Paid On"         value={formatDate(payment?.paidAt)} />
              <Row label="Amount Paid"     value={`${payment?.currency} ${Number(payment?.amount || 0).toFixed(2)}`} />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-400">Generated: {new Date().toLocaleString("en-GB")}</p>
          <p className="text-[10px] text-gray-400 font-mono">DCMS Admission System</p>
        </div>

      </div>
    </div>
  );
}
