"use client";

import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useFormError } from "@/hooks/use-form-error";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  required?: boolean;
  children: (field: ControllerRenderProps<T, FieldPath<T>>) => React.ReactNode;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  children,
}: FormFieldProps<T>) {
  const getErrorMessage = useFormError();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={name as string}>
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </Label>
          {children(field)}
          {fieldState.error?.message && (
            <p className="text-sm text-destructive">
              {getErrorMessage(fieldState.error.message)}
            </p>
          )}
        </div>
      )}
    />
  );
}
