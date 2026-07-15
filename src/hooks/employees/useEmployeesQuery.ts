import { useQuery } from "@tanstack/react-query";
import { getEmployees, type EmployeeListParams } from "../../api/employees";

export function useEmployeesQuery(params: EmployeeListParams) {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: () => getEmployees(params),
  });
}
