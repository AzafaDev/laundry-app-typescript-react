import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAddressQuery } from "../hooks/addresses/useAddressQuery";
import { AddressForm } from "../components/address/AddressForm";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { buttonClasses } from "../components/ui/buttonStyles";

export function AddressEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addressQuery = useAddressQuery(id);
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

  if (addressQuery.isLoading) {
    return (
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-10 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Edit Alamat</h1>
        <div className="h-[88px] rounded-3xl bg-surface-container animate-pulse" />
      </main>
    );
  }

  if (addressQuery.isError) {
    return (
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-10">
        <div className="text-center py-12 px-6">
          <p className="text-sm text-on-surface-variant mb-5">Alamat tidak ditemukan</p>
          <Link to="/addresses" className={buttonClasses("primary", "md")}>Kembali ke daftar alamat</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-10 space-y-6">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Edit Alamat</h1>
        <button
          type="button"
          onClick={handleCancel}
          className="text-xs font-bold uppercase tracking-[0.06em] text-on-surface-variant hover:text-primary"
        >
          Batal
        </button>
      </div>
      <AddressForm initialData={addressQuery.data} onSuccess={() => navigate("/addresses")} onDirtyChange={setIsDirty} />

      <ConfirmDialog
        open={confirmOpen}
        title="Batalkan perubahan alamat?"
        description="Perubahan yang belum disimpan akan hilang."
        confirmLabel="Batalkan"
        danger
        onConfirm={() => navigate("/addresses")}
        onCancel={() => setConfirmOpen(false)}
      />
    </main>
  );
}
