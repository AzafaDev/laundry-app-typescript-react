import { useQuery } from "@tanstack/react-query";
import { getLaundryItems } from "../../api/laundryItems";

export function useLaundryItemsQuery(limit: number, offset: number) {
  return useQuery({
    queryKey: ["laundry-items", { limit, offset }],
    queryFn: () => getLaundryItems(limit, offset),
  });
}
