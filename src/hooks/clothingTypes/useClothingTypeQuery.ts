import { useQuery } from "@tanstack/react-query";
import { getClothingType } from "../../api/clothingTypes";

export function useClothingTypeQuery(id?: string) {
  return useQuery({
    queryKey: ["clothing-type", id],
    queryFn: () => getClothingType(id!),
    enabled: !!id,
  });
}
