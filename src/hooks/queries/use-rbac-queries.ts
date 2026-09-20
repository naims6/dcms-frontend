import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRolesApi,
  getRoleByIdApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
  getPermissionsApi,
} from "@/services/rbac.service";
import { queryKeys } from "@/lib/query-keys";
import { CreateRoleDto, UpdateRoleDto } from "@/types/rbac.types";

/**
 * Fetch list of system roles
 */
export function useRolesQuery() {
  return useQuery({
    queryKey: queryKeys.rbac.roles(),
    queryFn: getRolesApi,
  });
}

/**
 * Fetch list of system permissions
 */
export function usePermissionsQuery() {
  return useQuery({
    queryKey: queryKeys.rbac.permissions(),
    queryFn: getPermissionsApi,
  });
}

/**
 * Fetch role details by ID
 */
export function useRoleDetailQuery(roleId: string | null) {
  return useQuery({
    queryKey: queryKeys.rbac.roleDetail(roleId || ""),
    queryFn: () => getRoleByIdApi(roleId!),
    enabled: Boolean(roleId),
  });
}

/**
 * Create a new system role
 */
export function useCreateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateRoleDto) => createRoleApi(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rbac.all });
    },
  });
}

/**
 * Update an existing system role
 */
export function useUpdateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateRoleDto }) => updateRoleApi(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rbac.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.rbac.roleDetail(variables.id) });
    },
  });
}

/**
 * Delete a system role
 */
export function useDeleteRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: string) => deleteRoleApi(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rbac.all });
    },
  });
}
