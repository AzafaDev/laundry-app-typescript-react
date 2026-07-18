import type { HTMLAttributes } from "react";

export function ClaimTag({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="absolute -top-2.5 left-7 h-5 w-5 rounded-full border-2 border-outline-variant bg-surface"
      />
      <div
        className={`rounded-3xl border border-outline-variant bg-surface-container-lowest p-7 shadow-sm ${className}`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
