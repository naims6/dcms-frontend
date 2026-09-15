import { useState } from "react";
import { AdmissionFormValues } from "@/schemas/admissions";
import { apiClient } from "@/lib/apiClient";

export function useAdmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFileName, setPhotoFileName] = useState<string>("");

  const onSubmit = async (data: AdmissionFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.post<{ message?: string }>("/admissions", data);

      console.log("Form submitted successfully:", response);
      return {
        success: true,
        message: response?.message || "Application submitted successfully!",
      };
    } catch (error: unknown) {
      console.error("Submission error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Submission failed. Please try again.";
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    setIsSubmitting,
    photoFileName,
    setPhotoFileName,
    onSubmit,
  };
}
