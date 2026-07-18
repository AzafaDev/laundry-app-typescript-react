import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeTask } from "../../api/driver";

export function useCompleteTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => completeTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver"] });
    },
  });
}
