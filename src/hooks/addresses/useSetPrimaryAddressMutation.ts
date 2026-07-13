import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setPrimaryAddress } from "../../api/addresses";

export function useSetPrimaryAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setPrimaryAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
}
