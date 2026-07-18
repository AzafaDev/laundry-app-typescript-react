import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployeeShift, type EmployeeShiftRequestData } from "../../api/shifts";

export function useCreateEmployeeShiftMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, data }: { employeeId: string; data: EmployeeShiftRequestData }) =>
      createEmployeeShift(employeeId, data),
    onSuccess: (_data, { employeeId }) => {
      queryClient.invalidateQueries({ queryKey: ["employee-shifts", employeeId] });
    },
  });
}
