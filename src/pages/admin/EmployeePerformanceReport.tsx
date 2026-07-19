import { useState } from "react";
import { Download, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useStaffAuth } from "../../context/StaffAuthContext";
import { useEmployeePerformanceReportQuery } from "../../hooks/reports/useEmployeePerformanceReportQuery";
import { useOutletsQuery, OUTLET_SELECT_LIMIT } from "../../hooks/outlets/useOutletsQuery";
import type { SalesReportFilters } from "../../types/reports";
import { exportEmployeePerformanceReport } from "../../api/reports";
import { ApiError } from "../../api/client";
import { buttonClasses } from "../../components/ui/buttonStyles";
import { Card } from "../../components/ui/Card";
import { inputClasses } from "../../components/ui/Input";
import { LoadingState, EmptyState } from "../../components/ui/PageState";
import { BackLink } from "../../components/ui/BackLink";

export function EmployeePerformanceReport() {
  const { employee } = useStaffAuth();
  const isSuperAdmin = employee?.role === "super_admin";

  const [filters, setFilters] = useState<Omit<SalesReportFilters, "group_by">>({});
  const [exportError, setExportError] = useState<string | null>(null);

  const reportQuery = useEmployeePerformanceReportQuery(filters);
  const data = reportQuery.data?.data ?? [];

  const outletsQuery = useOutletsQuery(OUTLET_SELECT_LIMIT, 0);
  const outlets = outletsQuery.data?.data ?? [];

  const handleExport = async () => {
    setExportError(null);
    try {
      await exportEmployeePerformanceReport(filters);
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

      <h1 className="text-2xl font-bold text-on-surface">Laporan Performa Karyawan</h1>

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
              <label className="text-sm font-bold text-on-surface" htmlFor="date_from">
                Dari Tanggal
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
                Sampai Tanggal
              </label>
              <input
                id="date_to"
                type="date"
                className={inputClasses}
                value={filters.date_to ?? ""}
                onChange={(e) => setFilters({ ...filters, date_to: e.target.value || undefined })}
              />
            </div>
          </div>

          {exportError && (
            <div className="p-3 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded text-sm">
              {exportError}
            </div>
          )}

          <button
            type="button"
            onClick={handleExport}
            disabled={reportQuery.isLoading}
            className={`${buttonClasses("primary", "sm")} inline-flex items-center gap-2`}
          >
            <Download className="w-4 h-4" />
            {reportQuery.isLoading ? "Memuat..." : "Unduh CSV"}
          </button>
        </div>
      </Card>

      {/* Data Table */}
      {reportQuery.isLoading ? (
        <LoadingState label="Memuat laporan performa karyawan..." />
      ) : data.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-outline">
                <tr>
                  <th className="text-left py-3 px-4 font-bold text-on-surface">Nama</th>
                  <th className="text-left py-3 px-4 font-bold text-on-surface">Peran</th>
                  {isSuperAdmin && <th className="text-left py-3 px-4 font-bold text-on-surface">Outlet</th>}
                  <th className="text-right py-3 px-4 font-bold text-on-surface">Pekerjaan Pekerja</th>
                  <th className="text-right py-3 px-4 font-bold text-on-surface">Pekerjaan Pengemudi</th>
                  <th className="text-right py-3 px-4 font-bold text-on-surface">Total Pekerjaan</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.employee_id} className="border-b border-outline hover:bg-surface-variant/30">
                    <td className="py-3 px-4 text-on-surface font-medium">{row.name}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-surface-variant text-on-surface px-2 py-1 rounded">
                        {row.role}
                      </span>
                    </td>
                    {isSuperAdmin && (
                      <td className="py-3 px-4 text-on-surface text-sm">{row.outlet_id ?? "-"}</td>
                    )}
                    <td className="py-3 px-4 text-right text-on-surface font-medium">{row.worker_jobs}</td>
                    <td className="py-3 px-4 text-right text-on-surface font-medium">{row.driver_jobs}</td>
                    <td className="py-3 px-4 text-right text-on-surface font-bold text-base">
                      {row.total_jobs}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState icon={Users} title="Tidak ada data" description="Tidak ada data untuk periode ini" />
      )}
    </main>
  );
}
