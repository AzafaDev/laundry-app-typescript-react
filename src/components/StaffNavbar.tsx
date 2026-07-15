import { Link, useNavigate } from "react-router-dom";
import { useStaffAuth } from "../context/StaffAuthContext";
import { useTheme } from "../context/ThemeContext";
import { useStaffLogoutMutation } from "../hooks/staffAuth/useStaffLogoutMutation";
import "../styles/navbar.css";

export function StaffNavbar() {
  const { isLoading, isAuthenticated, employee } = useStaffAuth();
  const { theme, toggleTheme } = useTheme();
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

      <div className="navbar-links">
        <button
          type="button"
          className="navbar-link navbar-theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
        >
          {theme === "dark" ? "☀️ Terang" : "🌙 Gelap"}
        </button>
        {!isLoading && isAuthenticated && (
          <>
            <Link to="/staff/dashboard" className="navbar-link">Dasbor</Link>
            {employee?.role === "super_admin" && (
              <>
                <Link to="/staff/admin/outlets" className="navbar-link">Outlet</Link>
                <Link to="/staff/admin/employees" className="navbar-link">Karyawan</Link>
              </>
            )}
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
