"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { User, CalendarIcon, Upload, X, ImageIcon } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormSection } from "@/components/shared/FormSection";
import { FormInput } from "@/components/shared/FormInput";
import { FormSelect, type SelectOption } from "@/components/shared/FormSelect";
import { useFormError } from "@/hooks/use-form-error";
import { cn } from "@/lib/utils";
import { StudentInformationProps } from "@/types/admission";


export function StudentInformation({
  photoFileName,
  onPhotoChange,
}: StudentInformationProps) {
  const t = useTranslations("admissions");
  const {
    setValue,
    control,
    formState: { errors },
  } = useFormContext();
  const getErrorMessage = useFormError();

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // ── Photo handlers ───────────────────────────────────────────────
  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      onPhotoChange(file.name);
      setValue("studentPhoto", file.name, { shouldValidate: true });

      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    },
    [onPhotoChange, setValue],
  );

  const removePhoto = useCallback(() => {
    setPhotoPreview(null);
    onPhotoChange("");
    setValue("studentPhoto", "", { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [onPhotoChange, setValue]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <FormSection
      icon={User}
      title={t("sections.student.title")}
      description={t("sections.student.description")}
      accentColor="secondary"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Full Name ──────────────────────────────────────── */}
        <div className="md:col-span-2">
          <FormInput
            name="fullName"
            label={t("fields.fullName")}
            placeholder={t("placeholders.fullName")}
            required
          />
        </div>

        {/* ── Date of Birth (Calendar Picker) ────────────────── */}
        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field, fieldState }) => {
            const selectedDate = field.value ? new Date(field.value) : undefined;

            return (
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  {t("fields.dateOfBirth")}
                  <span className="text-destructive ml-0.5">*</span>
                </Label>

                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="dateOfBirth"
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-9",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-60" />
                      {field.value
                        ? format(new Date(field.value), "PPP")
                        : t("fields.dateOfBirth")}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(format(date, "yyyy-MM-dd"));
                          setDateOpen(false);
                        }
                      }}
                      defaultMonth={selectedDate ?? new Date(2010, 0)}
                      startMonth={new Date(1990, 0)}
                      endMonth={new Date()}
                      disabled={{ after: new Date() }}
                    />
                  </PopoverContent>
                </Popover>

                {fieldState.error?.message && (
                  <p className="text-sm text-destructive">
                    {getErrorMessage(fieldState.error.message)}
                  </p>
                )}
              </div>
            );
          }}
        />

        {/* ── Gender ─────────────────────────────────────────── */}
        <FormSelect
          name="gender"
          label={t("fields.gender")}
          placeholder={t("placeholders.selectGender")}
          options={genderOptions}
          required
        />

        {/* ── Blood Group ────────────────────────────────────── */}
        <FormSelect
          name="bloodGroup"
          label={t("fields.bloodGroup")}
          placeholder={t("placeholders.selectBloodGroup")}
          options={bloodGroupOptions}
          required
        />

        {/* ── Religion ───────────────────────────────────────── */}
        <FormSelect
          name="religion"
          label={t("fields.religion")}
          placeholder={t("placeholders.selectReligion")}
          options={religionOptions}
          required
        />

        {/* ── Student Photo (Drag & Drop + Preview) ──────────── */}
        <div className="md:col-span-2 space-y-2">
          <Label>
            {t("fields.studentPhoto")}
            <span className="text-destructive ml-0.5">*</span>
          </Label>

          {photoPreview ? (
            /* ── Preview state ─────────────────────────────── */
            <div className="relative flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4 transition-colors">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border shadow-sm">
                <img
                  src={photoPreview}
                  alt="Student"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-sm font-medium truncate">{photoFileName}</p>
                <p className="text-xs text-muted-foreground">
                  {t("fields.studentPhoto")}
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                onClick={removePhoto}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            /* ── Drop zone ─────────────────────────────────── */
            <div
              role="button"
              tabIndex={0}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 cursor-pointer transition-all duration-200",
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40",
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-200",
                  isDragging
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                )}
              >
                {isDragging ? (
                  <ImageIcon className="h-5 w-5" />
                ) : (
                  <Upload className="h-5 w-5" />
                )}
              </div>

              <div className="text-center">
                <p className="text-sm font-medium">
                  {isDragging ? (
                    <span className="text-primary">
                      {t("placeholders.chooseFile")}
                    </span>
                  ) : (
                    <>
                      <span className="text-primary underline underline-offset-4">
                        {t("placeholders.chooseFile")}
                      </span>
                    </>
                  )}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PNG, JPG, WEBP • max 1 MB
                </p>
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

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
