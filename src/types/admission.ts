import { AdmissionFormValues } from "@/schemas/admissions";
import { Control } from "react-hook-form";

export interface AcademicInformationProps {
  control: Control<AdmissionFormValues>;
}

export interface AdditionalInformationProps {
  control: Control<AdmissionFormValues>;
}

export interface ContactInformationProps {
  control: Control<AdmissionFormValues>;
}

export interface ParentInformationProps {
  control: Control<AdmissionFormValues>;
}

export interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

export interface StudentInformationProps {
  control: Control<AdmissionFormValues>;
  photoFileName: string;
  onPhotoChange: (fileName: string) => void;
}
