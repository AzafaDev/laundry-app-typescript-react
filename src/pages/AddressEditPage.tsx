import { Link, useNavigate, useParams } from "react-router-dom";
import { useAddressQuery } from "../hooks/addresses/useAddressQuery";
import { AddressForm } from "../components/address/AddressForm";
import { buttonClasses } from "../components/ui/buttonStyles";

export function AddressEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addressQuery = useAddressQuery(id);

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
        <Link to="/addresses" className="text-xs font-bold uppercase tracking-[0.06em] text-on-surface-variant hover:text-primary">
          Batal
        </Link>
      </div>
      <AddressForm initialData={addressQuery.data} onSuccess={() => navigate("/addresses")} />
    </main>
  );
}
