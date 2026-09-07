const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Set true for multipart/form-data uploads — skips JSON stringify/headers. */
  isFormData?: boolean;
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  // Multiple simultaneous 401s shouldn't trigger multiple refresh
  // calls — share one in-flight refresh across all of them.
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/api/v1/auth/refresh/`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.ok)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function request<T>(path: string, options: RequestOptions = {}, isRetry = false): Promise<T> {
  const { body, isFormData, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    credentials: "include", // send the httpOnly auth cookies
    headers: isFormData
      ? headers
      : { "Content-Type": "application/json", ...headers },
    body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && !isRetry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request<T>(path, options, true);
    }
    // Deliberately NOT redirecting here. A 401 is the expected outcome
    // of useAuth's initial "am I logged in?" check on every page load —
    // forcing a redirect from this low-level client caused an infinite
    // reload loop (the redirect landed back on /login, which re-ran the
    // same check, which 401'd again). Callers that need redirect-on-401
    // behavior (e.g. a protected action failing mid-session) handle it
    // themselves via the thrown ApiError; proxy.ts already keeps
    // unauthenticated users off protected routes on normal navigation.
    throw new ApiError("Session expired", 401, null);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(
      //Request failed with ${response.status}
      (data && (data.error as string)) || `You are not authorized to access this resource.`,
      response.status,
      data
    );
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),

  postForm: <T>(path: string, formData: FormData, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body: formData, isFormData: true }),
};
