const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:5000/api/v1";

export interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
  next?: NextFetchRequestConfig;
  _retry?: boolean;
  /** When true, return the full JSON body instead of unwrapping `.data`. */
  _raw?: boolean;
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

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function handleTokenRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function request<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, headers, _retry, _raw, ...config } = options;

  let url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
  if (params) {
    const queryString = new URLSearchParams(params).toString();
    if (queryString) {
      url += url.includes("?") ? `&${queryString}` : `?${queryString}`;
    }
  }

  const res = await fetch(url, {
    credentials: "include",
    ...config,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!res.ok) {
    // Automatic 401 token refresh retry logic with Mutex deduplication
    if (
      res.status === 401 &&
      !_retry &&
      !endpoint.includes("/auth/refresh") &&
      !endpoint.includes("/auth/login")
    ) {
      const refreshSuccess = await handleTokenRefresh();
      if (refreshSuccess) {
        // Retry original request with updated cookie
        return request<T>(endpoint, { ...options, _retry: true });
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
  if (_raw) return json as T;
  return json?.data !== undefined ? json.data : json;
}

export const apiClient = {
  get: <T>(url: string, options?: FetchOptions) =>
    request<T>(url, { ...options, method: "GET" }),

  /** Like get() but returns the full JSON body (no .data unwrapping). Use for paginated responses that need `meta`. */
  getRaw: <T>(url: string, options?: FetchOptions) =>
    request<T>(url, { ...options, method: "GET", _raw: true } as FetchOptions),

  /** Download a binary file from the API. Returns a Blob. */
  getBlob: (url: string, options?: Omit<FetchOptions, "params"> & { params?: Record<string, string> }): Promise<Blob> => {
    const { params, ...rest } = options ?? {};
    const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
    const finalUrl = params
      ? `${fullUrl}?${new URLSearchParams(params).toString()}`
      : fullUrl;

    return fetch(finalUrl, {
      credentials: "include",
      method: "GET",
      ...rest,
    }).then((res) => {
      if (!res.ok) throw new ApiError(`Download failed`, res.status);
      return res.blob();
    });
  },

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
