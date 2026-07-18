import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useStaffAuth } from "../context/StaffAuthContext";
import { useTheme } from "../context/ThemeContext";
import { useStaffLogoutMutation } from "../hooks/staffAuth/useStaffLogoutMutation";
import { useStaffUnreadCountQuery } from "../hooks/staffNotifications/useStaffUnreadCountQuery";
import { STATION_FOR_ROLE, STATION_LABEL } from "./worker/workerConstants";
import "../styles/navbar.css";

export function StaffNavbar() {
  const { isLoading, isAuthenticated, employee } = useStaffAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const logoutMutation = useStaffLogoutMutation();
  const unreadCountQuery = useStaffUnreadCountQuery(isAuthenticated);
  const unreadCount = unreadCountQuery.data?.unread_count ?? 0;
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

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        closeMenu();
        navigate("/staff/login");
      },
    });
  };

  return (
    <nav className="navbar">
      <Link to="/staff/dashboard" className="navbar-brand" onClick={closeMenu}>Laundry Staf</Link>

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
        {!isLoading && isAuthenticated && (
          <>
            <Link to="/staff/dashboard" className="navbar-link" onClick={closeMenu}>Dasbor</Link>
            {employee?.role === "super_admin" && (
              <>
                <Link to="/staff/admin/outlets" className="navbar-link" onClick={closeMenu}>Outlet</Link>
                <Link to="/staff/admin/employees" className="navbar-link" onClick={closeMenu}>Karyawan</Link>
                <Link to="/staff/admin/shifts" className="navbar-link" onClick={closeMenu}>Shift</Link>
                <Link to="/staff/admin/attendance" className="navbar-link" onClick={closeMenu}>Laporan Absensi</Link>
                <Link to="/staff/admin/reports/sales" className="navbar-link" onClick={closeMenu}>Laporan Penjualan</Link>
                <Link to="/staff/admin/reports/employee-performance" className="navbar-link" onClick={closeMenu}>Laporan Performa Karyawan</Link>
                <Link to="/staff/admin/complaints" className="navbar-link" onClick={closeMenu}>Manajemen Komplain</Link>
                <Link to="/staff/admin/laundry-items" className="navbar-link" onClick={closeMenu}>Item Laundry</Link>
                <Link to="/staff/admin/clothing-types" className="navbar-link" onClick={closeMenu}>Jenis Pakaian</Link>
              </>
            )}
            {station && (
              <>
                <Link to="/staff/attendance" className="navbar-link" onClick={closeMenu}>Absensi</Link>
                <Link to="/staff/station" className="navbar-link" onClick={closeMenu}>{STATION_LABEL[station]}</Link>
                <Link to="/staff/station/history" className="navbar-link" onClick={closeMenu}>Riwayat {STATION_LABEL[station]}</Link>
                <Link to="/staff/attendance/history" className="navbar-link" onClick={closeMenu}>Riwayat Absensi</Link>
              </>
            )}
            {employee?.role === "outlet_admin" && (
              <>
                <Link to="/staff/admin/attendance" className="navbar-link" onClick={closeMenu}>Laporan Absensi</Link>
                <Link to="/staff/admin/reports/sales" className="navbar-link" onClick={closeMenu}>Laporan Penjualan</Link>
                <Link to="/staff/admin/reports/employee-performance" className="navbar-link" onClick={closeMenu}>Laporan Performa Karyawan</Link>
                <Link to="/staff/admin/orders" className="navbar-link" onClick={closeMenu}>Semua Pesanan</Link>
                <Link to="/staff/admin/orders/pending-process" className="navbar-link" onClick={closeMenu}>Proses Pesanan</Link>
                <Link to="/staff/admin/bypass-requests" className="navbar-link" onClick={closeMenu}>Bypass</Link>
                <Link to="/staff/admin/complaints" className="navbar-link" onClick={closeMenu}>Manajemen Komplain</Link>
              </>
            )}
            {employee?.role === "driver" && (
              <>
                <Link to="/staff/attendance" className="navbar-link" onClick={closeMenu}>Absensi</Link>
                <Link to="/staff/driver/tasks" className="navbar-link" onClick={closeMenu}>Task Tersedia</Link>
                <Link to="/staff/driver/active" className="navbar-link" onClick={closeMenu}>Task Aktif</Link>
                <Link to="/staff/driver/history" className="navbar-link" onClick={closeMenu}>Riwayat Task</Link>
                <Link to="/staff/attendance/history" className="navbar-link" onClick={closeMenu}>Riwayat Absensi</Link>
              </>
            )}
            <Link to="/staff/notifications" className="navbar-link" onClick={closeMenu}>
              Notifikasi{unreadCount > 0 ? ` (${unreadCount})` : ""}
            </Link>
            <Link to="/staff/profile" className="navbar-link" onClick={closeMenu}>Profil</Link>
            <span className="navbar-link">{employee?.role}</span>
            <button
              type="button"
              className="navbar-link navbar-logout"
              onClick={handleLogout}
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
