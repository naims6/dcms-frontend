import { apiClient } from "@/lib/apiClient";
import {
  AuthData,
  ChangePasswordCredentials,
  LoginCredentials,
  User,
} from "@/types/auth.types";

/**
 * User Login
 * POST /auth/login
 */
export async function loginApi(credentials: LoginCredentials): Promise<AuthData> {
  const data = await apiClient.post<AuthData>("/auth/login", {
    email: credentials.email,
    password: credentials.password,
  });

  return data;
}

/**
 * Get Current User Profile & Permissions (Auth Hydration)
 * GET /auth/me
 */
export async function getMeApi(): Promise<User> {
  return apiClient.get<User>("/auth/me");
}

/**
 * Refresh Access Token
 * POST /auth/refresh
 */
export async function refreshApi(refreshToken?: string): Promise<{ accessToken: string; refreshToken?: string }> {
  const res = await apiClient.post<{ accessToken: string; refreshToken?: string }>(
    "/auth/refresh",
    refreshToken ? { refreshToken } : undefined
  );

  return res;
}

/**
 * Change Password
 * POST /auth/change-password
 */
export async function changePasswordApi(credentials: ChangePasswordCredentials): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>("/auth/change-password", credentials);
}

/**
 * Logout
 * POST /auth/logout
 */
export async function logoutApi(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } catch {
    // Silent catch for logout transport teardown
  }
}
