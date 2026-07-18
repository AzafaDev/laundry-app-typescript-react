import type { ReactNode } from "react";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-on-secondary-container ${className}`}
    >
      {children}
    </span>
  );
}
