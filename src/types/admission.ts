export interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

export interface StudentInformationProps {
  photoFileName: string;
  onPhotoChange: (fileName: string) => void;
}
