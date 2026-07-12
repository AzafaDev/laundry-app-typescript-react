import { useQuery } from "@tanstack/react-query";
import { verifyEmail } from "../../api/auth";

export function useVerifyEmailQuery(token: string | null) {
  return useQuery({
    queryKey: ["verify-email", token],
    queryFn: () => verifyEmail(token!),
    enabled: !!token,
    retry: false,
  });
}
