"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormError } from "@/hooks/use-form-error";

interface FormInputProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
}

export function FormInput({
  name,
  label,
  placeholder,
  type = "text",
  required,
  className,
}: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const getErrorMessage = useFormError();

  const error = errors[name];

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
      />
      {error?.message && (
        <p className="text-sm text-destructive">
          {getErrorMessage(error.message as string)}
        </p>
      )}
    </div>
  );
}
