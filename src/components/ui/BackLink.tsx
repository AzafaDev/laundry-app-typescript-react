import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface BackLinkProps {
  to: string;
  children: ReactNode;
  variant?: "default" | "underline";
  className?: string;
}

const variantClasses = {
  default: "text-on-surface-variant hover:text-primary",
  underline: "text-primary hover:underline",
};

export function BackLink({ to, children, variant = "default", className = "" }: BackLinkProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${variantClasses[variant]} ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {children}
    </Link>
  );
}
