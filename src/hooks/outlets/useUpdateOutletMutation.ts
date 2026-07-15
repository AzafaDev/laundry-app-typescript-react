import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOutlet } from "../../api/outlets";
import type { OutletRequestData } from "../../api/outlets";

export function useUpdateOutletMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: OutletRequestData }) => updateOutlet(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["outlets"] });
      queryClient.invalidateQueries({ queryKey: ["outlet", id] });
    },
  });
}
