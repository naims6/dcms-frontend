"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthState, LoginCredentials, User } from "@/types/auth.types";
import { getMeApi, loginApi, logoutApi } from "@/services/auth.service";


export const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const extractLocale = useCallback(() => {
    if (!pathname) return "en";
    const segments = pathname.split("/");
    return segments[1] && (segments[1] === "en" || segments[1] === "bn")
      ? segments[1]
      : "en";
  }, [pathname]);

  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      try {
        const currentUser = await getMeApi();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const data = await loginApi(credentials);
      setUser(data.user);
      const locale = extractLocale();
      router.push(`/${locale}/dashboard`);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutApi();
    } catch {
      // ignore logout errors
    } finally {
      setUser(null);
      setIsLoading(false);
      const locale = extractLocale();
      router.push(`/${locale}/login`);
    }
  };

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      return user.permissions?.includes(permission) ?? false;
    },
    [user],
  );

  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      if (!user) return false;
      return permissions.some((p) => user.permissions?.includes(p));
    },
    [user],
  );

  return (
    <AuthContext
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
        hasAnyPermission,
      }}
    >
      {children}
    </AuthContext>
  );
}
