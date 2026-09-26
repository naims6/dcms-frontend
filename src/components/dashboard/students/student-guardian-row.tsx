"use client";

import type { Control } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField, SelectField, toOptions } from "./student-form-fields";
import { RELATIONSHIP_OPTIONS, type StudentFormValues } from "@/schemas/student.schema";

const RELATIONSHIP_FIELD_OPTIONS = toOptions(RELATIONSHIP_OPTIONS);

interface GuardianRowProps {
  control: Control<StudentFormValues>;
  index: number;
  isPending: boolean;
  onRemove: () => void;
}

export function GuardianRow({ control, index, isPending, onRemove }: GuardianRowProps) {
  return (
    <div className="space-y-4 rounded-lg border border-border/70 bg-muted/20 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Guardian {index + 1}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs text-destructive hover:text-destructive"
          onClick={onRemove}
          disabled={isPending}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          control={control}
          name={`guardians.${index}.name`}
          label="Name"
          placeholder="e.g. Abdul Rahman"
        />
        <SelectField
          control={control}
          name={`guardians.${index}.relationship`}
          label="Relationship"
          options={RELATIONSHIP_FIELD_OPTIONS}
        />
        <TextField
          control={control}
          name={`guardians.${index}.phone`}
          label="Phone"
          type="tel"
          placeholder="e.g. +8801XXXXXXXXX"
        />
        <TextField
          control={control}
          name={`guardians.${index}.email`}
          label="Email"
          type="email"
          placeholder="e.g. abdul@example.com"
        />
        <TextField
          control={control}
          name={`guardians.${index}.occupation`}
          label="Occupation"
          placeholder="e.g. Farmer"
        />
        <TextField
          control={control}
          name={`guardians.${index}.address`}
          label="Address"
          placeholder="e.g. Dhanbari, Tangail"
        />
      </div>
    </div>
  );
}
