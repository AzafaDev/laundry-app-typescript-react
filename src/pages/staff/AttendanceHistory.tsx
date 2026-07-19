import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { useMyAttendanceLogsQuery } from "../../hooks/attendance/useMyAttendanceLogsQuery";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import { Card } from "../../components/ui/Card";
import { Pagination } from "../../components/ui/Pagination";
import { LoadingState, EmptyState } from "../../components/ui/PageState";
import { BackLink } from "../../components/ui/BackLink";

const LIMIT = 20;
const STATUS_LABEL: Record<string, string> = {
  on_time: "Tepat waktu",
  late: "Telat",
  absent: "Tidak hadir",
};
const STATUS_BADGE: Record<string, string> = {
  on_time: "bg-primary/10 text-primary",
  late: "bg-tertiary-container text-on-tertiary-container",
  absent: "bg-error/10 text-error",
};

export function AttendanceHistory() {
  const [page, setPage] = useState(1);
  const offset = (page - 1) * LIMIT;
  const logsQuery = useMyAttendanceLogsQuery(LIMIT, offset);

  const logs = logsQuery.data?.data ?? [];
  const total = logsQuery.data?.total_count ?? 0;

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>

      <h1 className="text-2xl font-bold text-on-surface">Riwayat Absensi</h1>

      <ApiErrorMessage error={logsQuery.error} />

      {logsQuery.isLoading && (
        <Card>
          <LoadingState label="Memuat riwayat absensi..." bordered={false} />
        </Card>
      )}

      {!logsQuery.isLoading && logs.length === 0 && !logsQuery.isError && (
        <Card>
          <EmptyState icon={CalendarClock} title="Belum ada riwayat" description="Riwayat check-in/check-out kamu akan muncul di sini." />
        </Card>
      )}

      <div className="space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="rounded-xl border border-outline-variant bg-surface p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-on-surface">{log.date}</p>
              {log.outlet_name && <p className="text-xs text-on-surface-variant">{log.outlet_name}</p>}
              <p className="text-xs text-on-surface-variant">
                {log.check_in_time ? new Date(log.check_in_time).toLocaleTimeString("id-ID") : "-"} —{" "}
                {log.check_out_time ? new Date(log.check_out_time).toLocaleTimeString("id-ID") : "-"}
              </p>
              {log.is_late && <p className="text-xs text-error mt-0.5">Telat {log.late_minutes} menit</p>}
              {log.notes && <p className="text-xs text-on-surface-variant italic mt-0.5">"{log.notes}"</p>}
            </div>
            {log.status && (
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${STATUS_BADGE[log.status] ?? ""}`}>
                {STATUS_LABEL[log.status] ?? log.status}
              </span>
            )}
          </div>
        ))}
      </div>

      {logs.length > 0 && <Pagination page={page} limit={LIMIT} totalCount={total} onPageChange={setPage} />}
    </main>
  );
}
