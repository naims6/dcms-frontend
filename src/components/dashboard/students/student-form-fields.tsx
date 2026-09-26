"use client";

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ── Field shell (label + control + error) ─────────────────────────────────
interface FieldShellProps {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  htmlFor?: string;
  children: React.ReactNode;
}

export function FieldShell({
  label,
  required,
  error,
  className,
  htmlFor,
  children,
}: FieldShellProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-xs font-semibold">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-destructive">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ── Text / number / date input ────────────────────────────────────────────
interface TextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  autoComplete?: string;
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  required,
  disabled,
  className,
  inputClassName,
  autoComplete,
}: TextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldShell
          label={label}
          required={required}
          error={fieldState.error?.message as string | undefined}
          className={className}
          htmlFor={name}
        >
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            aria-invalid={!!fieldState.error}
            className={cn(
              "h-10 text-sm",
              fieldState.error && "border-destructive",
              inputClassName
            )}
            {...field}
            value={field.value ?? ""}
          />
        </FieldShell>
      )}
    />
  );
}

// ── Select ────────────────────────────────────────────────────────────────
export interface SelectFieldOption {
  value: string;
  label: string;
}

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: SelectFieldOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Select",
  required,
  disabled,
  className,
}: SelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldShell
          label={label}
          required={required}
          error={fieldState.error?.message as string | undefined}
          className={className}
          htmlFor={name}
        >
          <Select
            onValueChange={field.onChange}
            value={field.value || undefined}
            disabled={disabled}
          >
            <SelectTrigger id={name} className="h-10 text-sm" aria-invalid={!!fieldState.error}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-sm">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldShell>
      )}
    />
  );
}

// ── Option builders (keep the enum → label mapping in one place) ──────────
export const toOptions = (values: readonly string[]): SelectFieldOption[] =>
  values.map((v) => ({ value: v, label: v.replace(/_/g, " ") }));
