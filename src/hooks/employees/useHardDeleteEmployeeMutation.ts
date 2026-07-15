import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hardDeleteEmployee } from "../../api/employees";

export function useHardDeleteEmployeeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: hardDeleteEmployee,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee", id] });
    },
  });
}
