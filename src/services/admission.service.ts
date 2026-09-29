import { apiClient } from "@/lib/apiClient";
import type {
  ApplyAdmissionResponse,
  VerifyEmailDto,
  VerifyEmailResponse,
  ResendOtpDto,
  InitiateAdmissionPaymentDto,
  InitiateAdmissionPaymentResponse,
  AdmissionReceipt,
  ApplicationStatusResponse,
} from "@/types/admission";

/**
 * Step 1: Submit Admission Form & Upload Photo
 */
export async function applyAdmissionApi(
  formData: FormData,
): Promise<ApplyAdmissionResponse> {
  return apiClient.postForm<ApplyAdmissionResponse>(
    "/admission/apply",
    formData,
  );
}

/**
 * Step 2: Verify applicant email via OTP
 */
export async function verifyAdmissionEmailApi(
  dto: VerifyEmailDto,
): Promise<VerifyEmailResponse> {
  return apiClient.post<VerifyEmailResponse>("/admission/verify-email", dto);
}

/**
 * Step 2 (Optional): Resend verification OTP
 */
export async function resendAdmissionOtpApi(
  dto: ResendOtpDto,
): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>("/admission/resend-otp", dto);
}

/**
 * Step 3: Initiate Payment session (SSLCommerz, bKash, etc.)
 */
export async function initiateAdmissionPaymentApi(
  dto: InitiateAdmissionPaymentDto,
): Promise<InitiateAdmissionPaymentResponse> {
  return apiClient.post<InitiateAdmissionPaymentResponse>(
    "/admission/payment/initiate",
    dto,
  );
}

/**
 * Step 4: Download / view Admission Receipt (by applicationNo or email)
 */
export async function getAdmissionReceiptApi(
  identifier: string,
): Promise<AdmissionReceipt> {
  return apiClient.get<AdmissionReceipt>(
    `/admission/receipt/${encodeURIComponent(identifier.trim())}`,
  );
}

/**
 * Check Application Status (by applicationNo or email)
 */
export async function getAdmissionStatusApi(
  identifier: string,
): Promise<ApplicationStatusResponse> {
  return apiClient.get<ApplicationStatusResponse>(
    `/admission/status/${encodeURIComponent(identifier.trim())}`,
  );
}
