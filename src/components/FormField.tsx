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
    <div className="space-y-1.5">
      {hint ? (
        <div className="flex items-baseline justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-[0.08em] text-on-surface-variant" htmlFor={htmlFor}>
            {label}
          </label>
          <span className="text-xs text-on-surface-variant">{hint}</span>
        </div>
      ) : (
        <label className="text-xs font-bold uppercase tracking-[0.08em] text-on-surface-variant" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {error && (
        <span role="alert" className="block text-xs text-error">
          {error}
        </span>
      )}
    </div>
  );
}
