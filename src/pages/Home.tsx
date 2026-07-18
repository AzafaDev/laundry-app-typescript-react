import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAddressesQuery } from "../hooks/addresses/useAddressesQuery";
import { Card } from "../components/ui/Card";
import { buttonClasses } from "../components/ui/buttonStyles";

export function Home() {
  const { customer, isLoading: authLoading, isAuthenticated } = useAuth();
  const addressesQuery = useAddressesQuery(isAuthenticated);

  if (authLoading || (isAuthenticated && addressesQuery.isLoading)) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center px-6 py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    const addresses = addressesQuery.data ?? [];
    const primary = addresses.find((a) => a.is_primary) ?? addresses[0];
    const firstName = customer?.full_name?.split(" ")[0] ?? "";

    return (
      <div className="min-h-[100svh] flex flex-col items-center justify-center gap-5 px-6 py-12">
        <Card className="w-full max-w-sm">
          <span className="text-xs font-bold uppercase tracking-[0.08em] text-on-surface-variant">Halo</span>
          <h1 className="mt-1 mb-5 text-2xl font-bold text-on-surface">{firstName || "kamu"}</h1>

          {primary ? (
            <>
              <p className="mb-3.5 text-sm text-on-surface">
                <span className="font-bold">{primary.label}</span>
                {" — "}
                {primary.city}
              </p>
              <Link to="/addresses" className="text-xs font-bold uppercase tracking-[0.06em] text-primary hover:underline">
                Lihat alamat
              </Link>
            </>
          ) : (
            <>
              <p className="mb-3.5 text-sm text-on-surface-variant">Belum ada alamat tersimpan.</p>
              <Link to="/addresses/new" className={buttonClasses("primary", "md")}>Tambah alamat pertama</Link>
            </>
          )}
        </Card>

        <Link to="/profile" className="text-xs font-bold uppercase tracking-[0.06em] text-on-surface-variant hover:text-primary">
          Lihat profil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center text-center px-6 py-12">
      <Card className="max-w-[420px] w-full text-left">
        <h1 className="text-3xl font-bold text-on-surface">Laundry jadi lebih mudah</h1>
        <p className="mt-2 mb-7 text-sm text-on-surface-variant">Simpan alamat dan kelola akun kamu dalam satu tempat, siap dipakai tiap kali butuh layanan laundry.</p>
        <div className="flex flex-col gap-2.5">
          <Link to="/register" className={buttonClasses("primary", "md")}>Daftar</Link>
          <Link to="/login" className={buttonClasses("secondary", "md")}>Masuk</Link>
        </div>

        <ol className="mt-7 pt-5 border-t border-outline-variant flex flex-col gap-4 list-none">
          <li className="grid grid-cols-[auto_1fr] gap-x-2.5">
            <span className="row-span-2 pt-0.5 text-xs font-bold text-primary">01</span>
            <span className="font-bold text-sm text-on-surface">Pesan</span>
            <span className="text-sm text-on-surface-variant">Jadwalkan jemput dari alamat kamu.</span>
          </li>
          <li className="grid grid-cols-[auto_1fr] gap-x-2.5">
            <span className="row-span-2 pt-0.5 text-xs font-bold text-primary">02</span>
            <span className="font-bold text-sm text-on-surface">Kami jemput &amp; cuci</span>
            <span className="text-sm text-on-surface-variant">Laundry diproses dan dijaga kualitasnya.</span>
          </li>
          <li className="grid grid-cols-[auto_1fr] gap-x-2.5">
            <span className="row-span-2 pt-0.5 text-xs font-bold text-primary">03</span>
            <span className="font-bold text-sm text-on-surface">Kami antar kembali</span>
            <span className="text-sm text-on-surface-variant">Bersih, terlipat, tiba di alamatmu.</span>
          </li>
        </ol>
      </Card>
    </div>
  );
}
