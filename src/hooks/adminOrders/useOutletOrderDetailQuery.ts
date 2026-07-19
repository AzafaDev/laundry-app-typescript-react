import { useQuery } from "@tanstack/react-query";
import { getOutletOrderDetail } from "../../api/adminOrders";

export function useOutletOrderDetailQuery(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["admin", "orders", id],
    queryFn: () => getOutletOrderDetail(id!),
    enabled: enabled && !!id,
  });
}
