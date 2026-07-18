import type { HTMLAttributes } from "react";

export function AuthShell({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`min-h-[100svh] flex flex-col items-center justify-center gap-5 px-6 py-12 ${className}`}
      {...props}
    />
  );
}

export function AuthCard({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`w-full max-w-sm rounded-3xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm space-y-5 ${className}`}
      {...props}
    />
  );
}
