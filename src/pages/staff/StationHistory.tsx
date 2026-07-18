import { useState } from "react";
import { History } from "lucide-react";
import { useStaffAuth } from "../../context/StaffAuthContext";
import { useStationHistoryQuery } from "../../hooks/worker/useStationHistoryQuery";
import { STATION_FOR_ROLE, STATION_LABEL } from "../../components/worker/workerConstants";
import { ORDER_STATUS_LABEL, formatDateTime } from "../../components/orders/orderConstants";
import type { OrderStatus } from "../../types/order";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import { Card } from "../../components/ui/Card";
import { Pagination } from "../../components/ui/Pagination";
import { LoadingState, EmptyState } from "../../components/ui/PageState";
import { BackLink } from "../../components/ui/BackLink";
import "../../styles/auth.css";

const LIMIT = 20;

export function StationHistory() {
  const { employee } = useStaffAuth();
  const station = employee ? STATION_FOR_ROLE[employee.role] : undefined;
  const [page, setPage] = useState(1);
  const offset = (page - 1) * LIMIT;
  const historyQuery = useStationHistoryQuery(station, LIMIT, offset);

  const entries = historyQuery.data?.data ?? [];
  const total = historyQuery.data?.total_count ?? 0;

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>

      <h1 className="text-2xl font-bold text-on-surface">
        Riwayat {station ? STATION_LABEL[station] : "Station"}
      </h1>

      <ApiErrorMessage error={historyQuery.error} />

      {historyQuery.isLoading && (
        <Card>
          <LoadingState label="Memuat riwayat..." bordered={false} />
        </Card>
      )}

      {!historyQuery.isLoading && entries.length === 0 && !historyQuery.isError && (
        <Card>
          <EmptyState icon={History} title="Belum ada riwayat" description="Order yang sudah kamu proses akan muncul di sini." />
        </Card>
      )}

      <div className="space-y-2">
        {entries.map((entry) => (
          <div key={entry.id} className="rounded-xl border border-outline-variant bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-on-surface">{entry.invoice_number}</p>
              <p className="text-xs text-on-surface-variant">{formatDateTime(entry.processed_at)}</p>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              {ORDER_STATUS_LABEL[entry.from_status as OrderStatus] ?? entry.from_status} →{" "}
              {ORDER_STATUS_LABEL[entry.to_status as OrderStatus] ?? entry.to_status}
            </p>
          </div>
        ))}
      </div>

      {entries.length > 0 && <Pagination page={page} limit={LIMIT} totalCount={total} onPageChange={setPage} />}
    </main>
  );
}
