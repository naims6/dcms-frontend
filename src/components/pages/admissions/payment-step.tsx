"use client";

import { useState } from "react";
import {
  CreditCard,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  initiateAdmissionPaymentApi,
  getAdmissionReceiptApi,
} from "@/services/admission.service";
import type { AdmissionReceipt, PaymentProvider } from "@/types/admission";

interface PaymentStepProps {
  applicationNo: string;
  email: string;
  admissionFee?: number;
  currency?: string;
  onPaymentValidated: (receipt: AdmissionReceipt) => void;
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
}

export function PaymentStep({
  applicationNo,
  email,
  admissionFee = 100,
  currency = "BDT",
  onPaymentValidated,
  onError,
  onSuccess,
}: PaymentStepProps) {
  const [provider, setProvider] = useState<PaymentProvider>("SSLCOMMERZ");
  const [isInitiating, setIsInitiating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [lastTranId, setLastTranId] = useState<string | null>(null);
  const [gatewayUrl, setGatewayUrl] = useState<string | null>(null);

  const handleInitiatePayment = async () => {
    setIsInitiating(true);
    try {
      const result = await initiateAdmissionPaymentApi({
        email: email.trim(),
        provider,
      });

      setLastTranId(result.tranId);
      setGatewayUrl(result.gatewayUrl);

      onSuccess("Payment session created! Redirecting to secure gateway...");

      // Redirect to the payment gateway
      if (result.gatewayUrl) {
        window.location.href = result.gatewayUrl;
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to initiate payment session.";
      onError(message);
    } finally {
      setIsInitiating(false);
    }
  };

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      const receipt = await getAdmissionReceiptApi(applicationNo || email);
      if (receipt && receipt.payment?.status?.includes("PAID") || receipt.payment?.status?.includes("VALIDATED")) {
        onSuccess("Payment verified successfully! Here is your official receipt.");
        onPaymentValidated(receipt);
      } else {
        onError("Payment has not been validated yet. If you have paid, please wait a moment and check again.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Payment is not yet completed.";
      onError(message);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Card className="border-border/60 shadow-xl bg-card/95 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-border/40 text-center pb-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            <CreditCard className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Admission Fee Payment
          </CardTitle>
          <CardDescription className="text-sm mt-1">
            Pay the application processing fee to finalize your admission request
          </CardDescription>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <span className="px-3 py-1 rounded-full bg-background border text-xs font-mono">
              App: <strong className="text-foreground">{applicationNo}</strong>
            </span>
            <span className="px-3 py-1 rounded-full bg-background border text-xs">
              Email: <strong className="text-foreground">{email}</strong>
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Fee Invoice Box */}
          <div className="rounded-xl border border-border/60 p-5 bg-muted/20 space-y-3">
            <div className="flex justify-between items-center text-sm text-muted-foreground pb-2 border-b border-border/30">
              <span>Item</span>
              <span>Amount</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span>Student Admission Application Processing Fee</span>
              <span>
                {currency} {Number(admissionFee).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Online Gateway Charges</span>
              <span className="text-emerald-600 font-medium">FREE</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t-2 border-border/60 text-lg font-bold">
              <span>Total Payable</span>
              <span className="text-primary">
                {currency} {Number(admissionFee).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">
              Select Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setProvider("SSLCOMMERZ")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  provider === "SSLCOMMERZ"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                    : "border-border/60 hover:border-primary/40 bg-card"
                }`}
              >
                <div className="font-bold text-sm tracking-wide text-foreground">
                  SSLCommerz
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 text-center">
                  Cards, Net Banking & Mobile
                </div>
              </button>

              <button
                type="button"
                onClick={() => setProvider("BKASH")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  provider === "BKASH"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                    : "border-border/60 hover:border-primary/40 bg-card"
                }`}
              >
                <div className="font-bold text-sm text-pink-600">bKash</div>
                <div className="text-[11px] text-muted-foreground mt-1 text-center">
                  Direct bKash Wallet
                </div>
              </button>

              <button
                type="button"
                onClick={() => setProvider("NAGAD")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  provider === "NAGAD"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                    : "border-border/60 hover:border-primary/40 bg-card"
                }`}
              >
                <div className="font-bold text-sm text-orange-600">Nagad</div>
                <div className="text-[11px] text-muted-foreground mt-1 text-center">
                  Direct Nagad Wallet
                </div>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              type="button"
              onClick={handleInitiatePayment}
              disabled={isInitiating}
              size="lg"
              className="w-full h-12 text-base font-bold shadow-lg hover:shadow-xl transition-all"
            >
              {isInitiating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Connecting to Secure Gateway...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  Pay Now ({currency} {Number(admissionFee).toFixed(2)})
                </>
              )}
            </Button>

            {/* If user opened gateway in new tab or returning from payment */}
            <div className="pt-2 text-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleCheckStatus}
                disabled={isChecking}
                className="w-full text-xs sm:text-sm font-medium border-border/80"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Checking Payment Status...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" />
                    I Have Completed Payment / Check Status
                  </>
                )}
              </Button>
            </div>
          </div>

          {lastTranId && (
            <div className="p-3 rounded-lg bg-muted/40 border text-xs text-center space-y-1">
              <p className="text-muted-foreground">
                Transaction ID: <span className="font-mono font-bold text-foreground">{lastTranId}</span>
              </p>
              {gatewayUrl && (
                <a
                  href={gatewayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                >
                  <span>Re-open Payment Gateway</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground pt-1">
            <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
            <span>256-bit SSL encrypted & secure transaction processing</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
