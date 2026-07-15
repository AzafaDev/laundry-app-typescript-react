import { useNavigate } from "react-router-dom";
import { useStaffAuth } from "../context/StaffAuthContext";
import { useStaffLogoutMutation } from "../hooks/staffAuth/useStaffLogoutMutation";
import "../styles/auth.css";

export function StaffDashboard() {
  const { employee } = useStaffAuth();
  const navigate = useNavigate();
  const logoutMutation = useStaffLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/staff/login"),
    });
  };

  return (
    <div className="home-landing">
      <div className="home-dashboard">
        <div className="home-dashboard-ticket">
          <span className="auth-label">Staf</span>
          <h1 className="home-dashboard-greeting">{employee?.full_name}</h1>
          <span className="auth-label">{employee?.role}</span>

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
