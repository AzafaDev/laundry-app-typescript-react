import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAddress } from "../../api/addresses";

export function useCreateAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
}
