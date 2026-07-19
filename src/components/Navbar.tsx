import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useUnreadCountQuery } from "../hooks/notifications/useUnreadCountQuery";
import { BottomNav } from "./BottomNav";
import "../styles/navbar.css";

function isActiveRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(route + "/");
}

export function Navbar() {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const unreadCountQuery = useUnreadCountQuery(isAuthenticated);
  const unreadCount = unreadCountQuery.data?.unread_count ?? 0;
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="navbar navbar-desktop">
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

            {menuOpen && <div className="navbar-backdrop" onClick={closeMenu} />}

            <div className={`navbar-links ${menuOpen ? "navbar-links-open" : ""}`}>
              {isAuthenticated ? (
                <>
                  <Link to="/pickup" className={`navbar-link ${isActiveRoute(location.pathname, "/pickup") ? "active" : ""}`} onClick={closeMenu}>Pesan Laundry</Link>
                  <Link to="/orders" className={`navbar-link ${isActiveRoute(location.pathname, "/orders") ? "active" : ""}`} onClick={closeMenu}>Pesanan</Link>
                  <Link to="/notifications" className={`navbar-link ${isActiveRoute(location.pathname, "/notifications") ? "active" : ""}`} onClick={closeMenu}>
                    Notifikasi{unreadCount > 0 ? ` (${unreadCount})` : ""}
                  </Link>
                  <Link to="/profile" className={`navbar-link ${isActiveRoute(location.pathname, "/profile") ? "active" : ""}`} onClick={closeMenu}>Profil</Link>
                </>
              ) : (
                <>
                  <Link to="/login" className={`navbar-link ${isActiveRoute(location.pathname, "/login") ? "active" : ""}`} onClick={closeMenu}>Masuk</Link>
                  <Link to="/register" className={`navbar-link ${isActiveRoute(location.pathname, "/register") ? "active" : ""}`} onClick={closeMenu}>Daftar</Link>
                </>
              )}
            </div>
          </>
        )}
      </nav>

      <BottomNav />
    </>
  );
}
