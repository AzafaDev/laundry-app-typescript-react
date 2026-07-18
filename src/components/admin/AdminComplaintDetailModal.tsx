import { useState } from "react";
import { X, Phone, AlertCircle } from "lucide-react";
import type { AdminComplaintResponse, UpdateComplaintStatusRequest } from "../../api/complaints";
import { useUpdateComplaintStatusMutation } from "../../hooks/admin/useUpdateComplaintStatusMutation";
import "../../styles/admin-complaints.css";

interface AdminComplaintDetailModalProps {
  complaint: AdminComplaintResponse;
  onClose: () => void;
  onStatusUpdated: () => void;
}

const statusLabel: Record<string, string> = {
  open: "Terbuka",
  in_progress: "Diproses",
  resolved: "Selesai",
  rejected: "Ditolak",
};

const complaintTypeLabel: Record<string, string> = {
  missing_item: "Barang Hilang",
  damaged_item: "Barang Rusak",
  wrong_item: "Barang Salah",
  late_delivery: "Pengiriman Terlambat",
  quality_issue: "Masalah Kualitas",
  other: "Lainnya",
};

const validTransitions: Record<string, string[]> = {
  open: ["in_progress", "rejected"],
  in_progress: ["resolved", "rejected"],
};

const transitionLabel: Record<string, string> = {
  in_progress: "Mulai Proses",
  resolved: "Tandai Selesai",
  rejected: "Tolak Komplain",
};

export function AdminComplaintDetailModal({ complaint, onClose, onStatusUpdated }: AdminComplaintDetailModalProps) {
  const updateMutation = useUpdateComplaintStatusMutation();

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState(complaint.resolution_notes || "");
  const [expectedResolutionDate, setExpectedResolutionDate] = useState(complaint.expected_resolution_date || "");
  const [error, setError] = useState<string | null>(null);

  const validNextStatuses = validTransitions[complaint.status] || [];
  const isTerminal = complaint.status === "resolved" || complaint.status === "rejected";

  const handleStatusChange = async (newStatus: string) => {
    if (!validNextStatuses.includes(newStatus)) {
      setError("Status transisi tidak valid");
      return;
    }

    const request: UpdateComplaintStatusRequest = {
      status: newStatus as "in_progress" | "resolved" | "rejected",
      resolution_notes: resolutionNotes || undefined,
      expected_resolution_date: expectedResolutionDate || undefined,
    };

    updateMutation.mutate(
      { id: complaint.id, request },
      {
        onSuccess: () => {
          onStatusUpdated();
          onClose();
        },
        onError: (err) => {
          setError(err.message || "Gagal memperbarui status");
        },
      }
    );
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="complaint-detail-modal">
        <div className="complaint-modal-header">
          <h2>Rincian Komplain</h2>
          <button className="complaint-modal-close" onClick={onClose} aria-label="Tutup">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="complaint-modal-body">
          {/* Order Context */}
          <section className="complaint-section">
            <h3 className="complaint-section-title">Pesanan</h3>
            <div className="complaint-info-grid">
              <div className="complaint-info-item">
                <span className="complaint-info-label">No. Invoice</span>
                <span className="complaint-info-value">{complaint.invoice_number}</span>
              </div>
              <div className="complaint-info-item">
                <span className="complaint-info-label">Customer</span>
                <span className="complaint-info-value">{complaint.customer_name}</span>
              </div>
              <div className="complaint-info-item">
                <span className="complaint-info-label">Kontak</span>
                <span className="complaint-info-value">
                  <a href={`tel:${complaint.customer_phone}`} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Phone className="w-4 h-4" />
                    {complaint.customer_phone}
                  </a>
                </span>
              </div>
              <div className="complaint-info-item">
                <span className="complaint-info-label">Tanggal Dikirim</span>
                <span className="complaint-info-value">{new Date(complaint.created_at).toLocaleDateString("id-ID")}</span>
              </div>
            </div>
          </section>

          {/* Complaint Details */}
          <section className="complaint-section">
            <h3 className="complaint-section-title">Rincian Komplain</h3>
            <div className="complaint-detail-info">
              <div>
                <label className="complaint-info-label">Tipe Komplain</label>
                <p>{complaintTypeLabel[complaint.complaint_type]}</p>
              </div>
              <div>
                <label className="complaint-info-label">Deskripsi</label>
                <p>{complaint.description}</p>
              </div>
            </div>

            {/* Photos */}
            {complaint.photo_urls && complaint.photo_urls.length > 0 && (
              <div className="complaint-photos-section">
                <label className="complaint-info-label">Foto</label>
                <div className="complaint-photos-grid">
                  {complaint.photo_urls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="complaint-photo-thumbnail"
                    >
                      <img src={url} alt={`Foto komplain ${idx + 1}`} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Current Status and Resolution */}
          <section className="complaint-section">
            <h3 className="complaint-section-title">Status & Resolusi</h3>
            <div className="complaint-status-display">
              <span className="complaint-info-label">Status Saat Ini</span>
              <span className={`complaint-status-badge complaint-status-${complaint.status}`}>{statusLabel[complaint.status]}</span>
            </div>

            {complaint.resolved_at && (
              <div className="complaint-resolution-info">
                <div className="complaint-info-item">
                  <span className="complaint-info-label">Diselesaikan Oleh</span>
                  <span className="complaint-info-value">{complaint.resolved_by_name || complaint.resolved_by}</span>
                </div>
                <div className="complaint-info-item">
                  <span className="complaint-info-label">Tanggal Resolusi</span>
                  <span className="complaint-info-value">{new Date(complaint.resolved_at).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
            )}

            {complaint.resolution_notes && (
              <div className="complaint-info-item">
                <span className="complaint-info-label">Catatan Resolusi</span>
                <p>{complaint.resolution_notes}</p>
              </div>
            )}

            {complaint.expected_resolution_date && (
              <div className="complaint-info-item">
                <span className="complaint-info-label">Tanggal Resolusi Target</span>
                <span className="complaint-info-value">{complaint.expected_resolution_date}</span>
              </div>
            )}
          </section>

          {/* Status Action Section */}
          {!isTerminal && (
            <section className="complaint-section">
              <h3 className="complaint-section-title">Ubah Status</h3>

              {error && (
                <div className="complaint-error-message">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="complaint-transition-buttons">
                {validNextStatuses.map((nextStatus) => (
                  <button
                    key={nextStatus}
                    className={`complaint-transition-button complaint-transition-${nextStatus}`}
                    onClick={() => setSelectedStatus(nextStatus)}
                    disabled={updateMutation.isPending}
                  >
                    {transitionLabel[nextStatus]}
                  </button>
                ))}
              </div>

              {selectedStatus && (
                <div className="complaint-action-form">
                  <div className="form-group">
                    <label htmlFor="resolution-date">Tanggal Resolusi Target</label>
                    <input
                      id="resolution-date"
                      type="date"
                      value={expectedResolutionDate}
                      onChange={(e) => setExpectedResolutionDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="resolution-notes">Catatan Resolusi</label>
                    <textarea
                      id="resolution-notes"
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="Jelaskan tindakan yang diambil..."
                      rows={4}
                    />
                  </div>

                  <div className="complaint-action-buttons">
                    <button
                      className="btn-secondary"
                      onClick={() => setSelectedStatus(null)}
                      disabled={updateMutation.isPending}
                    >
                      Batal
                    </button>
                    <button
                      className={`btn-primary complaint-btn-${selectedStatus}`}
                      onClick={() => handleStatusChange(selectedStatus)}
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? "Memproses..." : "Ubah Status"}
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
}
