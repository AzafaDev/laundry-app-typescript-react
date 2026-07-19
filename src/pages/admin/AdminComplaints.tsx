import { useState } from "react";
import { AlertCircle, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import { useComplaintStatsQuery } from "../../hooks/admin/useComplaintStatsQuery";
import { useComplaintsQuery } from "../../hooks/admin/useComplaintsQuery";
import { useStaffAuth } from "../../context/StaffAuthContext";
import { AdminComplaintDetailModal } from "../../components/admin/AdminComplaintDetailModal";
import type { AdminComplaintResponse } from "../../api/complaints";
import "../../styles/admin.css";
import "../../styles/admin-complaints.css";

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
    <div className="admin-page admin-page-wide">
      <div className="admin-page-header">
        <h1>Manajemen Komplain</h1>
      </div>

      {/* Stats Section */}
      <div className="complaint-stats-grid">
        <div className="complaint-stat-tile complaint-stat-open">
          <div className="complaint-stat-icon">{statusIcon.open}</div>
          <div className="complaint-stat-content">
            <div className="complaint-stat-count">{stats.open}</div>
            <div className="complaint-stat-label">{statusLabel.open}</div>
          </div>
        </div>
        <div className="complaint-stat-tile complaint-stat-in-progress">
          <div className="complaint-stat-icon">{statusIcon.in_progress}</div>
          <div className="complaint-stat-content">
            <div className="complaint-stat-count">{stats.in_progress}</div>
            <div className="complaint-stat-label">{statusLabel.in_progress}</div>
          </div>
        </div>
        <div className="complaint-stat-tile complaint-stat-resolved">
          <div className="complaint-stat-icon">{statusIcon.resolved}</div>
          <div className="complaint-stat-content">
            <div className="complaint-stat-count">{stats.resolved}</div>
            <div className="complaint-stat-label">{statusLabel.resolved}</div>
          </div>
        </div>
        <div className="complaint-stat-tile complaint-stat-rejected">
          <div className="complaint-stat-icon">{statusIcon.rejected}</div>
          <div className="complaint-stat-content">
            <div className="complaint-stat-count">{stats.rejected}</div>
            <div className="complaint-stat-label">{statusLabel.rejected}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filter-row">
        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
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
        <div className="filter-group filter-search">
          <label htmlFor="complaint-search">Cari</label>
          <div className="filter-search-input-wrapper">
            <Search className="w-4 h-4 filter-search-icon" />
            <input
              id="complaint-search"
              type="text"
              placeholder="No. Invoice atau Nama Customer"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOffset(0);
              }}
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="admin-table">
        <div className="admin-table-header">
          <div className="complaint-col-invoice">No. Invoice</div>
          <div className="complaint-col-customer">Customer</div>
          <div className="complaint-col-type">Tipe</div>
          <div className="complaint-col-date">Tgl. Dikirim</div>
          <div className="complaint-col-status">Status</div>
        </div>

        {listQuery.isLoading && (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--text)" }}>
            Memuat...
          </div>
        )}

        {!listQuery.isLoading && complaints.length === 0 && (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--text)" }}>
            Tidak ada komplain
          </div>
        )}

        {complaints.map((complaint) => (
          <div
            key={complaint.id}
            className="admin-table-row complaint-row"
            onClick={() => setSelectedComplaint(complaint)}
            style={{ cursor: "pointer" }}
          >
            <div className="complaint-col-invoice" data-label="No. Invoice">
              <span className="complaint-invoice-number">{complaint.invoice_number}</span>
            </div>
            <div className="complaint-col-customer" data-label="Customer">
              <span className="complaint-customer-name">{complaint.customer_name}</span>
            </div>
            <div className="complaint-col-type" data-label="Tipe">
              <span className="complaint-type-badge">{complaintTypeLabel[complaint.complaint_type]}</span>
            </div>
            <div className="complaint-col-date" data-label="Tgl. Dikirim">
              <span className="complaint-date">{new Date(complaint.created_at).toLocaleDateString("id-ID")}</span>
            </div>
            <div className="complaint-col-status" data-label="Status">
              <span className={`complaint-status-badge complaint-status-${complaint.status}`}>
                {statusIcon[complaint.status]}
                {statusLabel[complaint.status]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            disabled={currentPage === 1 || listQuery.isLoading}
            onClick={() => setOffset(Math.max(0, offset - defaultPageLimit))}
          >
            Sebelumnya
          </button>
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages || listQuery.isLoading}
            onClick={() => setOffset(offset + defaultPageLimit)}
          >
            Berikutnya
          </button>
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
    </div>
  );
}
