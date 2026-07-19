import { useStaffAuth } from "../../context/StaffAuthContext";

export function AdminSidebar() {
  const { isAuthenticated } = useStaffAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      {/* TIKET-06: Admin sidebar implementation (desktop ≥768px + mobile fallback) */}
      <div>Admin Sidebar (TODO: TIKET-06)</div>
    </nav>
  );
}
