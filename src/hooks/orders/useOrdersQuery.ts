import { useQuery } from "@tanstack/react-query";
import { listOrders, type ListOrdersQuery } from "../../api/orders";

export function useOrdersQuery(query: ListOrdersQuery, enabled = true) {
  return useQuery({
    queryKey: ["orders", query],
    queryFn: () => listOrders(query),
    enabled,
  });
}
