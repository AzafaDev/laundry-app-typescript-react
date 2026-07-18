import { useQuery } from "@tanstack/react-query";
import { getDeletedWorkShifts } from "../../api/shifts";

export function useDeletedWorkShiftsQuery(limit: number, offset: number) {
  return useQuery({
    queryKey: ["work-shifts-deleted", { limit, offset }],
    queryFn: () => getDeletedWorkShifts(limit, offset),
  });
}
