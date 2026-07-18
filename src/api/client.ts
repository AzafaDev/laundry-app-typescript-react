export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function getCsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const MUTATING_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

async function rawRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const method = (options.method ?? "GET").toUpperCase();
  // Only attach the CSRF header on mutating requests — the backend's
  // csrfMiddleware is only ever attached to those routes, and sending a
  // custom header on every GET forces an unnecessary CORS preflight on all
  // of them for no benefit.
  const csrfToken = MUTATING_METHODS.has(method) ? getCsrfToken() : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(res.status, data.error ?? data.message ?? "Terjadi kesalahan");
  }

  return data as T;
}

function refreshPathFor(path: string): string | null {
  if (path.startsWith("/api/v1/employee/")) return "/api/v1/employee/auth/refresh";
  if (path.startsWith("/api/v1/customer/")) return "/api/v1/customer/auth/refresh";
  return null;
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    return await rawRequest<T>(path, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401 && !path.includes("/auth/")) {
      const refreshPath = refreshPathFor(path);

      if (refreshPath) {
        const refreshRes = await fetch(`${BASE_URL}${refreshPath}`, {
          method: "POST",
          credentials: "include",
        });

        if (refreshRes.ok) {
          return rawRequest<T>(path, options);
        }
      }
    }

    throw err;
  }
}

// A handful of endpoints (e.g. worker SubmitItems) use a non-2xx status as
// a meaningful business response rather than a hard error — a plain
// `request()` would discard that body behind a generic ApiError. This
// treats any status in `allowedStatuses` as a normal successful parse.
export async function requestAllowStatus<T>(
  path: string,
  allowedStatuses: number[],
  options: RequestInit = {},
): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const method = (options.method ?? "GET").toUpperCase();
  const csrfToken = MUTATING_METHODS.has(method) ? getCsrfToken() : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok && !allowedStatuses.includes(res.status)) {
    throw new ApiError(res.status, data.error ?? data.message ?? "Terjadi kesalahan");
  }

  return data as T;
}
