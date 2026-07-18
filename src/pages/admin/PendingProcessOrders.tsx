import { Link } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import { usePendingProcessOrdersQuery } from "../../hooks/pipeline/usePendingProcessOrdersQuery";
import { Card } from "../../components/ui/Card";
import { LoadingState, EmptyState } from "../../components/ui/PageState";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import { BackLink } from "../../components/ui/BackLink";
import { formatDateTime } from "../../components/orders/orderConstants";

export function PendingProcessOrders() {
  const pendingQuery = usePendingProcessOrdersQuery();
  const orders = pendingQuery.data?.data ?? [];

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>

      <h1 className="text-2xl font-bold text-on-surface">Proses Pesanan</h1>

      <ApiErrorMessage error={pendingQuery.error} />

      {pendingQuery.isLoading && (
        <Card>
          <LoadingState label="Memuat pesanan..." bordered={false} />
        </Card>
      )}

      {!pendingQuery.isLoading && orders.length === 0 && !pendingQuery.isError && (
        <Card>
          <EmptyState
            icon={PackageSearch}
            title="Belum ada pesanan menunggu"
            description="Pesanan yang sudah tiba di outlet dan siap diproses akan muncul di sini."
          />
        </Card>
      )}

      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/staff/admin/orders/${order.id}/process`}
            className="block rounded-2xl border border-outline-variant bg-surface p-4 hover:border-primary/40 transition-colors"
          >
            <p className="text-sm font-bold text-on-surface">{order.invoice_number}</p>
            <p className="text-xs text-on-surface-variant">Masuk: {formatDateTime(order.created_at)}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
