import { useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";
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

interface AcademicInformationProps {
  control: Control<AdmissionFormValues>;
}

const CLASS_OPTIONS = ["class-6", "class-7", "class-8", "class-9", "class-10"];
const PREV_CLASS_OPTIONS = [
  "class-5",
  "class-6",
  "class-7",
  "class-8",
  "class-9",
];

export function AcademicInformation({ control }: AcademicInformationProps) {
  const t = useTranslations("admissions");

  return (
    <Card className="hover:translate-y-0 relative overflow-hidden border-0 shadow-md bg-linear-to-br from-background via-background to-accent/5">
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-linear-to-br from-accent/10 to-transparent blur-2xl -mr-16 -mt-16" />

      <div className="relative p-6 sm:p-8 z-10">
        <SectionHeader
          icon={GraduationCap}
          title={t("sections.academic.title")}
          description={t("sections.academic.description")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="classApplying"
            label={t("fields.classApplying")}
            required
          >
            {(field) => (
              <Select onValueChange={field.onChange} value={field.value as string}>
                <SelectTrigger>
                  <SelectValue placeholder={t("placeholders.selectClass")} />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_OPTIONS.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {t(`options.${cls}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>

          <FormField
            control={control}
            name="previousSchool"
            label={t("fields.previousSchool")}
          >
            {(field) => (
              <Input
                id="previousSchool"
                placeholder={t("placeholders.previousSchool")}
                {...field}
                value={(field.value as string) || ""}
              />
            )}
          </FormField>

          <FormField
            control={control}
            name="previousClass"
            label={t("fields.previousClass")}
          >
            {(field) => (
              <Select onValueChange={field.onChange} value={field.value as string}>
                <SelectTrigger>
                  <SelectValue placeholder={t("placeholders.selectClass")} />
                </SelectTrigger>
                <SelectContent>
                  {PREV_CLASS_OPTIONS.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {t(`options.${cls}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>

          <FormField
            control={control}
            name="previousGrade"
            label={t("fields.previousGrade")}
          >
            {(field) => (
              <Input
                id="previousGrade"
                placeholder={t("placeholders.previousGrade")}
                {...field}
                value={(field.value as string) || ""}
              />
            )}
          </FormField>
        </div>
      </div>
    </Card>
  );
}
