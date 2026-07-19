import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, CheckCircle2, Inbox, History, User } from "lucide-react";
import { useStaffAuth } from "../../context/StaffAuthContext";
import { useStaffNavUtilities } from "../../hooks/useStaffNavUtilities";
import "../../styles/navbar.css";
import "../../styles/bottom-nav.css";

function isActiveRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(route + "/");
}

export function DriverNav() {
  const { isAuthenticated } = useStaffAuth();
  const location = useLocation();
  const { unreadCount, logoutMutation, handleLogout } = useStaffNavUtilities(isAuthenticated);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Desktop hamburger nav (≥768px) */}
      <nav className="navbar navbar-desktop">
        <Link to="/staff/dashboard" className="navbar-brand" onClick={closeMenu}>
          Laundry Staf
        </Link>

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
          <Link to="/staff/driver/active" className={`navbar-link ${isActiveRoute(location.pathname, "/staff/driver/active") ? "active" : ""}`} onClick={closeMenu}>
            Task Aktif
          </Link>
          <Link to="/staff/driver/tasks" className={`navbar-link ${isActiveRoute(location.pathname, "/staff/driver/tasks") ? "active" : ""}`} onClick={closeMenu}>
            Task Tersedia
          </Link>
          <Link to="/staff/driver/history" className={`navbar-link ${isActiveRoute(location.pathname, "/staff/driver/history") ? "active" : ""}`} onClick={closeMenu}>
            Riwayat Task
          </Link>
          <Link to="/staff/profile" className={`navbar-link ${isActiveRoute(location.pathname, "/staff/profile") ? "active" : ""}`} onClick={closeMenu}>
            Profil
          </Link>
          <Link to="/staff/notifications" className={`navbar-link ${isActiveRoute(location.pathname, "/staff/notifications") ? "active" : ""}`} onClick={closeMenu}>
            Notifikasi{unreadCount > 0 ? ` (${unreadCount})` : ""}
          </Link>
          <button
            type="button"
            className="navbar-link navbar-logout"
            onClick={() => {
              handleLogout();
              closeMenu();
            }}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Keluar..." : "Keluar"}
          </button>
        </div>
      </nav>

      {/* Mobile bottom nav (<768px) */}
      <nav className="bottom-nav">
        <Link to="/staff/driver/active" className={`bottom-nav-item ${isActiveRoute(location.pathname, "/staff/driver/active") ? "active" : ""}`} title="Task Aktif">
          <CheckCircle2 className="w-6 h-6" />
          <span className="bottom-nav-label">Aktif</span>
        </Link>

        <Link to="/staff/driver/tasks" className={`bottom-nav-item ${isActiveRoute(location.pathname, "/staff/driver/tasks") ? "active" : ""}`} title="Task Tersedia">
          <Inbox className="w-6 h-6" />
          <span className="bottom-nav-label">Tersedia</span>
        </Link>

        <Link to="/staff/driver/history" className={`bottom-nav-item ${isActiveRoute(location.pathname, "/staff/driver/history") ? "active" : ""}`} title="Riwayat Task">
          <History className="w-6 h-6" />
          <span className="bottom-nav-label">Riwayat</span>
        </Link>

        <Link to="/staff/profile" className={`bottom-nav-item ${isActiveRoute(location.pathname, "/staff/profile") ? "active" : ""}`} title="Profil">
          <User className="w-6 h-6" />
          <span className="bottom-nav-label">Profil</span>
        </Link>
      </nav>
    </>
  );
}
