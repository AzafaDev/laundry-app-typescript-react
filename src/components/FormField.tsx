import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, hint, error, children }: FormFieldProps) {
  return (
    <div className="auth-field">
      {hint ? (
        <div className="auth-label-row">
          <label className="auth-label" htmlFor={htmlFor}>{label}</label>
          <span className="auth-hint">{hint}</span>
        </div>
      ) : (
        <label className="auth-label" htmlFor={htmlFor}>{label}</label>
      )}
      {children}
      {error && <span className="auth-error">{error}</span>}
    </div>
  );
}
