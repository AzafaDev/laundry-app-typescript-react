import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLaundryItem } from "../../api/laundryItems";
import type { LaundryItem } from "../../types/laundryItem";
import type { PaginatedResponse } from "../../types/pagination";

export function useDeleteLaundryItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLaundryItem,
    onSuccess: (_data, deletedId) => {
      queryClient.setQueriesData<PaginatedResponse<LaundryItem>>({ queryKey: ["laundry-items"] }, (old) =>
        old
          ? {
              data: old.data.filter((item) => item.id !== deletedId),
              total_count: old.total_count - 1,
            }
          : old,
      );
    },
  });
}
