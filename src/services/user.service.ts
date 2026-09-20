import { apiClient } from "@/lib/apiClient";
import { PaginatedUsersResponse, UserWithRoles } from "@/types/rbac.types";

export interface GetUsersQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  role?: string;
}

/**
 * Get Paginated List of System Users
 * GET /users
 */
export async function getUsersApi(
  params?: GetUsersQueryParams,
): Promise<PaginatedUsersResponse | UserWithRoles[]> {
  const optionsParams: Record<string, string> = {};
  if (params?.page) optionsParams.page = String(params.page);
  if (params?.limit) optionsParams.limit = String(params.limit);
  if (params?.status) optionsParams.status = params.status;
  if (params?.role) optionsParams.role = params.role;

  const res = await apiClient.get<PaginatedUsersResponse | UserWithRoles[]>("/users", {
    params: Object.keys(optionsParams).length > 0 ? optionsParams : undefined,
  });

  return res;
}

/**
 * Get Full User Details by ID (profile + embedded roles + student/teacher sub-profiles)
 * GET /users/:id
 */
export async function getUserByIdApi(id: string): Promise<UserWithRoles> {
  return apiClient.get<UserWithRoles>(`/users/${id}`);
}

/**
 * Update User Profile (firstName, lastName, email, phone)
 * PATCH /users/:id
 */
export async function updateUserApi(
  id: string,
  dto: { firstName?: string; lastName?: string; email?: string; phone?: string },
): Promise<UserWithRoles> {
  return apiClient.patch<UserWithRoles>(`/users/${id}`, dto);
}

/**
 * Change User Status (ACTIVE | INACTIVE | SUSPENDED)
 * PATCH /users/:id/status
 */
export async function changeUserStatusApi(
  id: string,
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED",
): Promise<{ id: string; status: string }> {
  return apiClient.patch<{ id: string; status: string }>(`/users/${id}/status`, { status });
}

/**
 * Assign Role to User
 * POST /users/:id/roles
 */
export async function assignUserRoleApi(
  userId: string,
  roleId: string,
): Promise<{ userId: string; roles: Array<string | { id: string; name: string }> }> {
  return apiClient.post(`/users/${userId}/roles`, { roleId });
}

/**
 * Revoke Role from User
 * DELETE /users/:id/roles/:roleId
 */
export async function revokeUserRoleApi(
  userId: string,
  roleId: string,
): Promise<{ userId: string; roles: Array<string | { id: string; name: string }> }> {
  return apiClient.delete(`/users/${userId}/roles/${roleId}`);
}
