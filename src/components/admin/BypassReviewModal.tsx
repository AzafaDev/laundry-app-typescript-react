import { useState } from "react";
import { CheckCircle2, Loader2, X, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useReviewBypassRequestMutation } from "../../hooks/adminBypass/useReviewBypassRequestMutation";
import type { BypassRequest } from "../../types/worker";
import { ApiErrorMessage } from "../ApiErrorMessage";
import "../../styles/auth.css";

interface Props {
  bypass: BypassRequest;
  onClose: () => void;
}

function ItemList({ title, items }: { title: string; items: BypassRequest["expected_items"] }) {
  return (
    <div>
      <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide mb-1">{title}</p>
      {items.length === 0 ? (
        <p className="text-sm text-on-surface-variant">-</p>
      ) : (
        <ul className="text-sm text-on-surface space-y-0.5">
          {items.map((item) => (
            <li key={item.item_id}>
              {item.name}: {item.quantity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function BypassReviewModal({ bypass, onClose }: Props) {
  const [adminNotes, setAdminNotes] = useState("");
  const reviewMutation = useReviewBypassRequestMutation();

  const handleReview = (approve: boolean) => {
    reviewMutation.mutate(
      { id: bypass.id, approve, adminNotes: adminNotes.trim() || undefined },
      {
        onSuccess: () => {
          toast.success(approve ? "Bypass disetujui" : "Bypass ditolak");
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[10px]">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-bold text-on-surface">{bypass.invoice_number ?? bypass.order_id}</h2>
            <p className="text-xs text-on-surface-variant uppercase tracking-wide">Station: {bypass.station}</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-container-high rounded-full p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <p className="text-xs text-on-surface-variant">Diajukan oleh</p>
            <p className="text-sm font-medium text-on-surface">{bypass.requested_by_name ?? bypass.requested_by}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ItemList title="Diharapkan" items={bypass.expected_items} />
            <ItemList title="Aktual (dilaporkan)" items={bypass.actual_items} />
          </div>

          <div>
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide mb-1">Keterangan Selisih</p>
            <p className="text-sm text-on-surface">{bypass.discrepancy_description}</p>
          </div>

          {bypass.photo_evidence.length > 0 && (
            <div>
              <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide mb-1">Foto Bukti</p>
              <div className="flex flex-wrap gap-2">
                {bypass.photo_evidence.map((url) => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="block w-20 h-20 rounded-lg overflow-hidden border border-outline-variant">
                    <img src={url} alt="Bukti bypass" className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {bypass.status === "pending" ? (
            <div className="space-y-1">
              <label className="text-sm font-bold text-on-surface">Catatan Admin (opsional)</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full bg-white border border-outline-variant rounded-lg p-3 text-sm h-20 focus:border-primary"
                placeholder="Alasan approve/reject..."
              />
            </div>
          ) : (
            <div className="rounded-xl border border-outline-variant bg-surface-container-low p-3 space-y-1">
              <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                Status: {bypass.status === "approved" ? "Disetujui" : "Ditolak"}
              </p>
              {bypass.admin_notes && <p className="text-sm text-on-surface">{bypass.admin_notes}</p>}
            </div>
          )}

          <ApiErrorMessage error={reviewMutation.error} />
        </div>

        {bypass.status === "pending" && (
          <div className="p-6 bg-surface-container-low flex gap-4 shrink-0">
            <button
              onClick={() => handleReview(false)}
              disabled={reviewMutation.isPending}
              className="flex-1 py-2 text-sm font-bold text-error border border-error/30 rounded-lg hover:bg-error/5 disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {reviewMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Tolak
            </button>
            <button
              onClick={() => handleReview(true)}
              disabled={reviewMutation.isPending}
              className="flex-1 py-2 text-sm font-bold bg-primary text-on-primary rounded-lg shadow-sm hover:opacity-90 active:scale-95 disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {reviewMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Setujui
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
