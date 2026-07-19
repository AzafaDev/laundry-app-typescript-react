import { Circle, ClipboardList, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useOutletOrdersQuery } from "../../hooks/adminOrders/useOutletOrdersQuery";
import { LoadingState, ErrorState, EmptyState } from "../../components/ui/PageState";
import { Pagination } from "../../components/ui/Pagination";
import { BackLink } from "../../components/ui/BackLink";
import { ORDER_STATUS_LABEL, formatDateTime, STATUS_GROUPS } from "../../components/orders/orderConstants";
import { OrderFilters } from "../../components/orders/OrderFilters";
import { STEP_ICON, statusBadgeClasses } from "../../components/orders/statusIcons";
import { formatRupiah } from "../../utils/formatPrice";
import { inputClasses } from "../../components/ui/Input";
import { useState } from "react";

const LIMIT = 15;

export function OutletOrders() {
  const [search, setSearch] = useState("");
  const [statusGroup, setStatusGroup] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const hasFilters = search !== "" || statusGroup !== "all" || dateFrom !== "" || dateTo !== "";

  const statusEnum = statusGroup && statusGroup !== "all"
    ? STATUS_GROUPS.find(g => g.key === statusGroup)?.statuses.join(",")
    : undefined;

  const offset = (page - 1) * LIMIT;
  const ordersQuery = useOutletOrdersQuery({
    status: statusEnum,
    search: search || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    limit: LIMIT,
    offset,
  });

  const handleClearFilters = () => {
    setSearch("");
    setStatusGroup("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const orders = ordersQuery.data?.data ?? [];
  const total = ordersQuery.data?.total_count ?? 0;

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-on-surface">Semua Pesanan Outlet</h1>
        <button
          onClick={() => ordersQuery.refetch()}
          disabled={ordersQuery.isFetching}
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-outline-variant px-4 py-2.5 text-sm font-medium text-on-surface hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${ordersQuery.isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="rounded-2xl border border-outline-variant bg-surface p-4 md:p-6 space-y-4">
        <OrderFilters
          searchInput={search}
          statusGroup={statusGroup}
          hasFilters={hasFilters}
          isSearching={ordersQuery.isFetching}
          onSearchChange={setSearch}
          onStatusGroupChange={setStatusGroup}
          onClear={handleClearFilters}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-on-surface" htmlFor="date_from">
              Dari Tanggal
            </label>
            <input
              id="date_from"
              type="date"
              className={inputClasses}
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-on-surface" htmlFor="date_to">
              Sampai Tanggal
            </label>
            <input
              id="date_to"
              type="date"
              className={inputClasses}
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {ordersQuery.isLoading && <LoadingState label="Memuat pesanan..." />}

      {!ordersQuery.isLoading && ordersQuery.isError && (
        <ErrorState message="Gagal memuat data pesanan." onRetry={() => ordersQuery.refetch()} />
      )}

      {!ordersQuery.isLoading && !ordersQuery.isError && orders.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title={hasFilters ? "Tidak ada pesanan ditemukan" : "Belum ada pesanan"}
          description={hasFilters ? "Coba ubah filter atau hapus pencarian dan tanggal." : "Pesanan yang masuk ke outlet ini akan muncul di sini."}
        />
      )}

      {!ordersQuery.isLoading && !ordersQuery.isError && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => {
            const StatusIcon = STEP_ICON[order.status] ?? Circle;
            return (
              <Link key={order.id} to={`/staff/admin/orders/${order.id}`} className="block rounded-2xl border border-outline-variant bg-surface p-4 space-y-2 hover:border-primary hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-on-surface-variant font-medium tracking-wide uppercase">{order.invoice_number}</p>
                    {order.customer_name && (
                      <p className="text-sm font-semibold text-on-surface mt-0.5">
                        {order.customer_name}
                        {order.customer_phone ? ` · ${order.customer_phone}` : ""}
                      </p>
                    )}
                    <p className="text-xs text-on-surface-variant mt-0.5">Dibuat: {formatDateTime(order.created_at)}</p>
                  </div>
                  <span className="text-sm font-semibold text-on-surface">
                    {order.total_price > 0 ? formatRupiah(order.total_price) : "Belum diproses"}
                  </span>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClasses(order.status)}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {ORDER_STATUS_LABEL[order.status]}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {!ordersQuery.isLoading && !ordersQuery.isError && orders.length > 0 && (
        <Pagination page={page} limit={LIMIT} totalCount={total} onPageChange={setPage} />
      )}
    </main>
  );
}
