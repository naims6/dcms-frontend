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
  AdminAdmissionApplication,
  AdminAdmissionDetailData,
  GetAdminApplicationsQueryParams,
  PaginatedAdminApplicationsResponse,
  AcceptApplicationResponseData,
  RejectApplicationDto,
  RejectApplicationResponseData,
} from "@/types/admission";

/** Convert a params object to a Record<string, string>, skipping undefined values. */
function toQuery(
  params: Record<string, string | number | undefined>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)]),
  ) as Record<string, string>;
}

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

// ── Dashboard / Admin APIs ───────────────────────────────────────────────────

/**
 * Admin: List All Applications
 * GET /api/v1/admission/admin/applications
 */
export async function getAdminApplicationsApi(
  params?: GetAdminApplicationsQueryParams,
): Promise<PaginatedAdminApplicationsResponse> {
  const query = toQuery({
    page: params?.page,
    limit: params?.limit,
    search: params?.search,
    status: params?.status,
  });

  const raw = await apiClient.getRaw<{
    data: AdminAdmissionApplication[];
    meta: PaginatedAdminApplicationsResponse["meta"];
  }>("/admission/admin/applications", {
    params: Object.keys(query).length ? query : undefined,
  });

  return {
    data: raw.data ?? [],
    meta: raw.meta ?? { page: 1, limit: 10, total: 0, totalPages: 1 },
  };
}

/**
 * Admin: View Application Details
 * GET /api/v1/admission/admin/applications/:id
 */
export async function getAdminApplicationByIdApi(
  id: string,
): Promise<AdminAdmissionDetailData> {
  return apiClient.get<AdminAdmissionDetailData>(
    `/admission/admin/applications/${encodeURIComponent(id)}`,
  );
}

/**
 * Admin: Accept Application & Enroll Student
 * PATCH /api/v1/admission/admin/applications/:id/accept
 */
export async function acceptAdminApplicationApi(
  id: string,
): Promise<AcceptApplicationResponseData> {
  return apiClient.patch<AcceptApplicationResponseData>(
    `/admission/admin/applications/${encodeURIComponent(id)}/accept`,
  );
}

/**
 * Admin: Reject Application
 * PATCH /api/v1/admission/admin/applications/:id/reject
 */
export async function rejectAdminApplicationApi(
  id: string,
  dto: RejectApplicationDto,
): Promise<RejectApplicationResponseData> {
  return apiClient.patch<RejectApplicationResponseData>(
    `/admission/admin/applications/${encodeURIComponent(id)}/reject`,
    dto,
  );
}
