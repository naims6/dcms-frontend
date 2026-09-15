import { customFetch, setAccessToken } from "@/lib/api/custom-fetch";
import { AuthData, LoginCredentials, User } from "@/types/auth.types";

/**
 * Auth Service isolating API endpoints specified in frontend.md
 */

export async function loginApi(credentials: LoginCredentials): Promise<AuthData> {
  const res = await customFetch<AuthData>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  if (res.data?.accessToken) {
    setAccessToken(res.data.accessToken);
  }

  return res.data;
}

export async function getMeApi(): Promise<User> {
  const res = await customFetch<User>("/auth/me", {
    method: "GET",
  });
  return res.data;
}

export async function refreshTokenApi(): Promise<{ accessToken: string; refreshToken?: string }> {
  const res = await customFetch<{ accessToken: string; refreshToken?: string }>("/auth/refresh", {
    method: "POST",
  });
  if (res.data?.accessToken) {
    setAccessToken(res.data.accessToken);
  }
  return res.data;
}

export async function logoutApi(): Promise<void> {
  try {
    await customFetch("/auth/logout", {
      method: "POST",
    });
  } finally {
    setAccessToken(null);
  }
}
