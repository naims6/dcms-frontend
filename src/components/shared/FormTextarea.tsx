"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormError } from "@/hooks/use-form-error";

interface FormTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function FormTextarea({
  name,
  label,
  placeholder,
  required,
  className,
}: FormTextareaProps) {
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
      <Textarea
        id={name}
        placeholder={placeholder}
        className="resize-none"
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
