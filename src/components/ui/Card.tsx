import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-3xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm ${className}`}
      {...props}
    />
  );
}
