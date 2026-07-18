import { useMutation, useQueryClient } from "@tanstack/react-query";
import { processOrder } from "../../api/pipeline";
import type { ProcessOrderFormValues } from "../../schemas/processOrder";

export function useProcessOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: ProcessOrderFormValues }) => processOrder(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline", "pending-process"] });
    },
  });
}
