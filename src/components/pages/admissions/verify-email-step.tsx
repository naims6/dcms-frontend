"use client";

import { useState, useEffect } from "react";
import { Mail, CheckCircle2, RotateCw, ArrowLeft, Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  verifyAdmissionEmailApi,
  resendAdmissionOtpApi,
} from "@/services/admission.service";
import type { VerifyEmailResponse } from "@/types/admission";

interface VerifyEmailStepProps {
  applicationNo: string;
  email: string;
  onVerified: (data: VerifyEmailResponse) => void;
  onBack: () => void;
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
}

export function VerifyEmailStep({
  applicationNo,
  email,
  onVerified,
  onBack,
  onError,
  onSuccess,
}: VerifyEmailStepProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      onError("Please enter a valid 6-digit OTP code.");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await verifyAdmissionEmailApi({
        email: email.trim(),
        otp: otp.trim(),
      });
      onSuccess("Email verified successfully! Proceeding to payment...");
      onVerified(response);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid or expired OTP code.";
      onError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    try {
      await resendAdmissionOtpApi({ email: email.trim() });
      setResendCooldown(60);
      onSuccess("A new 6-digit OTP has been sent to your email.");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to resend OTP. Try again later.";
      onError(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-6">
      <Card className="border-border/60 shadow-xl bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            <Mail className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-sm mt-1">
            We sent a 6-digit verification code to
            <br />
            <strong className="text-foreground">{email}</strong>
          </CardDescription>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-xs font-mono font-medium mx-auto">
            <span>Application No:</span>
            <span className="text-primary font-bold">{applicationNo}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleVerify} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="otp-input"
                className="text-sm font-semibold flex items-center gap-1.5 justify-center"
              >
                <KeyRound className="h-4 w-4 text-primary" />
                <span>Enter 6-Digit OTP Code</span>
              </label>

              <div className="flex justify-center">
                <Input
                  id="otp-input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="• • • • • •"
                  className="text-center text-2xl tracking-[0.5em] font-mono font-bold h-14 max-w-xs focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isVerifying || otp.length !== 6}
              className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying OTP...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Verify Email & Continue
                </>
              )}
            </Button>
          </form>

          {/* Resend OTP Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/40 text-sm">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Application</span>
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline disabled:opacity-50 disabled:no-underline"
            >
              <RotateCw
                className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`}
              />
              {resendCooldown > 0 ? (
                <span>Resend OTP in ({resendCooldown}s)</span>
              ) : (
                <span>Resend OTP</span>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
