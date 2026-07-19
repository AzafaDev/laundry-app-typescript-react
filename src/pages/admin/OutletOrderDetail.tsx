import { useParams } from "react-router-dom";
import { useOutletOrderDetailQuery } from "../../hooks/adminOrders/useOutletOrderDetailQuery";
import { ORDER_STATUS_LABEL, COMPLAINT_STATUS_LABEL, complaintBadgeClasses, formatDateTime } from "../../components/orders/orderConstants";
import { formatRupiah } from "../../utils/formatPrice";
import { LoadingState, ErrorState } from "../../components/ui/PageState";
import { BackLink } from "../../components/ui/BackLink";

export function OutletOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const orderQuery = useOutletOrderDetailQuery(id);

  if (orderQuery.isLoading) {
    return (
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-10">
        <LoadingState label="Memuat detail pesanan..." bordered={false} />
      </main>
    );
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-10 space-y-4">
        <ErrorState message="Pesanan tidak ditemukan atau kamu tidak punya akses ke pesanan ini." />
        <BackLink to="/staff/admin/orders" variant="underline">Kembali ke daftar pesanan</BackLink>
      </main>
    );
  }

  const order = orderQuery.data;

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/admin/orders">Kembali ke daftar pesanan</BackLink>

      <div className="rounded-2xl border border-outline-variant bg-surface p-4 md:p-6 shadow-sm space-y-5">
        <div>
          <p className="font-mono text-xs text-on-surface-variant font-medium tracking-wide uppercase">{order.invoice_number}</p>
          <p className="text-sm text-on-surface-variant mt-0.5">Outlet: {order.outlet_name ?? "-"}</p>
          <p className="text-xs text-on-surface-variant mt-0.5">Dibuat: {formatDateTime(order.created_at)}</p>
          {!!order.total_weight_kg && (
            <p className="text-xs text-on-surface-variant mt-0.5">Berat cucian: {order.total_weight_kg} kg</p>
          )}
        </div>

        {order.customer_name && (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-3 space-y-1">
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Data Pelanggan</p>
            <p className="text-sm font-semibold text-on-surface">{order.customer_name}</p>
            {order.customer_phone && (
              <p className="text-sm text-on-surface-variant">{order.customer_phone}</p>
            )}
          </div>
        )}

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

        {order.status_history.length > 0 && (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-3 space-y-2">
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Riwayat Status</p>
            <div className="space-y-2">
              {order.status_history.map((entry) => (
                <div key={entry.id} className="text-sm">
                  <p className="text-on-surface font-medium">{ORDER_STATUS_LABEL[entry.new_status as keyof typeof ORDER_STATUS_LABEL] ?? entry.new_status}</p>
                  {entry.note && (
                    <p className="text-xs text-on-surface-variant">{entry.note}</p>
                  )}
                  <p className="text-xs text-on-surface-variant">{formatDateTime(entry.created_at)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {order.payment && (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-3 space-y-2">
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Informasi Pembayaran</p>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Jumlah</span>
                <span className="font-medium text-on-surface">{formatRupiah(order.payment.amount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Status</span>
                <span className="font-medium text-on-surface capitalize">{order.payment.status}</span>
              </div>
              {order.payment.paid_at && (
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">Dibayar</span>
                  <span className="text-xs text-on-surface">{formatDateTime(order.payment.paid_at)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {order.complaints.length > 0 && (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-3 space-y-1">
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Komplain</p>
            {order.complaints.map((c) => (
              <div key={c.id} className="text-sm space-y-1">
                <p className="text-on-surface">{c.description}</p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${complaintBadgeClasses(c.status)}`}>
                    {COMPLAINT_STATUS_LABEL[c.status] ?? c.status}
                  </span>
                  <span className="font-mono text-xs text-on-surface-variant">{formatDateTime(c.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
