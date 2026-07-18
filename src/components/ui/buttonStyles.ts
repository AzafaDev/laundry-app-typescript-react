export type ButtonVariant = "primary" | "secondary" | "danger";
export type ButtonSize = "md" | "sm";

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-5 py-3 text-sm",
  sm: "px-4 py-2 text-sm",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary/90 shadow-sm",
  secondary:
    "bg-transparent border border-outline text-on-surface hover:border-primary hover:text-primary",
  danger: "bg-error text-on-error hover:bg-error/90",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className = "") {
  return [
    "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-colors",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    sizeClasses[size],
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
