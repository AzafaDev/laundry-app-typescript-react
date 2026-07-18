import { useState } from "react";
import { History } from "lucide-react";
import { useTaskHistoryQuery } from "../../hooks/driver/useTaskHistoryQuery";
import { formatDateTime } from "../../components/orders/orderConstants";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import { Card } from "../../components/ui/Card";
import { Pagination } from "../../components/ui/Pagination";
import { LoadingState, EmptyState } from "../../components/ui/PageState";
import { BackLink } from "../../components/ui/BackLink";

const LIMIT = 20;
const TASK_TYPE_LABEL: Record<string, string> = { pickup: "Pickup", delivery: "Delivery" };

export function DriverTaskHistory() {
  const [page, setPage] = useState(1);
  const offset = (page - 1) * LIMIT;
  const historyQuery = useTaskHistoryQuery(LIMIT, offset);

  const tasks = historyQuery.data?.data ?? [];
  const total = historyQuery.data?.total_count ?? 0;

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>

      <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Riwayat Task</h1>

      <ApiErrorMessage error={historyQuery.error} />

      {historyQuery.isLoading && (
        <Card>
          <LoadingState label="Memuat riwayat task..." bordered={false} />
        </Card>
      )}

      {!historyQuery.isLoading && tasks.length === 0 && !historyQuery.isError && (
        <Card>
          <EmptyState icon={History} title="Belum ada riwayat" description="Task yang sudah kamu selesaikan akan muncul di sini." />
        </Card>
      )}

      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-xl border border-outline-variant bg-surface p-4 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm font-bold text-on-surface truncate">{task.invoice_number}</p>
              <p className="text-xs text-on-surface-variant">{TASK_TYPE_LABEL[task.task_type] ?? task.task_type}</p>
            </div>
            <p className="text-xs text-on-surface-variant shrink-0">
              {task.completed_at ? formatDateTime(task.completed_at) : "-"}
            </p>
          </div>
        ))}
      </div>

      {tasks.length > 0 && <Pagination page={page} limit={LIMIT} totalCount={total} onPageChange={setPage} />}
    </main>
  );
}
