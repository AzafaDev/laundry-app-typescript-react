import { useQuery } from "@tanstack/react-query";
import { getEmployeeShifts } from "../../api/shifts";

export function useEmployeeShiftsQuery(employeeId?: string) {
  return useQuery({
    queryKey: ["employee-shifts", employeeId],
    queryFn: () => getEmployeeShifts(employeeId!),
    enabled: !!employeeId,
  });
}
