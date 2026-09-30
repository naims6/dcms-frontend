"use client";

import { useTranslations } from "next-intl";
import { MapPin, Mail, Phone } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { FormSection } from "@/components/shared/FormSection";
import { FormInput } from "@/components/shared/FormInput";
import { FormTextarea } from "@/components/shared/FormTextarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function ContactInformation() {
  const t = useTranslations("admissions");
  const { control, watch } = useFormContext();
  const sameAsPresent = watch("sameAsPresentAddress");

  return (
    <FormSection
      icon={MapPin}
      title={t("sections.contact.title")}
      description={t("sections.contact.description")}
    >
      <div className="space-y-6">
        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
          <div>
            <FormInput
              name="email"
              label={t("fields.email")}
              type="email"
              placeholder={t("placeholders.email")}
              required
            />
            <p className="text-xs text-primary font-medium mt-1 flex items-center gap-1">
              <Mail className="h-3 w-3 inline" />
              Verification OTP will be sent to this email address.
            </p>
          </div>

          <div>
            <FormInput
              name="phone"
              label={t("fields.phone")}
              placeholder="+880 1700 000000"
              required
            />
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Phone className="h-3 w-3 inline" />
              Primary SMS and admission notifications.
            </p>
          </div>
        </div>

        {/* Present Address */}
        <div className="p-4 rounded-lg bg-background/50 border border-border/30 space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Present Address
          </h4>
          <FormTextarea
            name="presentStreetAddress"
            label="Street Address / House & Road"
            placeholder={t("placeholders.address") || "e.g. House 12, Road 5, Block B"}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormInput
              name="presentUpazila"
              label="Upazila / Thana"
              placeholder="e.g. Mirpur"
              required
            />
            <FormInput
              name="presentDistrict"
              label="District"
              placeholder="e.g. Dhaka"
              required
            />
            <FormInput
              name="presentDivision"
              label="Division"
              placeholder="e.g. Dhaka"
              required
            />
            <FormInput
              name="presentPostCode"
              label="Postal Code"
              placeholder="e.g. 1216"
            />
          </div>
        </div>

        {/* Same as present address checkbox */}
        <div className="flex items-center space-x-2 pt-1">
          <Controller
            control={control}
            name="sameAsPresentAddress"
            render={({ field }) => (
              <Checkbox
                id="sameAsPresent"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(!!checked)}
              />
            )}
          />
          <Label htmlFor="sameAsPresent" className="cursor-pointer text-sm font-medium">
            Permanent Address is the same as Present Address
          </Label>
        </div>

        {/* Permanent Address if different */}
        {!sameAsPresent && (
          <div className="p-4 rounded-lg bg-background/50 border border-border/30 space-y-4 animate-in fade-in duration-200">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Permanent Address
            </h4>
            <FormTextarea
              name="permanentStreetAddress"
              label="Permanent Street Address"
              placeholder="e.g. Village, Post Office, Road"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormInput
                name="permanentUpazila"
                label="Upazila / Thana"
                placeholder="e.g. Mirpur"
              />
              <FormInput
                name="permanentDistrict"
                label="District"
                placeholder="e.g. Dhaka"
              />
              <FormInput
                name="permanentDivision"
                label="Division"
                placeholder="e.g. Dhaka"
              />
              <FormInput
                name="permanentPostCode"
                label="Postal Code"
                placeholder="e.g. 1216"
              />
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
}
