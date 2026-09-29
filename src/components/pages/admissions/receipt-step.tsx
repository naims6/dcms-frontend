"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Printer,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  School,
  Calendar,
  CreditCard,
  User,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AdmissionReceipt } from "@/types/admission";

interface ReceiptStepProps {
  receipt: AdmissionReceipt;
  onReset: () => void;
}

export function ReceiptStep({ receipt, onReset }: ReceiptStepProps) {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    if (!receipt.verificationCode) return;
    navigator.clipboard.writeText(receipt.verificationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Top Banner & Action Controls (Hidden on print) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 print:hidden">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">
              Admission Application & Payment Completed!
            </h3>
            <p className="text-xs text-muted-foreground">
              Your application has been received and verified. Please download or print your official receipt.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={handlePrint}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Receipt / PDF
          </Button>

          <Button
            variant="outline"
            onClick={onReset}
            className="text-xs border-border"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            New Application
          </Button>
        </div>
      </div>

      {/* Official Printable Receipt Voucher */}
      <Card
        id="admission-receipt-voucher"
        className="border-2 border-border/80 shadow-2xl bg-card overflow-hidden print:border-none print:shadow-none print:p-0"
      >
        <CardContent className="p-8 md:p-12 space-y-8">
          {/* Institution Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b-2 border-primary/20">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <School className="h-9 w-9" />
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
                  Dhaka Central Model School
                </h1>
                <p className="text-xs font-medium text-muted-foreground">
                  Excellence in Education, Character & Future Leadership
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Mirpur, Dhaka-1216, Bangladesh • admissions@dcms.edu.bd
                </p>
              </div>
            </div>

            {/* Receipt & Verification Badge */}
            <div className="text-center sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 text-xs font-black tracking-widest uppercase">
                {receipt.payment?.status || "PAID & VALIDATED"}
              </span>
              <p className="text-xs font-mono text-muted-foreground">
                Receipt No: <strong className="text-foreground">{receipt.receiptNo}</strong>
              </p>
              <p className="text-xs font-mono text-muted-foreground">
                Date: {new Date(receipt.issuedAt || Date.now()).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Subheader Title */}
          <div className="text-center">
            <h2 className="text-lg font-extrabold uppercase tracking-widest text-primary">
              Official Admission Application & Fee Voucher
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Status: <span className="font-semibold text-foreground">{receipt.reviewStatus}</span>
            </p>
          </div>

          {/* Main Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl bg-muted/20 border border-border/40">
            {/* Applicant Photo */}
            <div className="flex flex-col items-center justify-center p-2 text-center border-b md:border-b-0 md:border-r border-border/40 pb-4 md:pb-0">
              <div className="relative h-28 w-28 rounded-xl overflow-hidden border-2 border-primary/30 shadow-md mb-2 bg-muted">
                {receipt.applicant?.photoUrl ? (
                  <Image
                    src={receipt.applicant.photoUrl}
                    alt="Applicant Photo"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    <User className="h-12 w-12" />
                  </div>
                )}
              </div>
              <span className="text-xs font-bold text-foreground">
                {receipt.applicant?.fullName}
              </span>
              <span className="text-[11px] font-mono text-primary font-bold">
                {receipt.applicationNo}
              </span>
            </div>

            {/* Applicant & Parent Information */}
            <div className="space-y-2 text-xs md:col-span-2">
              <h4 className="font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 pb-1 border-b border-border/30">
                <User className="h-3.5 w-3.5 text-primary" />
                <span>Candidate Information</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-1">
                <div>
                  <span className="text-muted-foreground">Candidate Name: </span>
                  <strong className="text-foreground">{receipt.applicant?.fullName}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Target Class: </span>
                  <strong className="text-foreground">{receipt.applicant?.targetClassId}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Email: </span>
                  <span className="font-mono text-foreground">{receipt.applicant?.email || receipt.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Contact Phone: </span>
                  <span className="font-mono text-foreground">{receipt.applicant?.phone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Father&apos;s Name: </span>
                  <span className="text-foreground">{receipt.applicant?.fatherName || "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Mother&apos;s Name: </span>
                  <span className="text-foreground">{receipt.applicant?.motherName || "—"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Transaction Info */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-xs text-muted-foreground flex items-center gap-1.5 pb-1 border-b border-border/30">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              <span>Payment Details</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-border/40 bg-card text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Transaction ID</span>
                <strong className="font-mono text-foreground">{receipt.payment?.tranId}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Payment Method</span>
                <strong className="text-foreground">
                  {receipt.payment?.provider} {receipt.payment?.cardType ? `(${receipt.payment.cardType})` : ""}
                </strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Amount Paid</span>
                <strong className="text-primary font-bold text-sm">
                  {receipt.payment?.currency} {Number(receipt.payment?.amount || 100).toFixed(2)}
                </strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Payment Status</span>
                <strong className="text-emerald-600 font-bold">
                  {receipt.payment?.status}
                </strong>
              </div>
            </div>
          </div>

          {/* Verification Code Box & Official Signature */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t-2 border-border/40">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Security Verification Code
              </span>
              <div className="flex items-center gap-2">
                <code className="px-3 py-1.5 rounded-lg bg-muted text-primary font-mono text-sm font-bold border">
                  {receipt.verificationCode}
                </code>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors print:hidden"
                  title="Copy verification code"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-center sm:text-right space-y-2">
              <div className="inline-block border-b border-foreground/40 w-44 pb-1">
                <ShieldCheck className="h-6 w-6 text-primary mx-auto sm:ml-auto" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Authorized Admission Registrar
              </p>
            </div>
          </div>

          {/* Instructions note for student */}
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <p className="font-bold">Important Instructions for Candidate:</p>
            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
              <li>Please keep a printed copy of this receipt safe for your admission written test / viva interview.</li>
              <li>Your login account has been provisioned. Once admitted by administration, you can sign in using your email and password.</li>
              <li>Official interview dates and updates will be communicated via your registered email ({receipt.email}).</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
