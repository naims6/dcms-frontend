"use client";

import { useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";
import { FormSection } from "@/components/shared/FormSection";
import { FormInput } from "@/components/shared/FormInput";
import { FormSelect, type SelectOption } from "@/components/shared/FormSelect";

const CLASS_OPTIONS = ["class-6", "class-7", "class-8", "class-9", "class-10"];
const PREV_CLASS_OPTIONS = ["class-5", "class-6", "class-7", "class-8", "class-9"];

export function AcademicInformation() {
  const t = useTranslations("admissions");

  const classOptions: SelectOption[] = CLASS_OPTIONS.map((cls) => ({
    value: cls,
    label: t(`options.${cls}`),
  }));

  const prevClassOptions: SelectOption[] = PREV_CLASS_OPTIONS.map((cls) => ({
    value: cls,
    label: t(`options.${cls}`),
  }));

  return (
    <FormSection
      icon={GraduationCap}
      title={t("sections.academic.title")}
      description={t("sections.academic.description")}
      accentColor="accent"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          name="classApplying"
          label={t("fields.classApplying")}
          placeholder={t("placeholders.selectClass")}
          options={classOptions}
          required
        />

        <FormInput
          name="previousSchool"
          label={t("fields.previousSchool")}
          placeholder={t("placeholders.previousSchool")}
        />

        <FormSelect
          name="previousClass"
          label={t("fields.previousClass")}
          placeholder={t("placeholders.selectClass")}
          options={prevClassOptions}
        />

        <FormInput
          name="previousGrade"
          label={t("fields.previousGrade")}
          placeholder={t("placeholders.previousGrade")}
        />
      </div>
    </FormSection>
  );
}
