import { Navigate } from "react-router-dom";
import { useStaffAuth } from "../context/StaffAuthContext";
import { StaffProtectedRoute } from "./StaffProtectedRoute";
import type { ReactNode } from "react";

const WORKER_ROLES = new Set(["washing_worker", "ironing_worker", "packing_worker"]);

export function WorkerRoute({ children }: { children: ReactNode }) {
  const { employee } = useStaffAuth();

  return (
    <StaffProtectedRoute>
      {!employee || !WORKER_ROLES.has(employee.role) ? (
        <Navigate to="/staff/dashboard" replace />
      ) : (
        <>{children}</>
      )}
    </StaffProtectedRoute>
  );
}
