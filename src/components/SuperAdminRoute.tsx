import { Navigate } from "react-router-dom";
import { useStaffAuth } from "../context/StaffAuthContext";
import { StaffProtectedRoute } from "./StaffProtectedRoute";
import type { ReactNode } from "react";

export function SuperAdminRoute({ children }: { children: ReactNode }) {
  const { employee } = useStaffAuth();

  return (
    <StaffProtectedRoute>
      {employee?.role !== "super_admin" ? (
        <Navigate to="/staff/dashboard" replace />
      ) : (
        <>{children}</>
      )}
    </StaffProtectedRoute>
  );
}
