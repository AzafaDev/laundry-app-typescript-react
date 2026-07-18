import { Link } from "react-router-dom";
import { ChevronRight, Circle } from "lucide-react";
import type { Order } from "../../types/order";
import { formatRupiah } from "../../utils/formatPrice";
import { ORDER_STATUS_LABEL, formatDateTime } from "./orderConstants";
import { STEP_ICON, statusBadgeClasses } from "./statusIcons";

export function OrderCard({ order }: { order: Order }) {
  const StatusIcon = STEP_ICON[order.status] ?? Circle;

  return (
    <Link
      to={`/orders/${order.id}`}
      className="block rounded-2xl border border-outline-variant bg-surface p-4 md:p-6 shadow-sm hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs text-on-surface-variant font-medium tracking-wide uppercase truncate">{order.invoice_number}</p>
          <p className="text-sm text-on-surface-variant mt-0.5 truncate">Outlet: {order.outlet_name ?? "-"}</p>
          <p className="text-xs text-on-surface-variant mt-0.5">Dibuat: {formatDateTime(order.created_at)}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-on-surface-variant shrink-0" />
      </div>

      <div className="flex items-center justify-between gap-2 mt-4">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold min-w-0 ${statusBadgeClasses(order.status)}`}>
          <StatusIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{ORDER_STATUS_LABEL[order.status]}</span>
        </span>
        <span className="text-sm font-semibold text-on-surface shrink-0">
          {order.total_price > 0 ? formatRupiah(order.total_price) : "Harga menyusul"}
        </span>
      </div>
    </Link>
  );
}
