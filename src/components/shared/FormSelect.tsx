"use client";

import { useFormContext, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormError } from "@/hooks/use-form-error";

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  required?: boolean;
  className?: string;
}

export function FormSelect({
  name,
  label,
  placeholder,
  options,
  required,
  className,
}: FormSelectProps) {
  const { control } = useFormContext();
  const getErrorMessage = useFormError();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn("space-y-2", className)}>
          <Label htmlFor={name}>
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </Label>
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
