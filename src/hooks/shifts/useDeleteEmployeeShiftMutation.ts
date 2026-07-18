import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEmployeeShift } from "../../api/shifts";
import type { EmployeeShift } from "../../types/shift";

export function useDeleteEmployeeShiftMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, shiftRecordId }: { employeeId: string; shiftRecordId: string }) =>
      deleteEmployeeShift(employeeId, shiftRecordId),
    onSuccess: (_data, { employeeId, shiftRecordId }) => {
      queryClient.setQueriesData({ queryKey: ["employee-shifts", employeeId] }, (old: any) =>
        old
          ? {
              data: old.data.filter((es: EmployeeShift) => es.id !== shiftRecordId),
            }
          : old,
      );
    },
  });
}
