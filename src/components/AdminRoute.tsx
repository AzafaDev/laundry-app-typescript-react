import { Navigate } from "react-router-dom";
import { useStaffAuth } from "../context/StaffAuthContext";
import { StaffProtectedRoute } from "./StaffProtectedRoute";
import type { ReactNode } from "react";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { employee } = useStaffAuth();
  const isAdmin = employee?.role === "super_admin" || employee?.role === "outlet_admin";

  return (
    <StaffProtectedRoute>
      {!isAdmin ? (
        <Navigate to="/staff/dashboard" replace />
      ) : (
        <>{children}</>
      )}
    </StaffProtectedRoute>
  );
}
