import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export function Home() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="home-landing" />;
  }

  if (isAuthenticated) {
    return null;
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
