import { useQuery } from "@tanstack/react-query";
import { getBypassByOrder } from "../../api/worker";

export function useBypassByOrderQuery(orderId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["worker", "bypass", orderId],
    queryFn: () => getBypassByOrder(orderId!),
    enabled: enabled && !!orderId,
    retry: false,
  });
}
