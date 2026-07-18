import { useQuery } from "@tanstack/react-query";
import { listOutletOrders, type ListOutletOrdersQuery } from "../../api/adminOrders";

export function useOutletOrdersQuery(query: ListOutletOrdersQuery) {
  return useQuery({
    queryKey: ["admin", "orders", query],
    queryFn: () => listOutletOrders(query),
  });
}
