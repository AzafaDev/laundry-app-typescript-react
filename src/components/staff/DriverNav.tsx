import { useStaffAuth } from "../../context/StaffAuthContext";

export function DriverNav() {
  const { isAuthenticated } = useStaffAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      {/* TIKET-03: Bottom nav implementation for driver mobile */}
      <div>Driver Nav (TODO: TIKET-03)</div>
    </nav>
  );
}
