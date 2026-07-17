import { useEffect, useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { useCreateComplaintMutation } from "../../hooks/orders/useCreateComplaintMutation";
import type { ComplaintType } from "../../types/order";
import { ApiError } from "../../api/client";

interface Props {
  orderId: string;
  onClose: () => void;
}

const COMPLAINT_TYPE_OPTIONS: { value: ComplaintType; label: string }[] = [
  { value: "missing_item", label: "Item hilang" },
  { value: "damaged_item", label: "Item rusak" },
  { value: "wrong_item", label: "Item tertukar" },
  { value: "late_delivery", label: "Pengantaran terlambat" },
  { value: "quality_issue", label: "Kualitas cuci kurang baik" },
  { value: "other", label: "Lainnya" },
];

// The parent only mounts this component while the modal should be open (see
// OrderDetail.tsx: `{complaintOpen && <ComplaintModal ... />}`), so a fresh
// mount already gives fresh initial state — no reset-on-open effect needed.
export function ComplaintModal({ orderId, onClose }: Props) {
  const [complaintType, setComplaintType] = useState<ComplaintType>("missing_item");
  const [description, setDescription] = useState("");
  const mutation = useCreateComplaintMutation();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleSubmit = () => {
    mutation.mutate(
      { orderId, data: { complaint_type: complaintType, description } },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[10px]">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-error" />
            Ajukan Komplain
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-container-high rounded-full p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            <label className="text-sm font-bold text-on-surface">Jenis Komplain</label>
            <select
              value={complaintType}
              onChange={(e) => setComplaintType(e.target.value as ComplaintType)}
              className="w-full bg-white border border-outline-variant rounded-lg p-3 text-sm focus:border-primary"
            >
              {COMPLAINT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-on-surface">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-lg p-3 text-sm h-28 focus:border-primary"
              placeholder="Jelaskan kendala yang kamu alami..."
            />
          </div>

          {mutation.isError && (
            <p className="text-xs text-error">
              {mutation.error instanceof ApiError ? mutation.error.message : "Gagal mengirim komplain. Coba lagi."}
            </p>
          )}
        </div>

        <div className="p-6 bg-surface-container-low flex gap-4 shrink-0">
          <button
            onClick={onClose}
            disabled={mutation.isPending}
            className="flex-1 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high rounded-lg disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending || description.trim().length === 0}
            className="flex-1 py-2 text-sm font-bold bg-primary text-on-primary rounded-lg shadow-sm hover:opacity-90 active:scale-95 disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Kirim Komplain
          </button>
        </div>
      </div>
    </div>
  );
}
