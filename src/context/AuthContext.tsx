import { createContext, useContext, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useProfileQuery } from "../hooks/profile/useProfileQuery";
import type { Customer } from "../types/customer";

interface AuthContextValue {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { data: customer, isLoading } = useProfileQuery(!location.pathname.startsWith("/staff"));

  const value: AuthContextValue = {
    customer: customer ?? null,
    isLoading,
    isAuthenticated: !!customer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
