import { useQuery } from "@tanstack/react-query";
import { getTodayAttendance } from "../../api/attendance";

export function useTodayAttendanceQuery() {
  return useQuery({
    queryKey: ["attendance", "today"],
    queryFn: () => getTodayAttendance(),
    retry: false,
  });
}
