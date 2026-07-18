import { Link, useNavigate } from "react-router-dom";
import { Bell, ClipboardList, Clock, History, ListChecks, Package, PackageSearch, ShieldAlert, Shirt, Truck, UserRound } from "lucide-react";
import { useStaffAuth } from "../context/StaffAuthContext";
import { useStaffLogoutMutation } from "../hooks/staffAuth/useStaffLogoutMutation";
import { useStaffUnreadCountQuery } from "../hooks/staffNotifications/useStaffUnreadCountQuery";
import { STATION_FOR_ROLE, STATION_LABEL } from "../components/worker/workerConstants";
import { ROLE_LABEL } from "../constants/roleLabels";
import "../styles/auth.css";

export function StaffDashboard() {
  const { employee } = useStaffAuth();
  const navigate = useNavigate();
  const logoutMutation = useStaffLogoutMutation();
  const unreadCountQuery = useStaffUnreadCountQuery();
  const unreadCount = unreadCountQuery.data?.unread_count ?? 0;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/staff/login"),
    });
  };

  const station = employee ? STATION_FOR_ROLE[employee.role] : undefined;

  return (
    <div className="home-landing">
      <div className="home-dashboard">
        <div className="home-dashboard-ticket">
          <span className="auth-label">Staf</span>
          <h1 className="home-dashboard-greeting">{employee?.full_name}</h1>
          <span className="auth-label">{employee ? ROLE_LABEL[employee.role] ?? employee.role : ""}</span>

          {employee?.role === "super_admin" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginTop: 16 }}>
              <Link to="/staff/admin/outlets" className="auth-button">Kelola Outlet</Link>
              <Link to="/staff/admin/employees" className="auth-button">Kelola Karyawan</Link>
              <Link to="/staff/admin/shifts" className="auth-button">
                <Clock className="w-4 h-4" style={{ display: "inline", marginRight: 6 }} />
                Kelola Shift
              </Link>
              <Link to="/staff/admin/laundry-items" className="auth-button auth-button-secondary">
                <Package className="w-4 h-4" style={{ display: "inline", marginRight: 6 }} />
                Item Laundry
              </Link>
              <Link to="/staff/admin/clothing-types" className="auth-button auth-button-secondary">
                <Shirt className="w-4 h-4" style={{ display: "inline", marginRight: 6 }} />
                Jenis Pakaian
              </Link>
            </div>
          )}

          {station && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginTop: 16 }}>
              <Link to="/staff/attendance" className="auth-button auth-button-secondary">
                <Clock className="w-4 h-4" style={{ display: "inline", marginRight: 6 }} />
                Absensi
              </Link>
              <Link to="/staff/station" className="auth-button">
                <Package className="w-4 h-4" style={{ display: "inline", marginRight: 6 }} />
                {STATION_LABEL[station]}
              </Link>
              <Link to="/staff/station/history" className="auth-button auth-button-secondary">
                <History className="w-4 h-4" style={{ display: "inline", marginRight: 6 }} />
                Riwayat {STATION_LABEL[station]}
              </Link>
              <Link to="/staff/attendance/history" className="auth-button auth-button-secondary">
                <History className="w-4 h-4" style={{ display: "inline", marginRight: 6 }} />
                Riwayat Absensi
              </Link>
            </div>
          )}

          {employee?.role === "outlet_admin" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginTop: 16 }}>
              <Link to="/staff/admin/orders" className="auth-button">
                <ClipboardList className="w-4 h-4" style={{ display: "inline", marginRight: 6 }} />
                Semua Pesanan
              </Link>
              <Link to="/staff/admin/orders/pending-process" className="auth-button auth-button-secondary">
                <PackageSearch className="w-4 h-4" style={{ display: "inline", marginRight: 6 }} />
                Proses Pesanan
              </Link>
              <Link to="/staff/admin/bypass-requests" className="auth-button auth-button-secondary">
                <ShieldAlert className="w-4 h-4" style={{ display: "inline", marginRight: 6 }} />
                Permintaan Bypass
              </Link>
            </div>
          )}

          {employee?.role === "driver" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginTop: 16 }}>
              <Link to="/staff/attendance" className="auth-button auth-button-secondary">
                <Clock className="w-4 h-4" style={{ display: "inline", marginRight: 6 }} />
                Absensi
              </Link>
              <Link to="/staff/driver/tasks" className="auth-button">
                <ListChecks className="w-4 h-4" style={{ display: "inline", marginRight: 6 }} />
                Task Tersedia
              </Link>
              <Link to="/staff/driver/active" className="auth-button auth-button-secondary">
                <Truck className="w-4 h-4" style={{ display: "inline", marginRight: 6 }} />
                Task Aktif
              </Link>
              <Link to="/staff/driver/history" className="auth-button auth-button-secondary">
                <History className="w-4 h-4" style={{ display: "inline", marginRight: 6 }} />
                Riwayat Task
              </Link>
              <Link to="/staff/attendance/history" className="auth-button auth-button-secondary">
                <History className="w-4 h-4" style={{ display: "inline", marginRight: 6 }} />
                Riwayat Absensi
              </Link>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginTop: 16 }}>
            <Link to="/staff/notifications" className="auth-button auth-button-secondary">
              <Bell className="w-4 h-4" style={{ display: "inline", marginRight: 6 }} />
              Notifikasi{unreadCount > 0 ? ` (${unreadCount})` : ""}
            </Link>
            <Link to="/staff/profile" className="auth-button auth-button-secondary">
              <UserRound className="w-4 h-4" style={{ display: "inline", marginRight: 6 }} />
              Profil
            </Link>
            <button
              className="auth-button auth-button-secondary"
              type="button"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Keluar..." : "Keluar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
