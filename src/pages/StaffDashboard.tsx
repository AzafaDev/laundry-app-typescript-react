import { Link, useNavigate } from "react-router-dom";
import { Clock, History, Package } from "lucide-react";
import { useStaffAuth } from "../context/StaffAuthContext";
import { useStaffLogoutMutation } from "../hooks/staffAuth/useStaffLogoutMutation";
import { STATION_FOR_ROLE, STATION_LABEL } from "../components/worker/workerConstants";
import "../styles/auth.css";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  outlet_admin: "Admin Outlet",
  washing_worker: "Worker Cuci",
  ironing_worker: "Worker Setrika",
  packing_worker: "Worker Packing",
  driver: "Driver",
};

export function StaffDashboard() {
  const { employee } = useStaffAuth();
  const navigate = useNavigate();
  const logoutMutation = useStaffLogoutMutation();

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
  );
}
