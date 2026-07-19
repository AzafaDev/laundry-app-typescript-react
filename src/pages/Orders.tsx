import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { ClipboardList, RefreshCw } from "lucide-react";
import { useOrdersQuery } from "../hooks/orders/useOrdersQuery";
import { OrderCard } from "../components/orders/OrderCard";
import { OrderFilters } from "../components/orders/OrderFilters";
import { LoadingState, ErrorState, EmptyState } from "../components/ui/PageState";
import { Pagination } from "../components/ui/Pagination";
import { buttonClasses } from "../components/ui/buttonStyles";
import { BackLink } from "../components/ui/BackLink";
import { Eyebrow } from "../components/ui/Eyebrow";
import { STATUS_GROUPS } from "../components/orders/orderConstants";

const LIMIT = 10;

export function Orders() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusGroup, setStatusGroup] = useState<string>(STATUS_GROUPS[0].key);
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

  const handleStatusGroupChange = (key: string) => {
    setStatusGroup(key);
    setPage(1);
  };

  const hasFilters = !!search || statusGroup !== STATUS_GROUPS[0].key;
  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatusGroup(STATUS_GROUPS[0].key);
    setPage(1);
  };

  const activeGroup = STATUS_GROUPS.find((g) => g.key === statusGroup) ?? STATUS_GROUPS[0];
  const offset = (page - 1) * LIMIT;
  const query = {
    status: activeGroup.statuses.length > 0 ? activeGroup.statuses : undefined,
    search: search || undefined,
    limit: LIMIT,
    offset,
  };
  const ordersQuery = useOrdersQuery(query);

  const orders = ordersQuery.data?.data ?? [];
  const total = ordersQuery.data?.total_count ?? 0;

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <div className="space-y-4">
        <BackLink to="/pickup">Buat order baru</BackLink>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Eyebrow className="mb-2">Riwayat Pesanan</Eyebrow>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Status laundry kamu.</h1>
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
        statusGroup={statusGroup}
        hasFilters={hasFilters}
        isSearching={ordersQuery.isFetching && !ordersQuery.isLoading}
        onSearchChange={handleSearchChange}
        onStatusGroupChange={handleStatusGroupChange}
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
            description="Buat order pertama kamu untuk mulai melihat tracking progress."
            tone="primary"
            action={
              <Link to="/pickup" className={buttonClasses("primary", "md")}>
                Buat Order Sekarang
              </Link>
            }
          />
        )
      )}

      {!ordersQuery.isLoading && !ordersQuery.isError && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {!ordersQuery.isLoading && !ordersQuery.isError && orders.length > 0 && (
        <Pagination page={page} limit={LIMIT} totalCount={total} onPageChange={setPage} />
      )}
    </main>
  );
}
