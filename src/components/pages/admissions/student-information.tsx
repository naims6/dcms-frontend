"use client";

import { useTranslations } from "next-intl";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { FormSection } from "@/components/shared/FormSection";
import { FormInput } from "@/components/shared/FormInput";
import { FormSelect, type SelectOption } from "@/components/shared/FormSelect";
import { useFormError } from "@/hooks/use-form-error";

interface StudentInformationProps {
  photoFileName: string;
  onPhotoChange: (fileName: string) => void;
}

export function StudentInformation({
  photoFileName,
  onPhotoChange,
}: StudentInformationProps) {
  const t = useTranslations("admissions");
  const { setValue, formState: { errors } } = useFormContext();
  const getErrorMessage = useFormError();

  const genderOptions: SelectOption[] = [
    { value: "male", label: t("options.male") },
    { value: "female", label: t("options.female") },
    { value: "other", label: t("options.other") },
  ];

  const bloodGroupOptions: SelectOption[] = [
    "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
  ].map((type) => ({ value: type, label: type }));

  const religionOptions: SelectOption[] = [
    "islam", "hindu", "christian", "other",
  ].map((r) => ({ value: r, label: t(`options.${r}`) }));

  return (
    <FormSection
      icon={User}
      title={t("sections.student.title")}
      description={t("sections.student.description")}
      accentColor="secondary"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <FormInput
            name="fullName"
            label={t("fields.fullName")}
            placeholder={t("placeholders.fullName")}
            required
          />
        </div>

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

        {/* Photo upload — custom layout, not a standard input */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium">{t("fields.studentPhoto")}</label>
          <div className="flex items-center gap-3">
            <label
              htmlFor="photo-upload"
              className="flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent transition-colors"
            >
              <span className="text-sm">{t("placeholders.chooseFile")}</span>
            </label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onPhotoChange(file.name);
                  setValue("studentPhoto", file.name);
                }
              }}
            />
            {photoFileName && (
              <span className="text-sm text-muted-foreground">
                {photoFileName}
              </span>
            )}
          </div>
          {errors.studentPhoto?.message && (
            <p className="text-sm text-destructive">
              {getErrorMessage(errors.studentPhoto.message as string)}
            </p>
          )}
        </div>
      </div>
    </FormSection>
  );
}
