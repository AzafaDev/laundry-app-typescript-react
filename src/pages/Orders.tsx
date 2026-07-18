import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, ClipboardList, RefreshCw } from "lucide-react";
import { useOrdersQuery } from "../hooks/orders/useOrdersQuery";
import { OrderCard } from "../components/orders/OrderCard";
import { OrderFilters } from "../components/orders/OrderFilters";
import { LoadingState, ErrorState, EmptyState } from "../components/ui/PageState";
import { buttonClasses } from "../components/ui/buttonStyles";
import type { OrderStatus } from "../types/order";

const LIMIT = 10;

export function Orders() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [page, setPage] = useState(1);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setSearch(value.trim());
      setPage(1);
    }, 400);
  };

  const handleStatusChange = (value: OrderStatus | "") => {
    setStatus(value);
    setPage(1);
  };

  const hasFilters = !!search || !!status;
  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setPage(1);
  };

  const offset = (page - 1) * LIMIT;
  const query = { status: status || undefined, search: search || undefined, limit: LIMIT, offset };
  const ordersQuery = useOrdersQuery(query);

  const orders = ordersQuery.data?.data ?? [];
  const total = ordersQuery.data?.total_count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <div className="space-y-4">
        <Link to="/pickup" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Buat order baru
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-2">
              Riwayat Pesanan
            </span>
            <h1 className="text-3xl font-bold text-on-surface">Status laundry kamu.</h1>
          </div>
          <button
            onClick={() => ordersQuery.refetch()}
            disabled={ordersQuery.isFetching}
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-outline-variant px-4 py-2.5 text-sm font-medium text-on-surface hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${ordersQuery.isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <OrderFilters
        searchInput={searchInput}
        status={status}
        hasFilters={hasFilters}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onClear={clearFilters}
      />

      {ordersQuery.isLoading && <LoadingState label="Memuat pesanan..." />}

      {!ordersQuery.isLoading && ordersQuery.isError && (
        <ErrorState message="Gagal memuat data pesanan." onRetry={() => ordersQuery.refetch()} />
      )}

      {!ordersQuery.isLoading && !ordersQuery.isError && orders.length === 0 && (
        hasFilters ? (
          <EmptyState
            icon={ClipboardList}
            title="Tidak ada pesanan ditemukan"
            description="Coba ubah filter atau hapus pencarian."
            action={
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-xl border border-outline-variant px-5 py-2.5 text-sm font-bold text-on-surface hover:border-primary hover:text-primary transition-colors"
              >
                Hapus Filter
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="Belum ada pesanan"
            description="Buat order pertama Anda untuk mulai melihat tracking progress."
            action={
              <Link to="/pickup" className={buttonClasses("primary", "md")}>
                Buat Order Sekarang
              </Link>
            }
          />
        )
      )}

      {!ordersQuery.isLoading && !ordersQuery.isError && orders.length > 0 && (
        <>
          <p className="text-xs text-on-surface-variant">
            Menampilkan {orders.length} dari {total} pesanan
          </p>
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </>
      )}

      {!ordersQuery.isLoading && !ordersQuery.isError && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 rounded-xl border border-outline-variant px-3 py-2 text-sm font-medium text-on-surface disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </button>
          <span className="text-sm text-on-surface-variant px-2">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 rounded-xl border border-outline-variant px-3 py-2 text-sm font-medium text-on-surface disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
          >
            Berikutnya
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </main>
  );
}
