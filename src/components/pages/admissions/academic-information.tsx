"use client";

import { useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";
import { FormSection } from "@/components/shared/FormSection";
import { FormInput } from "@/components/shared/FormInput";
import { FormSelect, type SelectOption } from "@/components/shared/FormSelect";
import { useClassesQuery } from "@/hooks/queries/use-class-queries";

export function AcademicInformation() {
  const t = useTranslations("admissions");
  const { data: classesData, isLoading: isLoadingClasses } = useClassesQuery();

  // Map classes from backend API, or fall back to standard list
  const classOptions: SelectOption[] =
    classesData && classesData.length > 0
      ? classesData.map((c) => ({
          value: c.id,
          label: c.name,
        }))
      : [
          { value: "class-6", label: "Class 6" },
          { value: "class-7", label: "Class 7" },
          { value: "class-8", label: "Class 8" },
          { value: "class-9", label: "Class 9" },
          { value: "class-10", label: "Class 10" },
        ];

  return (
    <FormSection
      icon={GraduationCap}
      title={t("sections.academic.title")}
      description={t("sections.academic.description")}
      accentColor="accent"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          name="targetClassId"
          label={t("fields.classApplying")}
          placeholder={
            isLoadingClasses
              ? "Loading classes..."
              : t("placeholders.selectClass")
          }
          options={classOptions}
          required
        />

        <FormInput
          name="previousSchoolName"
          label={t("fields.previousSchool")}
          placeholder={t("placeholders.previousSchool")}
        />

        <FormInput
          name="previousClass"
          label={t("fields.previousClass")}
          placeholder={t("placeholders.previousClass")}
        />

        <FormInput
          name="previousGpa"
          label={t("fields.previousGrade")}
          placeholder="e.g. 5.00 or A+"
        />

        <FormInput
          name="previousBoardRoll"
          label={t("fields.previousBoardRoll") || "Board Roll (if any)"}
          placeholder="e.g. 123456"
        />

        <FormInput
          name="previousPassingYear"
          label={t("fields.previousPassingYear") || "Passing Year"}
          placeholder="e.g. 2025"
          type="number"
        />
      </div>
    </FormSection>
  );
}
