import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useOrderDetailQuery } from "../hooks/orders/useOrderDetailQuery";
import { useCompleteOrderMutation } from "../hooks/orders/useCompleteOrderMutation";
import { OrderProgressTracker } from "../components/orders/OrderProgressTracker";
import { ComplaintModal } from "../components/orders/ComplaintModal";
import { COMPLAINT_STATUS_LABEL, formatDateTime } from "../components/orders/orderConstants";
import { formatRupiah } from "../utils/formatPrice";

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [complaintOpen, setComplaintOpen] = useState(false);
  const orderQuery = useOrderDetailQuery(id);
  const completeMutation = useCompleteOrderMutation();

  if (orderQuery.isLoading) {
    return (
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-10 flex items-center justify-center gap-3 text-sm text-on-surface-variant">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        Memuat detail pesanan...
      </main>
    );
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-10 space-y-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-700">
          Pesanan tidak ditemukan atau kamu tidak punya akses ke pesanan ini.
        </div>
        <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke daftar pesanan
        </Link>
      </main>
    );
  }

  const order = orderQuery.data;

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke daftar pesanan
      </Link>

      <div className="rounded-2xl border border-outline-variant bg-surface p-4 md:p-6 shadow-sm space-y-5">
        <div>
          <p className="text-xs text-on-surface-variant font-medium tracking-wide uppercase">{order.invoice_number}</p>
          <p className="text-sm text-on-surface-variant mt-0.5">Outlet: {order.outlet_name ?? "-"}</p>
          <p className="text-xs text-on-surface-variant mt-0.5">Dibuat: {formatDateTime(order.created_at)}</p>
        </div>

        {order.items.length > 0 && (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-3 space-y-2">
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Detail Item Laundry</p>
            <div className="space-y-1">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-on-surface">Qty {item.quantity}</span>
                  <span className="font-medium text-on-surface">{formatRupiah(item.price_at_order * item.quantity)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant">Ongkos kirim</span>
                <span className="font-medium text-on-surface">
                  {order.delivery_fee > 0 ? formatRupiah(order.delivery_fee) : "Gratis"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold border-t border-outline-variant pt-1 mt-1">
                <span className="text-on-surface">Total</span>
                <span className="text-primary">{formatRupiah(order.total_price)}</span>
              </div>
            </div>
          </div>
        )}

        <OrderProgressTracker
          order={order}
          onComplete={() => completeMutation.mutate(order.id)}
          isCompleting={completeMutation.isPending}
          onComplaint={() => setComplaintOpen(true)}
        />

        {order.complaints.length > 0 && (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-3 space-y-1">
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Komplain</p>
            {order.complaints.map((c) => (
              <div key={c.id} className="text-sm">
                <p className="text-on-surface">{c.description}</p>
                <p className="text-xs text-on-surface-variant">
                  {COMPLAINT_STATUS_LABEL[c.status] ?? c.status} &middot; {formatDateTime(c.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {complaintOpen && <ComplaintModal orderId={order.id} onClose={() => setComplaintOpen(false)} />}
    </main>
  );
}
