import { useQuery } from "@tanstack/react-query";
import { getClothingTypes } from "../../api/clothingTypes";

export function useClothingTypesQuery(limit: number, offset: number) {
  return useQuery({
    queryKey: ["clothing-types", { limit, offset }],
    queryFn: () => getClothingTypes(limit, offset),
  });
}
