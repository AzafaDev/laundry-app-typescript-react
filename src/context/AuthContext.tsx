import { createContext, useContext, type ReactNode } from "react";
import { useProfileQuery } from "../hooks/profile/useProfileQuery";
import type { Customer } from "../types/customer";

interface AuthContextValue {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: customer, isLoading } = useProfileQuery();

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
