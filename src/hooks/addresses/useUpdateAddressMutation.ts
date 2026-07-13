import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAddress } from "../../api/addresses";
import type { AddressRequestData } from "../../api/addresses";

export function useUpdateAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddressRequestData }) => updateAddress(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
}
