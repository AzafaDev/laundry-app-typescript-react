import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComplaint, type CreateComplaintInput } from "../../api/orders";

export function useCreateComplaintMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: CreateComplaintInput }) =>
      createComplaint(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
