"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Users, ChevronDown, ChevronUp } from "lucide-react";
import { FormSection } from "@/components/shared/FormSection";
import { FormInput } from "@/components/shared/FormInput";

export function ParentInformation() {
  const t = useTranslations("admissions");
  const [showGuardian, setShowGuardian] = useState(false);

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
              label={t("fields.name") || "Father's Name"}
              placeholder={t("placeholders.fatherName")}
              required
            />
            <FormInput
              name="fatherPhone"
              label={t("fields.phone") || "Father's Phone"}
              placeholder="+880 1700 000000"
            />
            <FormInput
              name="fatherOccupation"
              label={t("fields.occupation") || "Occupation"}
              placeholder={t("placeholders.occupation") || "e.g. Business"}
            />
            <FormInput
              name="fatherNid"
              label="National ID (NID)"
              placeholder="e.g. 1980123456789"
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
              label={t("fields.name") || "Mother's Name"}
              placeholder={t("placeholders.motherName")}
              required
            />
            <FormInput
              name="motherPhone"
              label={t("fields.phone") || "Mother's Phone"}
              placeholder="+880 1700 000000"
            />
            <FormInput
              name="motherOccupation"
              label={t("fields.occupation") || "Occupation"}
              placeholder={t("placeholders.occupation") || "e.g. Teacher / Homemaker"}
            />
            <FormInput
              name="motherNid"
              label="National ID (NID)"
              placeholder="e.g. 1982123456789"
            />
          </div>
        </div>

        {/* Local Guardian Toggle */}
        <div className="bg-background/50 rounded-lg p-4 border border-border/30">
          <button
            type="button"
            onClick={() => setShowGuardian(!showGuardian)}
            className="w-full flex items-center justify-between text-left text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span>Local Guardian Information (Optional)</span>
            {showGuardian ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {showGuardian && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-border/20">
              <FormInput
                name="localGuardianName"
                label="Guardian Name"
                placeholder="e.g. Rafiq Uddin"
              />
              <FormInput
                name="localGuardianPhone"
                label="Guardian Phone"
                placeholder="+880 1700 000000"
              />
              <FormInput
                name="localGuardianRelation"
                label="Relationship"
                placeholder="e.g. Uncle / Grandfather"
              />
              <FormInput
                name="localGuardianAddress"
                label="Guardian Address"
                placeholder="e.g. Mirpur, Dhaka"
              />
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
}
