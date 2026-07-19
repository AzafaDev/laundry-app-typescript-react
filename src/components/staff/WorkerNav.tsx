import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useStaffAuth } from "../../context/StaffAuthContext";
import { useStaffNavUtilities } from "../../hooks/useStaffNavUtilities";
import { STATION_FOR_ROLE, STATION_LABEL } from "../worker/workerConstants";
import "../../styles/navbar.css";

function isActiveRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(route + "/");
}

export function WorkerNav() {
  const { isLoading, isAuthenticated, employee } = useStaffAuth();
  const location = useLocation();
  const { unreadCount, logoutMutation, handleLogout } = useStaffNavUtilities(isAuthenticated);
  const station = employee ? STATION_FOR_ROLE[employee.role] : undefined;
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
    <nav className="navbar">
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
        {!isLoading && isAuthenticated && (
          <>
            <Link to="/staff/dashboard" className={`navbar-link ${isActiveRoute(location.pathname, "/staff/dashboard") ? "active" : ""}`} onClick={closeMenu}>
              Dasbor
            </Link>
            {station && (
              <>
                <Link to="/staff/attendance" className={`navbar-link ${isActiveRoute(location.pathname, "/staff/attendance") ? "active" : ""}`} onClick={closeMenu}>
                  Absensi
                </Link>
                <Link to="/staff/station" className={`navbar-link ${isActiveRoute(location.pathname, "/staff/station") ? "active" : ""}`} onClick={closeMenu}>
                  {STATION_LABEL[station]}
                </Link>
                <Link to="/staff/station/history" className={`navbar-link ${isActiveRoute(location.pathname, "/staff/station/history") ? "active" : ""}`} onClick={closeMenu}>
                  Riwayat {STATION_LABEL[station]}
                </Link>
                <Link to="/staff/attendance/history" className={`navbar-link ${isActiveRoute(location.pathname, "/staff/attendance/history") ? "active" : ""}`} onClick={closeMenu}>
                  Riwayat Absensi
                </Link>
              </>
            )}
            <Link to="/staff/notifications" className={`navbar-link ${isActiveRoute(location.pathname, "/staff/notifications") ? "active" : ""}`} onClick={closeMenu}>
              Notifikasi{unreadCount > 0 ? ` (${unreadCount})` : ""}
            </Link>
            <Link to="/staff/profile" className={`navbar-link ${isActiveRoute(location.pathname, "/staff/profile") ? "active" : ""}`} onClick={closeMenu}>
              Profil
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
          </>
        )}
      </div>
    </nav>
  );
}
