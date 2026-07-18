import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkShift } from "../../api/shifts";

export function useCreateWorkShiftMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkShift,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["work-shifts"] }),
  });
}
