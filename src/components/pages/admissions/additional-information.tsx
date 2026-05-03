"use client";

import { useTranslations } from "next-intl";
import { FileText } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormSection } from "@/components/shared/FormSection";
import { FormInput } from "@/components/shared/FormInput";
import { useFormError } from "@/hooks/use-form-error";

export function AdditionalInformation() {
  const t = useTranslations("admissions");
  const { control } = useFormContext();
  const getErrorMessage = useFormError();

  return (
    <FormSection
      icon={FileText}
      title={t("sections.additional.title")}
      description={t("sections.additional.description")}
      accentColor="accent"
    >
      <div className="space-y-6">
        <FormInput
          name="password"
          label={t("fields.password")}
          type="password"
          placeholder="********"
          required
        />

        <FormInput
          name="confirmPassword"
          label={t("fields.confirmPassword")}
          type="password"
          placeholder="********"
          required
        />

        {/* Agree Terms — custom layout with checkbox + description */}
        <Controller
          control={control}
          name="agreeTerms"
          render={({ field, fieldState }) => (
            <div className="flex flex-row items-start space-x-3 rounded-lg border-2 border-primary/20 p-5 bg-linear-to-br from-primary/5 via-background to-secondary/5 hover:border-primary/30 transition-all duration-300">
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(!!checked)}
                className="mt-1"
              />
              <div className="space-y-2 leading-none">
                <Label className="cursor-pointer font-semibold">
                  {t("fields.agreeTerms")}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("messages.termsDescription")}
                </p>
                {fieldState.error?.message && (
                  <p className="text-sm text-destructive">
                    {getErrorMessage(fieldState.error.message)}
                  </p>
                )}
              </div>
            </div>
          )}
        />
      </div>
    </FormSection>
  );
}
