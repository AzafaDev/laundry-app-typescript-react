import { Loader2, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface LoadingStateProps {
  label: string;
  bordered?: boolean;
}

export function LoadingState({ label, bordered = true }: LoadingStateProps) {
  return (
    <div
      className={
        bordered
          ? "rounded-2xl border border-outline-variant bg-surface px-4 py-8 flex items-center justify-center gap-3 text-sm text-on-surface-variant"
          : "flex items-center justify-center gap-3 py-10 text-sm text-on-surface-variant"
      }
    >
      <Loader2 className="w-5 h-5 animate-spin text-primary" />
      {label}
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({ message, onRetry, retryLabel = "Coba lagi" }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-error/30 bg-error-container/40 px-4 py-5 text-sm text-on-error-container space-y-3">
      <p className="font-semibold">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center rounded-lg bg-error px-3 py-2 text-xs font-semibold text-on-error hover:bg-error/90 transition-colors"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  /**
   * "neutral": nothing to do here right now (empty inbox, no filter results).
   * "primary": an invitation to take the first action (first order, first address).
   */
  tone?: "neutral" | "primary";
}

export function EmptyState({ icon: Icon, title, description, action, tone = "neutral" }: EmptyStateProps) {
  return (
    <div
      className={`rounded-2xl border border-dashed px-6 py-12 text-center ${
        tone === "primary" ? "border-primary/30 bg-primary/5" : "border-outline-variant bg-surface"
      }`}
    >
      <div
        className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-4 ${
          tone === "primary" ? "bg-primary/15 text-primary" : "bg-surface-container text-outline"
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <p className="font-semibold text-on-surface mb-1">{title}</p>
      <p className={`text-sm text-on-surface-variant ${action ? "mb-5" : ""}`}>{description}</p>
      {action}
    </div>
  );
}
