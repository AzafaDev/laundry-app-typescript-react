import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWorkShift, type WorkShiftRequestData } from "../../api/shifts";

export function useUpdateWorkShiftMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: WorkShiftRequestData }) => updateWorkShift(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["work-shifts"] });
      queryClient.invalidateQueries({ queryKey: ["work-shift", id] });
    },
  });
}
