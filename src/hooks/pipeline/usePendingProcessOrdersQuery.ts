import { useQuery } from "@tanstack/react-query";
import { getPendingProcessOrders } from "../../api/pipeline";

export function usePendingProcessOrdersQuery() {
  return useQuery({
    queryKey: ["pipeline", "pending-process"],
    queryFn: () => getPendingProcessOrders(),
    retry: false,
  });
}
