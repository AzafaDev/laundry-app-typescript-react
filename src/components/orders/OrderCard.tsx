import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Order } from "../../types/order";
import { formatRupiah } from "../../utils/formatPrice";
import { ORDER_STATUS_LABEL, formatDateTime } from "./orderConstants";

export function OrderCard({ order }: { order: Order }) {
  return (
    <Link
      to={`/orders/${order.id}`}
      className="block rounded-2xl border border-outline-variant bg-surface p-4 md:p-6 shadow-sm hover:border-primary/40 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-on-surface-variant font-medium tracking-wide uppercase">{order.invoice_number}</p>
          <p className="text-sm text-on-surface-variant mt-0.5">Outlet: {order.outlet_name ?? "-"}</p>
          <p className="text-xs text-on-surface-variant mt-0.5">Dibuat: {formatDateTime(order.created_at)}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-on-surface-variant shrink-0" />
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {ORDER_STATUS_LABEL[order.status]}
        </span>
        <span className="text-sm font-semibold text-on-surface">
          {order.total_price > 0 ? formatRupiah(order.total_price) : "Harga menyusul"}
        </span>
      </div>
    </Link>
  );
}
