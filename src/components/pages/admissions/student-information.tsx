"use client";

import { useTranslations } from "next-intl";
import { User, Upload, X } from "lucide-react";
import Image from "next/image";
import { FormSection } from "@/components/shared/FormSection";
import { FormInput } from "@/components/shared/FormInput";
import { FormSelect, type SelectOption } from "@/components/shared/FormSelect";
import type { StudentInformationProps } from "@/types/admission";

export function StudentInformation({
  photoFile,
  photoPreview,
  onPhotoSelect,
}: StudentInformationProps) {
  const t = useTranslations("admissions");

  const genderOptions: SelectOption[] = [
    { value: "MALE", label: t("options.male") || "Male" },
    { value: "FEMALE", label: t("options.female") || "Female" },
    { value: "OTHER", label: t("options.other") || "Other" },
  ];

  const bloodGroupOptions: SelectOption[] = [
    { value: "A_POSITIVE", label: "A+" },
    { value: "A_NEGATIVE", label: "A-" },
    { value: "B_POSITIVE", label: "B+" },
    { value: "B_NEGATIVE", label: "B-" },
    { value: "AB_POSITIVE", label: "AB+" },
    { value: "AB_NEGATIVE", label: "AB-" },
    { value: "O_POSITIVE", label: "O+" },
    { value: "O_NEGATIVE", label: "O-" },
  ];

  const religionOptions: SelectOption[] = [
    { value: "ISLAM", label: t("options.islam") || "Islam" },
    { value: "HINDU", label: t("options.hindu") || "Hindu" },
    { value: "CHRISTIAN", label: t("options.christian") || "Christian" },
    { value: "OTHER", label: t("options.other") || "Other" },
  ];

  return (
    <FormSection
      icon={User}
      title={t("sections.student.title")}
      description={t("sections.student.description")}
      accentColor="secondary"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          name="firstName"
          label={t("fields.firstName") || "First Name"}
          placeholder={t("placeholders.firstName") || "e.g. Rahim"}
          required
        />

        <FormInput
          name="lastName"
          label={t("fields.lastName") || "Last Name"}
          placeholder={t("placeholders.lastName") || "e.g. Uddin"}
          required
        />

        <FormInput
          name="dateOfBirth"
          label={t("fields.dateOfBirth")}
          type="date"
          required
        />

        <FormSelect
          name="gender"
          label={t("fields.gender")}
          placeholder={t("placeholders.selectGender")}
          options={genderOptions}
          required
        />

        <FormSelect
          name="bloodGroup"
          label={t("fields.bloodGroup")}
          placeholder={t("placeholders.selectBloodGroup")}
          options={bloodGroupOptions}
        />

        <FormSelect
          name="religion"
          label={t("fields.religion")}
          placeholder={t("placeholders.selectReligion")}
          options={religionOptions}
        />

        <FormInput
          name="nationality"
          label={t("fields.nationality") || "Nationality"}
          placeholder="Bangladeshi"
        />

        <FormInput
          name="nationalIdOrBirthReg"
          label={t("fields.nationalIdOrBirthReg") || "Birth Reg / NID No."}
          placeholder={t("placeholders.birthReg") || "e.g. 20081234567890123"}
        />

        {/* Student Photo Upload with Preview */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium">
            {t("fields.studentPhoto")} (Passport size, max 5MB)
          </label>
          <div className="flex flex-wrap items-center gap-4 p-4 border border-dashed rounded-lg bg-muted/20">
            {photoPreview ? (
              <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-border shadow-xs">
                <Image
                  src={photoPreview}
                  alt="Student Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => onPhotoSelect(null)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-90"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : null}

            <div className="space-y-1">
              <label
                htmlFor="photo-upload-input"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-medium text-sm rounded-md cursor-pointer transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>{photoFile ? "Change Photo" : t("placeholders.chooseFile")}</span>
              </label>
              <input
                id="photo-upload-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  onPhotoSelect(file);
                }}
              />
              <p className="text-xs text-muted-foreground">
                {photoFile ? photoFile.name : "JPEG, PNG or WEBP (Max 5MB)"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </FormSection>
  );
}
