import { useQuery } from "@tanstack/react-query";
import { getOutlet } from "../../api/outlets";

export function useOutletQuery(id?: string) {
  return useQuery({
    queryKey: ["outlet", id],
    queryFn: () => getOutlet(id!),
    enabled: !!id,
  });
}
