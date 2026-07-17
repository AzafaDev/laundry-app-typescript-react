import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "../../api/payments";

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => createTransaction(orderId),
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["payment-status", orderId] });
    },
  });
}
