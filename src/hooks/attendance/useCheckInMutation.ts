import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkIn } from "../../api/attendance";

export function useCheckInMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { latitude: number; longitude: number }) => checkIn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}
