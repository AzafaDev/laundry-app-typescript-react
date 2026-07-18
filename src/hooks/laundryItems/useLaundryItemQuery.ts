import { useQuery } from "@tanstack/react-query";
import { getLaundryItem } from "../../api/laundryItems";

export function useLaundryItemQuery(id?: string) {
  return useQuery({
    queryKey: ["laundry-item", id],
    queryFn: () => getLaundryItem(id!),
    enabled: !!id,
  });
}
