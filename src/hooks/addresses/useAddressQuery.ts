import { useQuery } from "@tanstack/react-query";
import { getAddress } from "../../api/addresses";

export function useAddressQuery(id: string | undefined) {
  return useQuery({
    queryKey: ["addresses", id],
    queryFn: () => getAddress(id!),
    enabled: !!id,
  });
}
