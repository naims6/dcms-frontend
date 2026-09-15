import { apiClient } from "@/lib/apiClient";
import { AuthData, LoginCredentials, User } from "@/types/auth.types";

/**
 * Auth Service using unified apiClient
 */

export async function loginApi(credentials: LoginCredentials): Promise<AuthData> {
  return apiClient.post<AuthData>("/auth/login", {
    email: credentials.email,
    password: credentials.password,
  });
}

export async function getMeApi(): Promise<User> {
  return apiClient.get<User>("/auth/me");
}

export async function logoutApi(): Promise<void> {
  return apiClient.post("/auth/logout");
}
