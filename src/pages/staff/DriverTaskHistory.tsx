import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTaskHistoryQuery } from "../../hooks/driver/useTaskHistoryQuery";
import { formatDateTime } from "../../components/orders/orderConstants";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import "../../styles/auth.css";

const LIMIT = 20;
const TASK_TYPE_LABEL: Record<string, string> = { pickup: "Pickup", delivery: "Delivery" };

export function DriverTaskHistory() {
  const [page, setPage] = useState(1);
  const offset = (page - 1) * LIMIT;
  const historyQuery = useTaskHistoryQuery(LIMIT, offset);

  const tasks = historyQuery.data?.data ?? [];
  const total = historyQuery.data?.total_count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <Link to="/staff/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke dashboard
      </Link>

      <h1 className="text-2xl font-bold text-on-surface">Riwayat Task</h1>

      <ApiErrorMessage error={historyQuery.error} />

      {historyQuery.isLoading && <p className="text-sm text-on-surface-variant">Memuat...</p>}
      {!historyQuery.isLoading && tasks.length === 0 && (
        <p className="text-sm text-on-surface-variant">Belum ada task yang kamu selesaikan.</p>
      )}

      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-xl border border-outline-variant bg-surface p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-on-surface">{task.invoice_number}</p>
              <p className="text-xs text-on-surface-variant">{TASK_TYPE_LABEL[task.task_type] ?? task.task_type}</p>
            </div>
            <p className="text-xs text-on-surface-variant">
              {task.completed_at ? formatDateTime(task.completed_at) : "-"}
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
