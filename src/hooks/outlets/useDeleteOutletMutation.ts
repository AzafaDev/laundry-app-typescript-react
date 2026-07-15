import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOutlet } from "../../api/outlets";
import type { Outlet } from "../../types/outlet";
import type { PaginatedResponse } from "../../types/pagination";

export function useDeleteOutletMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOutlet,
    onSuccess: (_data, deletedId) => {
      queryClient.setQueriesData<PaginatedResponse<Outlet>>({ queryKey: ["outlets"] }, (old) =>
        old
          ? {
              data: old.data.filter((o) => o.id !== deletedId),
              total_count: old.total_count - 1,
            }
          : old
      );
    },
  });
}
