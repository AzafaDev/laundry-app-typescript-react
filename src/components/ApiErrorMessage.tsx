import { ApiError } from "../api/client";
import { errorMessages } from "../api/errorMessages";

export function ApiErrorMessage({ error }: { error: unknown }) {
  if (!error) return null;

  return (
    <p role="alert" className="rounded-xl border border-error/30 bg-error-container/40 px-4 py-2.5 text-sm text-on-error-container">
      {error instanceof ApiError ? (errorMessages[error.message] ?? "Terjadi kesalahan") : "Terjadi kesalahan"}
    </p>
  );
}
