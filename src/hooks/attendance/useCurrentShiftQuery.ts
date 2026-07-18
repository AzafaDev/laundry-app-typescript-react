import { useQuery } from "@tanstack/react-query";
import { getCurrentShift } from "../../api/attendance";

export function useCurrentShiftQuery() {
  return useQuery({
    queryKey: ["attendance", "current-shift"],
    queryFn: () => getCurrentShift(),
    retry: false,
  });
}
