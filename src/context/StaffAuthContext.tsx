import { createContext, useContext, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useStaffProfileQuery } from "../hooks/staffAuth/useStaffProfileQuery";
import type { Employee } from "../types/employee";

interface StaffAuthContextValue {
  employee: Employee | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const StaffAuthContext = createContext<StaffAuthContextValue | undefined>(undefined);

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { data: employee, isLoading } = useStaffProfileQuery(location.pathname.startsWith("/staff"));

  const value: StaffAuthContextValue = {
    employee: employee ?? null,
    isLoading,
    isAuthenticated: !!employee,
  };

  return <StaffAuthContext.Provider value={value}>{children}</StaffAuthContext.Provider>;
}

export function useStaffAuth() {
  const ctx = useContext(StaffAuthContext);
  if (!ctx) throw new Error("useStaffAuth must be used within StaffAuthProvider");
  return ctx;
}
