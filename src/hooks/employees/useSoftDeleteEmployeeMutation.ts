import { useMutation, useQueryClient } from "@tanstack/react-query";
import { softDeleteEmployee } from "../../api/employees";

export function useSoftDeleteEmployeeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: softDeleteEmployee,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee", id] });
    },
  });
}
