import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useStaffAuth } from "../../context/StaffAuthContext";
import { useStationHistoryQuery } from "../../hooks/worker/useStationHistoryQuery";
import { STATION_FOR_ROLE, STATION_LABEL } from "../../components/worker/workerConstants";
import { ORDER_STATUS_LABEL, formatDateTime } from "../../components/orders/orderConstants";
import type { OrderStatus } from "../../types/order";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
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
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <Link to="/staff/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke dashboard
      </Link>

      <h1 className="text-2xl font-bold text-on-surface">
        Riwayat {station ? STATION_LABEL[station] : "Station"}
      </h1>

      <ApiErrorMessage error={historyQuery.error} />

      {historyQuery.isLoading && <p className="text-sm text-on-surface-variant">Memuat...</p>}
      {!historyQuery.isLoading && entries.length === 0 && (
        <p className="text-sm text-on-surface-variant">Belum ada order yang kamu proses.</p>
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-sm font-medium text-primary disabled:opacity-40"
          >
            Sebelumnya
          </button>
          <span className="text-sm text-on-surface-variant">{page} / {totalPages}</span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-sm font-medium text-primary disabled:opacity-40"
          >
            Berikutnya
          </button>
        </div>
      )}
    </main>
  );
}
