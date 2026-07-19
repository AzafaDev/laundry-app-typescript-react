import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useStaffAuth } from "../context/StaffAuthContext";
import { Navbar } from "./Navbar";
import { DriverNav } from "./staff/DriverNav";
import { AdminSidebar } from "./staff/AdminSidebar";
import { WorkerNav } from "./staff/WorkerNav";
import "../styles/auth.css";

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isStaffArea = location.pathname.startsWith("/staff");
  const { employee, isAuthenticated } = useStaffAuth();

  const renderStaffNav = () => {
    if (!isStaffArea || !isAuthenticated) return null;

    const role = employee?.role;
    switch (role) {
      case "driver":
        return <DriverNav />;
      case "super_admin":
      case "outlet_admin":
        return <AdminSidebar />;
      case "washing_worker":
      case "ironing_worker":
      case "packing_worker":
      default:
        return <WorkerNav />;
    }
  };

  return (
    <>
      {isStaffArea ? renderStaffNav() : <Navbar />}
      {children}
    </>
  );
}
