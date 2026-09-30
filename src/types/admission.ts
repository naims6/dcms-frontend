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

// ── Admin / Dashboard Admission Types ──────────────────────────────────────────

export interface AdminAdmissionApplication {
  id: string;
  applicationNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  bloodGroup?: BloodGroup | null;
  religion?: Religion | null;
  nationality?: string | null;
  nationalIdOrBirthReg?: string | null;
  photoUrl?: string | null;
  photoKey?: string | null;
  fatherName?: string | null;
  fatherPhone?: string | null;
  fatherOccupation?: string | null;
  fatherNid?: string | null;
  motherName?: string | null;
  motherPhone?: string | null;
  motherOccupation?: string | null;
  motherNid?: string | null;
  localGuardianName?: string | null;
  localGuardianPhone?: string | null;
  localGuardianRelation?: string | null;
  localGuardianAddress?: string | null;
  presentStreetAddress?: string | null;
  presentUpazila?: string | null;
  presentDistrict?: string | null;
  presentDivision?: string | null;
  presentPostCode?: string | null;
  sameAsPresentAddress?: boolean;
  permanentStreetAddress?: string | null;
  permanentUpazila?: string | null;
  permanentDistrict?: string | null;
  permanentDivision?: string | null;
  permanentPostCode?: string | null;
  targetClassId: string;
  previousSchoolName?: string | null;
  previousClass?: string | null;
  previousGpa?: string | null;
  previousBoardRoll?: string | null;
  previousPassingYear?: number | null;
  status: ApplicationStatus;
  isEmailVerified: boolean;
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdStudentId?: string | null;
  paymentTransactionId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAdmissionPayment {
  id: string;
  tranId: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  paidAt?: string | null;
}

export interface AdminAdmissionDetailData {
  application: AdminAdmissionApplication;
  payment: AdminAdmissionPayment | null;
}

export interface GetAdminApplicationsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ApplicationStatus;
}

export interface PaginatedAdminApplicationsResponse {
  data: AdminAdmissionApplication[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AcceptApplicationResponseData {
  message: string;
  studentId: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RejectApplicationDto {
  reason: string;
}

export interface RejectApplicationResponseData {
  message: string;
  applicationNo: string;
  status: ApplicationStatus;
  rejectionReason: string;
}
