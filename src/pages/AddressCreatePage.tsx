import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddressForm } from "../components/address/AddressForm";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

export function AddressCreatePage() {
  const navigate = useNavigate();
  const [isDirty, setIsDirty] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleCancel = () => {
    if (isDirty) {
      setConfirmOpen(true);
    } else {
      navigate("/addresses");
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-10 space-y-6">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Tambah Alamat</h1>
        <button
          type="button"
          onClick={handleCancel}
          className="text-xs font-bold uppercase tracking-[0.06em] text-on-surface-variant hover:text-primary"
        >
          Batal
        </button>
      </div>
      <AddressForm onSuccess={() => navigate("/addresses")} onDirtyChange={setIsDirty} />

      <ConfirmDialog
        open={confirmOpen}
        title="Batalkan penambahan alamat?"
        description="Perubahan yang belum disimpan akan hilang."
        confirmLabel="Batalkan"
        danger
        onConfirm={() => navigate("/addresses")}
        onCancel={() => setConfirmOpen(false)}
      />
    </main>
  );
}
