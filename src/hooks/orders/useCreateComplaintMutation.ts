import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComplaint } from "../../api/orders";
import type { CreateComplaintPayload } from "../../types/order";

export function useCreateComplaintMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: CreateComplaintPayload }) =>
      createComplaint(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
