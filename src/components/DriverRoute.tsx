import { Navigate } from "react-router-dom";
import { useStaffAuth } from "../context/StaffAuthContext";
import { StaffProtectedRoute } from "./StaffProtectedRoute";
import type { ReactNode } from "react";

export function DriverRoute({ children }: { children: ReactNode }) {
  const { employee } = useStaffAuth();

  return (
    <StaffProtectedRoute>
      {employee?.role !== "driver" ? (
        <Navigate to="/staff/dashboard" replace />
      ) : (
        <>{children}</>
      )}
    </StaffProtectedRoute>
  );
}
