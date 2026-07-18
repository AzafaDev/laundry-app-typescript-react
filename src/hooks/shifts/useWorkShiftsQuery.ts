import { useQuery } from "@tanstack/react-query";
import { getWorkShifts } from "../../api/shifts";

export function useWorkShiftsQuery(limit: number, offset: number) {
  return useQuery({
    queryKey: ["work-shifts", { limit, offset }],
    queryFn: () => getWorkShifts(limit, offset),
  });
}
