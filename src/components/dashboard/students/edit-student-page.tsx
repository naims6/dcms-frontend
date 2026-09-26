"use client";

import { useStudentDetailQuery } from "@/hooks/queries/use-student-queries";
import { StudentFormPage } from "@/components/dashboard/students/student-form-page";
import { Loader2 } from "lucide-react";

interface Props {
  id: string;
}

export function EditStudentPage({ id }: Props) {
  const { data: student, isLoading, isError } = useStudentDetailQuery(id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !student) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Unable to load this student.
      </div>
    );
  }

  // key ensures react-hook-form initialises its default values from the loaded record
  return <StudentFormPage key={student.id} mode="edit" student={student} />;
}
