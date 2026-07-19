import { useState } from "react";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import { useStaffAuth } from "../../context/StaffAuthContext";
import { usePaginationParams } from "../../hooks/usePaginationParams";
import { useAttendanceReportQuery } from "../../hooks/attendanceReport/useAttendanceReportQuery";
import { useSweepMutation } from "../../hooks/attendanceReport/useSweepMutation";
import { useOutletsQuery, OUTLET_SELECT_LIMIT } from "../../hooks/outlets/useOutletsQuery";
import { useEmployeesQuery } from "../../hooks/employees/useEmployeesQuery";
import type { AttendanceReportFilters } from "../../types/attendanceReport";
import { exportAttendanceReport } from "../../api/attendanceAdmin";
import { ApiError } from "../../api/client";
import { buttonClasses } from "../../components/ui/buttonStyles";
import { Card } from "../../components/ui/Card";
import { inputClasses } from "../../components/ui/Input";
import { Pagination } from "../../components/ui/Pagination";
import { LoadingState, EmptyState } from "../../components/ui/PageState";
import { BackLink } from "../../components/ui/BackLink";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";

export function AttendanceReport() {
  const { employee } = useStaffAuth();
  const { page, limit, offset, setPage } = usePaginationParams();
  const isSuperAdmin = employee?.role === "super_admin";

  const [filters, setFilters] = useState<AttendanceReportFilters>({});
  const [exportError, setExportError] = useState<string | null>(null);

  const reportQuery = useAttendanceReportQuery(filters, limit, offset);
  const data = reportQuery.data?.data ?? [];
  const totalCount = reportQuery.data?.total_count ?? 0;

  const outletsQuery = useOutletsQuery(OUTLET_SELECT_LIMIT, 0);
  const outlets = outletsQuery.data?.data ?? [];

  const employeesQuery = useEmployeesQuery({ limit: 500, offset: 0 });
  const employees = employeesQuery.data?.data ?? [];

  const handleExport = async () => {
    setExportError(null);
    try {
      await exportAttendanceReport(filters);
      toast.success("File berhasil diunduh");
    } catch (err) {
      let error = "Gagal mengunduh file";
      if (err instanceof ApiError && err.status === 422) {
        error = "Persempit filter untuk mengurangi jumlah data";
      } else if (err instanceof ApiError) {
        error = err.message;
      }
      setExportError(error);
      toast.error(error);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>

      <h1 className="text-2xl font-bold text-on-surface">Laporan Absensi</h1>

      {/* Filters Section */}
      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isSuperAdmin && (
              <div className="space-y-1">
                <label className="text-sm font-bold text-on-surface" htmlFor="outlet_id">
                  Outlet
                </label>
                <select
                  id="outlet_id"
                  className={inputClasses}
                  value={filters.outlet_id ?? ""}
                  onChange={(e) => setFilters({ ...filters, outlet_id: e.target.value || undefined })}
                >
                  <option value="">Semua outlet</option>
                  {outlets.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-bold text-on-surface" htmlFor="employee_id">
                Karyawan
              </label>
              <select
                id="employee_id"
                className={inputClasses}
                value={filters.employee_id ?? ""}
                onChange={(e) => setFilters({ ...filters, employee_id: e.target.value || undefined })}
              >
                <option value="">Semua karyawan</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-on-surface" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className={inputClasses}
                value={filters.status ?? ""}
                onChange={(e) => setFilters({ ...filters, status: (e.target.value || undefined) as typeof filters.status })}
              >
                <option value="">Semua status</option>
                <option value="on_time">Tepat waktu</option>
                <option value="late">Terlambat</option>
                <option value="absent">Tidak hadir</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-on-surface" htmlFor="date_from">
                Dari tanggal
              </label>
              <input
                id="date_from"
                type="date"
                className={inputClasses}
                value={filters.date_from ?? ""}
                onChange={(e) => setFilters({ ...filters, date_from: e.target.value || undefined })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-on-surface" htmlFor="date_to">
                Hingga tanggal
              </label>
              <input
                id="date_to"
                type="date"
                className={inputClasses}
                value={filters.date_to ?? ""}
                onChange={(e) => setFilters({ ...filters, date_to: e.target.value || undefined })}
              />
            </div>
            <div className="flex items-end">
              <button onClick={handleExport} disabled={reportQuery.isLoading} className={buttonClasses("primary", "sm")}>
                <Download className="w-4 h-4" />
                Unduh CSV
              </button>
            </div>
          </div>

          {exportError && (
            <div className="rounded-lg border border-error/30 bg-error-container/40 px-4 py-2.5 text-sm text-on-error-container">
              {exportError}
            </div>
          )}
        </div>
      </Card>

      {/* Report Table */}
      <Card className="p-0 overflow-hidden">
        {reportQuery.isLoading ? (
          <div className="p-6">
            <LoadingState label="Memuat laporan..." bordered={false} />
          </div>
        ) : data.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={Download} title="Tidak ada data" description="Tidak ada catatan absensi yang sesuai filter." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low">
                  <th className="py-2.5 px-2 text-left text-xs font-semibold text-on-surface-variant uppercase">Karyawan</th>
                  <th className="py-2.5 px-2 text-left text-xs font-semibold text-on-surface-variant uppercase">Outlet</th>
                  <th className="py-2.5 px-2 text-left text-xs font-semibold text-on-surface-variant uppercase">Tanggal</th>
                  <th className="py-2.5 px-2 text-left text-xs font-semibold text-on-surface-variant uppercase">Check-in</th>
                  <th className="py-2.5 px-2 text-left text-xs font-semibold text-on-surface-variant uppercase">Check-out</th>
                  <th className="py-2.5 px-2 text-left text-xs font-semibold text-on-surface-variant uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((record) => (
                  <tr key={record.id} className="border-b border-outline-variant last:border-0">
                    <td className="py-3 px-2 text-sm text-on-surface">{record.employee_name || "—"}</td>
                    <td className="py-3 px-2 text-sm text-on-surface">{record.outlet_name || "—"}</td>
                    <td className="py-3 px-2 text-sm text-on-surface">{record.date}</td>
                    <td className="py-3 px-2 text-sm text-on-surface">
                      {record.check_in_time ? new Date(record.check_in_time).toLocaleTimeString("id-ID") : "—"}
                    </td>
                    <td className="py-3 px-2 text-sm text-on-surface">
                      {record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString("id-ID") : "—"}
                    </td>
                    <td className="py-3 px-2">
                      <StatusBadge status={record.status} isLate={record.is_late} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Pagination page={page} limit={limit} totalCount={totalCount} onPageChange={setPage} />

      {/* Sweep Section (Super Admin Only) */}
      {isSuperAdmin && <SweepSection />}
    </main>
  );
}

function StatusBadge({ status, isLate }: { status: string; isLate: boolean }) {
  const color = status === "absent" ? "bg-error" : isLate ? "bg-warning" : "bg-success";
  const label = status === "absent" ? "Tidak hadir" : isLate ? "Terlambat" : "Tepat waktu";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${color}`}>
      {label}
    </span>
  );
}

function SweepSection() {
  const [sweepDate, setSweepDate] = useState("");
  const [sweepResult, setSweepResult] = useState<{ marked_absent: number; auto_checked_out: number } | null>(null);
  const sweepMutation = useSweepMutation();

  const handleSweep = () => {
    if (!sweepDate) {
      toast.error("Pilih tanggal terlebih dahulu");
      return;
    }

    sweepMutation.mutate(sweepDate, {
      onSuccess: (result) => {
        setSweepResult(result);
        toast.success("Sweep berhasil dijalankan");
        setSweepDate("");
      },
    });
  };

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-on-surface mb-2">Jalankan End-of-Day Sweep</h2>
          <p className="text-sm text-on-surface-variant mb-4">Tandai tidak hadir untuk karyawan terjadwal yang belum check-in, dan auto-checkout untuk yang sudah check-in tapi belum check-out.</p>
        </div>

        <div className="flex gap-4 items-end">
          <div className="space-y-1 flex-1">
            <label className="text-sm font-bold text-on-surface" htmlFor="sweep_date">
              Tanggal
            </label>
            <input
              id="sweep_date"
              type="date"
              className={inputClasses}
              value={sweepDate}
              onChange={(e) => setSweepDate(e.target.value)}
              disabled={sweepMutation.isPending}
            />
          </div>
          <button
            onClick={handleSweep}
            disabled={sweepMutation.isPending}
            className={buttonClasses("primary", "sm")}
          >
            {sweepMutation.isPending ? "Menjalankan..." : "Jalankan Sweep"}
          </button>
        </div>

        {sweepResult && (
          <div className="rounded-lg border border-primary/30 bg-primary-container/40 px-4 py-3 space-y-2">
            <p className="text-sm font-semibold text-on-primary-container">Hasil Sweep</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-on-primary-container/80">Ditandai tidak hadir</p>
                <p className="font-bold text-lg text-on-primary-container">{sweepResult.marked_absent}</p>
              </div>
              <div>
                <p className="text-on-primary-container/80">Auto-checkout</p>
                <p className="font-bold text-lg text-on-primary-container">{sweepResult.auto_checked_out}</p>
              </div>
            </div>
          </div>
        )}

        <ApiErrorMessage error={sweepMutation.error} />
      </div>
    </Card>
  );
}
