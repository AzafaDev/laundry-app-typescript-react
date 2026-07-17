import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, ClipboardList, Loader2, RefreshCw } from "lucide-react";
import { useOrdersQuery } from "../hooks/orders/useOrdersQuery";
import { OrderCard } from "../components/orders/OrderCard";
import { OrderFilters } from "../components/orders/OrderFilters";
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

      {ordersQuery.isLoading && (
        <div className="rounded-2xl border border-outline-variant bg-surface px-4 py-8 flex items-center justify-center gap-3 text-sm text-on-surface-variant">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          Memuat pesanan...
        </div>
      )}

      {!ordersQuery.isLoading && ordersQuery.isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-700">
          <p className="font-semibold mb-2">Gagal memuat data pesanan.</p>
          <button
            onClick={() => ordersQuery.refetch()}
            className="inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Coba lagi
          </button>
        </div>
      )}

      {!ordersQuery.isLoading && !ordersQuery.isError && orders.length === 0 && (
        <div className="rounded-2xl border border-dashed border-outline-variant bg-surface px-6 py-12 text-center">
          <div className="w-14 h-14 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-4">
            <ClipboardList className="w-6 h-6 text-outline" />
          </div>
          {hasFilters ? (
            <>
              <p className="font-semibold text-on-surface mb-1">Tidak ada pesanan ditemukan</p>
              <p className="text-sm text-on-surface-variant mb-5">Coba ubah filter atau hapus pencarian.</p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-xl border border-outline-variant px-5 py-2.5 text-sm font-bold text-on-surface hover:border-primary hover:text-primary transition-colors"
              >
                Hapus Filter
              </button>
            </>
          ) : (
            <>
              <p className="font-semibold text-on-surface mb-1">Belum ada pesanan</p>
              <p className="text-sm text-on-surface-variant mb-5">Buat order pertama Anda untuk mulai melihat tracking progress.</p>
              <Link to="/pickup" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-container transition-colors">
                Buat Order Sekarang
              </Link>
            </>
          )}
        </div>
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
