import { useState } from "react";
import { Download, BarChart3 } from "lucide-react";
import toast from "react-hot-toast";
import { useStaffAuth } from "../../context/StaffAuthContext";
import { useSalesReportQuery } from "../../hooks/reports/useSalesReportQuery";
import { useOutletsQuery, OUTLET_SELECT_LIMIT } from "../../hooks/outlets/useOutletsQuery";
import type { SalesReportFilters } from "../../types/reports";
import { exportSalesReport } from "../../api/reports";
import { ApiError } from "../../api/client";
import { buttonClasses } from "../../components/ui/buttonStyles";
import { Card } from "../../components/ui/Card";
import { inputClasses } from "../../components/ui/Input";
import { LoadingState, EmptyState } from "../../components/ui/PageState";
import { BackLink } from "../../components/ui/BackLink";

export function SalesReport() {
  const { employee } = useStaffAuth();
  const isSuperAdmin = employee?.role === "super_admin";

  const [filters, setFilters] = useState<SalesReportFilters>({ group_by: "month" });
  const [exportError, setExportError] = useState<string | null>(null);

  const reportQuery = useSalesReportQuery(filters);
  const data = reportQuery.data;

  const outletsQuery = useOutletsQuery(OUTLET_SELECT_LIMIT, 0);
  const outlets = outletsQuery.data?.data ?? [];

  const handleExport = async () => {
    setExportError(null);
    try {
      await exportSalesReport(filters);
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>

      <h1 className="text-2xl font-bold text-on-surface">Laporan Penjualan</h1>

      {/* Filters Section */}
      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-on-surface" htmlFor="group_by">
                Kelompokkan Berdasarkan
              </label>
              <select
                id="group_by"
                className={inputClasses}
                value={filters.group_by ?? "month"}
                onChange={(e) =>
                  setFilters({ ...filters, group_by: e.target.value as "day" | "month" | "year" })
                }
              >
                <option value="day">Harian</option>
                <option value="month">Bulanan</option>
                <option value="year">Tahunan</option>
              </select>
            </div>

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

      {/* Summary Cards */}
      {reportQuery.isLoading ? (
        <LoadingState label="Memuat laporan penjualan..." />
      ) : data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="p-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-on-surface-variant uppercase">Total Pendapatan</p>
                <p className="text-2xl font-bold text-on-surface">{formatCurrency(data.summary.total_income)}</p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-on-surface-variant uppercase">Total Pesanan</p>
                <p className="text-2xl font-bold text-on-surface">{data.summary.total_orders}</p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-on-surface-variant uppercase">Rata-rata per Pesanan</p>
                <p className="text-2xl font-bold text-on-surface">{formatCurrency(data.summary.average_per_order)}</p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-on-surface-variant uppercase">Rata-rata per Periode</p>
                <p className="text-2xl font-bold text-on-surface">{formatCurrency(data.summary.average_per_period)}</p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-on-surface-variant uppercase">Jumlah Periode</p>
                <p className="text-2xl font-bold text-on-surface">{data.summary.period_count}</p>
              </div>
            </Card>
          </div>

          {/* Chart Data Table */}
          {data.chart.length > 0 ? (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-outline">
                    <tr>
                      <th className="text-left py-3 px-4 font-bold text-on-surface">Periode</th>
                      <th className="text-right py-3 px-4 font-bold text-on-surface">Pendapatan</th>
                      <th className="text-right py-3 px-4 font-bold text-on-surface">Jumlah Pesanan</th>
                      <th className="text-right py-3 px-4 font-bold text-on-surface">Rata-rata per Pesanan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.chart.map((row, idx) => (
                      <tr key={idx} className="border-b border-outline hover:bg-surface-variant/30">
                        <td className="py-3 px-4 text-on-surface">{row.period}</td>
                        <td className="py-3 px-4 text-right text-on-surface font-medium">
                          {formatCurrency(row.income)}
                        </td>
                        <td className="py-3 px-4 text-right text-on-surface font-medium">
                          {row.order_count}
                        </td>
                        <td className="py-3 px-4 text-right text-on-surface font-medium">
                          {formatCurrency(row.average_per_order)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <EmptyState icon={BarChart3} title="Tidak ada data" description="Tidak ada data untuk periode ini" />
          )}
        </>
      ) : (
        <EmptyState icon={BarChart3} title="Tidak ada data" description="Tidak ada data untuk periode ini" />
      )}
    </main>
  );
}
