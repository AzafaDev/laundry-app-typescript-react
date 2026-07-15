import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOutlet } from "../../api/outlets";

export function useCreateOutletMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOutlet,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outlets"] }),
  });
}
