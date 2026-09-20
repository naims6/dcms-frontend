import { apiClient } from "@/lib/apiClient";
import { CreateRoleDto, Permission, Role, UpdateRoleDto } from "@/types/rbac.types";

/**
 * Get All System Roles
 * GET /rbac/roles
 */
export async function getRolesApi(): Promise<Role[]> {
  return apiClient.get<Role[]>("/rbac/roles");
}

/**
 * Get Role By ID
 * GET /rbac/roles/:id
 */
export async function getRoleByIdApi(id: string): Promise<Role> {
  return apiClient.get<Role>(`/rbac/roles/${id}`);
}

/**
 * Create New Role
 * POST /rbac/roles
 */
export async function createRoleApi(dto: CreateRoleDto): Promise<Role> {
  return apiClient.post<Role>("/rbac/roles", dto);
}

/**
 * Update Role & Assign Permissions
 * PATCH /rbac/roles/:id
 */
export async function updateRoleApi(id: string, dto: UpdateRoleDto): Promise<Role> {
  return apiClient.patch<Role>(`/rbac/roles/${id}`, dto);
}

/**
 * Delete Role
 * DELETE /rbac/roles/:id
 */
export async function deleteRoleApi(id: string): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(`/rbac/roles/${id}`);
}

/**
 * Get All System Permissions
 * GET /rbac/permissions
 */
export async function getPermissionsApi(): Promise<Permission[]> {
  return apiClient.get<Permission[]>("/rbac/permissions");
}
