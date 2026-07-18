import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClothingType, type ClothingTypeRequestData } from "../../api/clothingTypes";

export function useUpdateClothingTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClothingTypeRequestData }) => updateClothingType(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["clothing-types"] });
      queryClient.invalidateQueries({ queryKey: ["clothing-type", id] });
    },
  });
}
