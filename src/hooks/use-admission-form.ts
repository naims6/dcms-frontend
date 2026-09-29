import { useState } from "react";
import { type AdmissionFormValues } from "@/schemas/admissions";
import { applyAdmissionApi } from "@/services/admission.service";
import type { ApplyAdmissionResponse } from "@/types/admission";

export function useAdmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoSelect = (file: File | null) => {
    setPhotoFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    } else {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
  };

  const onSubmit = async (
    data: AdmissionFormValues,
  ): Promise<{
    success: boolean;
    data?: ApplyAdmissionResponse;
    message?: string;
  }> => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append file if selected
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      // Strip frontend-only fields — backend DTO does not accept these
      const { confirmPassword: _confirmPassword, agreeTerms: _agreeTerms, ...backendData } = data;

      // Append all backend-safe form values
      Object.entries(backendData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, String(value));
        }
      });

      const response = await applyAdmissionApi(formData);

      return {
        success: true,
        data: response,
        message:
          response?.message ||
          "Application submitted successfully! Please check your email for the verification OTP.",
      };
    } catch (error: unknown) {
      console.error("Admission submission error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Submission failed. Please check the fields and try again.";
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
    photoFile,
    photoPreview,
    onPhotoSelect: handlePhotoSelect,
    onSubmit,
  };
}
