import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { useBypassRequestsQuery } from "../../hooks/adminBypass/useBypassRequestsQuery";
import { BypassReviewModal } from "../../components/admin/BypassReviewModal";
import { Card } from "../../components/ui/Card";
import { Pagination } from "../../components/ui/Pagination";
import { LoadingState, EmptyState } from "../../components/ui/PageState";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import { BackLink } from "../../components/ui/BackLink";
import type { BypassRequest } from "../../types/worker";

const LIMIT = 20;
const STATUS_TABS: Array<{ value: string; label: string }> = [
  { value: "", label: "Semua" },
  { value: "pending", label: "Menunggu" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
];

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-primary/10 text-primary",
  rejected: "bg-error/10 text-error",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
};

export function BypassRequests() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const offset = (page - 1) * LIMIT;
  const [selected, setSelected] = useState<BypassRequest | null>(null);

  const bypassQuery = useBypassRequestsQuery(LIMIT, offset, status || undefined);
  const requests = bypassQuery.data?.data ?? [];
  const totalCount = bypassQuery.data?.total_count ?? 0;

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>

      <h1 className="text-2xl font-bold text-on-surface">Permintaan Bypass</h1>

      <div className="flex gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-sm font-bold border-2 transition-colors ${
              status === tab.value ? "border-primary bg-primary/5 text-primary" : "border-outline-variant text-on-surface-variant"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ApiErrorMessage error={bypassQuery.error} />

      {bypassQuery.isLoading && (
        <Card>
          <LoadingState label="Memuat permintaan bypass..." bordered={false} />
        </Card>
      )}

      {!bypassQuery.isLoading && requests.length === 0 && !bypassQuery.isError && (
        <Card>
          <EmptyState icon={ShieldAlert} title="Tidak ada permintaan bypass" description="Belum ada yang perlu direview." />
        </Card>
      )}

      <div className="space-y-3">
        {requests.map((bypass) => (
          <button
            key={bypass.id}
            type="button"
            onClick={() => setSelected(bypass)}
            className="w-full text-left rounded-2xl border border-outline-variant bg-surface p-4 flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
          >
            <div>
              <p className="text-sm font-bold text-on-surface">{bypass.invoice_number ?? bypass.order_id}</p>
              <p className="text-xs text-on-surface-variant">
                Station {bypass.station} &middot; {bypass.requested_by_name ?? bypass.requested_by}
              </p>
            </div>
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${STATUS_BADGE[bypass.status] ?? ""}`}>
              {STATUS_LABEL[bypass.status] ?? bypass.status}
            </span>
          </button>
        ))}
      </div>

      {requests.length > 0 && <Pagination page={page} limit={LIMIT} totalCount={totalCount} onPageChange={setPage} />}

      {selected && <BypassReviewModal bypass={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
