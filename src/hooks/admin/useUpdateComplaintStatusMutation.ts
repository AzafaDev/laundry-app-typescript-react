import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComplaintStatus } from "../../api/complaints";
import type { UpdateComplaintStatusRequest, AdminComplaintResponse } from "../../api/complaints";

export function useUpdateComplaintStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation<AdminComplaintResponse, Error, { id: string; request: UpdateComplaintStatusRequest }>({
    mutationFn: ({ id, request }) => updateComplaintStatus(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "complaints"] });
    },
  });
}
