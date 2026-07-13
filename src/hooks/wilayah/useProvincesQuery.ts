import { useQuery } from "@tanstack/react-query";
import { getProvinces } from "../../api/wilayah";

export function useProvincesQuery() {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: getProvinces,
  });
}
