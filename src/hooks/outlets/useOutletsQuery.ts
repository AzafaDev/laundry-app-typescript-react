import { useQuery } from "@tanstack/react-query";
import { getOutlets } from "../../api/outlets";

// Asumsi: jumlah outlet tidak akan melebihi angka ini untuk kebutuhan dropdown/mapping di UI.
export const OUTLET_SELECT_LIMIT = 500;

export function useOutletsQuery(limit: number, offset: number) {
  return useQuery({
    queryKey: ["outlets", { limit, offset }],
    queryFn: () => getOutlets(limit, offset),
  });
}
