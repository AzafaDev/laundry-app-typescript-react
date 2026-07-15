import { ApiError } from "../api/client";

export function ApiErrorMessage({ error }: { error: unknown }) {
  if (!error) return null;

  return (
    <p className="auth-error">
      {error instanceof ApiError ? error.message : "Terjadi kesalahan"}
    </p>
  );
}
