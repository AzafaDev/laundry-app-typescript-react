import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBypassRequest, type CreateBypassInput } from "../../api/worker";

export function useCreateBypassRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBypassInput) => createBypassRequest(data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["worker", "bypass", variables.order_id] });
    },
  });
}
