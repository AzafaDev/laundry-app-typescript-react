import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLogoutMutation } from "../hooks/auth/useLogoutMutation";
import { useUnreadCountQuery } from "../hooks/notifications/useUnreadCountQuery";
import "../styles/navbar.css";

export function Navbar() {
  const { isLoading, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();
  const unreadCountQuery = useUnreadCountQuery(isAuthenticated);
  const unreadCount = unreadCountQuery.data?.unread_count ?? 0;

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
          <button
            type="button"
            className="navbar-link navbar-theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
          >
            {theme === "dark" ? "☀️ Terang" : "🌙 Gelap"}
          </button>
          {isAuthenticated ? (
            <>
              <Link to="/pickup" className="navbar-link">Pesan Laundry</Link>
              <Link to="/orders" className="navbar-link">Pesanan</Link>
              <Link to="/notifications" className="navbar-link">
                Notifikasi{unreadCount > 0 ? ` (${unreadCount})` : ""}
              </Link>
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
