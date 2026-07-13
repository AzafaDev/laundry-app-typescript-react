import { useQuery } from "@tanstack/react-query";
import { getAddresses } from "../../api/addresses";

export function useAddressesQuery(enabled = true) {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
    enabled,
  });
}
