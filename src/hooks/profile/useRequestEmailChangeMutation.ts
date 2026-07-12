import { useMutation } from "@tanstack/react-query";
import { requestEmailChange } from "../../api/profile";

export function useRequestEmailChangeMutation() {
  return useMutation({
    mutationFn: requestEmailChange,
  });
}
