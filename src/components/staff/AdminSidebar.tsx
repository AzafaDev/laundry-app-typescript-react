import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useStaffAuth } from "../../context/StaffAuthContext";
import { useStaffNavUtilities } from "../../hooks/useStaffNavUtilities";
import "../../styles/navbar.css";
import "../../styles/sidebar.css";

export function AdminSidebar() {
  const { isAuthenticated, employee } = useStaffAuth();
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

  const role = employee?.role;
  const isSuperAdmin = role === "super_admin";

  return (
    <>
      {/* Desktop sidebar (≥768px) */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/staff/dashboard" className="admin-sidebar-brand">
            Laundry Staf
          </Link>
        </div>

        <nav className="admin-sidebar-nav">
          {/* Super admin: 9 links */}
          {isSuperAdmin && (
            <>
              <Link to="/staff/admin/outlets" className="admin-sidebar-link">Outlet</Link>
              <Link to="/staff/admin/employees" className="admin-sidebar-link">Karyawan</Link>
              <Link to="/staff/admin/shifts" className="admin-sidebar-link">Shift</Link>
              <Link to="/staff/admin/attendance" className="admin-sidebar-link">Laporan Absensi</Link>
              <Link to="/staff/admin/reports/sales" className="admin-sidebar-link">Laporan Penjualan</Link>
              <Link to="/staff/admin/reports/employee-performance" className="admin-sidebar-link">
                Laporan Performa
              </Link>
              <Link to="/staff/admin/complaints" className="admin-sidebar-link">Manajemen Komplain</Link>
              <Link to="/staff/admin/laundry-items" className="admin-sidebar-link">Item Laundry</Link>
              <Link to="/staff/admin/clothing-types" className="admin-sidebar-link">Jenis Pakaian</Link>
            </>
          )}

          {/* Outlet admin: 7 links */}
          {role === "outlet_admin" && (
            <>
              <Link to="/staff/admin/attendance" className="admin-sidebar-link">Laporan Absensi</Link>
              <Link to="/staff/admin/reports/sales" className="admin-sidebar-link">Laporan Penjualan</Link>
              <Link to="/staff/admin/reports/employee-performance" className="admin-sidebar-link">
                Laporan Performa
              </Link>
              <Link to="/staff/admin/orders" className="admin-sidebar-link">Semua Pesanan</Link>
              <Link to="/staff/admin/orders/pending-process" className="admin-sidebar-link">
                Proses Pesanan
              </Link>
              <Link to="/staff/admin/bypass-requests" className="admin-sidebar-link">Bypass</Link>
              <Link to="/staff/admin/complaints" className="admin-sidebar-link">Manajemen Komplain</Link>
            </>
          )}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/staff/notifications" className="admin-sidebar-link admin-sidebar-link-secondary">
            Notifikasi{unreadCount > 0 ? ` (${unreadCount})` : ""}
          </Link>
          <Link to="/staff/profile" className="admin-sidebar-link admin-sidebar-link-secondary">
            Profil
          </Link>
          <button
            type="button"
            className="admin-sidebar-link admin-sidebar-link-logout"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Keluar..." : "Keluar"}
          </button>
        </div>
      </aside>

      {/* Mobile hamburger nav (hidden desktop, visible <768px) */}
      <nav className="navbar navbar-desktop-hamburger">
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
          {isSuperAdmin && (
            <>
              <Link to="/staff/admin/outlets" className="navbar-link" onClick={closeMenu}>Outlet</Link>
              <Link to="/staff/admin/employees" className="navbar-link" onClick={closeMenu}>Karyawan</Link>
              <Link to="/staff/admin/shifts" className="navbar-link" onClick={closeMenu}>Shift</Link>
              <Link to="/staff/admin/attendance" className="navbar-link" onClick={closeMenu}>Laporan Absensi</Link>
              <Link to="/staff/admin/reports/sales" className="navbar-link" onClick={closeMenu}>Laporan Penjualan</Link>
              <Link to="/staff/admin/reports/employee-performance" className="navbar-link" onClick={closeMenu}>
                Laporan Performa
              </Link>
              <Link to="/staff/admin/complaints" className="navbar-link" onClick={closeMenu}>Manajemen Komplain</Link>
              <Link to="/staff/admin/laundry-items" className="navbar-link" onClick={closeMenu}>Item Laundry</Link>
              <Link to="/staff/admin/clothing-types" className="navbar-link" onClick={closeMenu}>Jenis Pakaian</Link>
            </>
          )}

          {role === "outlet_admin" && (
            <>
              <Link to="/staff/admin/attendance" className="navbar-link" onClick={closeMenu}>Laporan Absensi</Link>
              <Link to="/staff/admin/reports/sales" className="navbar-link" onClick={closeMenu}>Laporan Penjualan</Link>
              <Link to="/staff/admin/reports/employee-performance" className="navbar-link" onClick={closeMenu}>
                Laporan Performa
              </Link>
              <Link to="/staff/admin/orders" className="navbar-link" onClick={closeMenu}>Semua Pesanan</Link>
              <Link to="/staff/admin/orders/pending-process" className="navbar-link" onClick={closeMenu}>
                Proses Pesanan
              </Link>
              <Link to="/staff/admin/bypass-requests" className="navbar-link" onClick={closeMenu}>Bypass</Link>
              <Link to="/staff/admin/complaints" className="navbar-link" onClick={closeMenu}>Manajemen Komplain</Link>
            </>
          )}

          <Link to="/staff/notifications" className="navbar-link" onClick={closeMenu}>
            Notifikasi{unreadCount > 0 ? ` (${unreadCount})` : ""}
          </Link>
          <Link to="/staff/profile" className="navbar-link" onClick={closeMenu}>Profil</Link>
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
    </>
  );
}
