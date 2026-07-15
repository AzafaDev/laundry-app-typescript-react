import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLogoutMutation } from "../hooks/auth/useLogoutMutation";
import "../styles/navbar.css";

export function Navbar() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/login"),
    });
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Laundry</Link>

      {!isLoading && (
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="navbar-link">Profil</Link>
              <Link to="/addresses" className="navbar-link">Alamat</Link>
              <button
                type="button"
                className="navbar-link navbar-logout"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Keluar..." : "Keluar"}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Masuk</Link>
              <Link to="/register" className="navbar-link">Daftar</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
