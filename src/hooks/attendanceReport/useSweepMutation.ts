import { useMutation } from "@tanstack/react-query";
import { triggerSweep } from "../../api/attendanceAdmin";

export function useSweepMutation() {
  return useMutation({
    mutationFn: (date: string) => triggerSweep(date),
  });
}
