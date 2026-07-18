import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClothingType } from "../../api/clothingTypes";

export function useCreateClothingTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClothingType,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clothing-types"] }),
  });
}
