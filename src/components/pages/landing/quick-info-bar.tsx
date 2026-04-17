"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, Phone, Clock, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickInfoBar() {
  const [isOpen, setIsOpen] = useState(true);
  const t = useTranslations("QuickInfo");

  if (!isOpen) return null;

  return (
    <section className="w-full bg-linear-to-r from-primary/5 via-accent/3 to-primary/5 backdrop-blur-sm border-b border-border/40 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-3 md:py-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-8 flex-row">
          {/* Left: Notice/Admission Status */}
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/15 text-primary animate-pulse">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary truncate">
                {t("admissionStatus")}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {t("admissionMessage")}
              </p>
            </div>
          </div>

          {/* Center: School Timing */}
          <div className="hidden lg:flex items-center gap-3 px-6 border-l border-r border-border/40">
            <Clock className="h-5 w-5 text-primary/70 flex-shrink-0" />
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-medium text-muted-foreground">
                {t("timingLabel")}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {t("timingValue")}
              </p>
            </div>
          </div>

          {/* Right: Contact Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-sm font-medium hover:bg-primary/10"
            >
              <Phone className="h-4 w-4" />
              {t("callLabel")}
            </Button>
            <Button
              size="sm"
              className="text-sm font-medium gap-1.5 shadow-sm hover:shadow-md"
            >
              <CheckCircle2 className="h-4 w-4" />
              {t("applyButton")}
            </Button>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="ml-2 flex-shrink-0 p-1.5 text-muted-foreground hover:text-primary bg-transparent rounded-lg hover:bg-primary/10 transition-all duration-200"
              aria-label="Close info bar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Layout - Stack vertically */}
        <div className="md:hidden space-y-3">
          {/* Top: Notice + Close Button */}
          <div className="flex items-start gap-2.5">
            <div className="flex-shrink-0 mt-0.5">
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/15 text-primary animate-pulse">
                <AlertCircle className="h-3 w-3" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-primary">
                {t("admissionStatus")}
              </p>
              <p className="text-xs text-muted-foreground leading-snug">
                {t("admissionMessage")}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-shrink-0 p-1 text-muted-foreground hover:text-primary bg-transparent rounded-lg hover:bg-primary/10 transition-all duration-200"
              aria-label="Close info bar"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Bottom: Timing + Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 flex-1 px-2.5 py-1.5 bg-background/50 rounded-lg border border-border/30">
              <Clock className="h-3.5 w-3.5 text-primary/70 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground leading-none">
                  {t("timingLabel")}
                </p>
                <p className="text-xs font-semibold text-foreground leading-none">
                  {t("timingValue")}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              className="text-xs font-medium gap-1 flex-shrink-0 h-7 px-2"
            >
              <Phone className="h-3 w-3" />
              <span className="hidden xs:inline">{t("callLabel")}</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
