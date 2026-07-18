import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLaundryItem } from "../../api/laundryItems";

export function useCreateLaundryItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLaundryItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["laundry-items"] }),
  });
}
