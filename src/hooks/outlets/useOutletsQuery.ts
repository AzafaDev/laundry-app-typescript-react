import { useQuery } from "@tanstack/react-query";
import { getOutlets } from "../../api/outlets";

export function useOutletsQuery(limit: number, offset: number) {
  return useQuery({
    queryKey: ["outlets", { limit, offset }],
    queryFn: () => getOutlets(limit, offset),
  });
}
