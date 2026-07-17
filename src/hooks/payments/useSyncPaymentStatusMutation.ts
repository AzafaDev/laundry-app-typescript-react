import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncPaymentStatus } from "../../api/payments";

export function useSyncPaymentStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => syncPaymentStatus(orderId),
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["payment-status", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
    },
  });
}
