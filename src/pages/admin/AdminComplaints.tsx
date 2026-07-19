import { useState } from "react";
import { AlertCircle, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import { useComplaintStatsQuery } from "../../hooks/admin/useComplaintStatsQuery";
import { useComplaintsQuery } from "../../hooks/admin/useComplaintsQuery";
import { useStaffAuth } from "../../context/StaffAuthContext";
import { AdminComplaintDetailModal } from "../../components/admin/AdminComplaintDetailModal";
import type { AdminComplaintResponse } from "../../api/complaints";
import { Card } from "../../components/ui/Card";
import { inputClasses } from "../../components/ui/Input";

const defaultPageLimit = 20;
const complaintTypeLabel: Record<string, string> = {
  missing_item: "Barang Hilang",
  damaged_item: "Barang Rusak",
  wrong_item: "Barang Salah",
  late_delivery: "Pengiriman Terlambat",
  quality_issue: "Masalah Kualitas",
  other: "Lainnya",
};

const statusLabel: Record<string, string> = {
  open: "Terbuka",
  in_progress: "Diproses",
  resolved: "Selesai",
  rejected: "Ditolak",
};

const statusIcon: Record<string, React.ReactNode> = {
  open: <AlertCircle className="w-4 h-4" />,
  in_progress: <Clock className="w-4 h-4" />,
  resolved: <CheckCircle className="w-4 h-4" />,
  rejected: <XCircle className="w-4 h-4" />,
};

const statusBadgeClasses: Record<string, string> = {
  open: "bg-error-container text-on-error-container",
  in_progress: "bg-tertiary-container text-on-tertiary-container",
  resolved: "bg-primary/10 text-primary",
  rejected: "bg-surface-container text-on-surface-variant",
};

const complaintTypeBadgeClasses: Record<string, string> = {
  missing_item: "bg-error-container text-on-error-container",
  damaged_item: "bg-error/10 text-error",
  wrong_item: "bg-tertiary-container text-on-tertiary-container",
  late_delivery: "bg-tertiary-container text-on-tertiary-container",
  quality_issue: "bg-tertiary-container text-on-tertiary-container",
  other: "bg-surface-container text-on-surface-variant",
};

export function AdminComplaints() {
  const { employee } = useStaffAuth();
  const outletId = employee?.outlet_id;

  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [offset, setOffset] = useState<number>(0);
  const [selectedComplaint, setSelectedComplaint] = useState<AdminComplaintResponse | null>(null);

  const statsQuery = useComplaintStatsQuery({
    outlet_id: outletId,
  });

  const listQuery = useComplaintsQuery({
    status: status.length > 0 ? status : undefined,
    search: search.length > 0 ? search : undefined,
    limit: defaultPageLimit,
    offset,
    outlet_id: outletId,
  });

  const stats = statsQuery.data || {
    open: 0,
    in_progress: 0,
    resolved: 0,
    rejected: 0,
  };

  const complaints = listQuery.data?.data || [];
  const totalCount = listQuery.data?.total_count || 0;
  const totalPages = Math.ceil(totalCount / defaultPageLimit);
  const currentPage = Math.floor(offset / defaultPageLimit) + 1;

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-on-surface">Manajemen Komplain</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-error">{statusIcon.open}</div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase">{statusLabel.open}</p>
              <p className="text-2xl font-bold text-on-surface">{stats.open}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-tertiary-container">{statusIcon.in_progress}</div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase">{statusLabel.in_progress}</p>
              <p className="text-2xl font-bold text-on-surface">{stats.in_progress}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-primary">{statusIcon.resolved}</div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase">{statusLabel.resolved}</p>
              <p className="text-2xl font-bold text-on-surface">{stats.resolved}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-on-surface-variant">{statusIcon.rejected}</div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase">{statusLabel.rejected}</p>
              <p className="text-2xl font-bold text-on-surface">{stats.rejected}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="status-filter" className="text-sm font-bold text-on-surface">Status</label>
            <select
              id="status-filter"
              className={inputClasses}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setOffset(0);
              }}
            >
              <option value="">Semua Status</option>
              <option value="open">Terbuka</option>
              <option value="in_progress">Diproses</option>
              <option value="resolved">Selesai</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="complaint-search" className="text-sm font-bold text-on-surface">Cari</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
              <input
                id="complaint-search"
                type="text"
                placeholder="No. Invoice atau Nama Customer"
                className={`${inputClasses} pl-10`}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setOffset(0);
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="py-2.5 px-4 text-left text-xs font-semibold text-on-surface-variant uppercase">No. Invoice</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold text-on-surface-variant uppercase">Customer</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold text-on-surface-variant uppercase">Tipe</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold text-on-surface-variant uppercase">Tgl. Dikirim</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold text-on-surface-variant uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {listQuery.isLoading && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant">Memuat...</td>
                </tr>
              )}
              {!listQuery.isLoading && complaints.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant">Tidak ada komplain</td>
                </tr>
              )}
              {complaints.map((complaint) => (
                <tr
                  key={complaint.id}
                  onClick={() => setSelectedComplaint(complaint)}
                  className="border-b border-outline-variant last:border-0 cursor-pointer hover:bg-surface-variant/30"
                >
                  <td className="py-3 px-4 text-sm font-medium text-on-surface">{complaint.invoice_number}</td>
                  <td className="py-3 px-4 text-sm text-on-surface">{complaint.customer_name}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${complaintTypeBadgeClasses[complaint.complaint_type] ?? ""}`}>
                      {complaintTypeLabel[complaint.complaint_type]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-on-surface">{new Date(complaint.created_at).toLocaleDateString("id-ID")}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClasses[complaint.status] ?? ""}`}>
                      {statusIcon[complaint.status]}
                      {statusLabel[complaint.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-on-surface-variant">Halaman {currentPage} dari {totalPages}</span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1 || listQuery.isLoading}
              onClick={() => setOffset(Math.max(0, offset - defaultPageLimit))}
              className="px-4 py-2 text-sm font-semibold text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <button
              disabled={currentPage === totalPages || listQuery.isLoading}
              onClick={() => setOffset(offset + defaultPageLimit)}
              className="px-4 py-2 text-sm font-semibold text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedComplaint && (
        <AdminComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onStatusUpdated={() => {
            setSelectedComplaint(null);
          }}
        />
      )}
    </main>
  );
}
