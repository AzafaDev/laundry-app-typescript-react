import { Navigate } from "react-router-dom";
import { useStaffAuth } from "../context/StaffAuthContext";
import type { ReactNode } from "react";

export function StaffProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useStaffAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/staff/login" replace />;

  return <>{children}</>;
}
