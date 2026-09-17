"use client";

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
} from "@/components/pages/admissions";
import {
  admissionFormDefaultValues,
  admissionFormResolver,
  type AdmissionFormValues,
} from "@/schemas/admissions";
import { useAdmissionForm } from "@/hooks/use-admission-form";

export default function AdmissionsPage() {
  const t = useTranslations("admissions");
  const {
    isSubmitting,
    photoFileName,
    setPhotoFileName,
    onSubmit: handleSubmit,
  } = useAdmissionForm();

  const form = useForm<AdmissionFormValues>({
    resolver: admissionFormResolver,
    mode: "onTouched",
    defaultValues: admissionFormDefaultValues,
  });

  async function onSubmit(data: AdmissionFormValues) {
    const result = await handleSubmit(data);
    if (result.success) {
      alert(t("messages.success"));
      form.reset();
      setPhotoFileName("");
    } else {
      alert(t("messages.error"));
    }
  }

  return (
    <>
      {/* Page Intro Section */}
      <PageIntro
        badgeIcon={<GraduationCap className="h-4 w-4" />}
        badgeText={t("badge")}
        title={t("title")}
        titleHighlight={t("titleHightlight")}
        description={t("subtitle")}
      />

      {/* Form Section */}
      <div className="relative w-full bg-background/50 backdrop-blur-sm">
        {/* Decorative background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-linear-to-br from-primary/5 to-secondary/5 blur-3xl" />
          <div className="absolute -bottom-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-linear-to-t from-accent/5 to-primary/5 blur-3xl" />
        </div>

        <div className="container mx-auto max-w-4xl px-4 md:px-6 py-6 md:py-20 relative z-10">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Section 1: Student Information */}
              <StudentInformation
                photoFileName={photoFileName}
                onPhotoChange={setPhotoFileName}
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
                  className="min-w-60 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("buttons.submitting")}
                    </>
                  ) : (
                    t("buttons.submit")
                  )}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
