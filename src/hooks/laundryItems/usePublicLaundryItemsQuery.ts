import { useQuery } from "@tanstack/react-query";
import { getPublicLaundryItems } from "../../api/laundryItems";

export function usePublicLaundryItemsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: ["public-laundry-items"],
    queryFn: () => getPublicLaundryItems(),
    enabled,
  });
}
