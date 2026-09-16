const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:5000/api/v1";

let memoryToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  memoryToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("access_token", token);
    } else {
      localStorage.removeItem("access_token");
    }
  }
};

export const getAccessToken = (): string | null => {
  if (memoryToken) return memoryToken;
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

export interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
  next?: NextFetchRequestConfig;
  _retry?: boolean;
}

export class ApiError extends Error {
  statusCode: number;
  errors?: string[];
  error?: string;

  constructor(
    message: string,
    statusCode: number = 400,
    errors?: string[],
    error?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.error = error;
  }
}

async function request<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, headers, _retry, ...config } = options;

  let url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
  if (params) {
    url += `?${new URLSearchParams(params).toString()}`;
  }

  const token = getAccessToken();
  const authHeaders: Record<string, string> = {};
  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    credentials: "include",
    ...config,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...headers,
    },
  });

  if (!res.ok) {
    // Automatic 401 token refresh retry logic (skip if already refreshing or logging in)
    if (
      res.status === 401 &&
      !_retry &&
      !endpoint.includes("/auth/refresh") &&
      !endpoint.includes("/auth/login")
    ) {
      try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
        });

        if (refreshRes.ok) {
          const refreshJson = await refreshRes.json();
          const newAccessToken =
            refreshJson?.data?.accessToken || refreshJson?.accessToken;
          if (newAccessToken) {
            setAccessToken(newAccessToken);
          }
          // Retry original request with updated token
          return request<T>(endpoint, { ...options, _retry: true });
        }
      } catch {
        // Refresh failed, fall through to throw error
      }
    }

    const errorData = await res.json().catch(() => ({}));
    const message =
      errorData.message ||
      (Array.isArray(errorData.errors)
        ? errorData.errors.join(", ")
        : `Error ${res.status}`);
    throw new ApiError(message, res.status, errorData.errors, errorData.error);
  }

  if (res.status === 204) return {} as T;

  const json = await res.json();
  return json?.data !== undefined ? json.data : json;
}

export const apiClient = {
  get: <T>(url: string, options?: FetchOptions) =>
    request<T>(url, { ...options, method: "GET" }),

  post: <T>(url: string, data?: unknown, options?: FetchOptions) =>
    request<T>(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(url: string, data?: unknown, options?: FetchOptions) =>
    request<T>(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(url: string, data?: unknown, options?: FetchOptions) =>
    request<T>(url, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(url: string, options?: FetchOptions) =>
    request<T>(url, { ...options, method: "DELETE" }),
};
