import { useTranslations } from "next-intl";
import { Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Control } from "react-hook-form";
import { AdmissionFormValues } from "@/schemas/admissions";
import { SectionHeader } from "./section-header";
import { FormField } from "@/components/shared/FormField";

interface ParentInformationProps {
  control: Control<AdmissionFormValues>;
}

export function ParentInformation({ control }: ParentInformationProps) {
  const t = useTranslations("admissions");

  return (
    <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-linear-to-br from-background via-background to-secondary/5">
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-linear-to-br from-secondary/10 to-transparent blur-2xl -mr-16 -mt-16" />

      <div className="relative p-6 sm:p-8 z-10">
        <SectionHeader
          icon={Users}
          title={t("sections.parent.title")}
          description={t("sections.parent.description")}
        />

        <div className="space-y-8">
          {/* Father Information */}
          <div className="bg-background/50 rounded-lg p-6 border border-border/30">
            <h4 className="text-base font-semibold text-foreground mb-6 pb-3 border-b-2 border-primary/30">
              {t("sections.fatherInfo")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="fatherName"
                label={t("fields.name")}
                required
              >
                {(field) => (
                  <Input
                    id="fatherName"
                    placeholder={t("placeholders.fatherName")}
                    {...field}
                  />
                )}
              </FormField>

              <FormField
                control={control}
                name="fatherOccupation"
                label={t("fields.occupation")}
              >
                {(field) => (
                  <Input
                    id="fatherOccupation"
                    placeholder={t("placeholders.occupation")}
                    {...field}
                  />
                )}
              </FormField>

              <FormField
                control={control}
                name="fatherPhone"
                label={t("fields.phone")}
                required
              >
                {(field) => (
                  <Input
                    id="fatherPhone"
                    placeholder={t("placeholders.phone")}
                    {...field}
                  />
                )}
              </FormField>
            </div>
          </div>

          {/* Mother Information */}
          <div className="bg-background/50 rounded-lg p-6 border border-border/30">
            <h4 className="text-base font-semibold text-foreground mb-6 pb-3 border-b-2 border-secondary/30">
              {t("sections.motherInfo")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="motherName"
                label={t("fields.name")}
                required
              >
                {(field) => (
                  <Input
                    id="motherName"
                    placeholder={t("placeholders.motherName")}
                    {...field}
                  />
                )}
              </FormField>

              <FormField
                control={control}
                name="motherOccupation"
                label={t("fields.occupation")}
              >
                {(field) => (
                  <Input
                    id="motherOccupation"
                    placeholder={t("placeholders.occupation")}
                    {...field}
                  />
                )}
              </FormField>

              <FormField
                control={control}
                name="motherPhone"
                label={t("fields.phone")}
                required
              >
                {(field) => (
                  <Input
                    id="motherPhone"
                    placeholder={t("placeholders.phone")}
                    {...field}
                  />
                )}
              </FormField>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
