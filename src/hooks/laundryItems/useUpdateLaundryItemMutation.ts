import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLaundryItem, type LaundryItemRequestData } from "../../api/laundryItems";

export function useUpdateLaundryItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LaundryItemRequestData }) => updateLaundryItem(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["laundry-items"] });
      queryClient.invalidateQueries({ queryKey: ["laundry-item", id] });
    },
  });
}
