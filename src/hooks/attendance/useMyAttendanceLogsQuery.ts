import { useQuery } from "@tanstack/react-query";
import { getMyAttendanceLogs } from "../../api/attendance";

export function useMyAttendanceLogsQuery(limit = 20, offset = 0) {
  return useQuery({
    queryKey: ["attendance", "my-logs", limit, offset],
    queryFn: () => getMyAttendanceLogs(limit, offset),
    retry: false,
  });
}
