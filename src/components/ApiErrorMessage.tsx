import { ApiError } from "../api/client";
import { errorMessages } from "../api/errorMessages";

export function ApiErrorMessage({ error }: { error: unknown }) {
  if (!error) return null;

  return (
    <p className="auth-error">
      {error instanceof ApiError ? (errorMessages[error.message] ?? "Terjadi kesalahan") : "Terjadi kesalahan"}
    </p>
  );
}
