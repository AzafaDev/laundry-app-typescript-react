import { useQuery } from "@tanstack/react-query";
import { searchGeocode } from "../../api/geocode";

export function useGeocodeSearchQuery(query: string, limit = 5) {
  return useQuery({
    queryKey: ["geocode-search", query, limit],
    queryFn: () => searchGeocode(query, limit),
    enabled: query.length >= 3,
  });
}
