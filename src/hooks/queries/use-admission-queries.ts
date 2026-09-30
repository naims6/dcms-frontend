import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  getAdminApplicationsApi,
  getAdminApplicationByIdApi,
  acceptAdminApplicationApi,
  rejectAdminApplicationApi,
} from "@/services/admission.service";
import type {
  GetAdminApplicationsQueryParams,
  RejectApplicationDto,
} from "@/types/admission";

/**
 * GET /admission/admin/applications — paginated list with optional status/search filters
 */
export function useAdminApplicationsQuery(
  params?: GetAdminApplicationsQueryParams,
) {
  return useQuery({
    queryKey: queryKeys.admissions.list(params as Record<string, unknown>),
    queryFn: () => getAdminApplicationsApi(params),
  });
}

/**
 * GET /admission/admin/applications/:id — single application + payment details
 */
export function useAdminApplicationDetailQuery(id: string | null) {
  return useQuery({
    queryKey: queryKeys.admissions.detail(id ?? ""),
    queryFn: () => getAdminApplicationByIdApi(id!),
    enabled: Boolean(id),
  });
}

/**
 * PATCH /admission/admin/applications/:id/accept — accept application & enroll student
 */
export function useAcceptApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => acceptAdminApplicationApi(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.admissions.all });
      qc.invalidateQueries({ queryKey: queryKeys.admissions.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.students.all });
    },
  });
}

/**
 * PATCH /admission/admin/applications/:id/reject — reject application with reason
 */
export function useRejectApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: RejectApplicationDto }) =>
      rejectAdminApplicationApi(id, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.admissions.all });
      qc.invalidateQueries({ queryKey: queryKeys.admissions.detail(id) });
    },
  });
}
