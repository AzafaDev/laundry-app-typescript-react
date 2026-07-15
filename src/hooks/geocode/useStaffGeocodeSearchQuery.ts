import { useQuery } from "@tanstack/react-query";
import { searchStaffGeocode } from "../../api/geocode";

export function useStaffGeocodeSearchQuery(query: string, limit = 5) {
  return useQuery({
    queryKey: ["staff-geocode-search", query, limit],
    queryFn: () => searchStaffGeocode(query, limit),
    enabled: query.length >= 3,
  });
}
