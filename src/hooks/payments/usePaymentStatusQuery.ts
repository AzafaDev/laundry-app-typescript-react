import { useQuery } from "@tanstack/react-query";
import { getPaymentStatus } from "../../api/payments";

export function usePaymentStatusQuery(orderId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["payment-status", orderId],
    queryFn: () => getPaymentStatus(orderId!),
    enabled: enabled && !!orderId,
    retry: false,
  });
}
