import { Link, useNavigate } from "react-router-dom";
import { useStaffAuth } from "../context/StaffAuthContext";
import { useStaffLogoutMutation } from "../hooks/staffAuth/useStaffLogoutMutation";
import "../styles/navbar.css";

export function StaffNavbar() {
  const { isLoading, isAuthenticated, employee } = useStaffAuth();
  const navigate = useNavigate();
  const logoutMutation = useStaffLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/staff/login"),
    });
  };

  return (
    <nav className="navbar">
      <Link to="/staff/dashboard" className="navbar-brand">Laundry Staf</Link>

      {!isLoading && isAuthenticated && (
        <div className="navbar-links">
          <span className="navbar-link">{employee?.role}</span>
          <Link to="/staff/dashboard" className="navbar-link">Dasbor</Link>
          <button
            type="button"
            className="navbar-link navbar-logout"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Keluar..." : "Keluar"}
          </button>
        </div>
      )}
    </nav>
  );
}
