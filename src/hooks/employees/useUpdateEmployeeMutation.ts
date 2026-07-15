import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEmployee } from "../../api/employees";
import type { UpdateEmployeeRequestData } from "../../api/employees";

export function useUpdateEmployeeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeRequestData }) => updateEmployee(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee", id] });
    },
  });
}
