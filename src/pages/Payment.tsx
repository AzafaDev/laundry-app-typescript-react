import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, CreditCard, Loader2, RefreshCw, XCircle } from "lucide-react";
import { useOrderDetailQuery } from "../hooks/orders/useOrderDetailQuery";
import { usePaymentStatusQuery } from "../hooks/payments/usePaymentStatusQuery";
import { useCreateTransactionMutation } from "../hooks/payments/useCreateTransactionMutation";
import { useSyncPaymentStatusMutation } from "../hooks/payments/useSyncPaymentStatusMutation";
import { formatRupiah } from "../utils/formatPrice";
import { formatDateTime } from "../components/orders/orderConstants";
import { ApiError } from "../api/client";
import { LoadingState, ErrorState } from "../components/ui/PageState";

export function Payment() {
  const { id } = useParams<{ id: string }>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const orderQuery = useOrderDetailQuery(id);
  const paymentQuery = usePaymentStatusQuery(id);
  const createTransaction = useCreateTransactionMutation();
  const syncStatus = useSyncPaymentStatusMutation();

  // Midtrans redirects back here after checkout (finish/unfinish/error), but
  // its webhook may not have landed in our DB yet — sync once per mount so
  // the status shown isn't stale while waiting on the webhook.
  const hasSyncedRef = useRef(false);
  useEffect(() => {
    if (!id || hasSyncedRef.current) return;
    hasSyncedRef.current = true;
    syncStatus.mutate(id);
  }, [id, syncStatus]);

  const payment = paymentQuery.data;
  const isPaid = payment?.status === "paid";
  const isExpiredOrFailed = payment?.status === "expired" || payment?.status === "failed";

  const handlePay = () => {
    if (!id) return;
    setErrorMessage(null);
    createTransaction.mutate(id, {
      onSuccess: (result) => {
        if (result.payment_link) {
          window.location.href = result.payment_link;
        } else {
          setErrorMessage("Link pembayaran tidak tersedia. Coba lagi.");
        }
      },
      onError: (err) => {
        setErrorMessage(err instanceof ApiError ? err.message : "Gagal membuat transaksi pembayaran.");
      },
    });
  };

  if (orderQuery.isLoading) {
    return (
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-10">
        <LoadingState label="Memuat detail pesanan..." bordered={false} />
      </main>
    );
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-10">
        <ErrorState message="Gagal memuat detail pesanan." />
      </main>
    );
  }

  const order = orderQuery.data;

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke pesanan
      </Link>
      <div>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-2">
          Pembayaran
        </span>
        <h1 className="text-3xl font-bold text-on-surface">Selesaikan pembayaran kamu.</h1>
        <p className="text-sm text-on-surface-variant mt-1">Pembayaran diproses secara aman melalui Midtrans.</p>
      </div>

      <div className="rounded-2xl border border-outline-variant bg-surface p-4 md:p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-xs text-on-surface-variant font-medium tracking-wide uppercase">{order.invoice_number}</p>
            {!isPaid && (
              <button
                type="button"
                onClick={() => syncStatus.mutate(id!)}
                disabled={syncStatus.isPending || !id}
                title="Cek status pembayaran terbaru"
                className="text-on-surface-variant hover:text-primary disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncStatus.isPending ? "animate-spin" : ""}`} />
              </button>
            )}
          </div>
          {isPaid && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Lunas
            </span>
          )}
          {isExpiredOrFailed && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
              <XCircle className="w-3.5 h-3.5" />
              {payment?.status === "expired" ? "Kedaluwarsa" : "Gagal"}
            </span>
          )}
          {!isPaid && !isExpiredOrFailed && payment?.status === "pending" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
              <AlertCircle className="w-3.5 h-3.5" />
              Menunggu Pembayaran
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-on-surface-variant">Outlet</span>
          <span className="font-medium text-on-surface">{order.outlet_name ?? "-"}</span>
        </div>
        <div className="border-t border-dashed border-outline-variant my-2" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-on-surface">Total Tagihan</span>
          <span className="text-xl font-extrabold text-primary">{formatRupiah(order.total_price)}</span>
        </div>
        {payment?.paid_at && (
          <p className="text-xs text-on-surface-variant text-right">Dibayar pada {formatDateTime(payment.paid_at)}</p>
        )}
      </div>

      {errorMessage && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}

      {isPaid ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-5 text-center text-sm text-green-700 font-medium">
          Pembayaran kamu sudah berhasil. Terima kasih!
        </div>
      ) : (
        <button
          type="button"
          onClick={handlePay}
          disabled={createTransaction.isPending}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-sm font-bold text-white hover:bg-primary-container hover:text-on-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {createTransaction.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
          {isExpiredOrFailed ? "Coba Bayar Lagi" : "Bayar Sekarang dengan Midtrans"}
        </button>
      )}
    </main>
  );
}
