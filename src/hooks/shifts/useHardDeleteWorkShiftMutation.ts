import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hardDeleteWorkShift } from "../../api/shifts";

export function useHardDeleteWorkShiftMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: hardDeleteWorkShift,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["work-shifts-deleted"] }),
  });
}
