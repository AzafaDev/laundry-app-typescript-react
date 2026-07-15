import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignEmployeeOutlet } from "../../api/employees";

export function useAssignEmployeeOutletMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, outletId }: { id: string; outletId: string | null }) => assignEmployeeOutlet(id, outletId),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee", id] });
    },
  });
}
