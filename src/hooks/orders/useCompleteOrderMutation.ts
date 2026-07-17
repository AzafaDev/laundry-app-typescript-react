import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOrder } from "../../api/orders";

export function useCompleteOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => completeOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
