import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useMyAttendanceLogsQuery } from "../../hooks/attendance/useMyAttendanceLogsQuery";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import "../../styles/auth.css";

const LIMIT = 20;

export function AttendanceHistory() {
  const [page, setPage] = useState(1);
  const offset = (page - 1) * LIMIT;
  const logsQuery = useMyAttendanceLogsQuery(LIMIT, offset);

  const logs = logsQuery.data?.data ?? [];
  const total = logsQuery.data?.total_count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <Link to="/staff/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke dashboard
      </Link>

      <h1 className="text-2xl font-bold text-on-surface">Riwayat Absensi</h1>

      <ApiErrorMessage error={logsQuery.error} />

      {logsQuery.isLoading && <p className="text-sm text-on-surface-variant">Memuat...</p>}
      {!logsQuery.isLoading && logs.length === 0 && (
        <p className="text-sm text-on-surface-variant">Belum ada riwayat absensi.</p>
      )}

      <div className="space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="rounded-xl border border-outline-variant bg-surface p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface">{log.date}</p>
              <p className="text-xs text-on-surface-variant">
                {log.check_in_time ? new Date(log.check_in_time).toLocaleTimeString("id-ID") : "-"} —{" "}
                {log.check_out_time ? new Date(log.check_out_time).toLocaleTimeString("id-ID") : "-"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-on-surface">{log.status}</p>
              {log.is_late && <p className="text-xs text-error">Telat {log.late_minutes} menit</p>}
            </div>
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
