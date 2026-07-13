import { useQuery } from "@tanstack/react-query";
import { getDistricts } from "../../api/wilayah";

export function useDistrictsQuery(cityId: number | undefined) {
  return useQuery({
    queryKey: ["districts", cityId],
    queryFn: () => getDistricts(cityId!),
    enabled: !!cityId,
  });
}
