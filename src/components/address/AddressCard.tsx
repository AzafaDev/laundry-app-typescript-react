import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import type { Address } from "../../types/address";
import { useDeleteAddressMutation } from "../../hooks/addresses/useDeleteAddressMutation";
import { useSetPrimaryAddressMutation } from "../../hooks/addresses/useSetPrimaryAddressMutation";
import { Card } from "../ui/Card";
import { ConfirmDialog } from "../ui/ConfirmDialog";

const toggleClasses = "text-xs font-bold uppercase tracking-[0.06em] text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline";
const UNDO_WINDOW_MS = 4000;

interface AddressCardProps {
  address: Address;
}

export function AddressCard({ address }: AddressCardProps) {
  const deleteMutation = useDeleteAddressMutation();
  const setPrimaryMutation = useSetPrimaryAddressMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    };
  }, []);

  const confirmDelete = () => {
    setConfirmOpen(false);
    setPendingDelete(true);

    const toastId = toast(
      (t) => (
        <span className="flex items-center gap-3">
          Alamat "{address.label}" akan dihapus.
          <button
            type="button"
            onClick={() => {
              if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
              setPendingDelete(false);
              toast.dismiss(t.id);
            }}
            className="font-bold text-primary hover:underline"
          >
            Urungkan
          </button>
        </span>
      ),
      { duration: UNDO_WINDOW_MS },
    );

    deleteTimerRef.current = setTimeout(() => {
      deleteMutation.mutate(address.id, {
        onError: () => {
          setPendingDelete(false);
          toast.dismiss(toastId);
        },
      });
    }, UNDO_WINDOW_MS);
  };

  const handleSetPrimary = () => {
    setPrimaryMutation.mutate(address.id);
  };

  return (
    <Card className={`p-5 transition-opacity ${pendingDelete ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
        <span className="text-sm font-bold text-on-surface">{address.label}</span>
        {address.is_primary && (
          <span className="inline-block rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-on-primary">
            Utama
          </span>
        )}
      </div>

      <p className="text-sm text-on-surface-variant mb-3">
        {address.address}, {address.district}, {address.city}, {address.province}
        {address.postal_code ? ` ${address.postal_code}` : ""}
      </p>

      {pendingDelete ? (
        <p className="text-xs text-on-surface-variant">Menghapus alamat ini...</p>
      ) : (
        <div className="flex flex-wrap gap-x-4 gap-y-2.5">
          <Link to={`/addresses/${address.id}/edit`} className={toggleClasses}>EDIT</Link>

          {!address.is_primary && (
            <button
              type="button"
              className={toggleClasses}
              onClick={handleSetPrimary}
              disabled={setPrimaryMutation.isPending}
            >
              {setPrimaryMutation.isPending ? "MENJADIKAN UTAMA..." : "JADIKAN UTAMA"}
            </button>
          )}

          <button
            type="button"
            className={`${toggleClasses} text-error`}
            onClick={() => setConfirmOpen(true)}
          >
            HAPUS
          </button>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Hapus alamat ini?"
        description={
          address.is_primary
            ? "Alamat ini adalah alamat utama. Alamat lain akan otomatis jadi utama."
            : "Tindakan ini bisa diurungkan sesaat setelah dihapus."
        }
        confirmLabel="Hapus"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Card>
  );
}
