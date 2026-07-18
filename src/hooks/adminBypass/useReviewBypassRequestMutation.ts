import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewBypassRequest } from "../../api/adminBypass";

export function useReviewBypassRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, approve, adminNotes }: { id: string; approve: boolean; adminNotes?: string }) =>
      reviewBypassRequest(id, { approve, admin_notes: adminNotes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bypass-requests"] });
    },
  });
}
