import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClothingType } from "../../api/clothingTypes";
import type { ClothingType } from "../../types/clothingType";
import type { PaginatedResponse } from "../../types/pagination";

export function useDeleteClothingTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteClothingType,
    onSuccess: (_data, deletedId) => {
      queryClient.setQueriesData<PaginatedResponse<ClothingType>>({ queryKey: ["clothing-types"] }, (old) =>
        old
          ? {
              data: old.data.filter((c) => c.id !== deletedId),
              total_count: old.total_count - 1,
            }
          : old,
      );
    },
  });
}
