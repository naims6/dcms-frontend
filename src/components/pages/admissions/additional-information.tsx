import { useTranslations } from "next-intl";
import { FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Control, Controller } from "react-hook-form";
import { AdmissionFormValues } from "@/schemas/admissions";
import { SectionHeader } from "./section-header";
import { FormField } from "@/components/shared/FormField";
import { useFormError } from "@/hooks/use-form-error";

interface AdditionalInformationProps {
  control: Control<AdmissionFormValues>;
}

export function AdditionalInformation({ control }: AdditionalInformationProps) {
  const t = useTranslations("admissions");
  const getErrorMessage = useFormError();

  return (
    <Card className="hover:translate-y-0 relative overflow-hidden border-0 shadow-md bg-linear-to-br from-background via-background to-accent/5">
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-linear-to-br from-accent/10 to-transparent blur-2xl -mr-16 -mt-16" />

      <div className="relative p-6 sm:p-8 z-10">
        <SectionHeader
          icon={FileText}
          title={t("sections.additional.title")}
          description={t("sections.additional.description")}
        />

        <div className="space-y-6">

          <FormField
            control={control}
            name="password"
            label={t("fields.password")}
            required
          >
            {(field) => (
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...field}
                value={(field.value as string) || ""}
              />
            )}
          </FormField>

          <FormField
            control={control}
            name="confirmPassword"
            label={t("fields.confirmPassword")}
            required
          >
            {(field) => (
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                {...field}
                value={(field.value as string) || ""}
              />
            )}
          </FormField>

          {/* agreeTerms has a custom layout so we use Controller directly here */}
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
      </div>
    </Card>
  );
}
