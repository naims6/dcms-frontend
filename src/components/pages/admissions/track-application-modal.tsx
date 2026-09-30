"use client";

import { useState } from "react";
import { Search, Loader2, FileText, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getAdmissionStatusApi,
  getAdmissionReceiptApi,
} from "@/services/admission.service";
import type { AdmissionReceipt, ApplicationStatusResponse } from "@/types/admission";

interface TrackApplicationModalProps {
  onLoadApplication: (data: {
    step: number;
    applicationNo: string;
    email: string;
    receipt?: AdmissionReceipt;
  }) => void;
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
}

export function TrackApplicationModal({
  onLoadApplication,
  onError,
  onSuccess,
}: TrackApplicationModalProps) {
  const [open, setOpen] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      onError("Please enter your Application No or Email.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Try to fetch receipt first (if paid)
      try {
        const receipt = await getAdmissionReceiptApi(identifier.trim());
        if (receipt && receipt.receiptNo) {
          onSuccess("Receipt found! Loading your admission voucher...");
          onLoadApplication({
            step: 4,
            applicationNo: receipt.applicationNo,
            email: receipt.email,
            receipt,
          });
          setOpen(false);
          return;
        }
      } catch {
        // Not paid or not ready for receipt yet, check status
      }

      // 2. Fetch basic application status
      const statusData = await getAdmissionStatusApi(identifier.trim());
      if (statusData) {
        if (!statusData.isEmailVerified) {
          onSuccess("Application found! Please complete email verification.");
          onLoadApplication({
            step: 2,
            applicationNo: statusData.applicationNo,
            email: statusData.email,
          });
        } else {
          onSuccess("Application found! Please proceed to fee payment.");
          onLoadApplication({
            step: 3,
            applicationNo: statusData.applicationNo,
            email: statusData.email,
          });
        }
        setOpen(false);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Application not found with this identifier.";
      onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs font-semibold gap-1.5 border-primary/30 hover:border-primary text-foreground"
        >
          <Search className="h-3.5 w-3.5 text-primary" />
          <span>Track Application / Download Receipt</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Track Application Status
          </DialogTitle>
          <DialogDescription className="text-xs">
            Already applied? Enter your Application Number (e.g. ADM-2026-0001) or registered Email to continue your application or download your receipt.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleTrack} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold">
              Application No or Email Address
            </label>
            <Input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. ADM-2026-0001 or student@example.com"
              className="text-sm"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading || !identifier.trim()}
              className="font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <span>Find Application</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
