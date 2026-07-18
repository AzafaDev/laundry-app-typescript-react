import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useAddressesQuery } from "../hooks/addresses/useAddressesQuery";
import { AddressCard } from "../components/address/AddressCard";
import { buttonClasses } from "../components/ui/buttonStyles";
import { BackLink } from "../components/ui/BackLink";
import { EmptyState } from "../components/ui/PageState";

export function Addresses() {
  const addressesQuery = useAddressesQuery();

  if (addressesQuery.isLoading) {
    return (
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-10 space-y-6">
        <BackLink to="/">Kembali ke beranda</BackLink>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Alamat</h1>
        <div className="space-y-4">
          <div className="h-[88px] rounded-3xl bg-surface-container animate-pulse" />
          <div className="h-[88px] rounded-3xl bg-surface-container animate-pulse" />
        </div>
      </main>
    );
  }

  if (addressesQuery.data?.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-10 space-y-6">
        <BackLink to="/">Kembali ke beranda</BackLink>
        <EmptyState
          icon={MapPin}
          title="Belum ada alamat tersimpan"
          description="Tambahkan alamat pertama kamu supaya kurir tahu ke mana harus jemput."
          tone="primary"
          action={
            <Link to="/addresses/new" className={buttonClasses("primary", "md")}>Tambah Alamat Baru</Link>
          }
        />
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-10 space-y-6">
      <BackLink to="/">Kembali ke beranda</BackLink>
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Alamat</h1>
        <Link to="/addresses/new" className="text-xs font-bold uppercase tracking-[0.06em] text-primary hover:underline">
          Tambah Alamat
        </Link>
      </div>
      <div className="space-y-4">
        {addressesQuery.data?.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </div>
    </main>
  );
}
