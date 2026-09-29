"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Loader2, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import PageIntro from "@/components/shared/PageIntro";
import {
  StudentInformation,
  AcademicInformation,
  ParentInformation,
  ContactInformation,
  AdditionalInformation,
  AdmissionStepper,
  VerifyEmailStep,
  PaymentStep,
  ReceiptStep,
  TrackApplicationModal,
} from "@/components/pages/admissions";
import {
  admissionFormDefaultValues,
  admissionFormResolver,
  type AdmissionFormValues,
} from "@/schemas/admissions";
import { useAdmissionForm } from "@/hooks/use-admission-form";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/shared/Toast";
import { getAdmissionReceiptApi } from "@/services/admission.service";
import type { AdmissionReceipt } from "@/types/admission";

const SESSION_KEY = "dcms_admission_state";

function AdmissionsContent() {
  const t = useTranslations("admissions");
  const { toast, toastState, dismiss } = useToast();
  const searchParams = useSearchParams();

  // Wizard Step: 1 = Apply, 2 = Verify Email, 3 = Payment, 4 = Receipt
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [applicationNo, setApplicationNo] = useState<string>("");
  const [applicantEmail, setApplicantEmail] = useState<string>("");
  const [admissionFee, setAdmissionFee] = useState<number>(100);
  const [currency, setCurrency] = useState<string>("BDT");
  const [receiptData, setReceiptData] = useState<AdmissionReceipt | null>(null);

  const {
    isSubmitting,
    photoFile,
    photoPreview,
    onPhotoSelect,
    onSubmit: handleFormSubmit,
  } = useAdmissionForm();

  const form = useForm<AdmissionFormValues>({
    resolver: admissionFormResolver,
    mode: "onTouched",
    defaultValues: admissionFormDefaultValues,
  });

  // Restore saved state from sessionStorage or handle URL parameters (e.g. from payment callback)
  useEffect(() => {
    // 1. Check URL query params (e.g. returning from payment callback /admission/complete)
    const tranIdParam = searchParams.get("tranId");
    const statusParam = searchParams.get("status");
    const appNoParam = searchParams.get("applicationNo");
    const identifierParam = searchParams.get("identifier");

    const identifier = appNoParam || identifierParam || tranIdParam;

    if (
      identifier &&
      (statusParam === "success" || searchParams.get("step") === "4")
    ) {
      void (async () => {
        try {
          const receipt = await getAdmissionReceiptApi(identifier);
          if (receipt) {
            setReceiptData(receipt);
            setApplicationNo(receipt.applicationNo);
            setApplicantEmail(receipt.email);
            setCurrentStep(4);
            toast(
              "success",
              "Payment confirmed! Here is your official admission receipt.",
            );
            return;
          }
        } catch {
          // If receipt fetch fails, fallback to session
        }
      })();
    }

    if (
      statusParam === "fail" ||
      statusParam === "cancel" ||
      statusParam === "error"
    ) {
      const msg =
        searchParams.get("message") ||
        (statusParam === "cancel"
          ? "Payment was cancelled. You can retry payment below."
          : "Payment failed. Please try again.");
      toast("error", msg);
      setCurrentStep(3);
      return;
    }

    // 2. Restore saved session state if available
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.applicationNo && parsed.email) {
          setApplicationNo(parsed.applicationNo);
          setApplicantEmail(parsed.email);
          if (parsed.admissionFee) setAdmissionFee(parsed.admissionFee);
          if (parsed.currency) setCurrency(parsed.currency);
          if (parsed.step && parsed.step > 1 && !statusParam) {
            setCurrentStep(parsed.step);
          }
          if (parsed.receiptData) {
            setReceiptData(parsed.receiptData);
          }
        }
      }
    } catch {
      // Ignore sessionStorage parsing errors
    }
  }, [searchParams]);

  // Save state to sessionStorage whenever step or application info updates
  useEffect(() => {
    if (applicationNo && applicantEmail) {
      try {
        sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify({
            step: currentStep,
            applicationNo,
            email: applicantEmail,
            admissionFee,
            currency,
            receiptData,
          }),
        );
      } catch {
        // Ignore storage error
      }
    }
  }, [
    currentStep,
    applicationNo,
    applicantEmail,
    admissionFee,
    currency,
    receiptData,
  ]);

  // Handle Step 1 form submission
  async function onSubmit(data: AdmissionFormValues) {
    const result = await handleFormSubmit(data);
    if (result.success && result.data) {
      const appNo = result.data.applicationNo;
      const email = result.data.email || data.email;
      setApplicationNo(appNo);
      setApplicantEmail(email);
      setCurrentStep(2);
      toast(
        "success",
        result.message || "Application submitted! Check your email for OTP.",
      );
    } else {
      toast("error", result.message || t("messages.error"));
    }
  }

  // Handle reset to Step 1
  function handleReset() {
    form.reset();
    onPhotoSelect(null);
    setApplicationNo("");
    setApplicantEmail("");
    setReceiptData(null);
    setCurrentStep(1);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore
    }
  }

  return (
    <>
      {toastState && <Toast state={toastState} onDismiss={dismiss} />}

      {/* Page Intro Section */}
      <PageIntro
        badgeIcon={<GraduationCap className="h-4 w-4" />}
        badgeText={t("badge") || "Admission Portal"}
        title={t("title") || "Student Admission"}
        titleHighlight={t("titleHightlight") || "Application"}
        description={
          t("subtitle") ||
          "Complete the 4-step admission process to apply, verify email, pay fees, and download your official receipt."
        }
      />

      <div className="relative w-full bg-background/50 backdrop-blur-sm">
        {/* Background glow decorations */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden print:hidden">
          <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-linear-to-br from-primary/5 to-secondary/5 blur-3xl" />
          <div className="absolute -bottom-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-linear-to-t from-accent/5 to-primary/5 blur-3xl" />
        </div>

        <div className="container mx-auto max-w-4xl px-4 md:px-6 py-6 md:py-12 relative z-10">
          {/* Top Actions: Stepper & Track Application Modal Button */}
          <div className="print:hidden">
            <div className="flex justify-end mb-4">
              <TrackApplicationModal
                onLoadApplication={({
                  step,
                  applicationNo: aNo,
                  email,
                  receipt,
                }) => {
                  setApplicationNo(aNo);
                  setApplicantEmail(email);
                  if (receipt) setReceiptData(receipt);
                  setCurrentStep(step);
                }}
                onError={(msg) => toast("error", msg)}
                onSuccess={(msg) => toast("success", msg)}
              />
            </div>

            <AdmissionStepper currentStep={currentStep} />
          </div>

          {/* ================================================================= */}
          {/* STEP 1: APPLY (Form Fill-Up & Document Upload) */}
          {/* ================================================================= */}
          {currentStep === 1 && (
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 animate-in fade-in duration-300"
              >
                {/* Section 1: Student Information */}
                <StudentInformation
                  photoFile={photoFile}
                  photoPreview={photoPreview}
                  onPhotoSelect={onPhotoSelect}
                />

                {/* Section 2: Academic Information */}
                <AcademicInformation />

                {/* Section 3: Parent Information */}
                <ParentInformation />

                {/* Section 4: Contact Information */}
                <ContactInformation />

                {/* Section 5: Additional Information */}
                <AdditionalInformation />

                {/* Submit Button */}
                <div className="flex justify-center pt-8">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="min-w-64 h-12 text-base font-bold bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t("buttons.submitting") || "Submitting Application..."}
                      </>
                    ) : (
                      t("buttons.submit") ||
                      "Submit & Proceed to Email Verification"
                    )}
                  </Button>
                </div>
              </form>
            </FormProvider>
          )}

          {/* ================================================================= */}
          {/* STEP 2: VERIFY EMAIL (6-Digit OTP) */}
          {/* ================================================================= */}
          {currentStep === 2 && (
            <div className="animate-in fade-in duration-300">
              <VerifyEmailStep
                applicationNo={applicationNo}
                email={applicantEmail}
                onVerified={(res) => {
                  if (res.admissionFee) setAdmissionFee(res.admissionFee);
                  if (res.currency) setCurrency(res.currency);
                  setCurrentStep(3);
                }}
                onBack={() => setCurrentStep(1)}
                onError={(msg) => toast("error", msg)}
                onSuccess={(msg) => toast("success", msg)}
              />
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 3: PAYMENT INITIATION & VERIFICATION */}
          {/* ================================================================= */}
          {currentStep === 3 && (
            <div className="animate-in fade-in duration-300">
              <PaymentStep
                applicationNo={applicationNo}
                email={applicantEmail}
                admissionFee={admissionFee}
                currency={currency}
                onPaymentValidated={(receipt) => {
                  setReceiptData(receipt);
                  setCurrentStep(4);
                }}
                onError={(msg) => toast("error", msg)}
                onSuccess={(msg) => toast("success", msg)}
              />
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 4: DOWNLOAD / PRINT ADMISSION RECEIPT */}
          {/* ================================================================= */}
          {currentStep === 4 && receiptData && (
            <div className="animate-in fade-in duration-300">
              <ReceiptStep receipt={receiptData} onReset={handleReset} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function AdmissionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AdmissionsContent />
    </Suspense>
  );
}
