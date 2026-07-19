import { useQuery } from "@tanstack/react-query";
import { estimateDeliveryFee } from "../../api/orders";
import { ApiError } from "../../api/client";

export function useEstimateDeliveryFeeQuery(pickupAddressId: string | null, enabled = true) {
  return useQuery({
    queryKey: ["orders", "estimate-fee", pickupAddressId],
    queryFn: () => estimateDeliveryFee(pickupAddressId!),
    enabled: enabled && !!pickupAddressId,
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx) — they won't resolve on retry
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        return false;
      }
      // Retry server errors (5xx) up to 2 times
      return failureCount < 2;
    },
  });
}
