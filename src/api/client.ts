const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function rawRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
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
