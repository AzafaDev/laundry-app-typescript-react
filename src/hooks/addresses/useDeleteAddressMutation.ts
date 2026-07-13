import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAddress } from "../../api/addresses";
import type { Address } from "../../types/address";

export function useDeleteAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: (_data, deletedId) => {
      queryClient.setQueryData<Address[]>(["addresses"], (old) =>
        old?.filter((a) => a.id !== deletedId)
      );
    },
  });
}
