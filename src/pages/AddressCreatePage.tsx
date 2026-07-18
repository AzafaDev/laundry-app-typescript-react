import { Link, useNavigate } from "react-router-dom";
import { AddressForm } from "../components/address/AddressForm";

export function AddressCreatePage() {
  const navigate = useNavigate();

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-10 space-y-6">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Tambah Alamat</h1>
        <Link to="/addresses" className="text-xs font-bold uppercase tracking-[0.06em] text-on-surface-variant hover:text-primary">
          Batal
        </Link>
      </div>
      <AddressForm onSuccess={() => navigate("/addresses")} />
    </main>
  );
}
