"use client";

import { useTranslations } from "next-intl";
import { Users } from "lucide-react";
import { FormSection } from "@/components/shared/FormSection";
import { FormInput } from "@/components/shared/FormInput";

export function ParentInformation() {
  const t = useTranslations("admissions");

  return (
    <FormSection
      icon={Users}
      title={t("sections.parent.title")}
      description={t("sections.parent.description")}
      accentColor="secondary"
    >
      <div className="space-y-8">
        {/* Father Information */}
        <div className="bg-background/50 rounded-lg p-6 border border-border/30">
          <h4 className="text-base font-semibold text-foreground mb-6 pb-3 border-b-2 border-primary/30">
            {t("sections.fatherInfo")}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              name="fatherName"
              label={t("fields.name")}
              placeholder={t("placeholders.fatherName")}
              required
            />
            <FormInput
              name="fatherOccupation"
              label={t("fields.occupation")}
              placeholder={t("placeholders.occupation")}
            />
            <FormInput
              name="fatherPhone"
              label={t("fields.phone")}
              placeholder={t("placeholders.phone")}
              required
            />
          </div>
        </div>

        {/* Mother Information */}
        <div className="bg-background/50 rounded-lg p-6 border border-border/30">
          <h4 className="text-base font-semibold text-foreground mb-6 pb-3 border-b-2 border-secondary/30">
            {t("sections.motherInfo")}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              name="motherName"
              label={t("fields.name")}
              placeholder={t("placeholders.motherName")}
              required
            />
            <FormInput
              name="motherOccupation"
              label={t("fields.occupation")}
              placeholder={t("placeholders.occupation")}
            />
            <FormInput
              name="motherPhone"
              label={t("fields.phone")}
              placeholder={t("placeholders.phone")}
              required
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
}
