"use client";

import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { FormSection } from "@/components/shared/FormSection";
import { FormInput } from "@/components/shared/FormInput";
import { FormTextarea } from "@/components/shared/FormTextarea";

export function ContactInformation() {
  const t = useTranslations("admissions");

  return (
    <FormSection
      icon={MapPin}
      title={t("sections.contact.title")}
      description={t("sections.contact.description")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <FormTextarea
            name="address"
            label={t("fields.address")}
            placeholder={t("placeholders.address")}
            required
          />
        </div>

        <FormInput
          name="city"
          label={t("fields.city")}
          placeholder={t("placeholders.city")}
          required
        />

        <FormInput
          name="postalCode"
          label={t("fields.postalCode")}
          placeholder={t("placeholders.postalCode")}
          required
        />

        <FormInput
          name="email"
          label={t("fields.email")}
          type="email"
          placeholder={t("placeholders.email")}
          required
        />

        <FormInput
          name="emergencyContact"
          label={t("fields.emergencyContact")}
          placeholder={t("placeholders.phone")}
          required
        />
      </div>
    </FormSection>
  );
}
