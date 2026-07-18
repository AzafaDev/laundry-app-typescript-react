import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAddressesQuery } from "../hooks/addresses/useAddressesQuery";
import { ClaimTag } from "../components/ui/ClaimTag";
import { buttonClasses } from "../components/ui/buttonStyles";

const HOW_IT_WORKS = [
  { label: "Pesan", text: "Jadwalkan jemput dari alamat kamu." },
  { label: "Kami jemput & cuci", text: "Laundry diproses dan dijaga kualitasnya." },
  { label: "Kami antar kembali", text: "Bersih, terlipat, tiba di alamatmu." },
];

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
        <ClaimTag className="w-full max-w-sm">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">Halo</span>
          <h1 className="mt-1 mb-4 text-2xl font-bold text-on-surface">{firstName || "kamu"}</h1>

          {primary ? (
            <div className="border-t border-dashed border-outline-variant pt-4">
              <p className="mb-3.5 text-sm text-on-surface">
                <span className="font-bold">{primary.label}</span>
                {" — "}
                {primary.city}
              </p>
              <Link to="/addresses" className="text-xs font-bold uppercase tracking-[0.06em] text-primary hover:underline">
                Lihat alamat
              </Link>
            </div>
          ) : (
            <div className="border-t border-dashed border-outline-variant pt-4">
              <p className="mb-3.5 text-sm text-on-surface-variant">Belum ada alamat tersimpan.</p>
              <Link to="/addresses/new" className={buttonClasses("primary", "md")}>Tambah alamat pertama</Link>
            </div>
          )}
        </ClaimTag>

        <div className="flex flex-col gap-2.5 w-full max-w-sm">
          <Link to="/pickup" className={buttonClasses("primary", "md")}>Pesan Laundry</Link>
          <Link to="/orders" className={buttonClasses("secondary", "md")}>Pesanan Saya</Link>
        </div>

        <Link to="/profile" className="text-xs font-bold uppercase tracking-[0.06em] text-on-surface-variant hover:text-primary">
          Lihat profil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center text-center px-6 py-12">
      <ClaimTag className="max-w-[420px] w-full text-left">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary">Tiket Digital</span>
        <h1 className="mt-2 text-3xl font-bold text-on-surface">Laundry jadi lebih mudah</h1>
        <p className="mt-2 mb-7 text-base text-on-surface-variant">Simpan alamat dan kelola akun kamu dalam satu tempat, siap dipakai tiap kali butuh layanan laundry.</p>
        <div className="flex flex-col gap-2.5">
          <Link to="/register" className={buttonClasses("primary", "md")}>Daftar</Link>
          <Link to="/login" className={buttonClasses("secondary", "md")}>Masuk</Link>
        </div>

        <ol className="mt-7 pt-5 border-t border-outline-variant flex flex-col list-none">
          {HOW_IT_WORKS.map((step, i) => (
            <li
              key={step.label}
              className={`grid grid-cols-[auto_1fr] gap-x-3 pb-4 ${i > 0 ? "pt-4 border-t border-dashed border-outline-variant" : ""}`}
            >
              <span className="row-span-2 pt-0.5 font-mono text-xs font-semibold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-bold text-sm text-on-surface">{step.label}</span>
              <span className="text-sm text-on-surface-variant">{step.text}</span>
            </li>
          ))}
        </ol>
      </ClaimTag>
    </div>
  );
}
