"use client";

import React, { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "@/context/auth-context";
import { LoginCredentials, User } from "@/types/auth.types";
import { getMeApi, loginApi, logoutApi } from "@/services/auth.service";
import { queryKeys } from "@/lib/query-keys";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const extractLocale = useCallback(() => {
    if (!pathname) return "en";
    const segments = pathname.split("/");
    return segments[1] && (segments[1] === "en" || segments[1] === "bn")
      ? segments[1]
      : "en";
  }, [pathname]);

  // Current Auth User Query managed by TanStack Query
  const {
    data: user = null,
    isLoading,
    refetch: fetchCurrentUserRefetch,
  } = useQuery<User | null>({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      try {
        return await getMeApi();
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    retry: false,
  });

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginApi(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.me(), data.user);
      const locale = extractLocale();
      router.push(`/${locale}/dashboard`);
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: () => logoutApi(),
    onSettled: () => {
      queryClient.clear();
      const locale = extractLocale();
      router.push(`/${locale}/login`);
    },
  });

  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const fetchCurrentUser = useCallback(async () => {
    await fetchCurrentUserRefetch();
  }, [fetchCurrentUserRefetch]);

  /**
   * Permission Helper:
   * Returns true if user is ADMIN, has wildcard '*', or possesses specific permission string
   */
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user || !user.permissions) return false;
      if (user.roles?.includes("ADMIN") || user.permissions.includes("*")) {
        return true;
      }
      return user.permissions.includes(permission);
    },
    [user],
  );

  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      if (!user || !user.permissions) return false;
      if (user.roles?.includes("ADMIN") || user.permissions.includes("*")) {
        return true;
      }
      return permissions.some((p) => user.permissions.includes(p));
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading:
          isLoading || loginMutation.isPending || logoutMutation.isPending,
        login,
        logout,
        fetchCurrentUser,
        hasPermission,
        hasAnyPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
