import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAvatar } from "../../api/profile";

export function useUploadAvatarMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (data) => queryClient.setQueryData(["profile"], data),
  });
}
