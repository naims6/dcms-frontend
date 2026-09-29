export type Gender = "MALE" | "FEMALE" | "OTHER";

export type BloodGroup =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE";

export type Religion = "ISLAM" | "HINDU" | "CHRISTIAN" | "OTHER";

export type PaymentProvider = "SSLCOMMERZ" | "BKASH" | "NAGAD" | "MANUAL";

export type ApplicationStatus =
  | "PENDING_EMAIL_VERIFICATION"
  | "EMAIL_VERIFIED"
  | "PAYMENT_PENDING"
  | "SUBMITTED_FOR_REVIEW"
  | "ADMITTED"
  | "REJECTED";

export interface ApplyAdmissionResponse {
  applicationNo: string;
  email: string;
  status: ApplicationStatus;
  message: string;
}

export interface VerifyEmailDto {
  email: string;
  otp: string;
}

export interface VerifyEmailResponse {
  applicationNo: string;
  email: string;
  status: ApplicationStatus;
  admissionFee: number;
  currency: string;
  message: string;
}

export interface ResendOtpDto {
  email: string;
}

export interface InitiateAdmissionPaymentDto {
  email: string;
  provider?: PaymentProvider;
}

export interface InitiateAdmissionPaymentResponse {
  applicationNo: string;
  email: string;
  tranId: string;
  gatewayUrl: string;
}

export interface AdmissionReceipt {
  receiptNo: string;
  applicationNo: string;
  email: string;
  applicationStatus: string;
  reviewStatus: string;
  applicant: {
    fullName: string;
    email: string;
    phone: string;
    fatherName: string;
    motherName: string;
    photoUrl?: string;
    targetClassId: string;
  };
  payment: {
    tranId: string;
    bankTranId?: string;
    cardType?: string;
    provider: string;
    amount: number;
    currency: string;
    paidAt: string;
    status: string;
  };
  issuedAt: string;
  verificationCode: string;
}

export interface ApplicationStatusResponse {
  id: string;
  applicationNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photoUrl?: string;
  status: ApplicationStatus;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

export interface StudentInformationProps {
  photoFile: File | null;
  photoPreview: string | null;
  onPhotoSelect: (file: File | null) => void;
}
