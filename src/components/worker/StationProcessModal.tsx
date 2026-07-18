import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useStationOrderItemsQuery } from "../../hooks/worker/useStationOrderItemsQuery";
import { useSubmitItemsMutation } from "../../hooks/worker/useSubmitItemsMutation";
import { useCreateBypassRequestMutation } from "../../hooks/worker/useCreateBypassRequestMutation";
import type { Discrepancy, Station } from "../../types/worker";
import { ApiErrorMessage } from "../ApiErrorMessage";
import "../../styles/auth.css";

interface Props {
  station: Station;
  orderId: string;
  invoiceNumber: string;
  onClose: () => void;
}

// The parent only mounts this while a specific order is being processed, so
// a fresh mount already gives fresh initial state.
export function StationProcessModal({ station, orderId, invoiceNumber, onClose }: Props) {
  const itemsQuery = useStationOrderItemsQuery(station, orderId);
  const submitMutation = useSubmitItemsMutation();
  const bypassMutation = useCreateBypassRequestMutation();

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[] | null>(null);
  const [bypassDescription, setBypassDescription] = useState("");

  const items = itemsQuery.data?.data ?? [];

  // No default value from `item.quantity` here on purpose — pre-filling the
  // input with the expected count would let the worker submit without
  // actually counting anything, defeating the point of this verification
  // step entirely.
  const quantityFor = (itemId: string) => quantities[itemId] ?? 0;

  const buildActualPayload = () => {
    const actual_items = items
      .filter((i) => i.item_type === "clothing_type")
      .map((i) => ({ clothing_type_id: i.item_id, actual_quantity: quantityFor(i.item_id) }));
    const actual_satuan_items = items
      .filter((i) => i.item_type === "laundry_item")
      .map((i) => ({ laundry_item_id: i.item_id, actual_quantity: quantityFor(i.item_id) }));
    return { actual_items, actual_satuan_items };
  };

  const handleSubmit = () => {
    submitMutation.mutate(
      { station, orderId, ...buildActualPayload() },
      {
        onSuccess: (result) => {
          if (result.success) {
            toast.success("Item berhasil diverifikasi");
            onClose();
          } else if (result.requires_bypass) {
            setDiscrepancies(result.discrepancies ?? []);
          }
        },
      },
    );
  };

  const handleBypassSubmit = () => {
    const payload = buildActualPayload();
    bypassMutation.mutate(
      {
        order_id: orderId,
        discrepancy_description: bypassDescription,
        ...payload,
      },
      {
        onSuccess: () => {
          toast.success("Permintaan bypass terkirim, menunggu review admin");
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[10px]">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold text-on-surface">{invoiceNumber}</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-container-high rounded-full p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {itemsQuery.isLoading && <p className="text-sm text-on-surface-variant">Memuat item...</p>}
          {!itemsQuery.isLoading && items.length === 0 && (
            <p className="text-sm text-on-surface-variant">Tidak ada item pada pesanan ini.</p>
          )}

          {!discrepancies &&
            items.map((item) => (
              <div key={item.item_id} className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-on-surface">{item.name}</p>
                <input
                  type="number"
                  min={0}
                  value={quantityFor(item.item_id)}
                  onChange={(e) =>
                    setQuantities((prev) => ({ ...prev, [item.item_id]: Number(e.target.value) }))
                  }
                  className="w-20 bg-white border border-outline-variant rounded-lg p-2 text-sm text-center"
                />
              </div>
            ))}

          {discrepancies && (
            <div className="space-y-3">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-sm text-amber-800 space-y-1">
                  <p className="font-semibold">Jumlah tidak cocok, perlu bypass admin.</p>
                  {discrepancies.map((d) => (
                    <p key={d.item_id}>
                      {d.name}: diharapkan {d.expected}, aktual {d.actual}
                    </p>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-on-surface">Keterangan Selisih</label>
                <textarea
                  value={bypassDescription}
                  onChange={(e) => setBypassDescription(e.target.value)}
                  className="w-full bg-white border border-outline-variant rounded-lg p-3 text-sm h-24 focus:border-primary"
                  placeholder="Jelaskan kenapa jumlahnya beda..."
                />
              </div>
            </div>
          )}

          <ApiErrorMessage error={submitMutation.error ?? bypassMutation.error} />
        </div>

        <div className="p-6 bg-surface-container-low flex gap-4 shrink-0">
          <button
            onClick={onClose}
            disabled={submitMutation.isPending || bypassMutation.isPending}
            className="flex-1 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high rounded-lg disabled:opacity-50"
          >
            Batal
          </button>
          {!discrepancies ? (
            <button
              onClick={handleSubmit}
              disabled={submitMutation.isPending || items.length === 0}
              className="flex-1 py-2 text-sm font-bold bg-primary text-on-primary rounded-lg shadow-sm hover:opacity-90 active:scale-95 disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {submitMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Kirim
            </button>
          ) : (
            <button
              onClick={handleBypassSubmit}
              disabled={bypassMutation.isPending || bypassDescription.trim().length === 0}
              className="flex-1 py-2 text-sm font-bold bg-primary text-on-primary rounded-lg shadow-sm hover:opacity-90 active:scale-95 disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {bypassMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Ajukan Bypass
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
