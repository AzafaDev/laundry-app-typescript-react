import { useQuery } from "@tanstack/react-query";
import { getCities } from "../../api/wilayah";

export function useCitiesQuery(provinceId: number | undefined) {
  return useQuery({
    queryKey: ["cities", provinceId],
    queryFn: () => getCities(provinceId!),
    enabled: !!provinceId,
  });
}
