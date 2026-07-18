import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitItems } from "../../api/worker";
import type { ActualBreakdownItem, ActualSatuanItem, Station } from "../../types/worker";

interface SubmitItemsInput {
  station: Station;
  orderId: string;
  actual_items: ActualBreakdownItem[];
  actual_satuan_items: ActualSatuanItem[];
}

export function useSubmitItemsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ station, orderId, ...data }: SubmitItemsInput) => submitItems(station, orderId, data),
    onSuccess: (result, { station }) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["worker", "station", station] });
      }
    },
  });
}
