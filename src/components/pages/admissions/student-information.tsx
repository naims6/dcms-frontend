import { useTranslations } from "next-intl";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Control } from "react-hook-form";
import { AdmissionFormValues } from "@/schemas/admissions";
import { SectionHeader } from "./section-header";
import { FormField } from "@/components/shared/FormField";

interface StudentInformationProps {
  control: Control<AdmissionFormValues>;
  photoFileName: string;
  onPhotoChange: (fileName: string) => void;
}

export function StudentInformation({
  control,
  photoFileName,
  onPhotoChange,
}: StudentInformationProps) {
  const t = useTranslations("admissions");

  return (
    <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-linear-to-br from-background via-background to-secondary/5">
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-linear-to-br from-primary/10 to-transparent blur-2xl -mr-16 -mt-16" />

      <div className="relative p-6 sm:p-8 z-10">
        <SectionHeader
          icon={User}
          title={t("sections.student.title")}
          description={t("sections.student.description")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField
              control={control}
              name="fullName"
              label={t("fields.fullName")}
              required
            >
              {(field) => (
                <Input
                  id="fullName"
                  placeholder={t("placeholders.fullName")}
                  {...field}
                />
              )}
            </FormField>
          </div>

          <FormField
            control={control}
            name="dateOfBirth"
            label={t("fields.dateOfBirth")}
            required
          >
            {(field) => <Input id="dateOfBirth" type="date" {...field} />}
          </FormField>

          <FormField
            control={control}
            name="gender"
            label={t("fields.gender")}
            required
          >
            {(field) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={t("placeholders.selectGender")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t("options.male")}</SelectItem>
                  <SelectItem value="female">{t("options.female")}</SelectItem>
                  <SelectItem value="other">{t("options.other")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          </FormField>

          <FormField
            control={control}
            name="bloodGroup"
            label={t("fields.bloodGroup")}
          >
            {(field) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("placeholders.selectBloodGroup")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}
          </FormField>

          <FormField
            control={control}
            name="religion"
            label={t("fields.religion")}
          >
            {(field) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={t("placeholders.selectReligion")} />
                </SelectTrigger>
                <SelectContent>
                  {["islam", "hindu", "christian", "other"].map((r) => (
                    <SelectItem key={r} value={r}>
                      {t(`options.${r}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>

          <div className="md:col-span-2">
            <FormField
              control={control}
              name="studentPhoto"
              label={t("fields.studentPhoto")}
            >
              {(field) => (
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="photo-upload"
                    className="flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent transition-colors"
                  >
                    <span className="text-sm">
                      {t("placeholders.chooseFile")}
                    </span>
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
                        field.onChange(file);
                      }
                    }}
                  />
                  {photoFileName && (
                    <span className="text-sm text-muted-foreground">
                      {photoFileName}
                    </span>
                  )}
                </div>
              )}
            </FormField>
          </div>
        </div>
      </div>
    </Card>
  );
}
