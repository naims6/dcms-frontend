"use client";

import { Check, FileText, MailCheck, CreditCard, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdmissionStepperProps {
  currentStep: number; // 1, 2, 3, 4
  onStepClick?: (step: number) => void;
}

const STEPS = [
  { step: 1, title: "1. Apply", description: "Fill Application Form", icon: FileText },
  { step: 2, title: "2. Verify Email", description: "6-Digit OTP Code", icon: MailCheck },
  { step: 3, title: "3. Fee Payment", description: "Online Gateway", icon: CreditCard },
  { step: 4, title: "4. Receipt", description: "Download Voucher", icon: Award },
];

export function AdmissionStepper({ currentStep }: AdmissionStepperProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-10 px-4">
      <div className="relative flex items-center justify-between">
        {/* Connector line behind steps */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-border/60 -z-10">
          <div
            className="h-full bg-primary transition-all duration-500 ease-in-out"
            style={{
              width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {STEPS.map((s) => {
          const isCompleted = currentStep > s.step;
          const isCurrent = currentStep === s.step;
          const Icon = s.icon;

          return (
            <div
              key={s.step}
              className="flex flex-col items-center group relative z-0"
            >
              <div
                className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-semibold text-sm",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground shadow-md"
                    : isCurrent
                      ? "bg-background border-primary text-primary ring-4 ring-primary/20 shadow-md font-bold scale-110"
                      : "bg-muted/80 border-border text-muted-foreground",
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>

              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-xs md:text-sm font-semibold transition-colors",
                    isCurrent
                      ? "text-primary"
                      : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {s.title}
                </p>
                <p className="text-[11px] text-muted-foreground hidden sm:block">
                  {s.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
