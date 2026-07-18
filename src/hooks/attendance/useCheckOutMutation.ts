import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkOut } from "../../api/attendance";

export function useCheckOutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { latitude?: number; longitude?: number } = {}) => checkOut(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}
