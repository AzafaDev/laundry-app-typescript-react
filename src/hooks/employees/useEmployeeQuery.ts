import { useQuery } from "@tanstack/react-query";
import { getEmployee } from "../../api/employees";

export function useEmployeeQuery(id?: string) {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => getEmployee(id!),
    enabled: !!id,
  });
}
