import { ApiEnvelope, ApiErrorEnvelope } from "@/types/auth.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

// In-memory access token storage
let memoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  memoryAccessToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("dcms_access_token", token);
    } else {
      localStorage.removeItem("dcms_access_token");
    }
  }
};

export const getAccessToken = (): string | null => {
  if (memoryAccessToken) return memoryAccessToken;
  if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("dcms_access_token");
    if (storedToken) {
      memoryAccessToken = storedToken;
      return storedToken;
    }
  }
  return null;
};

export class ApiError extends Error {
  public statusCode: number;
  public error?: string;
  public errors?: string[];

  constructor(errorData: ApiErrorEnvelope) {
    super(errorData.message || "An unexpected API error occurred");
    this.name = "ApiError";
    this.statusCode = errorData.statusCode || 500;
    this.error = errorData.error;
    this.errors = errorData.errors;
  }
}

interface CustomFetchOptions extends RequestInit {
  isRetry?: boolean;
}

/**
 * Custom fetch client built directly on top of Next.js native fetch.
 * Handles base URL configuration, bearer token headers, credentials inclusion,
 * and automatic 401 token refresh intercepting.
 */
export async function customFetch<T = unknown>(
  endpoint: string,
  options: CustomFetchOptions = {}
): Promise<ApiEnvelope<T>> {
  const { isRetry = false, headers: customHeaders, ...fetchOptions } = options;

  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const token = getAccessToken();

  const headers = new Headers(customHeaders);
  if (!headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const defaultOptions: RequestInit = {
    credentials: "include",
    headers,
    ...fetchOptions,
  };

  try {
    const response = await fetch(url, defaultOptions);

    // Handle 401 Unauthorized for token refresh
    if (response.status === 401 && !isRetry && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/refresh")) {
      try {
        const refreshResponse = await customFetch<{ accessToken?: string }>("/auth/refresh", {
          method: "POST",
          isRetry: true,
        });

        if (refreshResponse.success && refreshResponse.data?.accessToken) {
          setAccessToken(refreshResponse.data.accessToken);
          // Retry original request with new token
          return customFetch<T>(endpoint, {
            ...options,
            isRetry: true,
          });
        }
      } catch {
        // Clear token if refresh fails
        setAccessToken(null);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
      }
    }

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new ApiError({
        success: false,
        statusCode: response.status,
        message: data.message || "Request failed",
        error: data.error,
        errors: data.errors,
      });
    }

    return data as ApiEnvelope<T>;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError({
      success: false,
      statusCode: 500,
      message: err instanceof Error ? err.message : "Network error. Please check your connection.",
    });
  }
}
