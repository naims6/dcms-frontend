import { useState } from "react";
import { AdmissionFormValues } from "@/schemas/admissions";

export function useAdmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFileName, setPhotoFileName] = useState<string>("");

  const onSubmit = async (data: AdmissionFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      // Example: const response = await fetch('/api/admissions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Form submitted:", data);
      return {
        success: true,
        message: "Application submitted successfully!",
      };
    } catch (error) {
      console.error("Submission error:", error);
      return {
        success: false,
        message: "Submission failed. Please try again.",
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
