import { useQuery } from "@tanstack/react-query";
import { getAddresses } from "../../api/addresses";

export function useAddressesQuery() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
  });
}
