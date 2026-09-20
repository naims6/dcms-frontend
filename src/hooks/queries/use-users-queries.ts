import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsersApi,
  getUserByIdApi,
  assignUserRoleApi,
  revokeUserRoleApi,
  changeUserStatusApi,
  GetUsersQueryParams,
} from "@/services/user.service";
import { queryKeys } from "@/lib/query-keys";

/**
 * Fetch list of users with optional filtering parameters
 */
export function useUsersQuery(params?: GetUsersQueryParams) {
  return useQuery({
    queryKey: queryKeys.users.list(params as Record<string, unknown>),
    queryFn: async () => {
      const res = await getUsersApi(params);
      return Array.isArray(res) ? res : res.data || [];
    },
  });
}

/**
 * Fetch detailed profile for a specific user ID
 */
export function useUserDetailQuery(userId: string | null) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId || ""),
    queryFn: () => getUserByIdApi(userId!),
    enabled: Boolean(userId),
  });
}

/**
 * Assign a role to a user
 */
export function useAssignUserRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      assignUserRoleApi(userId, roleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.userId) });
    },
  });
}

/**
 * Revoke a role from a user
 */
export function useRevokeUserRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      revokeUserRoleApi(userId, roleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.userId) });
    },
  });
}

/**
 * Change status (ACTIVE, INACTIVE, SUSPENDED) for a user
 */
export function useChangeUserStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "INACTIVE" | "SUSPENDED" }) =>
      changeUserStatusApi(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
    },
  });
}
