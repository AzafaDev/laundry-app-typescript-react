import { useQuery } from "@tanstack/react-query";
import { getOrderDetail } from "../../api/orders";

export function useOrderDetailQuery(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrderDetail(id!),
    enabled: enabled && !!id,
  });
}
