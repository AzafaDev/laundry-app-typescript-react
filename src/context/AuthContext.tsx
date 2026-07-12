import { createContext, useContext, type ReactNode } from "react";
import { useProfileQuery } from "../hooks/profile/useProfileQuery";
import { useLoginMutation } from "../hooks/auth/useLoginMutation";
import { useLogoutMutation } from "../hooks/auth/useLogoutMutation";
import type { Customer } from "../types/customer";

interface AuthContextValue {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: { email: string; password: string }) => Promise<Customer>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: customer, isLoading } = useProfileQuery();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const value: AuthContextValue = {
    customer: customer ?? null,
    isLoading,
    isAuthenticated: !!customer,
    login: (data) => loginMutation.mutateAsync(data),
    logout: () => logoutMutation.mutateAsync(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
