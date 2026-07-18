import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        closeMenu();
        navigate("/login");
      },
    });
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" onClick={closeMenu}>Laundry</Link>

      {!isLoading && (
        <>
          <button
            type="button"
            className="navbar-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className={`navbar-links ${menuOpen ? "navbar-links-open" : ""}`}>
            <button
              type="button"
              className="navbar-link navbar-theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
            >
              <span className="inline-flex items-center gap-1.5">
                {theme === "dark" ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
                {theme === "dark" ? "Terang" : "Gelap"}
              </span>
            </button>
            {isAuthenticated ? (
              <>
                <Link to="/pickup" className="navbar-link" onClick={closeMenu}>Pesan Laundry</Link>
                <Link to="/orders" className="navbar-link" onClick={closeMenu}>Pesanan</Link>
                <Link to="/notifications" className="navbar-link" onClick={closeMenu}>
                  Notifikasi{unreadCount > 0 ? ` (${unreadCount})` : ""}
                </Link>
                <Link to="/profile" className="navbar-link" onClick={closeMenu}>Profil</Link>
                <Link to="/addresses" className="navbar-link" onClick={closeMenu}>Alamat</Link>
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
                <Link to="/login" className="navbar-link" onClick={closeMenu}>Masuk</Link>
                <Link to="/register" className="navbar-link" onClick={closeMenu}>Daftar</Link>
              </>
            )}
          </div>
        </>
      )}
    </nav>
  );
}
