import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Control } from "react-hook-form";
import { AdmissionFormValues } from "@/schemas/admissions";
import { SectionHeader } from "./section-header";
import { FormField } from "@/components/shared/FormField";

interface ContactInformationProps {
  control: Control<AdmissionFormValues>;
}

export function ContactInformation({ control }: ContactInformationProps) {
  const t = useTranslations("admissions");

  return (
    <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-linear-to-br from-background via-background to-primary/5">
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-linear-to-br from-primary/10 to-transparent blur-2xl -mr-16 -mt-16" />

      <div className="relative p-6 sm:p-8 z-10">
        <SectionHeader
          icon={MapPin}
          title={t("sections.contact.title")}
          description={t("sections.contact.description")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField
              control={control}
              name="address"
              label={t("fields.address")}
              required
            >
              {(field) => (
                <Textarea
                  id="address"
                  placeholder={t("placeholders.address")}
                  className="resize-none"
                  {...field}
                />
              )}
            </FormField>
          </div>

          <FormField
            control={control}
            name="city"
            label={t("fields.city")}
            required
          >
            {(field) => (
              <Input
                id="city"
                placeholder={t("placeholders.city")}
                {...field}
              />
            )}
          </FormField>

          <FormField
            control={control}
            name="postalCode"
            label={t("fields.postalCode")}
            required
          >
            {(field) => (
              <Input
                id="postalCode"
                placeholder={t("placeholders.postalCode")}
                {...field}
              />
            )}
          </FormField>

          <FormField
            control={control}
            name="email"
            label={t("fields.email")}
            required
          >
            {(field) => (
              <Input
                id="email"
                type="email"
                placeholder={t("placeholders.email")}
                {...field}
              />
            )}
          </FormField>

          <FormField
            control={control}
            name="emergencyContact"
            label={t("fields.emergencyContact")}
            required
          >
            {(field) => (
              <Input
                id="emergencyContact"
                placeholder={t("placeholders.phone")}
                {...field}
              />
            )}
          </FormField>
        </div>
      </div>
    </Card>
  );
}
