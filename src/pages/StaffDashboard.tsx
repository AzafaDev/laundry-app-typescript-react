import { useNavigate } from "react-router-dom";
import { useStaffAuth } from "../context/StaffAuthContext";
import { useStaffLogoutMutation } from "../hooks/staffAuth/useStaffLogoutMutation";

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
    <div>
      <p>Halo, {employee?.full_name}</p>
      <p>Peran: {employee?.role}</p>
      <button type="button" onClick={handleLogout} disabled={logoutMutation.isPending}>
        {logoutMutation.isPending ? "Keluar..." : "Keluar"}
      </button>
    </div>
  );
}
