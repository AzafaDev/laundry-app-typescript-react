import { useQuery } from "@tanstack/react-query";
import { getWorkShift } from "../../api/shifts";

export function useWorkShiftQuery(id?: string) {
  return useQuery({
    queryKey: ["work-shift", id],
    queryFn: () => getWorkShift(id!),
    enabled: !!id,
  });
}
