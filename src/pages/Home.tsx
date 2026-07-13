import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAddressesQuery } from "../hooks/addresses/useAddressesQuery";
import "../styles/auth.css";

export function Home() {
  const { customer, isLoading: authLoading, isAuthenticated } = useAuth();
  const addressesQuery = useAddressesQuery(isAuthenticated);

  if (authLoading || (isAuthenticated && addressesQuery.isLoading)) {
    return <div className="home-landing" />;
  }

  if (isAuthenticated) {
    const addresses = addressesQuery.data ?? [];
    const primary = addresses.find((a) => a.is_primary) ?? addresses[0];
    const firstName = customer?.full_name?.split(" ")[0] ?? "";

    return (
      <div className="home-landing">
        <div className="home-dashboard">
          <div className="home-dashboard-ticket">
            <span className="auth-label">Halo</span>
            <h1 className="home-dashboard-greeting">{firstName || "kamu"}</h1>

            {primary ? (
              <>
                <p className="home-dashboard-address">
                  <span className="home-dashboard-address-label">{primary.label}</span>
                  {" — "}
                  {primary.city}
                </p>
                <Link to="/addresses" className="auth-toggle">LIHAT ALAMAT</Link>
              </>
            ) : (
              <>
                <p className="home-dashboard-address home-dashboard-address-empty">
                  Belum ada alamat tersimpan.
                </p>
                <Link to="/addresses/new" className="auth-button">Tambah alamat pertama</Link>
              </>
            )}
          </div>

          <Link to="/profile" className="auth-toggle home-dashboard-profile-link">LIHAT PROFIL</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="home-landing">
      <div className="home-landing-content">
        <h1>Laundry jadi lebih mudah</h1>
        <p>Simpan alamat dan kelola akun kamu dalam satu tempat, siap dipakai tiap kali butuh layanan laundry.</p>
        <div className="home-landing-actions">
          <Link to="/register" className="auth-button">Daftar</Link>
          <Link to="/login" className="auth-button auth-button-secondary">Masuk</Link>
        </div>
      </div>
    </div>
  );
}
