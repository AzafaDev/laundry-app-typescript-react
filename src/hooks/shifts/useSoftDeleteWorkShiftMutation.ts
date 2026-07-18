import { useMutation, useQueryClient } from "@tanstack/react-query";
import { softDeleteWorkShift } from "../../api/shifts";

export function useSoftDeleteWorkShiftMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: softDeleteWorkShift,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["work-shifts"] }),
  });
}
