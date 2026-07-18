import { useMutation, useQueryClient } from "@tanstack/react-query";
import { claimTask } from "../../api/driver";

export function useClaimTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => claimTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver"] });
    },
  });
}
