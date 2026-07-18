import toast, { type Toast } from "react-hot-toast";
import { Bell, CreditCard, Package, ShieldAlert, Truck, X, type LucideIcon } from "lucide-react";
import type { SseToastContent, SseToastIcon } from "../lib/sseEvents";

const ICONS: Record<SseToastIcon, LucideIcon> = {
  bell: Bell,
  payment: CreditCard,
  package: Package,
  truck: Truck,
  bypass: ShieldAlert,
  complaint: ShieldAlert,
};

export function showSseToast(content: SseToastContent) {
  const Icon = ICONS[content.icon];

  toast.custom((t: Toast) => (
    <div
      className={`${t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"} transition-all duration-200 w-full max-w-sm rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-lg p-4 flex items-start gap-3`}
    >
      <div className="rounded-xl bg-primary/10 p-2 text-primary shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-on-surface break-words">{content.title}</p>
        {content.description && (
          <p className="mt-0.5 text-xs text-on-surface-variant break-words">{content.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => toast.dismiss(t.id)}
        className="shrink-0 text-on-surface-variant hover:text-on-surface"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  ));
}
